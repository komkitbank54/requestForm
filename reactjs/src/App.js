// src/App.js
import React, { useContext } from 'react'; // เพิ่มการนำเข้า useContext
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { UserProvider, UserContext } from './context/UserContext'; // แก้ไขการนำเข้า UserContext
import Login from './components/Login';
import UserPage from './page/UserPage';
import ManagerPage from './page/ManagerPage';
import SuperVisionPage from './page/SuperVisionPage';
import DirectorPage from './page/DirectorPage';
import ITPage from './page/ITPage';

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/it" element={<PrivateRoute role="it" component={ITPage} />} />
          <Route path="/manager" element={<PrivateRoute role="manager" component={ManagerPage} />} />
          <Route path="/supervision" element={<PrivateRoute role="supervision" component={SuperVisionPage} />} />
          <Route path="/director" element={<PrivateRoute role="director" component={DirectorPage} />} />
          <Route path="/" element={<UserPage />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

// คอมโพเนนท์สำหรับจัดการเส้นทางที่ต้องการ role เฉพาะ
function PrivateRoute({ component: Component, role }) {
  const { user } = useContext(UserContext); // ใช้ useContext ที่นี่
  return user && user.role === role ? <Component /> : <Navigate to="/" />;
}

export default App;
