from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends, HTTPException
from backend.database import get_db
from backend.models import Case
from backend.schemas import CaseCreate, CaseResponse
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session

import os
import shutil
import uuid

from backend.database import get_db
from backend.models import Case, Image
from backend.schemas import CaseCreate, CaseResponse

router = APIRouter(
    prefix="/cases",
    tags=["Cases"]
)


# Create a new case
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


# Get all cases
@router.get("/")
def get_cases(
    db: Session = Depends(get_db)
):

    cases = db.query(Case).all()

    return cases

# Get a single case
@router.get("/{case_id}", response_model=CaseResponse)
def get_case(
    case_id: int,
    db: Session = Depends(get_db)
):

    case = db.query(Case).filter(
        Case.id == case_id
    ).first()

    if case is None:
        raise HTTPException(
            status_code=404,
            detail="Case not found"
        )

    return case

# Update case status
@router.put("/{case_id}", response_model=CaseResponse)
def update_case(
    case_id: int,
    status: str,
    db: Session = Depends(get_db)
):

    case = db.query(Case).filter(
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

@router.post("/{case_id}/upload")
def upload_image(
    case_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):

    # Check if case exists
    case = db.query(Case).filter(
        Case.id == case_id
    ).first()

    if case is None:
        raise HTTPException(
            status_code=404,
            detail="Case not found"
        )

    # Validate file type
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

    # Create unique filename
    unique_filename = f"{uuid.uuid4()}_{file.filename}"

    # Create file path
    file_path = os.path.join(
        "uploads",
        unique_filename
    )

    # Save file
    with open(file_path, "wb") as buffer:

        shutil.copyfileobj(
            file.file,
            buffer
        )

    # Save metadata
    new_image = Image(
        case_id=case_id,
        filename=file.filename,
        file_path=file_path,
        content_type=file.content_type
    )

    db.add(new_image)
    db.commit()
    db.refresh(new_image)

    return {
        "message": "Image uploaded successfully",
        "image_id": new_image.id,
        "case_id": case_id,
        "filename": file.filename
    }