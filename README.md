# Real-time Quiz Application Backend

This is the backend for a real-time quiz application built with NestJS.

## Getting Started

To get started with the project, follow these steps:

### 1. Create `.env` File

Create a `.env` file in the root directory of the project according to the `.env.example` file. Fill in the environment variables:

```dotenv
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=root
DB_PASSWORD=root
DB_DATABASE=test

JWT_SECRET=your_jwt_secret_here
```

### 2. Configure Environment Variables
Ensure that all environment variables in the `.env` file are correctly configured for your development environment. Adjust the values as needed.

### 3. Create Database (Optional)
If you haven't already created the database, you can create it manually or use Docker to run a PostgreSQL database. Update the `.env` file with the appropriate database connection details.

```bash
docker run --name postgresql-container -p 5432:5432 -e POSTGRES_PASSWORD=root -e POSTGRES_USER=root -e POSTGRES_DB=test -d postgres
```

### 4. Start the Server
You can start the server using one of the following commands:

```bash
npm run start         # Start the server in production mode
npm run start:dev     # Start the server in development mode
npm run start:debug   # Start the server in debug mode
```

### 5. Access Swagger API Documentation
If the `NODE_ENV` is set to `dev`, Swagger documentation will be automatically generated. You can access it by navigating to: `http://localhost:3000/api`.


### Additional Information
- Make sure to install the dependencies by running `npm install --legacy-peer-deps` before starting the server.
- Ensure that PostgreSQL is running and accessible before starting the server if you're not using Docker.


## Tests

### Unit Tests

To run unit tests, execute the following command:

```bash
npm run test
```

### End-to-End (e2e) Tests
To run end-to-end tests, execute the following command:
```bash
npm run test:e2e
```