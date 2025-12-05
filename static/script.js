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
});
