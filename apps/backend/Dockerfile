# syntax=docker/dockerfile:1
FROM python:3.12
# Set the working directory in the container
WORKDIR /app/backend

# Copy the application code
COPY . .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt