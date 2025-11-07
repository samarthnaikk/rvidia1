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

print(getfilelist(['files/file0.txt', 'files/file2.txt', 'files/file3.txt'], 'data'))
