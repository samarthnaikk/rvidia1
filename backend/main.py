
# === Imports ===
import os
import sqlite3
import datetime
from flask import Flask, request, jsonify, send_file, after_this_request
from admin import generatedocker

# === App and DB Setup ===
app = Flask(__name__)

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

# === Admin Endpoint ===
@app.route('/admin/send', methods=['POST'])
def admin_send():
	"""
	Admin sends Dockerfile to all allowed users. Stores in DB with adminid and keep flag.
	"""
	data = request.json or {}
	adminid = data.get('adminid', 'admin')
	keep = data.get('keep', True)
	if not os.path.exists(DOCKERFILE_PATH):
		return jsonify({'error': 'Dockerfile not found'}), 404
	with open(DOCKERFILE_PATH, 'rb') as f:
		dockerfile_content = f.read()
	conn = sqlite3.connect(DB_PATH)
	c = conn.cursor()
	for user_id in ALLOWED_USER_IDS:
		# Check for duplicate (all columns except sent_at)
		c.execute('''SELECT 1 FROM dockerfiles WHERE userid=? AND adminid=? AND keep=? AND dockerfile=?''',
				  (user_id, adminid, int(keep), dockerfile_content))
		if not c.fetchone():
			c.execute('INSERT INTO dockerfiles (userid, adminid, keep, dockerfile, sent_at) VALUES (?, ?, ?, ?, ?)',
					  (user_id, adminid, int(keep), dockerfile_content, datetime.datetime.now()))
	conn.commit()
	conn.close()
	return jsonify({'message': f'Dockerfile stored in DB for users: {ALLOWED_USER_IDS}'}), 200

# === User Endpoint ===
@app.route('/user/recieve', methods=['GET'])
def user_receive():
	"""
	User can receive all their Dockerfiles with keep=true (no verification, just needs user_id param).
	Returns a list of dockerfiles and their sources as JSON.
	"""
	user_id = request.args.get('user_id')
	if not user_id:
		return jsonify({'error': 'user_id required as query param'}), 400
	conn = sqlite3.connect(DB_PATH)
	c = conn.cursor()
	c.execute('SELECT dockerfile, adminid FROM dockerfiles WHERE userid = ? AND keep = 1 ORDER BY sent_at DESC', (user_id,))
	rows = c.fetchall()
	conn.close()
	if not rows:
		return jsonify({'error': 'No Dockerfile available for this user'}), 404
	dockerfiles = []
	for row in rows:
		dockerfile_content = row[0].decode('utf-8') if isinstance(row[0], bytes) else str(row[0])
		adminid = row[1]
		dockerfiles.append({
			'dockerfile': dockerfile_content,
			'source': adminid
		})
	return jsonify({'dockerfiles': dockerfiles})

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
		# Call the generatedocker function from admin.py
		generatedocker(root_folder, n, batch_number)
		return jsonify({
			'success': True,
			'message': f'Dockerfile generated for admin {adminid}, batch {batch_number}/{n}',
			'adminid': adminid,
			'batch': batch_number,
			'total_batches': n
		}), 200
	except Exception as e:
		return jsonify({'error': f'Failed to generate Dockerfile: {str(e)}'}), 500

# === Main Entrypoint ===
if __name__ == '__main__':
	app.run(host='0.0.0.0', port=5001)
