"""
Company & Role Insights Generator
Extracts company information and provides strategic insights for job applications
"""

import re


def extract_company_info(jd_text):
    """
    Extract company name and role information from job description
    
    Args:
        jd_text (str): Job description text
        
    Returns:
        dict: Company and role information
    """
    company_info = {
        'company_name': None,
        'role_title': None,
        'company_size': None,
        'industry': None,
        'location': None
    }
    
    # Extract company name (common patterns)
    company_patterns = [
        r'(?:at|@|join)\s+([A-Z][A-Za-z0-9\s&\.]+?)(?:\s+is|\s+seeks|\s+we|\s+our|\n)',
        r'^([A-Z][A-Za-z0-9\s&\.]+?)\s+is\s+(?:seeking|hiring|looking)',
        r'About\s+([A-Z][A-Za-z0-9\s&\.]+?)[\n:]',
        r'Company:\s*([A-Z][A-Za-z0-9\s&\.]+?)[\n]'
    ]
    
    for pattern in company_patterns:
        match = re.search(pattern, jd_text, re.MULTILINE | re.IGNORECASE)
        if match:
            company_info['company_name'] = match.group(1).strip()
            break
    
    # Extract role title (usually in first few lines)
    role_patterns = [
        r'^([A-Z][A-Za-z\s]+(?:Engineer|Developer|Manager|Analyst|Designer|Architect|Consultant|Specialist|Lead|Director))',
        r'Position:\s*([A-Z][A-Za-z\s]+)',
        r'Role:\s*([A-Z][A-Za-z\s]+)',
        r'Title:\s*([A-Z][A-Za-z\s]+)'
    ]
    
    for pattern in role_patterns:
        match = re.search(pattern, jd_text, re.MULTILINE)
        if match:
            company_info['role_title'] = match.group(1).strip()
            break
    
    # Detect company size indicators
    size_keywords = {
        'startup': ['startup', 'early-stage', 'seed funded', 'series a', 'series b'],
        'mid-size': ['growing company', 'mid-size', 'established'],
        'enterprise': ['fortune 500', 'global leader', 'multinational', 'enterprise', 'industry leader']
    }
    
    jd_lower = jd_text.lower()
    for size, keywords in size_keywords.items():
        if any(keyword in jd_lower for keyword in keywords):
            company_info['company_size'] = size
            break
    
    # Detect industry
    industry_keywords = {
        'Technology': ['software', 'saas', 'cloud', 'ai', 'machine learning', 'data science'],
        'Finance': ['fintech', 'banking', 'financial services', 'investment', 'trading'],
        'Healthcare': ['healthcare', 'medical', 'biotech', 'pharma', 'telemedicine'],
        'E-commerce': ['e-commerce', 'marketplace', 'retail', 'shopping'],
        'Consulting': ['consulting', 'advisory', 'professional services'],
        'Gaming': ['gaming', 'game development', 'esports'],
        'Education': ['edtech', 'education', 'learning platform']
    }
    
    for industry, keywords in industry_keywords.items():
        if any(keyword in jd_lower for keyword in keywords):
            company_info['industry'] = industry
            break
    
    # Extract location
    location_pattern = r'Location:\s*([A-Za-z\s,]+?)(?:\n|$)'
    match = re.search(location_pattern, jd_text, re.IGNORECASE)
    if match:
        company_info['location'] = match.group(1).strip()
    elif 'remote' in jd_lower:
        company_info['location'] = 'Remote'
    
    return company_info


