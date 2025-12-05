# JobFit AI 🚀

**JobFit AI** is an intelligent web application that helps job seekers analyze their fit for specific job descriptions. Using advanced AI-powered semantic matching, it compares resumes against job descriptions, calculates match scores, identifies skill gaps, and generates personalized career development resources.

---

## ✨ Features

### Core Capabilities
- **🎯 Smart Match Analysis**: AI-powered semantic matching using Sentence Transformers to compute resume-JD compatibility scores
- **📊 Skill Gap Identification**: Clearly lists matched and missing skills with intelligent synonym detection (e.g., "React.js" vs "ReactJS")
- **📚 Personalized Upskilling Plan**: Generates tailored learning roadmaps with course recommendations, practice tasks, and timelines
- **✉️ Smart Cover Letter Generator**: One-click generation of professional, tailored cover letters based on JD and candidate experience
- **💡 Technical Interview Questions**: AI-generated interview questions specific to the job role with difficulty levels and categories

### User Experience
- **🎨 Enterprise UI**: Professional, Wipro-inspired design with multiple themes (Enterprise Blue, Modern Dark, Clean Minimal)
- **📱 Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **📄 File Upload Support**: Accept PDF, DOCX, and TXT files for both resumes and job descriptions
- **🔄 Real-time Analysis**: Instant results with animated progress indicators

### AI & Intelligence
- **🤖 Local AI Model**: Runs entirely offline using `all-MiniLM-L6-v2` - no API keys required
- **🧠 Semantic Understanding**: Goes beyond keyword matching to understand context and synonyms
- **🎓 Intelligent Skill Extraction**: Recognizes 30+ common technical and soft skills

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Python 3.13, Flask |
| **AI/ML** | Sentence Transformers, Scikit-learn |
| **Document Processing** | pypdf, python-docx |
| **Frontend** | HTML5, CSS3, Vanilla JavaScript |
| **Styling** | CSS Variables, Flexbox, Grid |
| **Icons** | Font Awesome 6.0 |

---

## 📦 Installation & Setup

### Prerequisites
- Python 3.8 or higher
- pip (Python package manager)

### Quick Start

1. **Clone the Repository**
   ```bash
   git clone https://github.com/vik20000in/JOBFIT-AI.git
   cd JOBFIT-AI
   ```

2. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```
   
   *Note: First run will download the AI model (~80MB) - this happens once.*

3. **Run the Application**
   ```bash
   python app.py
   ```

4. **Access the App**
   Open your browser and navigate to: `http://127.0.0.1:5000`

---

## 🎯 Usage Guide

### Basic Workflow

1. **Input Job Description**
   - Paste text directly, or
   - Upload a PDF/DOCX file

2. **Input Resume/CV**
   - Paste text directly, or
   - Upload a PDF/DOCX file

3. **Analyze**
   - Click "Analyze Match"
   - View your compatibility score (0-100%)

4. **Review Results**
   - ✅ **Matched Skills**: Skills you already have
   - ⚠️ **Missing Skills**: Areas for improvement
   - 📚 **Upskilling Plan**: Recommended courses and timelines
   - ✉️ **Cover Letter**: Click "Show Smart Cover Letter" for a tailored letter
   - 💡 **Interview Prep**: Click "Show Potential Technical Interview Questions" for role-specific questions

### Pro Tips
- Use specific job descriptions for better accuracy
- Include all relevant skills in your resume
- The AI understands synonyms (e.g., "JavaScript" = "JS")
- Cover letters automatically extract your name from the resume

---

## 📁 Project Structure

```
jobfit-ai/
├── app.py                      # Flask application entry point
├── requirements.txt            # Python dependencies
├── README.md                   # This file
├── .gitignore                 # Git ignore rules
├── utils/
│   ├── analyzer.py            # Core AI matching logic
│   ├── file_parser.py         # PDF/DOCX text extraction
│   ├── generator.py           # Cover letter generation
│   └── interview_generator.py # Interview question generation
├── templates/
│   └── index.html             # Main HTML template
└── static/
    ├── style.css              # Application styling
    └── script.js              # Frontend logic & API calls
```

---

## 🚀 Roadmap & Future Enhancements

### Phase 1: Enhanced Analysis 🔍
- [ ] **Resume Section Parser**: Automatically extract work experience, education, certifications, and projects
- [ ] **ATS Score**: Calculate Applicant Tracking System compatibility score
- [ ] **Keyword Density Analysis**: Optimize resume for ATS systems
- [ ] **Industry-Specific Skills**: Expand skill database for healthcare, finance, marketing, etc.

### Phase 2: Advanced AI Features 🤖
- [ ] **Multi-language Support**: Analyze resumes in Spanish, French, German, etc.
- [ ] **Sentiment Analysis**: Assess tone and professionalism of resume content
- [ ] **Resume Formatting Tips**: AI-powered suggestions for layout and structure
- [ ] **Job Description Analyzer**: Identify red flags, company culture signals, and compensation insights

### Phase 3: Career Intelligence 📊
- [ ] **Job Market Insights**: Real-time salary ranges and demand trends (via APIs like Glassdoor/LinkedIn)
- [ ] **Skill Trend Forecasting**: Predict which skills will be in-demand next year
- [ ] **Company Research**: Automatic company profile with news, reviews, and culture info
- [ ] **Competitive Analysis**: Compare your profile against market benchmarks

### Phase 4: Collaboration & Tracking 💾
- [ ] **User Accounts**: Save analyses, track progress over time
- [ ] **Resume Version Control**: Track changes and improvements across iterations
- [ ] **Application Tracker**: Manage job applications in one dashboard
- [ ] **Goal Setting**: Set skill targets and track learning progress

### Phase 5: Interview Mastery 🎤
- [ ] **Mock Interviews**: AI-driven voice/video interview practice with real-time feedback
- [ ] **Answer Quality Scorer**: Rate your responses to interview questions
- [ ] **STAR Method Guide**: Behavioral question coaching
- [ ] **Body Language Analysis**: (if using video) Posture, eye contact, gestures

### Phase 6: Networking & Outreach 🌐
- [ ] **LinkedIn Message Generator**: Personalized connection requests and recruiter outreach
- [ ] **Email Templates**: Follow-up emails, thank-you notes, salary negotiation scripts
- [ ] **Referral Request Helper**: Draft messages for requesting employee referrals

### Phase 7: Accessibility & Integrations 🔌
- [ ] **Chrome Extension**: Analyze LinkedIn job postings directly
- [ ] **Mobile App**: iOS/Android for on-the-go analysis
- [ ] **API Access**: Allow third-party integrations
- [ ] **Slack/Discord Bot**: Team collaboration features

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙏 Acknowledgments

- **Sentence Transformers** by UKPLab for the lightweight semantic model
- **Font Awesome** for the icon library
- **Flask** framework for rapid web development
- **Wipro** for design inspiration

---

## 📧 Contact & Support

- **Repository**: [github.com/vik20000in/JOBFIT-AI](https://github.com/vik20000in/JOBFIT-AI)
- **Issues**: Report bugs or request features via [GitHub Issues](https://github.com/vik20000in/JOBFIT-AI/issues)

---

**Made with ❤️ to help job seekers land their dream roles**
