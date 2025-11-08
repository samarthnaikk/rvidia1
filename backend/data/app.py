import os

def readfile(filename):
    with open(filename, 'r') as file:
        data = file.read()
    return data

folder = 'files'

for i, filename in enumerate(sorted(os.listdir(folder)), start=1):
    filepath = os.path.join(folder, filename)
    if os.path.isfile(filepath):
        print(f"\nReading file {i}: {filename}")
        content = readfile(filepath)
        print(content)
