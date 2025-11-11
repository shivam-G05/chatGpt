// src/socket.js
import { io } from "socket.io-client";

const socket = io("https://chatgpt-iet7.onrender.com", {
    withCredentials: true ,
    transports: ["websocket"],
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 2000,
    });

socket.on("connect", () => {
  console.log("🔗 Socket Connected:", socket.id);
});

socket.on("disconnect", () => {
  console.log("❌ Socket Disconnected");
});

socket.on("connect_error", (err) => {
  console.log("⚠️ Connection error:", err.message);
});

export default socket;
