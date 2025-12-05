from flask import Flask, render_template, request, jsonify
from utils.analyzer import analyze_job_match
from utils.file_parser import extract_text_from_file

app = Flask(__name__)

@app.route('/')
def index():
    """
    Renders the main page.
    """
    return render_template('index.html')

@app.route('/api/analyze', methods=['POST'])
def analyze():
    """
    API Endpoint to analyze the match between JD and Resume.
    Supports both JSON (text) and Multipart Form Data (files).
    """
    try:
        jd_text = ""
        resume_text = ""

        # Handle JSON Request (Text only)
        if request.is_json:
            data = request.get_json()
            jd_text = data.get('jd_text', '')
            resume_text = data.get('resume_text', '')
        
        # Handle Multipart Form Data (Files + Text)
        else:
            # 1. Get JD (File or Text)
            if 'jd_file' in request.files and request.files['jd_file'].filename:
                jd_text = extract_text_from_file(request.files['jd_file'])
            else:
                jd_text = request.form.get('jd_text', '')

            # 2. Get Resume (File or Text)
            if 'resume_file' in request.files and request.files['resume_file'].filename:
                resume_text = extract_text_from_file(request.files['resume_file'])
            else:
                resume_text = request.form.get('resume_text', '')

        if not jd_text or not resume_text:
            return jsonify({"error": "Both Job Description and Resume are required."}), 400
            
        result = analyze_job_match(jd_text, resume_text)
        
        return jsonify({
            "success": True,
            "data": result
        })
        
    except ValueError as ve:
        return jsonify({"error": str(ve)}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
