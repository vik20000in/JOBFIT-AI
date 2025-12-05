# JobFit AI

JobFit AI is a web application that helps job seekers analyze their fit for a specific job description. It compares a Resume against a Job Description (JD), calculates a match score, identifies missing skills, and generates a personalized upskilling plan.

## Features

- **Match Analysis**: Extracts skills from both JD and Resume to compute a match percentage.
- **Skill Gap Identification**: Clearly lists matched and missing skills.
- **Upskilling Plan**: Generates a tailored plan with recommended courses, practice tasks, and timelines for missing skills.
- **Clean UI**: A simple, responsive interface built with HTML, CSS, and JavaScript.

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
