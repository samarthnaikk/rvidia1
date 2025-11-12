import gdown

def getfolderGDrive(url,output="./grive_data"):
    gdown.download_folder(url=url, output=output, quiet=False, use_cookies=False)
    print(f"Download complete! Folder saved to: {output}")
