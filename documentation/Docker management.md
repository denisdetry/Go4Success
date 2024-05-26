# Run the application with docker

## Development

For easier development setup, the main docker-compose located at the root of the project has been divided into 2
separate docker-compose, each for a different part of the application, each is located in the directory it is
responsible for. The main docker-compose is still available and can be used to run the entire application.

### Backend

No docker compose there, since it can be run by using the python command to run Django : `python manage.py runserver`
Make sure to have installed the requirements by running `pip install -r requirements.txt` and to have the database
running.

### Frontend

The docker-compose is located in the `frontend` directory. It only runs the web server and won't be useful for
development. To run the frontend in development mode, you can use the expo command to run the web
server : `npx expo start --web` within the `go4success` directory.

Make sure to have installed the requirements by running `npm install` (Both at the root of the project and in
the `go4success` directory).

### Database

To run the database, you can use the main docker-compose located at the root of the project. It will run the database
and the backend server.

Or you can run the database by using the docker-compose located in the `database` directory. (cd into it and execute the
usual docker compose up command) It will only run the database and you'll have to run the backend server separately.

## Production

To run the application in production, you can use the main docker-compose located at the root of the project. It will
run the database, the backend server and the frontend web server.

You will have to set the different environment variables:

- SECRET_KEY &rarr; *Django secret key*
- POSTGRES_DB &rarr; *Name of the database*
- POSTGRES_USER &rarr; *Username of the database*
- POSTGRES_PASSWORD &rarr; *Password of the database*
- BACKEND_PORT &rarr; *Port on which the backend server will run*
- FRONTEND_PORT &rarr; *Port on which the frontend server will run*
- FRONT_PATH &rarr; *Path to the frontend directory, it will be used to serve the static files (only for the web app)*
- BACK_PATH &rarr; *Path to the backend directory*
- ALLOWED_HOSTS &rarr; *List of allowed hosts for the backend server*
- BACKEND_API_URL &rarr; *URL of the backend server*
- CORS_ALLOWED_ORIGINS &rarr; *List of allowed origins for the backend server*
- CSRF_TRUSTED_ORIGINS &rarr; *List of trusted origins for the backend server (Used only to access Django admin)*

You will have to download the entire project, since the root docker compose builds the images from the project. You
could also use a pull from the GitHub repository using, for example, Portainer.