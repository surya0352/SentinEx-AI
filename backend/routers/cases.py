from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    UploadFile,
    File
)

from sqlalchemy.orm import Session

import os
import shutil
import uuid

from backend.database import get_db

from backend.models import (
    Case,
    Image,
    Fingerprint
)

from backend.schemas import (
    CaseCreate,
    CaseResponse
)

from backend.services.fingerprint_service import (
    generate_fingerprints
)

from backend.services.matching_service import (
    find_similar_images
)

from backend.services.content_detection_service import (
    detect_sensitive_content
)

from backend.services.risk_service import (
    calculate_risk
)


router = APIRouter(
    prefix="/cases",
    tags=["Cases"]
)


# ============================================================
# CREATE A NEW CASE
# ============================================================

@router.post(
    "/",
    response_model=CaseResponse
)
def create_case(
    case: CaseCreate,
    db: Session = Depends(get_db)
):

    new_case = Case(
        case_number=case.case_number
    )

    db.add(new_case)

    db.commit()

    db.refresh(new_case)

    return new_case


# ============================================================
# GET ALL CASES
# ============================================================

@router.get("/")
def get_cases(
    db: Session = Depends(get_db)
):

    cases = db.query(
        Case
    ).all()

    return cases


# ============================================================
# GET A SINGLE CASE
# ============================================================

@router.get(
    "/{case_id}",
    response_model=CaseResponse
)
def get_case(
    case_id: int,
    db: Session = Depends(get_db)
):

    case = db.query(
        Case
    ).filter(
        Case.id == case_id
    ).first()

    if case is None:

        raise HTTPException(
            status_code=404,
            detail="Case not found"
        )

    return case


# ============================================================
# UPDATE CASE STATUS
# ============================================================

@router.put(
    "/{case_id}",
    response_model=CaseResponse
)
def update_case(
    case_id: int,
    status: str,
    db: Session = Depends(get_db)
):

    case = db.query(
        Case
    ).filter(
        Case.id == case_id
    ).first()

    if case is None:

        raise HTTPException(
            status_code=404,
            detail="Case not found"
        )

    case.status = status

    db.commit()

    db.refresh(case)

    return case


# ============================================================
# UPLOAD IMAGE
# ============================================================

@router.post(
    "/{case_id}/upload"
)
def upload_image(
    case_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):

    # --------------------------------------------------------
    # 1. Check if case exists
    # --------------------------------------------------------

    case = db.query(
        Case
    ).filter(
        Case.id == case_id
    ).first()

    if case is None:

        raise HTTPException(
            status_code=404,
            detail="Case not found"
        )


    # --------------------------------------------------------
    # 2. Validate file type
    # --------------------------------------------------------

    allowed_types = [
        "image/jpeg",
        "image/png",
        "image/webp"
    ]

    if file.content_type not in allowed_types:

        raise HTTPException(
            status_code=400,
            detail="Only JPEG, PNG and WEBP images are allowed"
        )


    # --------------------------------------------------------
    # 3. Generate unique filename
    # --------------------------------------------------------

    unique_filename = (
        f"{uuid.uuid4()}_{file.filename}"
    )


    # --------------------------------------------------------
    # 4. Create file path
    # --------------------------------------------------------

    file_path = os.path.join(
        "uploads",
        unique_filename
    )


    # --------------------------------------------------------
    # 5. Save uploaded image
    # --------------------------------------------------------

    with open(
        file_path,
        "wb"
    ) as buffer:

        shutil.copyfileobj(
            file.file,
            buffer
        )


    # --------------------------------------------------------
    # 6. Generate pHash and dHash
    # --------------------------------------------------------

    fingerprints = generate_fingerprints(
        file_path
    )


    # --------------------------------------------------------
    # 7. Run AI content detection
    # --------------------------------------------------------

    content_result = detect_sensitive_content(
        file_path
    )


    # --------------------------------------------------------
    # 8. Calculate risk level
    # --------------------------------------------------------

    risk_level = calculate_risk(
        is_sensitive=content_result["is_sensitive"],
        confidence=content_result["confidence"]
    )


    # --------------------------------------------------------
    # 9. Save image metadata + AI results
    # --------------------------------------------------------

    new_image = Image(
        case_id=case_id,
        filename=file.filename,
        file_path=file_path,
        content_type=file.content_type,

        ai_label=content_result["label"],
        ai_confidence=content_result["confidence"],
        is_sensitive=content_result["is_sensitive"],
        risk_level=risk_level
    )

    db.add(new_image)

    db.commit()

    db.refresh(new_image)


    # --------------------------------------------------------
    # 10. Save fingerprints
    # --------------------------------------------------------

    new_fingerprint = Fingerprint(
        image_id=new_image.id,
        phash=fingerprints["phash"],
        dhash=fingerprints["dhash"]
    )

    db.add(new_fingerprint)

    db.commit()


    # --------------------------------------------------------
    # 11. Return response
    # --------------------------------------------------------

    return {
        "message": "Image uploaded successfully",

        "image_id": new_image.id,

        "case_id": case_id,

        "filename": file.filename,

        "phash": fingerprints["phash"],

        "dhash": fingerprints["dhash"],

        "content_detection": {
            "is_sensitive": content_result["is_sensitive"],

            "confidence": content_result["confidence"],

            "label": content_result["label"],

            "risk_level": risk_level
        }
    }

