# syntax=docker/dockerfile:1
FROM python:3.12
WORKDIR /app

COPY . /app
COPY requirements.txt /code/

RUN pip install -r requirements.txt