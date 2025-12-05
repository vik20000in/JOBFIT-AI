# JobFit AI

JobFit AI is a web application that helps job seekers analyze their fit for a specific job description. It compares a Resume against a Job Description (JD), calculates a match score, identifies missing skills, and generates a personalized upskilling plan.

## Features

- **Match Analysis**: Extracts skills from both JD and Resume to compute a match percentage.
- **Skill Gap Identification**: Clearly lists matched and missing skills.
- **Upskilling Plan**: Generates a tailored plan with recommended courses, practice tasks, and timelines for missing skills.
- **Enterprise UI**: Professional, Wipro-inspired design with multiple themes (Enterprise Blue, Dark Mode, Minimal).
- **Interactive Dashboard**: Visual score representation and responsive grid layouts for learning plans.

## Roadmap & Future Enhancements

We are constantly improving JobFit AI. Here are the features planned for future releases:

### 1. Advanced Resume Parsing 📄
- Support for **PDF and DOCX** file uploads.
- Automatic extraction of work experience, education, and certifications.

### 2. AI-Powered Semantic Matching 🤖
- Integration with **LLMs (OpenAI/Gemini)** to understand context beyond simple keyword matching.
- Better handling of synonyms (e.g., "React.js" vs "ReactJS").

### 3. Smart Cover Letter Generator 📝
- One-click generation of a **tailored cover letter** based on the specific JD and user's experience.

### 4. Mock Interview Prep 🎤
- Generate **technical interview questions** specific to the job role.
- AI-driven feedback on potential answers.

### 5. Job Market Insights 📊
- Estimated **salary ranges** for the role.
- Demand trends for the missing skills.

### 6. User Accounts & History 💾
- Save past analyses and track upskilling progress over time.


## Tech Stack

- **Backend**: Python (Flask)
- **Frontend**: HTML, CSS, JavaScript
- **Logic**: Custom keyword-based skill extraction and scoring algorithm.

## Setup & Installation

1.  **Prerequisites**: Ensure you have Python 3.x installed.

2.  **Clone/Download**: Download the project files to your local machine.

3.  **Install Dependencies**:
    Open a terminal in the project root (`jobfit-ai`) and run:
    ```bash
    pip install -r requirements.txt
    ```

4.  **Run the Application**:
    ```bash
    python app.py
    ```

5.  **Access the App**:
    Open your web browser and go to: `http://127.0.0.1:5000`

## Usage

1.  Paste the **Job Description** text into the left box.
2.  Paste your **Resume/CV** text into the right box.
3.  Click the **"Analyze Match"** button.
4.  Review your Match Score, Skill Gaps, and Upskilling Plan below.

## Project Structure

- `app.py`: Main Flask application entry point.
- `utils/analyzer.py`: Core logic for skill extraction, scoring, and plan generation.
- `templates/index.html`: Main HTML file.
- `static/style.css`: Styling for the application.
- `static/script.js`: Frontend logic for API communication and UI updates.
