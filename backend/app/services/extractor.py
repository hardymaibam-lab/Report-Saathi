import io
import os
import tempfile
import logging
from typing import Tuple
from PIL import Image, ImageEnhance, ImageFilter
import pytesseract
import pymupdf
from app.core.config import settings

logger = logging.getLogger(__name__)

if settings.tesseract_cmd:
    pytesseract.pytesseract.tesseract_cmd = settings.tesseract_cmd

def preprocess_image_for_ocr(image: Image.Image) -> Image.Image:
    """Enhance contrast and convert to grayscale to maximize OCR recognition accuracy."""
    try:
        # Convert to grayscale
        gray = image.convert("L")
        # Increase contrast to clarify faint scanner text
        enhancer = ImageEnhance.Contrast(gray)
        enhanced = enhancer.enhance(1.8)
        # Apply slight sharpening
        sharpened = enhanced.filter(ImageFilter.SHARPEN)
        return sharpened
    except Exception as e:
        logger.warning(f"Image preprocessing warning: {e}")
        return image

def extract_text_from_image_file(file_path: str) -> str:
    """Extract text from an image file on disk using PIL and Tesseract OCR."""
    try:
        with Image.open(file_path) as img:
            preprocessed = preprocess_image_for_ocr(img)
            text = pytesseract.image_to_string(preprocessed)
            return text.strip()
    except Exception as e:
        logger.error(f"Error during image OCR on {file_path}: {e}")
        raise RuntimeError(f"OCR engine failed to process image: {str(e)}")

def extract_text_from_pdf_file(file_path: str, max_pages: int = 10) -> Tuple[str, bool]:
    """
    Extracts text from PDF file path.
    Tries native digital text first; if blank or sparse (< 60 chars),
    renders each page to an image and applies Tesseract OCR.
    Returns (extracted_text, is_scanned_ocr).
    """
    try:
        doc = pymupdf.open(file_path)
        total_pages = min(len(doc), max_pages)
        native_text_list = []
        
        for i in range(total_pages):
            page_text = doc[i].get_text()
            if page_text:
                native_text_list.append(page_text.strip())
                
        full_native_text = "\n\n".join(native_text_list).strip()
        
        # If native text extraction yielded substantial characters, return it
        if len(full_native_text) >= 60:
            return full_native_text, False
            
        # If native text is absent/scanty, render pages for OCR
        logger.info(f"PDF at {file_path} contains little or no digital text. Rendering {total_pages} page(s) for OCR...")
        ocr_text_list = []
        for i in range(total_pages):
            page = doc[i]
            # Render at 200 DPI
            pix = page.get_pixmap(dpi=200)
            img_bytes = pix.tobytes("png")
            with Image.open(io.BytesIO(img_bytes)) as img:
                preprocessed = preprocess_image_for_ocr(img)
                page_ocr = pytesseract.image_to_string(preprocessed)
                if page_ocr.strip():
                    ocr_text_list.append(f"--- Page {i+1} ---\n{page_ocr.strip()}")
                    
        ocr_result = "\n\n".join(ocr_text_list).strip()
        if not ocr_result and full_native_text:
            return full_native_text, False
        return ocr_result, True

    except Exception as e:
        logger.error(f"PDF extraction error on {file_path}: {e}")
        raise RuntimeError(f"Failed to read PDF document: {str(e)}")

def process_uploaded_file_safely(filename: str, file_bytes: bytes) -> Tuple[str, str]:
    """
    Validates file format and size, writes to a secure temporary file,
    extracts text via PyMuPDF or Tesseract OCR, cleans up temp file,
    and returns (extracted_text, method).
    """
    # 1. Size Validation
    max_bytes = settings.max_file_size_mb * 1024 * 1024
    if len(file_bytes) > max_bytes:
        raise ValueError(f"File size exceeds maximum allowed limit of {settings.max_file_size_mb} MB.")
        
    if len(file_bytes) == 0:
        raise ValueError("Uploaded file is empty (0 bytes).")

    # 2. Extension Validation
    ext = filename.split(".")[-1].lower() if "." in filename else ""
    if ext not in settings.allowed_extensions:
        raise ValueError(f"Unsupported file format (.{ext}). Please upload a PDF, JPG, or PNG document.")

    # 3. Safe Temporary File Handling
    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=f".{ext}")
    temp_path = temp_file.name
    try:
        temp_file.write(file_bytes)
        temp_file.flush()
        temp_file.close()

        # 4. Extract Text
        if ext == "pdf":
            text, is_ocr = extract_text_from_pdf_file(temp_path)
            method = "pdf_ocr" if is_ocr else "pdf_native"
        else:
            text = extract_text_from_image_file(temp_path)
            method = "image_ocr"

        # 5. Check Text Quality
        if not text or len(text.strip()) < 10:
            raise ValueError(
                "Unable to extract legible text from document. The scan may be blank, unreadable, or excessively blurred. Please provide a clearer copy."
            )

        return text, method

    finally:
        # Guarantee cleanup of temporary file on disk
        if os.path.exists(temp_path):
            try:
                os.unlink(temp_path)
            except Exception as err:
                logger.warning(f"Could not delete temp file {temp_path}: {err}")
