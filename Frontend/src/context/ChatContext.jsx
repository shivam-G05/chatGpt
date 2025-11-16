// import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
// import axios from "axios";
// import socket from "../socket";

// const ChatContext = createContext();

// export const ChatProvider = ({ children }) => {
//   const [chats, setChats] = useState([]);
//   const [messages, setMessages] = useState({});
//   const [currentChatId, setCurrentChatId] = useState(null);
//   const [loading, setLoading] = useState({});
//   const [socketReady, setSocketReady] = useState(false);

//   // ✅ Socket connection management
//   useEffect(() => {
//     const connectHandler = () => {
//       console.log("🔗 Socket connected:", socket.id);
//       setSocketReady(true);
//     };

//     const disconnectHandler = () => {
//       console.log("❌ Socket disconnected");
//       setSocketReady(false);
//     };

//     if (socket.connected) {
//       console.log("✅ Socket already connected:", socket.id);
//       setSocketReady(true);
//     }

//     socket.on("connect", connectHandler);
//     socket.on("disconnect", disconnectHandler);

//     // ✅ Listen for AI responses
//     socket.on("ai-response", (data) => {
//       const chatId = data.chatId || currentChatId;
//       if (chatId) {
//         setMessages((prev) => ({
//           ...prev,
//           [chatId]: [
//             ...(prev[chatId] || []),
//             { role: "ai", text: data.content, _id: Date.now() }
//           ]
//         }));
//       }
//     });

//     return () => {
//       socket.off("connect", connectHandler);
//       socket.off("disconnect", disconnectHandler);
//       socket.off("ai-response");
//     };
//   }, [currentChatId]);

//   // ✅ Fetch all chats (called once on app load)
//   const fetchChats = useCallback(async () => {
//     try {
//       const response = await axios.get("https://chatgpt-iet7.onrender.com/api/chat", {
//         withCredentials: true,
//       });
//       if (response.data.chats) {
//         setChats(response.data.chats);
//       }
//     } catch (err) {
//       console.error("Error fetching chats:", err);
//     }
//   }, []);

//   // ✅ Fetch messages for a specific chat (with caching)
//   const fetchMessages = useCallback(async (chatId, force = false) => {
//     // If already loaded and not forcing refresh, skip
//     if (messages[chatId] && !force) {
//       console.log(`✅ Messages for ${chatId} already in memory`);
//       return;
//     }

//     try {
//       setLoading((prev) => ({ ...prev, [chatId]: true }));
//       const response = await axios.get(
//         `https://chatgpt-iet7.onrender.com/api/chat/${chatId}/messages`,
//         { withCredentials: true }
//       );
      
//       setMessages((prev) => ({
//         ...prev,
//         [chatId]: response.data.messages || []
//       }));
//     } catch (err) {
//       console.error(`Error fetching messages for ${chatId}:`, err);
//     } finally {
//       setLoading((prev) => ({ ...prev, [chatId]: false }));
//     }
//   }, [messages]);

//   // ✅ Create new chat
//   const createChat = useCallback(async (title) => {
//     try {
//       const response = await axios.post(
//         "https://chatgpt-iet7.onrender.com/api/chat",
//         { title },
//         { withCredentials: true }
//       );

//       if (response.status === 201 || response.status === 200) {
//         const newChat = response.data.chat;
//         setChats((prev) => [newChat, ...prev]);
//         setMessages((prev) => ({ ...prev, [newChat._id]: [] }));
//         return newChat._id;
//       }
//     } catch (error) {
//       console.error("Error creating chat:", error);
//       throw error;
//     }
//   }, []);

//   // ✅ Send message
//   const sendMessage = useCallback((chatId, message) => {
//     if (!socketReady || !chatId || !message.trim()) return;

//     // Optimistically add user message
//     setMessages((prev) => ({
//       ...prev,
//       [chatId]: [
//         ...(prev[chatId] || []),
//         { role: "user", text: message, _id: Date.now() }
//       ]
//     }));

//     // Emit to socket
//     socket.emit("ai-message", { chat: chatId, message });
//   }, [socketReady]);

//   // ✅ Clear messages cache for a chat
//   const clearChatMessages = useCallback((chatId) => {
//     setMessages((prev) => {
//       const newMessages = { ...prev };
//       delete newMessages[chatId];
//       return newMessages;
//     });
//   }, []);

//   const value = {
//     chats,
//     messages,
//     currentChatId,
//     loading,
//     socketReady,
//     setCurrentChatId,
//     fetchChats,
//     fetchMessages,
//     createChat,
//     sendMessage,
//     clearChatMessages
//   };

