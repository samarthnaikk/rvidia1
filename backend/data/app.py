def readfile(filename):
    with open(filename, 'r') as file:
        data = file.read()
    return data

for i in range(1,5):
    print(f"Reading file iteration {i+1}")
    content = readfile(f'files/file{i}.txt')
    print(content)
    