def analyze_company_culture(jd_text):
    """
    Analyze job description for cultural indicators and values
    
    Args:
        jd_text (str): Job description text
        
    Returns:
        list: Cultural attributes detected
    """
    culture_signals = []
    jd_lower = jd_text.lower()
    
    culture_indicators = {
        'Innovation-Focused': ['innovation', 'cutting-edge', 'pioneering', 'disruptive', 'breakthrough'],
        'Collaborative': ['collaboration', 'team player', 'cross-functional', 'teamwork', 'work together'],
        'Fast-Paced': ['fast-paced', 'dynamic', 'agile', 'rapidly growing', 'move quickly'],
        'Data-Driven': ['data-driven', 'metrics', 'analytics', 'evidence-based', 'kpis'],
        'Customer-Centric': ['customer-focused', 'customer experience', 'user-centric', 'client satisfaction'],
        'Open Source Friendly': ['open source', 'github', 'contribute to community', 'oss'],
        'Learning Culture': ['continuous learning', 'professional development', 'growth mindset', 'mentorship'],
        'Work-Life Balance': ['work-life balance', 'flexible hours', 'remote-first', 'wellness'],
        'Diversity & Inclusion': ['diversity', 'inclusive', 'equal opportunity', 'belonging']
    }
    
    for culture, keywords in culture_indicators.items():
        if any(keyword in jd_lower for keyword in keywords):
            culture_signals.append(culture)
    
    return culture_signals


