from flask import Flask, request, send_file, jsonify
from flask_cors import CORS, cross_origin
from werkzeug.utils import secure_filename
import pandas as pd
import logging
import os

UPLOAD_FOLDER = './upload'
PROCESSED_FOLDER = './processed'
STATIC_FOLDER = './static'
FILE_NAME = 'file.xlsx'

app = Flask(__name__)
CORS(app)
app.secret_key = 'W\xa8}\x98_\xb9\xa7\x88.\x93\x08x9\xde\xa59\xa3\x02\xf1\xb3h\xd5\x17\x81'

def allowed_file(filename):
    return filename.lower().endswith('.xlsx')

@app.route('/upload', methods=['POST'])
@cross_origin(origins=["http://localhost:3000"])
def upload_file():
    if request.method == 'POST':
        files = request.files.getlist('file')
        for f in files:
            filename = secure_filename(f.filename)
            if allowed_file(filename):
                file_path = os.path.join(STATIC_FOLDER, FILE_NAME)
                f.save(file_path)
            else:
                return jsonify({'message': 'File type not allowed'}), 400
        return jsonify({"name": FILE_NAME, "status": "success"})
    return jsonify({"status": "failed"})

@app.route('/download_excel/<file_name>', methods=['GET'])
def download_excel(file_name):
    if file_name == FILE_NAME:
        file_path = os.path.join(STATIC_FOLDER, file_name)
        if os.path.exists(file_path):
            return send_file(file_path, as_attachment=True)
        return jsonify({"message": "File not found"}), 404
    return jsonify({"message": "File not allowed"}), 400

@app.route('/update_file', methods=['POST'])
@cross_origin(origins=["http://localhost:3000"])
def update_file():
    if request.method == 'POST':
        file = request.files['file']
        if allowed_file(file.filename):
            try:
                logging.info("Start updating file")
                # Save the uploaded file directly
                file_path = os.path.join(STATIC_FOLDER, FILE_NAME)
                file.save(file_path)
                logging.info("File saved successfully")

                return jsonify({"status": "success"})
            except Exception as e:
                logging.error(f"Error updating file: {str(e)}")
                return jsonify({"status": "failed", "message": "Error updating file"}), 500
        return jsonify({'message': 'File type not allowed'}), 400
    return jsonify({"status": "failed"})

if __name__ == '__main__':
    logging.basicConfig(level=logging.INFO)  # Configure logging
    if not os.path.exists(UPLOAD_FOLDER):
        os.mkdir(UPLOAD_FOLDER)
    if not os.path.exists(PROCESSED_FOLDER):
        os.mkdir(PROCESSED_FOLDER)
    if not os.path.exists(STATIC_FOLDER):
        os.mkdir(STATIC_FOLDER)
    app.run(debug=True)
