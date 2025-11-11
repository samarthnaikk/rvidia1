
# === Imports ===
import os
import sqlite3
import datetime
from flask import Flask, request, jsonify, send_file, after_this_request
from flask_cors import CORS
from admin import generatedocker

# === App and DB Setup ===
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Allowed users (for admin send)
ALLOWED_USER_IDS = ['user1', 'user2', 'user3']

# Paths
BASE_DIR = os.path.dirname(__file__)
DB_PATH = os.path.join(BASE_DIR, 'dockerfiles.db')
DOCKERFILE_PATH = os.path.join(BASE_DIR, 'data', 'Dockerfile')

# Initialize SQLite DB
def init_db():
	conn = sqlite3.connect(DB_PATH)
	c = conn.cursor()
	c.execute('''CREATE TABLE IF NOT EXISTS dockerfiles (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		userid TEXT NOT NULL,
		adminid TEXT NOT NULL,
		keep INTEGER NOT NULL,
		dockerfile BLOB NOT NULL,
		sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	)''')
	c.execute('CREATE INDEX IF NOT EXISTS idx_userid ON dockerfiles(userid)')
	c.execute('CREATE INDEX IF NOT EXISTS idx_adminid ON dockerfiles(adminid)')
	conn.commit()
	conn.close()

init_db()

# === Docker Generation Endpoint ===
@app.route('/admin/generate-docker', methods=['POST'])
def admin_gendock():
	"""
	Admin endpoint to generate Dockerfile using generatedocker function.
	Expects: adminid, n, batch_number in JSON body.
	"""
	data = request.json or {}
	adminid = data.get('adminid')
	n = data.get('n')
	batch_number = data.get('batch_number')
	root_folder = data.get('root_folder', 'data')  # default to 'data' folder
	
	if not adminid or not n or not batch_number:
		return jsonify({'error': 'adminid, n, and batch_number are required'}), 400
	
	try:
		# Call the generatedocker function from admin.py with adminid
		generatedocker(root_folder, n, batch_number, adminid)
		
		# Read the generated Dockerfile content
		dockerfile_path = os.path.join(BASE_DIR, root_folder, 'Dockerfile')
		dockerfile_content = ""
		
		print(f"BASE_DIR: {BASE_DIR}")
		print(f"Looking for Dockerfile at: {dockerfile_path}")
		print(f"File exists: {os.path.exists(dockerfile_path)}")
		
		if os.path.exists(dockerfile_path):
			with open(dockerfile_path, 'r') as f:
				dockerfile_content = f.read()
			print(f"Dockerfile content read: {len(dockerfile_content)} characters")
			print(f"First 100 chars: {dockerfile_content[:100]}")
		else:
			print("Dockerfile not found!")
			# Try alternative path
			alt_path = os.path.join(os.getcwd(), root_folder, 'Dockerfile')
			print(f"Trying alternative path: {alt_path}")
			if os.path.exists(alt_path):
				with open(alt_path, 'r') as f:
					dockerfile_content = f.read()
				print(f"Found at alternative path! Content length: {len(dockerfile_content)}")
			else:
				print("Alternative path also not found!")
		
		return jsonify({
			'success': True,
			'message': f'Dockerfile generated for admin {adminid}, batch {batch_number}/{n}',
			'adminid': adminid,
			'batch': batch_number,
			'total_batches': n,
			'dockerfile_content': dockerfile_content,
			'dockerfile_path': dockerfile_path  # For debugging
		}), 200
	except Exception as e:
		return jsonify({'error': f'Failed to generate Dockerfile: {str(e)}'}), 500

# === Main Entrypoint ===
if __name__ == '__main__':
	app.run(host='0.0.0.0', port=5001)
