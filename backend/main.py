
# === Imports ===
import os
import sqlite3
import datetime
from flask import Flask, request, jsonify, send_file, after_this_request

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
		c.execute('INSERT INTO dockerfiles (userid, adminid, keep, dockerfile, sent_at) VALUES (?, ?, ?, ?, ?)',
				  (user_id, adminid, int(keep), dockerfile_content, datetime.datetime.now()))
	conn.commit()
	conn.close()
	return jsonify({'message': f'Dockerfile stored in DB for users: {ALLOWED_USER_IDS}'}), 200

# === User Endpoint ===
@app.route('/user/recieve', methods=['GET'])
def user_receive():
	"""
	User can receive their latest Dockerfile (no verification, just needs user_id param).
	Returns the Dockerfile content and admin id as JSON.
	"""
	user_id = request.args.get('user_id')
	if not user_id:
		return jsonify({'error': 'user_id required as query param'}), 400
	conn = sqlite3.connect(DB_PATH)
	c = conn.cursor()
	c.execute('SELECT dockerfile, adminid FROM dockerfiles WHERE userid = ? ORDER BY sent_at DESC LIMIT 1', (user_id,))
	row = c.fetchone()
	conn.close()
	if not row:
		return jsonify({'error': 'No Dockerfile available for this user'}), 404
	dockerfile_content = row[0].decode('utf-8') if isinstance(row[0], bytes) else str(row[0])
	adminid = row[1]
	return jsonify({
		'dockerfile': dockerfile_content,
		'source': adminid
	})

# === Main Entrypoint ===
if __name__ == '__main__':
	app.run(host='0.0.0.0', port=5001)
