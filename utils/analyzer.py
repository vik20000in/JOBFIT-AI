import re
import random

# A small dictionary of common technical and soft skills for extraction
COMMON_SKILLS = {
    "python", "java", "javascript", "react", "node.js", "flask", "django", "html", "css",
    "sql", "nosql", "mongodb", "postgresql", "aws", "azure", "docker", "kubernetes",
    "git", "agile", "scrum", "communication", "leadership", "problem solving",
    "machine learning", "data analysis", "pandas", "numpy", "tensorflow", "pytorch",
    "c++", "c#", "go", "rust", "typescript", "angular", "vue", "rest api", "graphql"
}

def extract_skills(text):
    """
    Extracts skills from the provided text using a predefined list.
    Returns a set of found skills.
    """
    if not text:
        return set()
    
    text_lower = text.lower()
    found_skills = set()
    
    # Simple keyword matching
    for skill in COMMON_SKILLS:
        # Use regex to match whole words only to avoid partial matches (e.g., "java" in "javascript")
        # Escape skill for regex safety
        pattern = r'\b' + re.escape(skill) + r'\b'
        if re.search(pattern, text_lower):
            found_skills.add(skill)
            
    return found_skills

def calculate_match_score(jd_skills, resume_skills):
    """
    Computes the match score based on the intersection of JD and Resume skills.
    """
    if not jd_skills:
        return 0
    
    matching_skills = jd_skills.intersection(resume_skills)
    score = (len(matching_skills) / len(jd_skills)) * 100
    return round(score, 2)

def generate_upskilling_plan(missing_skills):
    """
    Generates a learning plan for the missing skills.
    """
    plan = []
    
    for skill in missing_skills:
        # Mock logic to generate course recommendations
        course_platforms = ["Udemy", "Coursera", "WiLearn", "edX"]
        platform = random.choice(course_platforms)
        
        item = {
            "skill": skill.title(),
            "course_name": f"Mastering {skill.title()} on {platform}",
            "platform": platform,
            "link": "#", # Mock link
            "practice_task": f"Build a small project using {skill.title()}",
            "timeline": f"{random.randint(1, 4)} weeks"
        }
        plan.append(item)
        
    return plan

def analyze_job_match(jd_text, resume_text):
    """
    Main function to coordinate the analysis.
    """
    jd_skills = extract_skills(jd_text)
    resume_skills = extract_skills(resume_text)
    
    match_score = calculate_match_score(jd_skills, resume_skills)
    missing_skills = list(jd_skills - resume_skills)
    matched_skills = list(jd_skills.intersection(resume_skills))
    
    upskilling_plan = generate_upskilling_plan(missing_skills)
    
    return {
        "score": match_score,
        "jd_skills": list(jd_skills),
        "resume_skills": list(resume_skills),
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
        "upskilling_plan": upskilling_plan
    }
