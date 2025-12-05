document.addEventListener('DOMContentLoaded', () => {
    const analyzeBtn = document.getElementById('analyze-btn');
    const jdInput = document.getElementById('jd-text');
    const resumeInput = document.getElementById('resume-text');
    const jdFileInput = document.getElementById('jd-file');
    const resumeFileInput = document.getElementById('resume-file');
    const errorMsg = document.getElementById('error-msg');
    const resultsSection = document.getElementById('results-section');
    const themeSelect = document.getElementById('theme-select');
    
    // Load default Job Description and Resume for debugging
    const defaultJD = `Senior Full Stack Developer

We are seeking an experienced Full Stack Developer to join our dynamic team.

Required Skills:
- Python (Django/Flask)
- JavaScript (React, Node.js)
- SQL and NoSQL databases (PostgreSQL, MongoDB)
- RESTful APIs and microservices
- Git version control
- Docker and Kubernetes
- AWS or Azure cloud platforms
- Agile/Scrum methodologies

Preferred Skills:
- Machine Learning basics
- CI/CD pipelines
- TypeScript
- GraphQL
- Redis caching

Responsibilities:
- Design and implement scalable web applications
- Collaborate with cross-functional teams
- Write clean, maintainable code
- Participate in code reviews
- Mentor junior developers

Experience: 5+ years in software development
Education: Bachelor's degree in Computer Science or related field`;

    const defaultResume = `John Doe
Senior Software Engineer
Email: john.doe@email.com | Phone: (555) 123-4567
LinkedIn: linkedin.com/in/johndoe | GitHub: github.com/johndoe

PROFESSIONAL SUMMARY
Experienced Full Stack Developer with 6+ years building scalable web applications. Expert in Python, JavaScript, and cloud technologies. Passionate about clean code and agile practices.

TECHNICAL SKILLS
Languages: Python, JavaScript, Java, SQL
Frameworks: Django, Flask, React, Node.js, Express
Databases: PostgreSQL, MySQL, MongoDB
Cloud: AWS (EC2, S3, Lambda), Docker
Tools: Git, Jenkins, JIRA, VS Code

WORK EXPERIENCE

Senior Software Engineer | Tech Solutions Inc. | 2021 - Present
- Developed microservices architecture using Python Flask and Docker
- Built RESTful APIs serving 100K+ daily requests
- Implemented CI/CD pipelines reducing deployment time by 60%
- Mentored 3 junior developers in best practices

Full Stack Developer | Startup XYZ | 2019 - 2021
- Created React-based dashboards with real-time data visualization
- Designed PostgreSQL database schemas for e-commerce platform
- Integrated payment gateways (Stripe, PayPal)
- Collaborated in Agile sprints with cross-functional teams

Software Developer | Legacy Corp | 2018 - 2019
- Maintained Java-based enterprise applications
- Wrote automated tests achieving 85% code coverage
- Optimized database queries improving performance by 40%

EDUCATION
Bachelor of Science in Computer Science
State University | 2018

CERTIFICATIONS
- AWS Certified Developer - Associate
- Certified Scrum Master (CSM)`;

    // Auto-populate text areas
    jdInput.value = defaultJD;
    resumeInput.value = defaultResume;
    
    // Theme Switching Logic
    themeSelect.addEventListener('change', (e) => {
        const theme = e.target.value;
        if (theme === 'wipro') {
            document.documentElement.removeAttribute('data-theme');
        } else {
            document.documentElement.setAttribute('data-theme', theme);
        }
    });

    // Tab Switching Logic
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targetId = e.target.dataset.target;
            const parentGroup = e.target.closest('.input-group');
            
            // Remove active class from all tabs in this group
            parentGroup.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            // Add active class to clicked tab
            e.target.classList.add('active');
            
            // Hide all content in this group
            parentGroup.querySelectorAll('.input-content').forEach(c => c.classList.remove('active', 'hidden'));
            parentGroup.querySelectorAll('.input-content').forEach(c => {
                if (c.id !== targetId) c.classList.add('hidden');
            });
            
            // Show target content
            parentGroup.querySelector(`#${targetId}`).classList.add('active');
        });
    });

    analyzeBtn.addEventListener('click', async () => {
        // Reset UI
        errorMsg.classList.add('hidden');
        resultsSection.classList.add('hidden');
        analyzeBtn.disabled = true;
        analyzeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analyzing...';
        
        const formData = new FormData();
        let hasJd = false;
        let hasResume = false;

        // Check JD Input (Text or File)
        if (jdFileInput.files.length > 0) {
            formData.append('jd_file', jdFileInput.files[0]);
            hasJd = true;
        } else if (jdInput.value.trim()) {
            formData.append('jd_text', jdInput.value.trim());
            hasJd = true;
        }

        // Check Resume Input (Text or File)
        if (resumeFileInput.files.length > 0) {
            formData.append('resume_file', resumeFileInput.files[0]);
            hasResume = true;
        } else if (resumeInput.value.trim()) {
            formData.append('resume_text', resumeInput.value.trim());
            hasResume = true;
        }
        
        // Basic Validation
        if (!hasJd || !hasResume) {
            showError("Please provide both a Job Description and a Resume (Text or File).");
            resetButton();
            return;
        }
        
        try {
            const response = await fetch('/api/analyze', {
                method: 'POST',
                body: formData // Fetch automatically sets Content-Type to multipart/form-data
            });
            
            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.error || "An error occurred during analysis.");
            }
            
            displayResults(result.data);
            
        } catch (error) {
            showError(error.message);
        } finally {
            resetButton();
        }
    });
    
    function showError(message) {
        errorMsg.textContent = message;
        errorMsg.classList.remove('hidden');
    }
    
    function resetButton() {
        analyzeBtn.disabled = false;
        analyzeBtn.innerHTML = '<i class="fas fa-search"></i> Analyze Match';
    }
    
    function escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }
    
    function displayResults(data) {
        resultsSection.classList.remove('hidden');
        
        // Update Score with Animation
        const scoreValue = document.getElementById('score-value');
        const circle = document.querySelector('.progress-ring__circle');
        
        if (circle && scoreValue) {
            const radius = circle.r.baseVal.value;
            const circumference = radius * 2 * Math.PI;
            
            circle.style.strokeDasharray = `${circumference} ${circumference}`;
            circle.style.strokeDashoffset = circumference;
            
            const offset = circumference - (data.score / 100) * circumference;
            
            // Animate the number
            let currentScore = 0;
            const interval = setInterval(() => {
                if (currentScore >= data.score) {
                    clearInterval(interval);
                    scoreValue.textContent = data.score;
                } else {
                    currentScore++;
                    scoreValue.textContent = currentScore;
                }
            }, 20);
            
            // Animate the circle
            setTimeout(() => {
                circle.style.strokeDashoffset = offset;
            }, 100);
        }
        
        // Update Matched Skills
        const matchedList = document.getElementById('matched-skills-list');
        matchedList.innerHTML = '';
        if (data.matched_skills.length === 0) {
            matchedList.innerHTML = '<li>No direct matches found</li>';
        } else {
            data.matched_skills.forEach(skill => {
                const li = document.createElement('li');
                li.innerHTML = `<i class="fas fa-check"></i> ${skill}`;
                matchedList.appendChild(li);
            });
        }
        
        // Update Missing Skills
        const missingList = document.getElementById('missing-skills-list');
        missingList.innerHTML = '';
        if (data.missing_skills.length === 0) {
            missingList.innerHTML = '<li>No missing skills detected!</li>';
        } else {
            data.missing_skills.forEach(skill => {
                const li = document.createElement('li');
                li.innerHTML = `<i class="fas fa-times"></i> ${skill}`;
                missingList.appendChild(li);
            });
        }

        // Update Cover Letter
        const coverLetterText = document.getElementById('cover-letter-text');
        if (data.cover_letter) {
            coverLetterText.value = data.cover_letter;
        } else {
            coverLetterText.value = "Could not generate cover letter.";
        }
        
        // Update Interview Questions
        const questionsList = document.getElementById('questions-list');
        questionsList.innerHTML = '';
        
        if (data.interview_questions && data.interview_questions.length > 0) {
            data.interview_questions.forEach((q, index) => {
                const questionItem = document.createElement('div');
                questionItem.className = 'question-item';
                
                questionItem.innerHTML = `
                    <div class="question-header">
                        <span class="question-skill"><i class="fas fa-code"></i> ${q.skill}</span>
                        <div class="question-badges">
                            <span class="badge difficulty-${q.difficulty}">${q.difficulty.toUpperCase()}</span>
                            <span class="badge category">${q.category}</span>
                        </div>
                    </div>
                    <p class="question-text">${q.question}</p>
                `;
                
                questionsList.appendChild(questionItem);
            });
        } else {
            questionsList.innerHTML = '<p style="text-align:center; color:var(--text-muted);">No interview questions generated.</p>';
        }
        
        // Update Formatting Tips
        const tipsList = document.getElementById('tips-list');
        tipsList.innerHTML = '';
        
        if (data.formatting_tips && data.formatting_tips.length > 0) {
            data.formatting_tips.forEach((tip) => {
                const tipItem = document.createElement('div');
                tipItem.className = `tip-item severity-${tip.severity}`;
                
                tipItem.innerHTML = `
                    <div class="tip-header">
                        <span class="tip-category">${tip.category}</span>
                        <i class="fas ${tip.icon} tip-icon severity-${tip.severity}"></i>
                    </div>
                    <div class="tip-issue">${tip.issue}</div>
                    <p class="tip-suggestion">${tip.suggestion}</p>
                `;
                
                tipsList.appendChild(tipItem);
            });
        } else {
            tipsList.innerHTML = '<p style="text-align:center; color:var(--text-muted);">No formatting tips available.</p>';
        }
        
        // Update Company Insights
        if (data.company_insights) {
            const insights = data.company_insights;
            
            // Company Overview
            const companyOverview = document.getElementById('company-overview-text');
            companyOverview.textContent = insights.insights.company_overview || 'No company information available.';
            
            // Company Meta
            const companySize = document.getElementById('company-size');
            const companyIndustry = document.getElementById('company-industry');
            const companyLocation = document.getElementById('company-location');
            
            companySize.textContent = insights.company_info.company_size ? `📊 ${insights.company_info.company_size}` : '';
            companySize.style.display = insights.company_info.company_size ? 'inline-block' : 'none';
            
            companyIndustry.textContent = insights.company_info.industry ? `🏢 ${insights.company_info.industry}` : '';
            companyIndustry.style.display = insights.company_info.industry ? 'inline-block' : 'none';
            
            companyLocation.textContent = insights.company_info.location ? `📍 ${insights.company_info.location}` : '';
            companyLocation.style.display = insights.company_info.location ? 'inline-block' : 'none';
            
            // Culture Signals
            const cultureSignals = document.getElementById('culture-signals');
            cultureSignals.innerHTML = '';
            if (insights.culture_signals && insights.culture_signals.length > 0) {
                insights.culture_signals.forEach(signal => {
                    const badge = document.createElement('span');
                    badge.className = 'culture-badge';
                    badge.textContent = signal;
                    cultureSignals.appendChild(badge);
                });
            } else {
                cultureSignals.innerHTML = '<p style="color:var(--text-muted);">No specific culture signals detected.</p>';
            }
            
            // Role Focus
            const roleFocusText = document.getElementById('role-focus-text');
            roleFocusText.textContent = insights.insights.role_focus || 'Role information not available.';
            
            // Salary Range
            const salaryRange = document.getElementById('salary-range');
            salaryRange.textContent = insights.insights.estimated_salary_range || 'Not specified';
            
            // Career Path
            const careerPath = document.getElementById('career-path-text');
            careerPath.textContent = insights.insights.career_path || 'Career path information not available.';
            
            // What to Emphasize
            const emphasisList = document.getElementById('emphasis-list');
            emphasisList.innerHTML = '';
            if (insights.insights.what_to_emphasize && insights.insights.what_to_emphasize.length > 0) {
                insights.insights.what_to_emphasize.forEach(point => {
                    const li = document.createElement('li');
                    li.textContent = point;
                    emphasisList.appendChild(li);
                });
            } else {
                emphasisList.innerHTML = '<li style="color:var(--text-muted);">No specific emphasis points.</li>';
            }
            
            // Application Tips
            const applicationTipsList = document.getElementById('application-tips-list');
            applicationTipsList.innerHTML = '';
            if (insights.insights.application_tips && insights.insights.application_tips.length > 0) {
                insights.insights.application_tips.forEach(tip => {
                    const li = document.createElement('li');
                    li.textContent = tip;
                    applicationTipsList.appendChild(li);
                });
            } else {
                applicationTipsList.innerHTML = '<li style="color:var(--text-muted);">No specific tips available.</li>';
            }
            
            // Green Flags
            const greenFlagsList = document.getElementById('green-flags-list');
            greenFlagsList.innerHTML = '';
            if (insights.insights.green_flags && insights.insights.green_flags.length > 0) {
                insights.insights.green_flags.forEach(flag => {
                    const li = document.createElement('li');
                    li.textContent = flag;
                    greenFlagsList.appendChild(li);
                });
            } else {
                greenFlagsList.innerHTML = '<li style="color:var(--text-muted);">No green flags identified.</li>';
            }
            
            // Red Flags
            const redFlagsList = document.getElementById('red-flags-list');
            redFlagsList.innerHTML = '';
            if (insights.insights.red_flags && insights.insights.red_flags.length > 0) {
                insights.insights.red_flags.forEach(flag => {
                    const li = document.createElement('li');
                    li.textContent = flag;
                    redFlagsList.appendChild(li);
                });
            } else {
                redFlagsList.innerHTML = '<li style="color:var(--text-muted);">No red flags detected.</li>';
            }
        }
        
        // Update Tailoring Workbench
        if (data.tailoring_data) {
            const tailoringData = data.tailoring_data;
            
            // Update improvement stats
            const improvementSummary = tailoringData.improvement_summary;
            document.getElementById('skills-added-stat').textContent = improvementSummary.skills_added || 0;
            document.getElementById('lines-enhanced-stat').textContent = improvementSummary.lines_enhanced || 0;
            document.getElementById('total-changes-stat').textContent = improvementSummary.total_changes || 0;
            document.getElementById('coverage-improvement').textContent = `Estimated improvement: ${improvementSummary.coverage_improvement}`;
            
            // Display suggestions
            const suggestionsList = document.getElementById('suggestions-list');
            suggestionsList.innerHTML = '';
            
            if (tailoringData.suggestions && tailoringData.suggestions.length > 0) {
                // Group by priority
                const highPriority = tailoringData.suggestions.filter(s => s.priority === 'high');
                const mediumPriority = tailoringData.suggestions.filter(s => s.priority === 'medium');
                
                if (highPriority.length > 0) {
                    const highSection = document.createElement('div');
                    highSection.className = 'priority-section';
                    highSection.innerHTML = '<h4><i class="fas fa-star"></i> High Priority</h4>';
                    highPriority.forEach(suggestion => {
                        const suggestionCard = document.createElement('div');
                        suggestionCard.className = 'suggestion-card priority-high';
                        suggestionCard.innerHTML = `
                            <div class="suggestion-skill">${suggestion.skill}</div>
                            <div class="suggestion-text">${suggestion.suggestion}</div>
                            <div class="suggestion-location"><i class="fas fa-map-marker-alt"></i> ${suggestion.location}</div>
                        `;
                        highSection.appendChild(suggestionCard);
                    });
                    suggestionsList.appendChild(highSection);
                }
                
                if (mediumPriority.length > 0 && mediumPriority.length <= 5) {
                    const mediumSection = document.createElement('div');
                    mediumSection.className = 'priority-section';
                    mediumSection.innerHTML = '<h4><i class="fas fa-circle"></i> Medium Priority</h4>';
                    mediumPriority.slice(0, 5).forEach(suggestion => {
                        const suggestionCard = document.createElement('div');
                        suggestionCard.className = 'suggestion-card priority-medium';
                        suggestionCard.innerHTML = `
                            <div class="suggestion-skill">${suggestion.skill}</div>
                            <div class="suggestion-text">${suggestion.suggestion}</div>
                            <div class="suggestion-location"><i class="fas fa-map-marker-alt"></i> ${suggestion.location}</div>
                        `;
                        mediumSection.appendChild(suggestionCard);
                    });
                    suggestionsList.appendChild(mediumSection);
                }
            } else {
                suggestionsList.innerHTML = '<p style="text-align:center; color:var(--text-muted);">Your resume is already well-optimized!</p>';
            }
            
            // Display original resume
            const originalDisplay = document.getElementById('original-resume-display');
            originalDisplay.textContent = tailoringData.original_resume;
            
            // Display tailored resume with highlights
            const tailoredDisplay = document.getElementById('tailored-resume-display');
            const tailoredText = tailoringData.tailored_resume;
            
            // Simple highlighting: show additions in green
            if (tailoringData.highlights && tailoringData.highlights.length > 0) {
                let highlightedHTML = escapeHtml(tailoredText);
                
                // Highlight added skills (simple approach - wrap added text)
                tailoringData.highlights.forEach(highlight => {
                    if (highlight.type === 'addition') {
                        const textToHighlight = escapeHtml(highlight.text);
                        highlightedHTML = highlightedHTML.replace(
                            textToHighlight,
                            `<span class="highlight-addition">${textToHighlight}</span>`
                        );
                    }
                });
                
                tailoredDisplay.innerHTML = highlightedHTML;
            } else {
                tailoredDisplay.textContent = tailoredText;
            }
        }
        
        /* Resume Builder - Hidden for future implementation
        // Update Resume Builder (but keep it hidden initially)
        const resumeBuilderText = document.getElementById('resume-builder-text');
        const resumeBuilderContainer = document.getElementById('resume-builder-container');
        if (data.improved_resume) {
            resumeBuilderText.value = data.improved_resume;
        } else {
            resumeBuilderText.value = "Could not generate resume template.";
        }
        // Reset to hidden state
        resumeBuilderContainer.classList.add('hidden');
        const toggleBuilderBtn = document.getElementById('toggle-builder-btn');
        toggleBuilderBtn.innerHTML = '<i class="fas fa-file-edit"></i> Show Improved Resume Builder';
        */
        
        // Update Upskilling Plan
        const planContainer = document.getElementById('plan-container');
        planContainer.innerHTML = '';
        
        if (data.upskilling_plan.length === 0) {
            planContainer.innerHTML = '<p style="text-align:center; color:var(--text-muted);">No upskilling needed. You are a great fit!</p>';
        } else {
            data.upskilling_plan.forEach(item => {
                const planItem = document.createElement('div');
                planItem.className = 'plan-item';
                
                planItem.innerHTML = `
                    <div class="plan-info">
                        <h4><i class="fas fa-graduation-cap"></i> ${item.skill}</h4>
                        <p><strong>Course:</strong> ${item.course_name}</p>
                        <p><strong>Task:</strong> ${item.practice_task}</p>
                    </div>
                    <div class="plan-meta">
                        <span class="timeline"><i class="fas fa-clock"></i> ${item.timeline}</span>
                        <a href="${item.link}" class="course-link" target="_blank">Start Learning <i class="fas fa-arrow-right"></i></a>
                    </div>
                `;
                
                planContainer.appendChild(planItem);
            });
        }
        
        resultsSection.classList.remove('hidden');
        // Scroll to results
        resultsSection.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Tab Switching Logic
    const resultsTabBtns = document.querySelectorAll('.results-tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');
    
    resultsTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.dataset.tab;
            
            // Remove active class from all tabs and panels
            resultsTabBtns.forEach(b => b.classList.remove('active'));
            tabPanels.forEach(panel => panel.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding panel
            btn.classList.add('active');
            const targetPanel = document.getElementById(`${targetTab}-panel`);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
        });
    });
    
    // Copy Cover Letter Logic
    const copyBtn = document.getElementById('copy-letter-btn');
    copyBtn.addEventListener('click', () => {
        const coverLetterText = document.getElementById('cover-letter-text');
        coverLetterText.select();
        document.execCommand('copy');
        
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        setTimeout(() => {
            copyBtn.innerHTML = originalText;
        }, 2000);
    });
    
    // Copy Tailored Resume
    const copyTailoredBtn = document.getElementById('copy-tailored-btn');
    copyTailoredBtn.addEventListener('click', () => {
        const tailoredText = document.getElementById('tailored-resume-display').textContent;
        navigator.clipboard.writeText(tailoredText).then(() => {
            const originalText = copyTailoredBtn.innerHTML;
            copyTailoredBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
            setTimeout(() => {
                copyTailoredBtn.innerHTML = originalText;
            }, 2000);
        });
    });
    
    // Download Tailored Resume
    const downloadTailoredBtn = document.getElementById('download-tailored-btn');
    downloadTailoredBtn.addEventListener('click', () => {
        const tailoredText = document.getElementById('tailored-resume-display').textContent;
        const blob = new Blob([tailoredText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Tailored_Resume_' + new Date().toISOString().split('T')[0] + '.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        const originalText = downloadTailoredBtn.innerHTML;
        downloadTailoredBtn.innerHTML = '<i class="fas fa-check"></i> Downloaded!';
        setTimeout(() => {
            downloadTailoredBtn.innerHTML = originalText;
        }, 2000);
    });
    
    /* Resume Builder - Hidden for future implementation
    // Toggle Resume Builder Visibility
    const toggleBuilderBtn = document.getElementById('toggle-builder-btn');
    const resumeBuilderContainer = document.getElementById('resume-builder-container');
    
    toggleBuilderBtn.addEventListener('click', () => {
        resumeBuilderContainer.classList.toggle('hidden');
        
        if (resumeBuilderContainer.classList.contains('hidden')) {
            toggleBuilderBtn.innerHTML = '<i class="fas fa-file-edit"></i> Show Improved Resume Builder';
        } else {
            toggleBuilderBtn.innerHTML = '<i class="fas fa-file-edit"></i> Hide Improved Resume Builder';
        }
    });
    
    // Download Resume
    const downloadResumeBtn = document.getElementById('download-resume-btn');
    downloadResumeBtn.addEventListener('click', () => {
        const resumeText = document.getElementById('resume-builder-text').value;
        const blob = new Blob([resumeText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Improved_Resume_' + new Date().toISOString().split('T')[0] + '.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        // Visual feedback
        const originalText = downloadResumeBtn.innerHTML;
        downloadResumeBtn.innerHTML = '<i class="fas fa-check"></i> Downloaded!';
        setTimeout(() => {
            downloadResumeBtn.innerHTML = originalText;
        }, 2000);
    });
    
    // Copy Resume to Clipboard
    const copyResumeBtn = document.getElementById('copy-resume-btn');
    copyResumeBtn.addEventListener('click', () => {
        const resumeBuilderText = document.getElementById('resume-builder-text');
        resumeBuilderText.select();
        document.execCommand('copy');
        
        const originalText = copyResumeBtn.innerHTML;
        copyResumeBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        setTimeout(() => {
            copyResumeBtn.innerHTML = originalText;
        }, 2000);
    });
    */

    // Scroll to Top Button Functionality
    const scrollToTopBtn = document.getElementById('scroll-to-top');
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    });
    
    // Scroll to top when button is clicked
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});
