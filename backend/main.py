from flask import Flask, request, send_file, jsonify
import os

app = Flask(__name__)


# In-memory mapping of user_id to Dockerfile content (simulate per-user delivery)
user_dockerfiles = {}
DOCKERFILE_PATH = os.path.join(os.path.dirname(__file__), 'data', 'Dockerfile')



@app.route('/admin/send', methods=['POST'])
def admin_send():
	data = request.json
	user_ids = data.get('user_ids')
	if not user_ids or not isinstance(user_ids, list):
		return jsonify({'error': 'user_ids (list) required'}), 400
	if not os.path.exists(DOCKERFILE_PATH):
		return jsonify({'error': 'Dockerfile not found'}), 404
	with open(DOCKERFILE_PATH, 'rb') as f:
		dockerfile_content = f.read()
	for user_id in user_ids:
		user_dockerfiles[user_id] = dockerfile_content
	return jsonify({'message': f'Dockerfile sent to users: {user_ids}'}), 200



@app.route('/user/recieve', methods=['GET'])
def user_receive():
	user_id = request.args.get('user_id')
	if not user_id:
		return jsonify({'error': 'user_id required as query param'}), 400
	if user_id not in user_dockerfiles:
		return jsonify({'error': 'No Dockerfile available for this user'}), 404

	save_path = os.path.join(os.path.dirname(__file__), 'data', 'Dockerfile')
	with open(save_path, 'wb') as f:
		f.write(user_dockerfiles[user_id])

	del user_dockerfiles[user_id]
	return jsonify({'message': 'Dockerfile received and saved.'}), 200

if __name__ == '__main__':
	app.run(host='0.0.0.0', port=5001)
