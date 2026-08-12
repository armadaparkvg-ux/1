FROM python:3.12-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY app ./app
COPY knowledge ./knowledge
COPY scripts ./scripts
COPY .env.example ./.env

ENV HOST=0.0.0.0 PORT=8080 DEBUG=false
EXPOSE 8080
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]
