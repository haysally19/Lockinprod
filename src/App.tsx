@@ .. @@
 import React from 'react';
 import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
 import { Header } from './components/layout/Header';
 import { Dashboard } from './pages/Dashboard';
 import { CoursePage } from './pages/CoursePage';
+import { LoginForm } from './components/auth/LoginForm';
+import { SignupForm } from './components/auth/SignupForm';
+import { SubscriptionPage } from './pages/SubscriptionPage';
+import { SuccessPage } from './pages/SuccessPage';
 
 function App() {
   return (
     <Router>
       <div className="min-h-screen bg-gray-50">
         <Header />
         <Routes>
           <Route path="/" element={<Dashboard />} />
           <Route path="/course/:id" element={<CoursePage />} />
+          <Route path="/login" element={<LoginForm />} />
+          <Route path="/signup" element={<SignupForm />} />
+          <Route path="/subscription" element={<SubscriptionPage />} />
+          <Route path="/success" element={<SuccessPage />} />
         </Routes>
       </div>
     </Router>
   );
 }
 
 export default App;