💬 ChatGPT Clone — AI Chat App with Long-Term Memory

  ChatGPT Clone is a full-stack AI chat web app that allows users to have interactive conversations with an intelligent assistant — just like ChatGPT.
  It uses WebSockets for real-time messaging and a vector database to remember past queries, giving a personalized and context-aware chat experience.

  ⚡ Built from scratch to learn how real AI chat systems work!

🚀 Features

  💭 Real-time Chat — Smooth, bi-directional communication powered by WebSockets.
  🧠 Long-Term Memory — Stores user interactions using a vector database to make responses context-aware.
  👤 Authentication System — JWT-based login and registration with cookies for session storage.
  📨 Password Reset via Email — Secure reset system integrated using NodeMailer.
  💬 Chat History — Displays all past conversations fetched dynamically.
  🎨 Responsive UI — Clean, modern interface built using React and Tailwind CSS.
  🌐 Backend on Render — Fully deployed and connected to cloud database.

🧠 Tech Stack
  Technology	Purpose
  React.js	Frontend Framework
  Node.js / Express.js	Backend API Server
  MongoDB Atlas	Cloud Database
  WebSocket (Socket.io)	Real-time communication
  Vector Database (e.g., Pinecone / FAISS)	Context memory storage ,to provide long term memory
  JWT + Cookies	User Authentication
  NodeMailer	Password reset emails
  Render / 	Deployment

⚙️ How It Works

  User logs in or registers.
  Every message sent through the chat is transmitted instantly using Socket.io.
  The backend uses an AI API (e.g., OpenAI) to generate the response.
  Each query–response pair is stored in a vector database to retain conversation context.
  When the user chats again, previous embeddings are fetched to keep the chat memory alive.

🖥️ Screenshots / Demo

<img width="1844" height="848" alt="Screenshot 2025-11-12 120216" src="https://github.com/user-attachments/assets/0893cb2b-2797-4a23-b4ef-a462f1cc5622" /><img width="1814" height="835" alt="Screenshot 2025-11-12 120531" src="https://github.com/user-attachments/assets/d0acf557-dfec-42aa-9c27-c370501adb4b" />
<img width="1862" height="851" alt="Screenshot 2025-11-12 120514" src="https://github.com/user-attachments/assets/fde47e0c-221c-434d-a13f-a4488f9f6aa5" /><img width="1901" height="846" alt="Screenshot 2025-11-12 120552" src="https://github.com/user-attachments/assets/5d004e5e-2f5f-4791-bf91-50efede2ca21" />

🛠️ Setup Instructions
Clone the repository
  git clone https://github.com/yourusername/chatgpt-clone.git
  cd chatgpt-clone

Install dependencies
For frontend
  cd client
  npm install
  npm start

For backend
  cd server
  npm install
  npm start

Configure Environment Variables

Create a .env file in your backend folder and add:

  MONGO_URI=your_mongodb_atlas_uri
  JWT_SECRET=your_secret_key
  EMAIL_USER=your_email_address
  EMAIL_PASS=your_email_app_password
  AI_API_KEY=your_openai_api_key
  VECTOR_DB_API_KEY=your_vector_database_key

🌟 Future Enhancements

  🧑‍🏫 Add AI personas (e.g., Teacher, Developer, Friend modes)
  🎙️ Add voice input and output
  📲 Build mobile-friendly version (React Native)
  🧩 Integrate multiple AI models for better accuracy


👨‍💻 Author

Shivam Goel B.Tech 2nd Year | Full Stack (Integrating AI and ML) Developer 
📧 shivamkgjj2005@gmail.com 
🌐 https://www.linkedin.com/in/shivam-goel-6236432a8/
