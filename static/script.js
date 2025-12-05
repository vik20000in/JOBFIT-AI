document.addEventListener('DOMContentLoaded', () => {
    const analyzeBtn = document.getElementById('analyze-btn');
    const jdInput = document.getElementById('jd-text');
    const resumeInput = document.getElementById('resume-text');
    const jdFileInput = document.getElementById('jd-file');
    const resumeFileInput = document.getElementById('resume-file');
    const errorMsg = document.getElementById('error-msg');
    const resultsSection = document.getElementById('results-section');
    const themeSelect = document.getElementById('theme-select');
    
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
    
    function displayResults(data) {
        resultsSection.classList.remove('hidden');
        
        // Update Score with Animation
        const scoreValue = document.getElementById('score-value');
        const circle = document.querySelector('.progress-ring__circle');
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

        // Update Cover Letter (but keep it hidden initially)
        const coverLetterText = document.getElementById('cover-letter-text');
        const coverLetterContainer = document.getElementById('cover-letter-container');
        if (data.cover_letter) {
            coverLetterText.value = data.cover_letter;
        } else {
            coverLetterText.value = "Could not generate cover letter.";
        }
        // Reset to hidden state
        coverLetterContainer.classList.add('hidden');
        const toggleLetterBtn = document.getElementById('toggle-letter-btn');
        toggleLetterBtn.innerHTML = '<i class="fas fa-file-signature"></i> Show Smart Cover Letter';
        
        // Update Interview Questions (but keep it hidden initially)
        const questionsList = document.getElementById('questions-list');
        const interviewQuestionsContainer = document.getElementById('interview-questions-container');
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
        
        // Reset to hidden state
        interviewQuestionsContainer.classList.add('hidden');
        const toggleQuestionsBtn = document.getElementById('toggle-questions-btn');
        toggleQuestionsBtn.innerHTML = '<i class="fas fa-question-circle"></i> Show Potential Technical Interview Questions';
        
        // Update Formatting Tips (but keep it hidden initially)
        const tipsList = document.getElementById('tips-list');
        const formattingTipsContainer = document.getElementById('formatting-tips-container');
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
        
        // Reset to hidden state
        formattingTipsContainer.classList.add('hidden');
        const toggleTipsBtn = document.getElementById('toggle-tips-btn');
        toggleTipsBtn.innerHTML = '<i class="fas fa-magic"></i> Show Resume Formatting Tips';
        
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
    
    // Toggle Cover Letter Visibility
    const toggleLetterBtn = document.getElementById('toggle-letter-btn');
    const coverLetterContainer = document.getElementById('cover-letter-container');
    
    toggleLetterBtn.addEventListener('click', () => {
        coverLetterContainer.classList.toggle('hidden');
        
        if (coverLetterContainer.classList.contains('hidden')) {
            toggleLetterBtn.innerHTML = '<i class="fas fa-file-signature"></i> Show Smart Cover Letter';
        } else {
            toggleLetterBtn.innerHTML = '<i class="fas fa-file-signature"></i> Hide Smart Cover Letter';
        }
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
    
    // Toggle Interview Questions Visibility
    const toggleQuestionsBtn = document.getElementById('toggle-questions-btn');
    const interviewQuestionsContainer = document.getElementById('interview-questions-container');
    
    toggleQuestionsBtn.addEventListener('click', () => {
        interviewQuestionsContainer.classList.toggle('hidden');
        
        if (interviewQuestionsContainer.classList.contains('hidden')) {
            toggleQuestionsBtn.innerHTML = '<i class="fas fa-question-circle"></i> Show Potential Technical Interview Questions';
        } else {
            toggleQuestionsBtn.innerHTML = '<i class="fas fa-question-circle"></i> Hide Potential Technical Interview Questions';
        }
    });
    
    // Toggle Formatting Tips Visibility
    const toggleTipsBtn = document.getElementById('toggle-tips-btn');
    const formattingTipsContainer = document.getElementById('formatting-tips-container');
    
    toggleTipsBtn.addEventListener('click', () => {
        formattingTipsContainer.classList.toggle('hidden');
        
        if (formattingTipsContainer.classList.contains('hidden')) {
            toggleTipsBtn.innerHTML = '<i class="fas fa-magic"></i> Show Resume Formatting Tips';
        } else {
            toggleTipsBtn.innerHTML = '<i class="fas fa-magic"></i> Hide Resume Formatting Tips';
        }
    });
    
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
});
