// src/components/Login.js
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // นำเข้า useNavigate
import { UserContext } from '../context/UserContext';

//import css
import '../page/css/add.css'
import '../page/css/input.css'
import '../page/css/button.css'

function Login({ isOpen, onClose, onConfirm }) {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate(); // สร้างตัวแปร navigate

    // กด ESC เพื่อปิด Login Modal
    useEffect(() => {
      const handleKeyDown = (event) => {
          if (event.key === 'Escape') {
              onClose();
          }
      };
      window.addEventListener('keydown', handleKeyDown);

      return () => {
          window.removeEventListener('keydown', handleKeyDown);
      };
  }, [onClose]);

  // action เมื่อกดปิด
  const onCloseHandle = () => {
      onClose();
  }

  // คลิกข้างนอกเพื่อออก
  const handleOutsideClick = (event) => {
      if (event.target === event.currentTarget) {
          onCloseHandle();
      }
  };

  if (!isOpen) {
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/user');
      const users = await response.json();
      const user = users.find((u) => u.username === username && u.password === password);

        if (user) {
          localStorage.setItem('userid', user.userid);
          localStorage.setItem('prefix', user.prefix);
          localStorage.setItem('firstname', user.firstname);
          localStorage.setItem('surname', user.surname);
          localStorage.setItem('position', user.position);
          setUser({ username: user.username, role: user.position });
        // ตรวจสอบ role และเปลี่ยนเส้นทางผู้ใช้
        if (user.position === 'it') {
          navigate('/it');
        } else if (user.position === 'manager') {
          navigate('/manager');
        } else if (user.position === 'audit') {
          navigate('/audit');
        } else if (user.position === 'director') {
          navigate('/director');
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
    <div className='overlay' onClick={handleOutsideClick}>
      <div className='login-modal'>
        <div className='flex justify-between'>
          <span className='text-[20px]'>ล็อคอินเข้าสู่ระบบ</span>
          <button className='' onClick={onCloseHandle}>X</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className='items-center pb-12 pt-4 pr-3'>
            <input className='inputfield' type="text" placeholder="Username" value={username} autoComplete="current-password" onChange={(e) => setUsername(e.target.value)} /><br/>
            <input className='inputfield' type="password" placeholder="Password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} /><br/>
            <div className='absolute right-0 bottom-0 flex items-center mr-2 space-x-1'>
              <button className='' onClick={onCloseHandle}>Cancel</button>
              <button type="submit" className='loginAddBtn2'>Login</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