def generate_role_insights(jd_text, company_info, culture_signals, matched_skills, missing_skills):
    """
    Generate strategic insights and recommendations for the application
    
    Args:
        jd_text (str): Job description text
        company_info (dict): Extracted company information
        culture_signals (list): Cultural attributes
        matched_skills (list): Skills the candidate has
        missing_skills (list): Skills the candidate needs
        
    Returns:
        dict: Comprehensive insights and recommendations
    """
    insights = {
        'company_overview': '',
        'role_focus': '',
        'what_to_emphasize': [],
        'application_tips': [],
        'estimated_salary_range': '',
        'career_path': '',
        'red_flags': [],
        'green_flags': []
    }
    
    # Company Overview
    if company_info['company_name']:
        size_text = f"{company_info['company_size']} " if company_info['company_size'] else ""
        industry_text = f" in the {company_info['industry']} sector" if company_info['industry'] else ""
        insights['company_overview'] = f"{company_info['company_name']} is a {size_text}company{industry_text}."
    else:
        insights['company_overview'] = "Company information not explicitly stated in the job description."
    
    # Role Focus
    if company_info['role_title']:
        insights['role_focus'] = f"This is a {company_info['role_title']} position"
        if company_info['location']:
            insights['role_focus'] += f" based in {company_info['location']}"
        insights['role_focus'] += "."
    
    # What to Emphasize
    jd_lower = jd_text.lower()
    
    if 'Open Source Friendly' in culture_signals:
        insights['what_to_emphasize'].append("💡 Highlight your GitHub profile and any open source contributions")
    
    if 'Collaborative' in culture_signals:
        insights['what_to_emphasize'].append("🤝 Emphasize team projects and cross-functional collaboration experience")
    
    if 'Data-Driven' in culture_signals:
        insights['what_to_emphasize'].append("📊 Showcase projects with measurable impact and data analysis")
    
    if 'Innovation-Focused' in culture_signals:
        insights['what_to_emphasize'].append("🚀 Mention innovative solutions, new technologies you've adopted, or patents")
    
    if 'Customer-Centric' in culture_signals:
        insights['what_to_emphasize'].append("⭐ Include examples of improving user experience or customer satisfaction")
    
    if 'leadership' in jd_lower or 'senior' in jd_lower:
        insights['what_to_emphasize'].append("👔 Demonstrate leadership experience and mentoring capabilities")
    
    if 'startup' in jd_lower or company_info['company_size'] == 'startup':
        insights['what_to_emphasize'].append("⚡ Show adaptability, wearing multiple hats, and thriving in ambiguity")
    
    # Application Tips
    if len(missing_skills) > 0:
        insights['application_tips'].append(f"🎯 Address the {len(missing_skills)} missing skills by showing quick learning ability or related experience")
    
    if len(matched_skills) >= 7:
        insights['application_tips'].append("✅ Strong skill match! Lead with your technical expertise in the cover letter")
    
    if 'portfolio' in jd_lower or 'github' in jd_lower:
        insights['application_tips'].append("📂 Attach or link your portfolio/GitHub - it's likely required for review")
    
    if 'referral' in jd_lower or 'employee referral' in jd_lower:
        insights['application_tips'].append("🔗 Seek an employee referral if possible - the JD mentions it")
    
    insights['application_tips'].append("📝 Customize your resume to mirror the language used in this JD")
    
    # Estimated Salary Range (based on role and seniority)
    role_lower = (company_info['role_title'] or '').lower()
    
    if 'senior' in role_lower or 'lead' in role_lower:
        insights['estimated_salary_range'] = "$120K - $180K (Senior level, varies by location)"
    elif 'junior' in role_lower or 'associate' in role_lower:
        insights['estimated_salary_range'] = "$70K - $100K (Junior level, varies by location)"
    elif 'principal' in role_lower or 'staff' in role_lower:
        insights['estimated_salary_range'] = "$150K - $220K (Principal/Staff level, varies by location)"
    elif 'manager' in role_lower or 'director' in role_lower:
        insights['estimated_salary_range'] = "$130K - $200K (Management level, varies by location)"
    else:
        insights['estimated_salary_range'] = "$90K - $140K (Mid-level, varies by location)"
    
    # Career Path
    if 'developer' in role_lower or 'engineer' in role_lower:
        insights['career_path'] = "Typical path: Junior → Mid-level → Senior → Staff/Principal → Engineering Manager/Architect"
    elif 'analyst' in role_lower:
        insights['career_path'] = "Typical path: Analyst → Senior Analyst → Lead Analyst → Manager → Director of Analytics"
    elif 'designer' in role_lower:
        insights['career_path'] = "Typical path: Designer → Senior Designer → Lead Designer → Design Manager → Head of Design"
    else:
        insights['career_path'] = "Career progression varies by role; typically Junior → Senior → Lead → Manager"
    
    # Red Flags
    if 'unpaid' in jd_lower or 'no compensation' in jd_lower:
        insights['red_flags'].append("🚩 Unpaid position - consider if this aligns with your goals")
    
    if 'overtime expected' in jd_lower or 'long hours' in jd_lower:
        insights['red_flags'].append("🚩 Mentions expected overtime - assess work-life balance expectations")
    
    if len(missing_skills) > 10:
        insights['red_flags'].append("🚩 Many missing skills - this role might be a significant stretch")
    
    if 'urgent' in jd_lower and 'immediate' in jd_lower:
        insights['red_flags'].append("⚠️ Urgency signals possible high turnover or critical backfill")
    
    # Green Flags
    if 'professional development' in jd_lower or 'training budget' in jd_lower:
        insights['green_flags'].append("✅ Offers professional development opportunities")
    
    if 'remote' in jd_lower or 'work from home' in jd_lower:
        insights['green_flags'].append("✅ Remote work options available")
    
    if 'equity' in jd_lower or 'stock options' in jd_lower:
        insights['green_flags'].append("✅ Equity/stock options mentioned - potential for ownership")
    
    if 'diverse' in jd_lower or 'inclusive' in jd_lower:
        insights['green_flags'].append("✅ Company emphasizes diversity and inclusion")
    
    if len(matched_skills) >= 8:
        insights['green_flags'].append("✅ Your skills align very well with this role")
    
    return insights


def generate_company_insights(jd_text, matched_skills, missing_skills):
    """
    Main function to generate complete company and role insights
    
    Args:
        jd_text (str): Job description text
        matched_skills (list): Skills the candidate has
        missing_skills (list): Skills the candidate needs
        
    Returns:
        dict: Complete insights package
    """
    company_info = extract_company_info(jd_text)
    culture_signals = analyze_company_culture(jd_text)
    insights = generate_role_insights(jd_text, company_info, culture_signals, matched_skills, missing_skills)
    
    return {
        'company_info': company_info,
        'culture_signals': culture_signals,
        'insights': insights
    }
