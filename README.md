# Message Management System

This is a Node.js application for managing messages,
templates, and sprints. It provides APIs for creating,
fetching, updating, and deleting messages, templates,
and sprints. Additionally, it integrates with Discord 
for sending congratulatory messages and GIPHY for fetching random GIFs.
The bot have to receive a JSON payload to the POST /messages endpoint to send the message: example (
{
  "username": "johdoe",
  "sprintCode": "WD-1.1"
})

## Prerequisites

Before running the application, ensure you have the following installed:

- Node.js
- npm (Node Package Manager)
- SQLite

## Installation

1. Clone the repository:

2. Navigate to the project directory:

3. Install dependencies:

4. Set up environment variables:
Create a `.env` file in the root directory and add the variables given in `.env.example.

5. Run npm run migrate:latest
:This command will ensure that the database schema is up-to-date by running any pending migrations.

## Usage

1. Start the server:


2. The server will start listening on port 3000 by default.

3. You can now interact with the API using tools like Postman or curl.

## API Endpoints

- `GET /messages`: get a list of all congratulatory messages.
- `POST /messages`: send a congratulatory message to a user on Discord.
- `GET /messages?username=johdoe`: get a list of all congratulatory messages for a specific user.
- `GET /messages?sprint=WD-1.1`: get a list of all congratulatory messages for a specific sprint.
- `GET /messages?sprint=WD-1.1&username=johdoe`: get a list of congratulatory message for a specific sprint and user.
- `CRUD /templates - POST/GET/PATCH/DELETE`: endpoints for managing congratulatory message templates.
- `CRUD /sprints - POST/GET/PATCH/DELETE`: endpoints for managing sprints.


## Discord Integration

The application integrates with Discord to send congratulatory messages. Make sure to provide your Discord bot token and channel ID in the `.env` file.

## GIPHY Integration

The application fetches random GIFs from GIPHY to include in congratulatory messages. Make sure to provide your GIPHY API key in the `.env` file.

## Assumptions

- The database is SQLite and is configured using the `DATABASE_URL` environment variable.
- Discord bot token and channel ID are provided for sending congratulatory messages.
- GIPHY API key is provided for fetching random GIFs.
