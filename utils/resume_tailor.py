"""
Resume Tailoring Engine
Analyzes resume and suggests specific improvements to match job description
"""

import re
from difflib import SequenceMatcher


def extract_resume_sections(resume_text):
    """
    Parse resume into sections for targeted improvements
    
    Args:
        resume_text (str): Original resume text
        
    Returns:
        dict: Resume sections with line numbers
    """
    lines = resume_text.split('\n')
    sections = {
        'header': {'start': 0, 'end': 0, 'lines': []},
        'summary': {'start': 0, 'end': 0, 'lines': []},
        'skills': {'start': 0, 'end': 0, 'lines': []},
        'experience': {'start': 0, 'end': 0, 'lines': []},
        'education': {'start': 0, 'end': 0, 'lines': []},
        'projects': {'start': 0, 'end': 0, 'lines': []},
        'certifications': {'start': 0, 'end': 0, 'lines': []},
        'other': {'start': 0, 'end': 0, 'lines': []}
    }
    
    current_section = 'header'
    section_start = 0
    
    section_keywords = {
        'summary': ['summary', 'objective', 'profile', 'about'],
        'skills': ['skills', 'technical skills', 'expertise', 'competencies'],
        'experience': ['experience', 'work history', 'employment', 'professional experience'],
        'education': ['education', 'academic', 'qualifications'],
        'projects': ['projects', 'portfolio'],
        'certifications': ['certifications', 'certificates', 'licenses']
    }
    
    for i, line in enumerate(lines):
        line_lower = line.lower().strip()
        
        # Detect section headers
        section_found = False
        for section, keywords in section_keywords.items():
            if any(keyword in line_lower for keyword in keywords) and len(line.strip()) < 50:
                # Save previous section
                if current_section and sections[current_section]['lines']:
                    sections[current_section]['end'] = i - 1
                
                # Start new section
                current_section = section
                sections[section]['start'] = i
                section_found = True
                break
        
        if current_section:
            sections[current_section]['lines'].append(line)
    
    # Close last section
    if current_section:
        sections[current_section]['end'] = len(lines) - 1
    
    return sections


def find_skill_insertion_points(resume_sections, missing_skills, matched_skills):
    """
    Identify where missing skills can be naturally inserted
    
    Args:
        resume_sections (dict): Parsed resume sections
        missing_skills (list): Skills to add
        matched_skills (list): Skills already present
        
    Returns:
        list: Insertion suggestions
    """
    suggestions = []
    
    # Check if skills section exists
    has_skills_section = bool(resume_sections['skills']['lines'])
    
    for skill in missing_skills:
        skill_lower = skill.lower()
        
        # Priority 1: Add to existing skills section
        if has_skills_section:
            suggestions.append({
                'skill': skill,
                'section': 'skills',
                'action': 'add_to_list',
                'location': 'Technical Skills section',
                'suggestion': f"Add '{skill}' to your Technical Skills list",
                'priority': 'high',
                'line_number': resume_sections['skills']['start'] + len(resume_sections['skills']['lines']) - 1
            })
        
        # Priority 2: Integrate into project descriptions
        if resume_sections['projects']['lines']:
            for i, line in enumerate(resume_sections['projects']['lines']):
                # Look for project bullets or descriptions
                if line.strip().startswith(('-', '•', '*')) or 'project' in line.lower():
                    suggestions.append({
                        'skill': skill,
                        'section': 'projects',
                        'action': 'enhance_description',
                        'location': f'Projects section, line {i+1}',
                        'suggestion': f"Mention '{skill}' in your project description: \"{line.strip()[:50]}...\"",
                        'priority': 'medium',
                        'line_number': resume_sections['projects']['start'] + i,
                        'original_line': line
                    })
                    break
        
        # Priority 3: Enhance work experience
        if resume_sections['experience']['lines']:
            for i, line in enumerate(resume_sections['experience']['lines']):
                # Look for bullet points in experience
                if line.strip().startswith(('-', '•', '*')):
                    # Check if this bullet is relevant to the skill
                    if any(keyword in line.lower() for keyword in ['developed', 'built', 'implemented', 'created', 'managed']):
                        suggestions.append({
                            'skill': skill,
                            'section': 'experience',
                            'action': 'enhance_bullet',
                            'location': f'Work Experience section, line {i+1}',
                            'suggestion': f"Add '{skill}' to this accomplishment: \"{line.strip()[:50]}...\"",
                            'priority': 'medium',
                            'line_number': resume_sections['experience']['start'] + i,
                            'original_line': line
                        })
                        break
    
    return suggestions


