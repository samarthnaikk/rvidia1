from flask import Flask, request, send_file, jsonify
import os
import sqlite3

app = Flask(__name__)


ALLOWED_USER_IDS = ['user1', 'user2', 'user3']  # Define allowed users here

# SQLite setup
import datetime
DB_PATH = os.path.join(os.path.dirname(__file__), 'dockerfiles.db')
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
DOCKERFILE_PATH = os.path.join(os.path.dirname(__file__), 'data', 'Dockerfile')



@app.route('/admin/send', methods=['POST'])
def admin_send():
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



# Optionally, you can implement a user receive endpoint to fetch from DB if needed

if __name__ == '__main__':
	app.run(host='0.0.0.0', port=5001)
