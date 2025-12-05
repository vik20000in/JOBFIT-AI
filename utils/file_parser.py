import os
from pypdf import PdfReader
from docx import Document

def extract_text_from_file(file_storage):
    """
    Extracts text from a FileStorage object (PDF or DOCX).
    """
    filename = file_storage.filename.lower()
    
    try:
        if filename.endswith('.pdf'):
            return _extract_from_pdf(file_storage)
        elif filename.endswith('.docx'):
            return _extract_from_docx(file_storage)
        elif filename.endswith('.txt'):
            return file_storage.read().decode('utf-8')
        else:
            raise ValueError("Unsupported file format. Please upload PDF, DOCX, or TXT.")
    except Exception as e:
        raise ValueError(f"Error parsing file: {str(e)}")

def _extract_from_pdf(file_storage):
    reader = PdfReader(file_storage)
    text = ""
    for page in reader.pages:
        text += page.extract_text() + "\n"
    return text

def _extract_from_docx(file_storage):
    doc = Document(file_storage)
    text = []
    for paragraph in doc.paragraphs:
        text.append(paragraph.text)
    return "\n".join(text)
