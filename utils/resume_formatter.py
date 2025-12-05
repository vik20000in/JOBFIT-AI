import re

def analyze_resume_structure(resume_text):
    """
    Analyzes resume structure and provides formatting tips.
    Returns a list of suggestions for improvement.
    """
    if not resume_text:
        return []
    
    tips = []
    lines = resume_text.split('\n')
    word_count = len(resume_text.split())
    
    # Check resume length
    if word_count < 150:
        tips.append({
            "category": "Length",
            "severity": "high",
            "issue": "Resume is too short",
            "suggestion": "Your resume appears to be very brief. Aim for 300-500 words to provide enough detail about your experience and skills.",
            "icon": "fa-ruler"
        })
    elif word_count > 800:
        tips.append({
            "category": "Length",
            "severity": "medium",
            "issue": "Resume may be too long",
            "suggestion": "Consider condensing your resume. Focus on the most relevant experiences and achievements for the target role.",
            "icon": "fa-ruler"
        })
    
    # Check for contact information
    has_email = bool(re.search(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', resume_text))
    has_phone = bool(re.search(r'(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}', resume_text))
    
    if not has_email:
        tips.append({
            "category": "Contact",
            "severity": "high",
            "issue": "Missing email address",
            "suggestion": "Add a professional email address at the top of your resume. Use a format like firstname.lastname@email.com.",
            "icon": "fa-envelope"
        })
    
    if not has_phone:
        tips.append({
            "category": "Contact",
            "severity": "medium",
            "issue": "Missing phone number",
            "suggestion": "Include a phone number where recruiters can reach you. Use a professional voicemail greeting.",
            "icon": "fa-phone"
        })
    
    # Check for common sections
    sections = {
        "experience": r'\b(experience|work history|employment|professional background)\b',
        "education": r'\b(education|academic|degree|university|college)\b',
        "skills": r'\b(skills|technical skills|competencies|expertise)\b',
        "summary": r'\b(summary|objective|profile|about)\b'
    }
    
    missing_sections = []
    for section_name, pattern in sections.items():
        if not re.search(pattern, resume_text, re.IGNORECASE):
            missing_sections.append(section_name.title())
    
    if "Experience" in missing_sections:
        tips.append({
            "category": "Structure",
            "severity": "high",
            "issue": "Missing Work Experience section",
            "suggestion": "Add a clear 'Work Experience' or 'Professional Experience' section. List your roles in reverse chronological order with company names, dates, and key achievements.",
            "icon": "fa-briefcase"
        })
    
    if "Education" in missing_sections:
        tips.append({
            "category": "Structure",
            "severity": "medium",
            "issue": "Missing Education section",
            "suggestion": "Include an 'Education' section with your degree(s), institution(s), and graduation year(s).",
            "icon": "fa-graduation-cap"
        })
    
    if "Skills" in missing_sections:
        tips.append({
            "category": "Structure",
            "severity": "medium",
            "issue": "Missing Skills section",
            "suggestion": "Add a dedicated 'Skills' section to highlight your technical and soft skills. This helps with ATS scanning and quick recruiter review.",
            "icon": "fa-cogs"
        })
    
    # Check for bullet points (action-oriented achievements)
    has_bullets = bool(re.search(r'[•\-\*]\s+', resume_text))
    if not has_bullets:
        tips.append({
            "category": "Formatting",
            "severity": "medium",
            "issue": "No bullet points detected",
            "suggestion": "Use bullet points to list achievements and responsibilities. Start each bullet with a strong action verb (e.g., 'Developed', 'Managed', 'Increased').",
            "icon": "fa-list-ul"
        })
    
    # Check for quantifiable achievements
    has_numbers = bool(re.search(r'\d+%|\d+\+|increased|improved|reduced|generated|saved', resume_text, re.IGNORECASE))
    if not has_numbers:
        tips.append({
            "category": "Content",
            "severity": "high",
            "issue": "Lacks quantifiable achievements",
            "suggestion": "Add measurable results to your accomplishments. Use numbers, percentages, or metrics (e.g., 'Increased sales by 30%', 'Managed team of 5').",
            "icon": "fa-chart-line"
        })
    
    # Check for action verbs
    weak_phrases = re.findall(r'\b(responsible for|duties included|helped with)\b', resume_text, re.IGNORECASE)
    if weak_phrases:
        tips.append({
            "category": "Content",
            "severity": "medium",
            "issue": "Using weak/passive language",
            "suggestion": "Replace passive phrases like 'Responsible for' with strong action verbs like 'Led', 'Executed', 'Spearheaded', 'Optimized'.",
            "icon": "fa-bolt"
        })
    
    # Check for overly long paragraphs
    long_paragraphs = [line for line in lines if len(line.split()) > 50]
    if len(long_paragraphs) > 2:
        tips.append({
            "category": "Formatting",
            "severity": "low",
            "issue": "Dense text blocks detected",
            "suggestion": "Break long paragraphs into concise bullet points. Recruiters typically spend 6-7 seconds scanning a resume.",
            "icon": "fa-align-left"
        })
    
    # Check for personal pronouns (should avoid in resumes)
    has_pronouns = bool(re.search(r'\b(I|me|my|we|our)\b', resume_text))
    if has_pronouns:
        tips.append({
            "category": "Style",
            "severity": "low",
            "issue": "Contains personal pronouns",
            "suggestion": "Remove personal pronouns (I, me, my). Use professional, third-person style. Start bullets with action verbs directly.",
            "icon": "fa-user-slash"
        })
    
    # Positive feedback if resume looks good
    if len(tips) <= 2:
        tips.insert(0, {
            "category": "Overall",
            "severity": "success",
            "issue": "Well-structured resume!",
            "suggestion": "Your resume has a solid structure. Keep refining the content and tailoring it to each job application.",
            "icon": "fa-check-circle"
        })
    
    return tips