//   return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
// };

// // ✅ Custom hook to use chat context
// export const useChat = () => {
//   const context = useContext(ChatContext);
//   if (!context) {
//     throw new Error("useChat must be used within ChatProvider");
//   }
//   return context;
// };


// import React, { useState, useEffect, useCallback } from "react";
// import axios from "axios";
// import socket from "../socket";
// import { ChatContext } from "./chatContextValue";

// export const ChatProvider = ({ children }) => {
//   const [chats, setChats] = useState([]);
//   const [messages, setMessages] = useState({});
//   const [currentChatId, setCurrentChatId] = useState(null);
//   const [loading, setLoading] = useState({});
//   const [socketReady, setSocketReady] = useState(false);

//   // ✅ Socket connection management
//   useEffect(() => {
//     const connectHandler = () => {
//       console.log("🔗 Socket connected:", socket.id);
//       setSocketReady(true);
//     };

//     const disconnectHandler = () => {
//       console.log("❌ Socket disconnected");
//       setSocketReady(false);
//     };

//     if (socket.connected) {
//       console.log("✅ Socket already connected:", socket.id);
//       setSocketReady(true);
//     }

//     socket.on("connect", connectHandler);
//     socket.on("disconnect", disconnectHandler);

//     // ✅ Listen for AI responses
//     socket.on("ai-response", (data) => {
//       const chatId = data.chatId || currentChatId;
//       if (chatId) {
//         setMessages((prev) => ({
//           ...prev,
//           [chatId]: [
//             ...(prev[chatId] || []),
//             { role: "ai", text: data.content, _id: Date.now() }
//           ]
//         }));
//       }
//     });

//     return () => {
//       socket.off("connect", connectHandler);
//       socket.off("disconnect", disconnectHandler);
//       socket.off("ai-response");
//     };
//   }, [currentChatId]);

//   // ✅ Fetch all chats (called once on app load)
//   const fetchChats = useCallback(async () => {
//     try {
//       const response = await axios.get("https://chatgpt-iet7.onrender.com/api/chat", {
//         withCredentials: true,
//       });
//       if (response.data.chats) {
//         setChats(response.data.chats);
//       }
//     } catch (err) {
//       console.error("Error fetching chats:", err);
//     }
//   }, []);

//   // ✅ Fetch messages for a specific chat (with caching)
//   const fetchMessages = useCallback(async (chatId, force = false) => {
//     // If already loaded and not forcing refresh, skip
//     if (messages[chatId] && !force) {
//       console.log(`✅ Messages for ${chatId} already in memory`);
//       return;
//     }

//     try {
//       setLoading((prev) => ({ ...prev, [chatId]: true }));
//       const response = await axios.get(
//         `https://chatgpt-iet7.onrender.com/api/chat/${chatId}/messages`,
//         { withCredentials: true }
//       );
      
//       setMessages((prev) => ({
//         ...prev,
//         [chatId]: response.data.messages || []
//       }));
//     } catch (err) {
//       console.error(`Error fetching messages for ${chatId}:`, err);
//     } finally {
//       setLoading((prev) => ({ ...prev, [chatId]: false }));
//     }
//   }, [messages]);

//   // ✅ Create new chat
//   const createChat = useCallback(async (title) => {
//     try {
//       const response = await axios.post(
//         "https://chatgpt-iet7.onrender.com/api/chat",
//         { title },
//         { withCredentials: true }
//       );

//       if (response.status === 201 || response.status === 200) {
//         const newChat = response.data.chat;
//         setChats((prev) => [newChat, ...prev]);
//         setMessages((prev) => ({ ...prev, [newChat._id]: [] }));
//         return newChat._id;
//       }
//     } catch (error) {
//       console.error("Error creating chat:", error);
//       throw error;
//     }
//   }, []);

//   // ✅ Send message
//   const sendMessage = useCallback((chatId, message) => {
//     if (!socketReady || !chatId || !message.trim()) return;

//     // Optimistically add user message
//     setMessages((prev) => ({
//       ...prev,
//       [chatId]: [
//         ...(prev[chatId] || []),
//         { role: "user", text: message, _id: Date.now() }
//       ]
//     }));

//     // Emit to socket
//     socket.emit("ai-message", { chat: chatId, message });
//   }, [socketReady]);

//   // ✅ Clear messages cache for a chat
//   const clearChatMessages = useCallback((chatId) => {
//     setMessages((prev) => {
//       const newMessages = { ...prev };
//       delete newMessages[chatId];
//       return newMessages;
//     });
//   }, []);

