// import { BrowserRouter, Routes, Route } from 'react-router-dom'
// import {useParams} from 'react-router-dom'
// import React from 'react'
// import Home from './pages/Home'
// import Register from './pages/Register'
// import Login from './pages/Login'
// import ChatPage from '../src/components/ChatPage'
// import Settings from './pages/Settings'
// import ResetPassword from './pages/ResetPassword'
// import ForgotPassword from './pages/ForgotPassword'
// import BlockedAuthRoute from './components/BlockedAuthRoute'
// import { ChatProvider } from "./context/ChatContext";
// import { AuthProvider } from "./context/AuthContext";
// import ProtectedRoute from "./components/ProtectedRoute";

// const AppRoutes = () => {
//     return (

//         <BrowserRouter>
//         <AuthProvider>
//         <ChatProvider>
//             <Routes>
//                 <Route path='/' element={<Home />} />
//                 <Route path='/register' element={<BlockedAuthRoute><Register /></BlockedAuthRoute>} />
//                 <Route path='/login' element={<BlockedAuthRoute><Login /></BlockedAuthRoute>} />
//                 <Route path="/chat/:chatId" element={<ChatPageWrapper />} />
//                 <Route path="/settings" element={<Settings />} />
//                 <Route path="/forgot-password" element={<ForgotPassword />} />
//                 <Route path="/reset-password/:token" element={<ResetPassword />} />

//             </Routes>
//             </ChatProvider>
//       </AuthProvider>
//         </BrowserRouter>
//     )
// }
// function ChatPageWrapper() {
//   const { chatId } = useParams();
//   return <ChatPage key={chatId} />;
// }

// export default AppRoutes;



import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import React from 'react';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import ChatPage from './components/ChatPage';
import Settings from './pages/Settings';
import ResetPassword from './pages/ResetPassword';
import ForgotPassword from './pages/ForgotPassword';
import BlockedAuthRoute from './components/BlockedAuthRoute';
import ProtectedRoute from './components/ProtectedRoute';
import { ChatProvider } from './context/ChatContext';
import { AuthProvider } from './context/AuthContext';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ChatProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            
            {/* Auth Routes - Blocked if already logged in */}
            <Route
              path="/register"
              element={
                <BlockedAuthRoute>
                  <Register />
                </BlockedAuthRoute>
              }
            />
            <Route
              path="/login"
              element={
                <BlockedAuthRoute>
                  <Login />
                </BlockedAuthRoute>
              }
            />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />

            {/* Protected Routes - Require authentication */}
            <Route
              path="/chat/:chatId?"
              element={
                <ProtectedRoute>
                  <ChatPageWrapper />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
          </Routes>
        </ChatProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

// ✅ Wrapper to ensure ChatPage re-renders when chatId changes
function ChatPageWrapper() {
  const { chatId } = useParams();
  return <ChatPage key={chatId} />;
}

export default AppRoutes;