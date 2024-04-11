# syntax=docker/dockerfile:1
FROM python:3.12
# Set the working directory in the container
WORKDIR /app/backend

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the application code
COPY manage.py .
COPY . .