//   const value = {
//     chats,
//     messages,
//     currentChatId,
//     loading,
//     socketReady,
//     setCurrentChatId,
//     fetchChats,
//     fetchMessages,
//     createChat,
//     sendMessage,
//     clearChatMessages
//   };

//   return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
// };

// import React, { useState, useEffect, useCallback } from "react";
// import axios from "axios";
// import socket from "../socket";
// import { ChatContext } from "./chatContextValue";

// export const ChatProvider = ({ children }) => {
//   const [chats, setChats] = useState([]);
//   const [messages, setMessages] = useState({});
//   const [currentChatId, setCurrentChatId] = useState(null);
//   const [loading, setLoading] = useState({});
//   const [socketReady, setSocketReady] = useState(false);

//   // ✅ Socket connection management
//   useEffect(() => {
//     const connectHandler = () => {
//       console.log("🔗 Socket connected:", socket.id);
//       setSocketReady(true);
//     };

//     const disconnectHandler = () => {
//       console.log("❌ Socket disconnected");
//       setSocketReady(false);
//     };

//     if (socket.connected) {
//       console.log("✅ Socket already connected:", socket.id);
//       setSocketReady(true);
//     }

//     socket.on("connect", connectHandler);
//     socket.on("disconnect", disconnectHandler);

//     // ✅ Listen for AI responses
//     socket.on("ai-response", (data) => {
//       const chatId = data.chatId || currentChatId;
//       if (chatId) {
//         setMessages((prev) => ({
//           ...prev,
//           [chatId]: [
//             ...(prev[chatId] || []),
//             { role: "ai", text: data.content, _id: Date.now() }
//           ]
//         }));
//       }
//     });

//     return () => {
//       socket.off("connect", connectHandler);
//       socket.off("disconnect", disconnectHandler);
//       socket.off("ai-response");
//     };
//   }, [currentChatId]);

//   // ✅ Fetch all chats (called once on app load)
//   const fetchChats = useCallback(async () => {
//     try {
//       const response = await axios.get("https://chatgpt-iet7.onrender.com/api/chat", {
//         withCredentials: true,
//       });
//       if (response.data.chats) {
//         setChats(response.data.chats);
//       }
//     } catch (err) {
//       console.error("Error fetching chats:", err);
//       if (err.response?.status === 401 || err.response?.status === 403) {
//         // Don't throw error, just log it - user might not be logged in yet
//         console.log("User not authenticated");
//       }
//     }
//   }, []);

//   // ✅ Fetch messages for a specific chat (with caching)
//   const fetchMessages = useCallback(async (chatId, force = false) => {
//     // If already loaded and not forcing refresh, skip
//     if (messages[chatId] && !force) {
//       console.log(`✅ Messages for ${chatId} already in memory`);
//       return;
//     }

//     try {
//       setLoading((prev) => ({ ...prev, [chatId]: true }));
//       const response = await axios.get(
//         `https://chatgpt-iet7.onrender.com/api/chat/${chatId}/messages`,
//         { withCredentials: true }
//       );
      
//       setMessages((prev) => ({
//         ...prev,
//         [chatId]: response.data.messages || []
//       }));
//     } catch (err) {
//       console.error(`Error fetching messages for ${chatId}:`, err);
//     } finally {
//       setLoading((prev) => ({ ...prev, [chatId]: false }));
//     }
//   }, [messages]);

//   // ✅ Create new chat
//   const createChat = useCallback(async (title) => {
//     try {
//       const response = await axios.post(
//         "https://chatgpt-iet7.onrender.com/api/chat",
//         { title },
//         { withCredentials: true }
//       );

//       if (response.status === 201 || response.status === 200) {
//         const newChat = response.data.chat;
//         setChats((prev) => [newChat, ...prev]);
//         setMessages((prev) => ({ ...prev, [newChat._id]: [] }));
//         return newChat._id;
//       }
//     } catch (error) {
//       console.error("Error creating chat:", error);
//       throw error;
//     }
//   }, []);

//   // ✅ Send message
//   const sendMessage = useCallback((chatId, message) => {
//     if (!socketReady || !chatId || !message.trim()) return;

//     // Optimistically add user message
//     setMessages((prev) => ({
//       ...prev,
//       [chatId]: [
//         ...(prev[chatId] || []),
//         { role: "user", text: message, _id: Date.now() }
//       ]
//     }));

//     // Emit to socket
//     socket.emit("ai-message", { chat: chatId, message });
//   }, [socketReady]);

//   // ✅ Clear messages cache for a chat
//   const clearChatMessages = useCallback((chatId) => {
//     setMessages((prev) => {
//       const newMessages = { ...prev };
//       delete newMessages[chatId];
//       return newMessages;
//     });
//   }, []);

