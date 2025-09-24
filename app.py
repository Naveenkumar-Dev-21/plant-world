#!/usr/bin/env python3
from flask import Flask, render_template, send_from_directory, jsonify
import os
import json

app = Flask(__name__)

# Serve static files (CSS, JS, JSON)
@app.route('/<path:filename>')
def serve_static(filename):
    return send_from_directory('.', filename)

# Main route
@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

# API route for plant data
@app.route('/api/plants')
def get_plant_data():
    try:
        with open('plant_data.json', 'r', encoding='utf-8') as f:
            data = json.load(f)
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Get port from environment variable (for hosting) or default to 8080
    port = int(os.environ.get('PORT', 8080))
    # Set host to 0.0.0.0 for external access (required for hosting)
    app.run(host='0.0.0.0', port=port, debug=False)