
## Installation

1. Clone the repository.
2. Navigate to the `backend` folder.
3. Run `npm install` to install dependencies.

## Scripts

- `npm start`: Start the server.
- `npm run dev`: Start the server with live reload (using `nodemon`).

## Endpoints

1. `/api/words`: Fetch categorized words.
2. `/api/words/random`: Fetch random words.

## Socket.IO Events

- `joinRoom`: Join a specific room.
- `startGame`: Start the game in a room.
- `typedWord`: Broadcast typed words and scores.

## Dependencies

- `express`: API endpoints.
- `socket.io`: Real-time communication.
- `cors`: Cross-origin requests.

## Usage

Start the backend server using:
```bash
npm start