//   const value = {
//     chats,
//     messages,
//     currentChatId,
//     loading,
//     socketReady,
//     setCurrentChatId,
//     fetchChats,
//     fetchMessages,
//     createChat,
//     sendMessage,
//     clearChatMessages
//   };

//   return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
// };


import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import socket from "../socket";
import { ChatContext } from "./chatContextValue";

export const ChatProvider = ({ children }) => {
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState({});
  const [currentChatId, setCurrentChatId] = useState(null);
  const [loading, setLoading] = useState({});
  const [socketReady, setSocketReady] = useState(false);

  // ✅ Socket connection management
  useEffect(() => {
    const connectHandler = () => {
      console.log("🔗 Socket connected:", socket.id);
      setSocketReady(true);
    };

    const disconnectHandler = () => {
      console.log("❌ Socket disconnected");
      setSocketReady(false);
    };

    if (socket.connected) {
      console.log("✅ Socket already connected:", socket.id);
      setSocketReady(true);
    }

    socket.on("connect", connectHandler);
    socket.on("disconnect", disconnectHandler);

    // ✅ Listen for AI responses
    socket.on("ai-response", (data) => {
      const chatId = data.chatId || currentChatId;
      if (chatId) {
        setMessages((prev) => ({
          ...prev,
          [chatId]: [
            ...(prev[chatId] || []),
            { role: "ai", text: data.content, _id: Date.now() }
          ]
        }));
      }
    });

    return () => {
      socket.off("connect", connectHandler);
      socket.off("disconnect", disconnectHandler);
      socket.off("ai-response");
    };
  }, [currentChatId]);

  // ✅ Fetch all chats (called once on app load)
  const fetchChats = useCallback(async () => {
    try {
      const response = await axios.get("https://chatgpt-iet7.onrender.com/api/chat", {
        withCredentials: true,
      });
      if (response.data.chats) {
        setChats(response.data.chats);
      }
    } catch (err) {
      console.error("Error fetching chats:", err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        // Don't throw error, just log it - user might not be logged in yet
        console.log("User not authenticated");
      }
    }
  }, []);

  // ✅ Fetch messages for a specific chat (with caching)
  const fetchMessages = useCallback(async (chatId, force = false) => {
    // If already loaded and not forcing refresh, skip
    if (messages[chatId] && !force) {
      console.log(`✅ Messages for ${chatId} already in memory`);
      return;
    }

    try {
      setLoading((prev) => ({ ...prev, [chatId]: true }));
      const response = await axios.get(
        `https://chatgpt-iet7.onrender.com/api/chat/${chatId}/messages`,
        { withCredentials: true }
      );
      
      setMessages((prev) => ({
        ...prev,
        [chatId]: response.data.messages || []
      }));
    } catch (err) {
      console.error(`Error fetching messages for ${chatId}:`, err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        console.log("Authentication required");
      }
    } finally {
      setLoading((prev) => ({ ...prev, [chatId]: false }));
    }
  }, [messages]);

  // ✅ Create new chat
  const createChat = useCallback(async (title) => {
    try {
      const response = await axios.post(
        "https://chatgpt-iet7.onrender.com/api/chat",
        { title },
        { withCredentials: true }
      );

      if (response.status === 201 || response.status === 200) {
        const newChat = response.data.chat;
        setChats((prev) => [newChat, ...prev]);
        setMessages((prev) => ({ ...prev, [newChat._id]: [] }));
        return newChat._id;
      }
    } catch (error) {
      console.error("Error creating chat:", error);
      throw error;
    }
  }, []);

  // ✅ Send message
  const sendMessage = useCallback((chatId, message) => {
    if (!socketReady || !chatId || !message.trim()) return;

    // Optimistically add user message
    setMessages((prev) => ({
      ...prev,
      [chatId]: [
        ...(prev[chatId] || []),
        { role: "user", text: message, _id: Date.now() }
      ]
    }));

    // Emit to socket
    socket.emit("ai-message", { chat: chatId, message });
  }, [socketReady]);

  // ✅ Clear messages cache for a chat
  const clearChatMessages = useCallback((chatId) => {
    setMessages((prev) => {
      const newMessages = { ...prev };
      delete newMessages[chatId];
      return newMessages;
    });
  }, []);

  const value = {
    chats,
    messages,
    currentChatId,
    loading,
    socketReady,
    setCurrentChatId,
    fetchChats,
    fetchMessages,
    createChat,
    sendMessage,
    clearChatMessages
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};