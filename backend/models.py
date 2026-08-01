from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime

from backend.database import Base


class Case(Base):

    __tablename__ = "cases"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    case_number = Column(
        String,
        unique=True,
        index=True,
        nullable=False
    )

    status = Column(
        String,
        default="Under Review"
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

class Image(Base):

    __tablename__ = "images"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    case_id = Column(
        Integer,
        nullable=False
    )

    filename = Column(
        String,
        nullable=False
    )

    file_path = Column(
        String,
        nullable=False
    )

    content_type = Column(
        String,
        nullable=False
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )


class Fingerprint(Base):

    __tablename__ = "fingerprints"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    image_id = Column(
        Integer,
        nullable=False
    )

    phash = Column(
        String,
        nullable=False,
        index=True
    )

    dhash = Column(
        String,
        nullable=False
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )