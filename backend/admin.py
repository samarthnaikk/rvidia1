import os

def getfilelist(folder_path):
	file_names = []
	for root, dirs, files in os.walk(folder_path):
		for file in files:
			rel_dir = os.path.relpath(root, folder_path)
			if rel_dir == ".":
				file_names.append(file)
			else:
				file_names.append(os.path.join(rel_dir, file))
	return file_names
