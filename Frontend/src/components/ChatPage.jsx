// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";
// import Sidebar from "./Sidebar";
// import ChatArea from "./ChatArea";
// import "./ChatPage.css";

// const ChatPage = () => {
//   const { chatId } = useParams(); // CHATID FROM HEADER
//   const [loading, setLoading] = useState(true); // CHECKS WHETHER DATA IS GETTING FETCHED OR NOT
//   const [messages, setMessages] = useState([]); // HOLDS ALL THE CONVERSATIONS
//   const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 770); // Default open only for wide screens

//   // ✅ Sidebar toggle
//   const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

//   // ✅ Auto close/open sidebar on screen resize
//   useEffect(() => {
//     const handleResize = () => {
//       if (window.innerWidth <= 770 && isSidebarOpen) {
//         setIsSidebarOpen(false);
//       } else if (window.innerWidth > 770 && !isSidebarOpen) {
//         setIsSidebarOpen(true);
//       }
//     };
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, [isSidebarOpen]);

//   // ✅ Fetch messages whenever chatId changes
//   useEffect(() => {
//     const fetchMessages = async () => {
//       try {
//         setLoading(true);
//         setMessages([]);
//         const response = await axios.get(
//           `https://chatgpt-iet7.onrender.com/api/chat/${chatId}/messages`,
//           { withCredentials: true }
//         );
//         setMessages(response.data.messages);
//         console.log(response.data.messages);
//       } catch (err) {
//         console.error("Error fetching messages:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (chatId) fetchMessages();
//   }, [chatId]);

//   return (
//     <div className="chat-page">
//       {/* ✅ Menu button fixed outside sidebar (always visible on mobile) */}
//       <button className="menu-button" onClick={toggleSidebar}>
//         ☰
//       </button>

//       {/* ✅ Sidebar stays same */}
//       <Sidebar
//         isOpen={isSidebarOpen}
//         toggleSidebar={toggleSidebar}
//         className={`sidebar ${isSidebarOpen ? "open" : ""}`}
//       />

//       {loading ? (
//         <div className="loading">Loading Chat...</div>
//       ) : (
//         <div className={`chat-area-container ${isSidebarOpen ? "shifted" : ""}`}>
//           <div className="main-container">
//             <ChatArea
//               toggleSidebar={toggleSidebar}
//               messages={messages}
//               chatId={chatId}
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ChatPage;



import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import io from "socket.io-client";
import ChatArea from "../ChatArea";

const socket = io("https://chatgpt-iet7.onrender.com", { autoConnect: true });

const ChatPage = () => {
  const location = useLocation();
  const { chatId, user } = location.state || {};

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!chatId) return;

    console.log("🔌 Joining chat room:", chatId);
    socket.emit("join-room", chatId);

    // ✅ Listener: AI response arrives here
    const handleAIResponse = (data) => {
      console.log("📨 AI Response:", data);
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: data?.message || data?.content || "",
        },
      ]);
    };

    // Clean & register listener ONCE per chatId change
    socket.off("ai-response");
    socket.on("ai-response", handleAIResponse);

    return () => {
      socket.off("ai-response", handleAIResponse);
    };
  }, [chatId]);

  // ✅ Listener: load previous messages only once
  useEffect(() => {
    if (!chatId) return;

    const handleRoomMessages = (data) => {
      console.log("🕒 Room Messages Loaded:", data);
      setMessages(data);
    };

    socket.emit("get-room-messages", chatId);

    socket.off("room-messages");
    socket.on("room-messages", handleRoomMessages);

    return () => socket.off("room-messages", handleRoomMessages);
  }, [chatId]);

  // ✅ Listener: user message (your echo)
  useEffect(() => {
    const handleUserMessage = (data) => {
      console.log("👤 User Message Echo:", data);
      setMessages((prev) => [...prev, { role: "user", text: data.message }]);
    };

    socket.off("user-message");
    socket.on("user-message", handleUserMessage);

    return () => socket.off("user-message", handleUserMessage);
  }, []);

  // ✅ Send user message to server
  const sendMessage = (text) => {
    socket.emit("send-message", {
      chatId,
      message: text,
      sender: user?.id,
    });

    // Optimistic append user message
    setMessages((prev) => [...prev, { role: "user", text }]);
  };

  return (
    <div className="chat-page-container">
      <ChatArea
        messages={messages}
        sendMessage={sendMessage}
        chatId={chatId}
      />
    </div>
  );
};

export default ChatPage;

