# Project Flora

Project Flora is a chat app with a unique way to make friends: you send a letter, which is delivered anonymously to another user at random. Neither sender nor receiver knows each other's identity until the receiver accepts the letter. The app features real-time chat, user authentication, and integration with Firebase, MongoDB, and Redis.

[![Project Flora Logo](https://i.ibb.co/wZC9zw3B/Screenshot-2025-07-12-155749.png)](https://i.ibb.co/wZC9zw3B/Screenshot-2025-07-12-155749.png)

## Project Structure

-   `backend/` — Node.js/Express server, API, database, and socket handling
-   `frontend/` — Angular application (UI)

---

## Backend

**Location:** `backend/`

### Features

-   RESTful API for chat, letters, login, profile
-   Real-time communication via WebSockets
-   Authentication middleware
-   MongoDB, Redis, and Firebase integration

### Setup

1. Install dependencies:
    ```sh
    cd backend
    npm install
    ```
2. Configure environment variables in `.env`.
3. Start the server:
    ```sh
    npm run start
    ```

---

## Frontend

**Location:** `frontend/`

### Features

-   Angular v20 SPA
-   User authentication and profile
-   Real-time chat UI
-   Responsive design

### Setup

1. Install dependencies:
    ```sh
    cd frontend
    npm install
    ```
2. Start the development server:
    ```sh
    npm start
    ```
    The app will be available at `http://localhost:4200/`.

---

## Development

-   Backend: TypeScript, Express, MongoDB, Redis, Firebase
-   Frontend: Angular, Bootstrap, RxJS

## License

MIT