# ============================================================
# GET IMAGE DETAILS
# ============================================================

@router.get(
    "/{case_id}/images/{image_id}"
)
def get_image_details(
    case_id: int,
    image_id: int,
    db: Session = Depends(get_db)
):

    # --------------------------------------------------------
    # Find image belonging to case
    # --------------------------------------------------------

    image = db.query(
        Image
    ).filter(
        Image.id == image_id,
        Image.case_id == case_id
    ).first()

    if image is None:

        raise HTTPException(
            status_code=404,
            detail="Image not found"
        )


    # --------------------------------------------------------
    # Return stored image and AI details
    # --------------------------------------------------------

    return {

        "image_id": image.id,

        "case_id": image.case_id,

        "filename": image.filename,

        "file_path": image.file_path,

        "content_type": image.content_type,

        "ai_label": image.ai_label,

        "ai_confidence": image.ai_confidence,

        "is_sensitive": image.is_sensitive,

        "risk_level": image.risk_level,

        "created_at": image.created_at
    }

# ============================================================
# FIND SIMILAR IMAGES
# ============================================================

@router.get(
    "/{case_id}/images/{image_id}/matches"
)
def find_image_matches(
    case_id: int,
    image_id: int,
    db: Session = Depends(get_db)
):

    # --------------------------------------------------------
    # Check if case exists
    # --------------------------------------------------------

    case = db.query(
        Case
    ).filter(
        Case.id == case_id
    ).first()

    if case is None:

        raise HTTPException(
            status_code=404,
            detail="Case not found"
        )


    # --------------------------------------------------------
    # Find image belonging to case
    # --------------------------------------------------------

    image = db.query(
        Image
    ).filter(
        Image.id == image_id,
        Image.case_id == case_id
    ).first()

    if image is None:

        raise HTTPException(
            status_code=404,
            detail="Image not found"
        )


    # --------------------------------------------------------
    # Find fingerprint of image
    # --------------------------------------------------------

    fingerprint = db.query(
        Fingerprint
    ).filter(
        Fingerprint.image_id == image_id
    ).first()

    if fingerprint is None:

        raise HTTPException(
            status_code=404,
            detail="Fingerprint not found"
        )


    # --------------------------------------------------------
    # Find similar images
    # --------------------------------------------------------

    matches = find_similar_images(
        fingerprint.phash,
        db
    )


    # --------------------------------------------------------
    # Remove current image from matches
    # --------------------------------------------------------

    matches = [
        match
        for match in matches
        if match["image_id"] != image_id
    ]


    # --------------------------------------------------------
    # Return matches
    # --------------------------------------------------------

    return {
        "case_id": case_id,

        "image_id": image_id,

        "matches": matches
    }