// src/components/Login.js
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom'; // นำเข้า useNavigate
import { UserContext } from '../context/UserContext';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate(); // สร้างตัวแปร navigate

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/user');
      const users = await response.json();
      const user = users.find((u) => u.userName === username && u.password === password);

      if (user) {
        setUser({ userName: user.userName, role: user.position });
        // ตรวจสอบ role และเปลี่ยนเส้นทางผู้ใช้
        if (user.position === 'admin') {
          navigate('/admin');
        } else if (user.position === 'staff') {
          navigate('/staff');
        } else {
          navigate('/');
        }
      } else {
        alert('Invalid username or password');
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('Login failed');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
