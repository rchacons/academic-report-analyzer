from pydantic import BaseModel
from typing import List

class LinkedBook(BaseModel):
    author: str
    year_published: str
    book_name: str

class SubjectSchema(BaseModel):
    subject: str