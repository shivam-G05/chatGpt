    import { createContext, useContext } from "react";

// ✅ Create the context
export const ChatContext = createContext();

// ✅ Custom hook to use chat context
export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within ChatProvider");
  }
  return context;
};