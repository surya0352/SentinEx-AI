from pydantic import BaseModel


class CaseCreate(BaseModel):
    case_number: str


class CaseResponse(BaseModel):
    id: int
    case_number: str
    status: str

    class Config:
        from_attributes = True