require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./src/config/db');
const app = require('./src/app');

// Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

// Websockets
const io = new Server(server, {
  cors: { origin: "*" }
});
io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);
  // ... setup real-time event handlers
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});