import re

def extract_job_details(jd_text):
    """
    Extracts Job Title and Company Name from JD text using simple heuristics.
    """
    job_title = "the position"
    company = "your company"
    
    # Try to find "Job Title:" or "Role:"
    # Look for lines starting with these keywords
    title_match = re.search(r'(?:Job Title|Role|Position)\s*[:|-]\s*([^\n\r]+)', jd_text, re.IGNORECASE)
    if title_match:
        job_title = title_match.group(1).strip()
        
    # Try to find "Company:" or "About <Company>"
    company_match = re.search(r'(?:Company|About)\s*[:|-]\s*([^\n\r]+)', jd_text, re.IGNORECASE)
    if company_match:
        company = company_match.group(1).strip()
        
    return job_title, company

def generate_cover_letter(jd_text, matched_skills):
    """
    Generates a simple template-based cover letter.
    """
    job_title, company = extract_job_details(jd_text)
    
    # Format skills for the letter
    if matched_skills:
        # Take top 3-4 skills
        top_skills = list(matched_skills)[:4]
        if len(top_skills) > 1:
            skills_str = ", ".join([s.title() for s in top_skills[:-1]]) + " and " + top_skills[-1].title()
        else:
            skills_str = top_skills[0].title()
    else:
        skills_str = "my technical skills"

    letter = f"""Dear Hiring Manager,

I am writing to express my enthusiastic interest in the {job_title} at {company}. With a strong background in {skills_str}, I am confident in my ability to contribute effectively to your team.

Upon reviewing the job description, I was excited to see that you are looking for a candidate with expertise in {skills_str}. My experience aligns well with these requirements, and I have a proven track record of applying these skills to deliver high-quality results.

I am particularly drawn to {company} because of its reputation for excellence and innovation. I am eager to bring my problem-solving abilities and technical proficiency to help your team achieve its goals.

Thank you for considering my application. I look forward to the possibility of discussing how my background, passion, and skills make me a perfect fit for this role.

Sincerely,

[Your Name]"""

    return letter
