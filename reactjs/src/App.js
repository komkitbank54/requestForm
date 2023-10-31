// src/App.js
import React, { useContext } from 'react'; // เพิ่มการนำเข้า useContext
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { UserProvider, UserContext } from './context/UserContext'; // แก้ไขการนำเข้า UserContext
import Login from './components/Login';
import MainPage from './main/MainPage';
import AdminPage from './main/AdminPage';
import StaffPage from './main/StaffPage';

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<PrivateRoute role="admin" component={AdminPage} />} />
          <Route path="/staff" element={<PrivateRoute role="staff" component={StaffPage} />} />
          <Route path="/" element={<MainPage />} />
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
