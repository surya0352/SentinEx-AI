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
    # Validate file type
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
    # Generate unique filename
    # --------------------------------------------------------

    unique_filename = (
        f"{uuid.uuid4()}_{file.filename}"
    )


    # --------------------------------------------------------
    # Create file path
    # --------------------------------------------------------

    file_path = os.path.join(
        "uploads",
        unique_filename
    )


    # --------------------------------------------------------
    # Save uploaded image
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
    # Save image metadata
    # --------------------------------------------------------

    new_image = Image(
        case_id=case_id,
        filename=file.filename,
        file_path=file_path,
        content_type=file.content_type
    )

    db.add(new_image)

    db.commit()

    db.refresh(new_image)


    # --------------------------------------------------------
    # Generate pHash and dHash
    # --------------------------------------------------------

    fingerprints = generate_fingerprints(
        file_path
    )

    content_result = detect_sensitive_content(
    file_path
)

    # --------------------------------------------------------
    # Save fingerprints
    # --------------------------------------------------------

    new_fingerprint = Fingerprint(
        image_id=new_image.id,
        phash=fingerprints["phash"],
        dhash=fingerprints["dhash"]
    )

    db.add(new_fingerprint)

    db.commit()


    # --------------------------------------------------------
    # Temporary response for testing
    # --------------------------------------------------------

    return {
        "message": "Image uploaded successfully",

        "image_id": new_image.id,

        "case_id": case_id,

        "filename": file.filename,

        "phash": fingerprints["phash"],

        "dhash": fingerprints["dhash"],

        "content_detection": content_result
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