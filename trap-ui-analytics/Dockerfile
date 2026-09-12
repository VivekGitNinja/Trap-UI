FROM python:3.11-slim-bookworm

# Install system dependencies for Chromium and OpenCV
RUN apt-get update && apt-get install -y \
    --no-install-recommends \
    chromium \
    chromium-driver \
    libgl1 \
    libglib2.0-0 \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Set environment variable for Pyppeteer to use installed Chromium
ENV PYPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
ENV PYTHONPATH=/app

COPY app ./app
COPY tests ./tests

EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
