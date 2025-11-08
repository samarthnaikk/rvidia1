from flask import Flask, request, send_file, jsonify
import os

app = Flask(__name__)

DOCKERFILE_PATH = os.path.join(os.path.dirname(__file__), 'data', 'Dockerfile')

@app.route('/admin/send', methods=['GET'])
def admin_send():
	if os.path.exists(DOCKERFILE_PATH):
		return send_file(DOCKERFILE_PATH, as_attachment=True)
	else:
		return jsonify({'error': 'Dockerfile not found'}), 404

@app.route('/user/recieve', methods=['POST'])
def user_receive():
	if 'file' not in request.files:
		return jsonify({'error': 'No file part in request'}), 400
	file = request.files['file']
	if file.filename == '':
		return jsonify({'error': 'No selected file'}), 400
	save_path = os.path.join(os.path.dirname(__file__), 'data', 'Dockerfile')
	file.save(save_path)
	return jsonify({'message': 'Dockerfile received and saved.'}), 200

if __name__ == '__main__':
	app.run(host='0.0.0.0', port=5001)
