# Stage 1: Build dependencies
FROM python:3.11-slim AS build

# Prevent Python from writing .pyc files & ensure output is unbuffered
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# Install system dependencies
RUN apt-get update \
 && apt-get install -y --no-install-recommends \
        build-essential \
        cmake \
        git \
        ca-certificates \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python dependencies in a virtual environment for smaller final image
COPY requirements.txt .
RUN pip install --no-cache-dir --prefix=/install -r requirements.txt

# Stage 2: Runtime image (lighter, without dev tools)
FROM python:3.11-slim AS runtime

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# Copy installed dependencies from build stage
COPY --from=build /install /usr/local

# Copy application files
COPY . .

EXPOSE 5000
ENV FLASK_APP=app.py \
    FLASK_RUN_HOST=0.0.0.0

CMD ["flask", "run"]