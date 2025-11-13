# === Imports ===
import os
import datetime
from flask import Flask, request, jsonify, send_file, after_this_request
from flask_cors import CORS
from supabase import create_client, Client
from dotenv import load_dotenv
from admin import generatedocker

# Load environment variables from .env file
load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))

# === App and DB Setup ===
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Allowed users (for admin send)
ALLOWED_USER_IDS = ['user1', 'user2', 'user3']

# Paths
BASE_DIR = os.path.dirname(__file__)
DOCKERFILE_PATH = os.path.join(BASE_DIR, 'data', 'Dockerfile')


# Supabase configuration
SUPABASE_URL = os.getenv('PROJECT_URL')
SUPABASE_KEY = os.getenv('API_KEY')

# Route password
ROUTE_PASSWORD = os.getenv('ROUTE_PASSWORD')

# Initialize Supabase client
if SUPABASE_URL and SUPABASE_KEY:
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    print("Supabase client initialized successfully")
else:
    print(f"Missing Supabase credentials: URL={bool(SUPABASE_URL)}, KEY={bool(SUPABASE_KEY)}")
    supabase = None

# Test Supabase connection
def test_supabase_connection():
    if not supabase:
        print("Supabase client not initialized")
        return False
    try:
        # Simple query to test connection
        result = supabase.table('dockerfiles').select('id').limit(1).execute()
        print("Supabase connection successful")
        return True
    except Exception as e:
        print(f"Supabase connection failed: {e}")
        return False

test_supabase_connection()

@app.route('/', methods=['GET'])
def home():
	"""
	Simple health check endpoint to verify the API is running.
	"""
	return jsonify({
		'status': 'success',
		'message': 'Flask API is running on Vercel!',
		'timestamp': datetime.datetime.utcnow().isoformat() + 'Z'
	}), 200

# === Users Table Endpoints ===
@app.route('/getusers', methods=['GET'])
def get_users():
	"""
	Get all users from Supabase users table. Protected by route_pwd.
	"""
	route_pwd = request.args.get('route_pwd')
	if route_pwd != ROUTE_PASSWORD:
		return jsonify({'error': 'Unauthorized'}), 401
	if not supabase:
		return jsonify({'error': 'Supabase not configured'}), 500
	try:
		result = supabase.table('users').select('*').execute()
		return jsonify({'users': result.data}), 200
	except Exception as e:
		return jsonify({'error': f'Supabase error: {str(e)}'}), 500

@app.route('/addusers', methods=['POST'])
def add_user():
	"""
	Add a new user to Supabase users table. Protected by route_pwd.
	"""
	data = request.json or {}
	route_pwd = data.get('route_pwd')
	if route_pwd != ROUTE_PASSWORD:
		return jsonify({'error': 'Unauthorized'}), 401
	username = data.get('username')
	email = data.get('email')
	password_hash = data.get('password_hash')
	refresh_token = data.get('refresh_token')
	if not username or not password_hash:
		return jsonify({'error': 'username and password_hash are required'}), 400
	if not supabase:
		return jsonify({'error': 'Supabase not configured'}), 500
	try:
		user_data = {
			'username': username,
			'email': email,
			'password_hash': password_hash,
			'refresh_token': refresh_token
		}
		result = supabase.table('users').insert(user_data).execute()
		return jsonify({'status': "Successfully Created User"}), 201
	except Exception as e:
		return jsonify({'error': f'Supabase error: {str(e)}'}), 500

# === Docker Generation Endpoint ===
@app.route('/admin/generate-docker', methods=['POST'])
def admin_gendock():
	"""
	Admin endpoint to generate Dockerfile using generatedocker function.
	Expects: adminid, n, batch_number in JSON body.
	Requires 'route_pwd' in JSON body.
	"""
	data = request.json or {}
	route_pwd = data.get('route_pwd')
	if route_pwd != ROUTE_PASSWORD:
		return jsonify({'error': 'Unauthorized'}), 401
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

# === Admin Send Endpoint ===
@app.route('/admin/send', methods=['POST'])
def admin_send():
	"""
	Admin sends Dockerfile to all allowed users. Stores in Supabase.
	Requires 'route_pwd' in JSON body.
	"""
	data = request.json or {}
	route_pwd = data.get('route_pwd')
	if route_pwd != ROUTE_PASSWORD:
		return jsonify({'error': 'Unauthorized'}), 401
	adminid = data.get('adminid', 'admin')
	keep = data.get('keep', True)
	if not os.path.exists(DOCKERFILE_PATH):
		return jsonify({'error': 'Dockerfile not found'}), 404
	if not supabase:
		return jsonify({'error': 'Supabase not configured'}), 500
	try:
		with open(DOCKERFILE_PATH, 'r') as f:
			dockerfile_content = f.read()
		for user_id in ALLOWED_USER_IDS:
			# Check for duplicate
			existing = supabase.table('dockerfiles').select('id').eq('userid', user_id).eq('adminid', adminid).eq('keep', int(keep)).eq('dockerfile', dockerfile_content).execute()
			if not existing.data:
				# Insert new record
				data_to_insert = {
					'userid': user_id,
					'adminid': adminid,
					'keep': int(keep),
					'dockerfile': dockerfile_content
				}
				supabase.table('dockerfiles').insert(data_to_insert).execute()
		return jsonify({'message': f'Dockerfile stored in Supabase for users: {ALLOWED_USER_IDS}'}), 200
	except Exception as e:
		return jsonify({'error': f'Supabase error: {str(e)}'}), 500

# === User Receive Endpoint ===
@app.route('/user/recieve', methods=['GET'])
def user_receive():
	"""
	User can receive all their Dockerfiles with keep=true.
	Requires 'route_pwd' as a query parameter.
	"""
	route_pwd = request.args.get('route_pwd')
	if route_pwd != ROUTE_PASSWORD:
		return jsonify({'error': 'Unauthorized'}), 401
	user_id = request.args.get('user_id')
	if not user_id:
		return jsonify({'error': 'user_id required as query param'}), 400
	if not supabase:
		return jsonify({'error': 'Supabase not configured'}), 500
	try:
		result = supabase.table('dockerfiles').select('dockerfile', 'adminid').eq('userid', user_id).eq('keep', 1).order('sent_at', desc=True).execute()
		if not result.data:
			return jsonify({'error': 'No Dockerfile available for this user'}), 404
		dockerfiles = []
		for row in result.data:
			dockerfiles.append({
				'dockerfile': row['dockerfile'],
				'source': row['adminid']
			})
		return jsonify({'dockerfiles': dockerfiles})
	except Exception as e:
		return jsonify({'error': f'Supabase error: {str(e)}'}), 500

# === Main Entrypoint ===
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)

# Vercel requires this export
application = app

