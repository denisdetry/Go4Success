# syntax=docker/dockerfile:1
FROM python:3.12
# Set the working directory
WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY manage.py ./app

# Copy the application code
COPY . .