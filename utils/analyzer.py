import re
import random
from sentence_transformers import SentenceTransformer, util
from utils.generator import generate_cover_letter, extract_name
from utils.interview_generator import generate_interview_questions
from utils.resume_formatter import analyze_resume_structure
from utils.resume_builder import generate_resume_template

# Load a lightweight, efficient model for semantic similarity
# This runs locally and requires no API key
print("Loading AI Model (all-MiniLM-L6-v2)...")
model = SentenceTransformer('all-MiniLM-L6-v2')
print("AI Model Loaded.")

# A small dictionary of common technical and soft skills for extraction
COMMON_SKILLS = {
    "python", "java", "javascript", "react", "node.js", "flask", "django", "html", "css",
    "sql", "nosql", "mongodb", "postgresql", "aws", "azure", "docker", "kubernetes",
    "git", "agile", "scrum", "communication", "leadership", "problem solving",
    "machine learning", "data analysis", "pandas", "numpy", "tensorflow", "pytorch",
    "c++", "c#", "go", "rust", "typescript", "angular", "vue", "rest api", "graphql",
    "reactjs", "react.js", "postgres", "postgresql", "aws services", "amazon web services"
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

def calculate_semantic_match(jd_skills, resume_skills):
    """
    Computes the match score based on Semantic Similarity using Sentence Transformers.
    This handles synonyms (e.g., "ReactJS" vs "React") automatically.
    """
    if not jd_skills:
        return 0, [], []
    
    jd_skills_list = list(jd_skills)
    resume_skills_list = list(resume_skills)
    
    if not resume_skills_list:
        return 0, [], jd_skills_list

    # Encode skills to vector embeddings
    jd_embeddings = model.encode(jd_skills_list, convert_to_tensor=True)
    resume_embeddings = model.encode(resume_skills_list, convert_to_tensor=True)

    # Compute cosine similarity matrix
    cosine_scores = util.cos_sim(jd_embeddings, resume_embeddings)
    
    matched_skills = set()
    missing_skills = set()
    
    # Threshold for semantic match (0.7 is usually a good balance)
    threshold = 0.7
    
    for i, jd_skill in enumerate(jd_skills_list):
        # Find the best match for this JD skill in the resume skills
        best_score = cosine_scores[i].max()
        
        if best_score >= threshold:
            matched_skills.add(jd_skill)
        else:
            missing_skills.add(jd_skill)
            
    score = (len(matched_skills) / len(jd_skills)) * 100
    return round(score, 2), list(matched_skills), list(missing_skills)

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
            "link": f"https://www.google.com/search?q=learn+{skill}+course", # Real search link
            "practice_task": f"Build a small project using {skill.title()}",
            "timeline": f"{random.randint(1, 4)} weeks"
        }
        plan.append(item)
        
    return plan

def analyze_job_match(jd_text, resume_text):
    """
    Main function to coordinate the analysis using Local AI.
    """
    jd_skills = extract_skills(jd_text)
    resume_skills = extract_skills(resume_text)
    
    # Use Semantic Matching instead of simple set intersection
    match_score, matched_skills, missing_skills = calculate_semantic_match(jd_skills, resume_skills)
    
    upskilling_plan = generate_upskilling_plan(missing_skills)
    
    # Generate Cover Letter
    cover_letter = generate_cover_letter(jd_text, matched_skills, resume_text)
    
    # Generate Interview Questions
    interview_questions = generate_interview_questions(jd_text, matched_skills, num_questions=5)
    
    # Analyze Resume Formatting
    formatting_tips = analyze_resume_structure(resume_text)
    
    # Generate Improved Resume Template
    candidate_name = extract_name(resume_text)
    improved_resume = generate_resume_template(
        resume_text, 
        candidate_name, 
        formatting_tips, 
        matched_skills, 
        missing_skills
    )
    
    return {
        "score": match_score,
        "jd_skills": list(jd_skills),
        "resume_skills": list(resume_skills),
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
        "upskilling_plan": upskilling_plan,
        "cover_letter": cover_letter,
        "interview_questions": interview_questions,
        "formatting_tips": formatting_tips,
        "improved_resume": improved_resume
    }
