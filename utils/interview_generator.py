import re
import random

def extract_key_technologies(jd_text, matched_skills):
    """
    Extracts key technologies and requirements from JD for interview question generation.
    """
    # Combine matched skills with additional context from JD
    technologies = set(matched_skills) if matched_skills else set()
    
    # Look for additional technical terms in JD
    tech_patterns = [
        r'\b(?:experience with|knowledge of|proficiency in|expertise in)\s+([^.,;\n]+)',
        r'\b(?:required|preferred|must have|should have)\s*:?\s*([^.,;\n]+)',
    ]
    
    for pattern in tech_patterns:
        matches = re.finditer(pattern, jd_text, re.IGNORECASE)
        for match in matches:
            extracted = match.group(1).strip()
            if len(extracted) < 100:  # Avoid capturing too much text
                technologies.add(extracted)
    
    return list(technologies)[:10]  # Limit to top 10

def generate_technical_question(skill, difficulty="medium"):
    """
    Generates a technical interview question for a given skill.
    Uses templates to create realistic questions.
    """
    skill_lower = skill.lower()
    
    # Question templates based on common patterns
    templates = {
        "concept": [
            f"Can you explain the key concepts and architecture of {skill}?",
            f"What are the main advantages of using {skill} in a production environment?",
            f"How does {skill} handle scalability and performance optimization?",
        ],
        "practical": [
            f"Describe a challenging project where you used {skill}. What problems did you solve?",
            f"Walk me through how you would implement a solution using {skill} for [specific use case].",
            f"What best practices do you follow when working with {skill}?",
        ],
        "comparison": [
            f"How does {skill} compare to alternative technologies in the same space?",
            f"When would you choose {skill} over other similar tools or frameworks?",
        ],
        "troubleshooting": [
            f"Describe a time when you encountered a difficult bug while using {skill}. How did you debug it?",
            f"What are common pitfalls or challenges when working with {skill}?",
        ],
        "advanced": [
            f"How would you optimize performance in a {skill}-based application?",
            f"Explain how you would design a scalable system using {skill}.",
        ]
    }
    
    # Select random question type
    question_type = random.choice(list(templates.keys()))
    question = random.choice(templates[question_type])
    
    return {
        "skill": skill.title(),
        "question": question,
        "difficulty": difficulty,
        "category": question_type.title()
    }

def generate_interview_questions(jd_text, matched_skills, num_questions=5):
    """
    Generates a set of technical interview questions based on JD and matched skills.
    """
    if not matched_skills:
        return []
    
    # Get key technologies from JD
    key_techs = list(set(matched_skills))[:num_questions]
    
    questions = []
    difficulties = ["easy", "medium", "hard"]
    
    for i, skill in enumerate(key_techs):
        # Vary difficulty
        difficulty = difficulties[i % len(difficulties)]
        question_obj = generate_technical_question(skill, difficulty)
        questions.append(question_obj)
    
    return questions
