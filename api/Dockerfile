FROM python:3.8

COPY requirements.txt ./
RUN pip install --no-cache -r requirements.txt

EXPOSE 5000
COPY . .

CMD ["flask", "run", "-h", "0.0.0.0", "-p", "5000"]
