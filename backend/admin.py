import os

def getfilelist(required_files, folder_path):
	file_names = []
	for root, dirs, files in os.walk(folder_path):
		for file in files:
			rel_dir = os.path.relpath(root, folder_path)
			if rel_dir == ".":
				file_names.append(file)
			else:
				file_names.append(os.path.join(rel_dir, file))

	missing_files = [f for f in required_files if f not in file_names]
	if missing_files:
		print("Missing files:", missing_files)
		return False, missing_files
	else:
		print("All files found!")
		return True, []


def generatedocker(root_folder, n, batch_number):
	files_folder = os.path.join(root_folder, 'files')
	all_files = sorted([f for f in os.listdir(files_folder) if os.path.isfile(os.path.join(files_folder, f))])
	total_files = len(all_files)
	if n <= 0 or batch_number < 1 or batch_number > n:
		print("Invalid n or batch_number")
		return
	batch_size = total_files // n
	remainder = total_files % n
	start_idx = (batch_number - 1) * batch_size + min(batch_number - 1, remainder)
	end_idx = start_idx + batch_size
	if batch_number <= remainder:
		end_idx += 1
	batch_files = all_files[start_idx:end_idx]

	dockerfile_content = [
		'FROM python:3.9-slim',
		'WORKDIR /app',
		'COPY app.py /app/',
		'# Batch files:',
		f'# {batch_files}',
	]
	for file in batch_files:
		dockerfile_content.append(f'COPY files/{file} /app/files/{file}')
	dockerfile_content.append('CMD ["python", "app.py"]')
	dockerfile_path = os.path.join(root_folder, 'Dockerfile')
	with open(dockerfile_path, 'w') as f:
		f.write('\n'.join(dockerfile_content))
	print(f"Dockerfile written for batch {batch_number} with files: {batch_files}")