def generate_tailored_resume(resume_text, resume_sections, suggestions, missing_skills, matched_skills):
    """
    Create an auto-tailored version of the resume with missing skills integrated
    
    Args:
        resume_text (str): Original resume
        resume_sections (dict): Parsed sections
        suggestions (list): Insertion suggestions
        missing_skills (list): Skills to add
        matched_skills (list): Existing skills
        
    Returns:
        str: Tailored resume with improvements
    """
    lines = resume_text.split('\n')
    modifications = []
    
    # Group suggestions by section and line
    skills_to_add_to_section = {}
    line_enhancements = {}
    
    for suggestion in suggestions:
        if suggestion['action'] == 'add_to_list':
            section = suggestion['section']
            if section not in skills_to_add_to_section:
                skills_to_add_to_section[section] = []
            skills_to_add_to_section[section].append(suggestion['skill'])
        elif suggestion['action'] in ['enhance_description', 'enhance_bullet']:
            line_num = suggestion['line_number']
            if line_num not in line_enhancements:
                line_enhancements[line_num] = []
            line_enhancements[line_num].append(suggestion)
    
    # Apply modifications
    tailored_lines = lines.copy()
    
    # 1. Add skills to skills section
    if 'skills' in skills_to_add_to_section and resume_sections['skills']['lines']:
        skills_section_end = resume_sections['skills']['end']
        # Find the last line with skills
        for i in range(skills_section_end, resume_sections['skills']['start'], -1):
            if tailored_lines[i].strip() and not tailored_lines[i].strip().endswith(':'):
                # Add skills to this line
                if tailored_lines[i].strip().endswith(','):
                    tailored_lines[i] = tailored_lines[i].rstrip() + ' ' + ', '.join(skills_to_add_to_section['skills'])
                else:
                    tailored_lines[i] = tailored_lines[i].rstrip() + ', ' + ', '.join(skills_to_add_to_section['skills'])
                modifications.append({
                    'line': i,
                    'type': 'skill_addition',
                    'skills': skills_to_add_to_section['skills']
                })
                break
    
    # 2. Enhance specific lines
    for line_num, enhancements in sorted(line_enhancements.items(), reverse=True):
        original_line = tailored_lines[line_num]
        skill = enhancements[0]['skill']  # Take first enhancement for this line
        
        # Smart insertion into bullet point
        if original_line.strip().startswith(('-', '•', '*')):
            bullet_char = original_line.strip()[0]
            text = original_line.strip()[1:].strip()
            
            # Add skill naturally
            if 'using' in text.lower() or 'with' in text.lower():
                # Append to existing technology list
                enhanced = f"{bullet_char} {text.rstrip('.')}, {skill}"
            else:
                # Add as new capability
                enhanced = f"{bullet_char} {text.rstrip('.')} using {skill}"
            
            # Preserve indentation
            indent = len(original_line) - len(original_line.lstrip())
            tailored_lines[line_num] = ' ' * indent + enhanced
            
            modifications.append({
                'line': line_num,
                'type': 'line_enhancement',
                'skill': skill,
                'original': original_line.strip(),
                'enhanced': enhanced
            })
    
    tailored_resume = '\n'.join(tailored_lines)
    
    return tailored_resume, modifications


def create_diff_highlights(original_text, tailored_text):
    """
    Create character-level highlights showing what changed
    
    Args:
        original_text (str): Original resume
        tailored_text (str): Tailored resume
        
    Returns:
        list: Highlighted sections for both versions
    """
    original_lines = original_text.split('\n')
    tailored_lines = tailored_text.split('\n')
    
    highlights = []
    
    for i, (orig, tail) in enumerate(zip(original_lines, tailored_lines)):
        if orig != tail:
            # Find the difference
            matcher = SequenceMatcher(None, orig, tail)
            
            for tag, i1, i2, j1, j2 in matcher.get_opcodes():
                if tag == 'insert':
                    highlights.append({
                        'line_number': i,
                        'type': 'addition',
                        'position': j1,
                        'text': tail[j1:j2],
                        'context': tail
                    })
                elif tag == 'replace':
                    highlights.append({
                        'line_number': i,
                        'type': 'modification',
                        'original': orig[i1:i2],
                        'new': tail[j1:j2],
                        'context': tail
                    })
    
    return highlights


def generate_tailoring_analysis(resume_text, jd_text, missing_skills, matched_skills):
    """
    Main function to generate complete tailoring workbench data
    
    Args:
        resume_text (str): Original resume
        jd_text (str): Job description
        missing_skills (list): Skills to add
        matched_skills (list): Existing skills
        
    Returns:
        dict: Complete tailoring data
    """
    # Parse resume
    resume_sections = extract_resume_sections(resume_text)
    
    # Find insertion points
    suggestions = find_skill_insertion_points(resume_sections, missing_skills, matched_skills)
    
    # Generate tailored version
    tailored_resume, modifications = generate_tailored_resume(
        resume_text, 
        resume_sections, 
        suggestions, 
        missing_skills, 
        matched_skills
    )
    
    # Create diff highlights
    highlights = create_diff_highlights(resume_text, tailored_resume)
    
    # Generate improvement summary
    improvement_summary = {
        'skills_added': len(set(mod['skills'] if 'skills' in mod else [mod.get('skill', '')] for mod in modifications if mod)),
        'lines_enhanced': len([mod for mod in modifications if mod['type'] == 'line_enhancement']),
        'total_changes': len(modifications),
        'coverage_improvement': f"+{min(len(missing_skills) * 5, 25)}%"  # Rough estimate
    }
    
    return {
        'original_resume': resume_text,
        'tailored_resume': tailored_resume,
        'suggestions': suggestions,
        'modifications': modifications,
        'highlights': highlights,
        'improvement_summary': improvement_summary,
        'resume_sections': {k: {'start': v['start'], 'end': v['end'], 'line_count': len(v['lines'])} 
                           for k, v in resume_sections.items() if v['lines']}
    }
