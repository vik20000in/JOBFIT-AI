from flask import Flask, render_template, request, jsonify
from utils.analyzer import analyze_job_match

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
    """
    try:
        data = request.get_json()
        
        jd_text = data.get('jd_text', '')
        resume_text = data.get('resume_text', '')
        
        if not jd_text or not resume_text:
            return jsonify({"error": "Both Job Description and Resume are required."}), 400
            
        result = analyze_job_match(jd_text, resume_text)
        
        return jsonify({
            "success": True,
            "data": result
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
