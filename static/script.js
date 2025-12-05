document.addEventListener('DOMContentLoaded', () => {
    const analyzeBtn = document.getElementById('analyze-btn');
    const jdInput = document.getElementById('jd-text');
    const resumeInput = document.getElementById('resume-text');
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

    analyzeBtn.addEventListener('click', async () => {
        // Reset UI
        errorMsg.classList.add('hidden');
        resultsSection.classList.add('hidden');
        analyzeBtn.disabled = true;
        analyzeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analyzing...';
        
        const jdText = jdInput.value.trim();
        const resumeText = resumeInput.value.trim();
        
        // Basic Validation
        if (!jdText || !resumeText) {
            showError("Please provide both a Job Description and a Resume.");
            resetButton();
            return;
        }
        
        try {
            const response = await fetch('/api/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    jd_text: jdText,
                    resume_text: resumeText
                })
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
});
