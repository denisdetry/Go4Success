# Run the application with docker

## Development

For easier development setup, the main docker-compose located at the root of the project has been divided into 2 separate docker-compose, each for a different part of the application, each is located in the directory it is responsible for. The main docker-compose is still available and can be used to run the entire application.

### Backend

No docker compose there, since it can be run by using the python command to run Django : `python manage.py runserver`
Make sure to have installed the requirements by running `pip install -r requirements.txt` and to have the database running.

### Frontend

The docker-compose is located in the `frontend` directory. It only runs the web server and won't be useful for development. To run the frontend in development mode, you can use the expo command to run the web server : `npx expo start --web` within the `go4success` directory.

Make sure to have installed the requirements by running `npm install` (Both at the root of the project and in the `go4success` directory).

### Database

To run the database, you can use the main docker-compose located at the root of the project. It will run the database and the backend server.

Or you can run the database by using the docker-compose located in the `database` directory. (cd into it and execute the usual docker compose up command) It will only run the database and you'll have to run the backend server separately.
