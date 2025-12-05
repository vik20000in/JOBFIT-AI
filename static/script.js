document.addEventListener('DOMContentLoaded', () => {
    const analyzeBtn = document.getElementById('analyze-btn');
    const jdInput = document.getElementById('jd-text');
    const resumeInput = document.getElementById('resume-text');
    const errorMsg = document.getElementById('error-msg');
    const resultsSection = document.getElementById('results-section');
    
    analyzeBtn.addEventListener('click', async () => {
        // Reset UI
        errorMsg.classList.add('hidden');
        resultsSection.classList.add('hidden');
        analyzeBtn.disabled = true;
        analyzeBtn.textContent = "Analyzing...";
        
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
        analyzeBtn.textContent = "Analyze Match";
    }
    
    function displayResults(data) {
        // Update Score
        document.getElementById('score-value').textContent = data.score;
        
        // Update Matched Skills
        const matchedList = document.getElementById('matched-skills-list');
        matchedList.innerHTML = '';
        if (data.matched_skills.length === 0) {
            matchedList.innerHTML = '<li>No direct matches found</li>';
        } else {
            data.matched_skills.forEach(skill => {
                const li = document.createElement('li');
                li.textContent = skill;
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
                li.textContent = skill;
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
                        <h4>${item.skill}</h4>
                        <p><strong>Course:</strong> ${item.course_name}</p>
                        <p><strong>Task:</strong> ${item.practice_task}</p>
                    </div>
                    <div class="plan-meta">
                        <span class="timeline">⏱ ${item.timeline}</span>
                        <a href="${item.link}" class="course-link" target="_blank">View Course &rarr;</a>
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
