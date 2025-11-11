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


export default socket;
