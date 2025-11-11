FROM python:3.9-slim
WORKDIR /app
COPY app.py /app/
# Batch files:
# ['file4.txt', 'file5.txt', 'file6.txt']
COPY files/file4.txt /app/files/file4.txt
COPY files/file5.txt /app/files/file5.txt
COPY files/file6.txt /app/files/file6.txt
CMD ["python", "app.py"]