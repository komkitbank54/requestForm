// addModal.jsx
import React, { useState, useEffect } from 'react';

import { InputField } from './input';
import moment from 'moment';
import 'moment/locale/th';

// import css
import '../css/add.css';

const initialFormData = {
    username: '',
    password: '',
    prefix: '',
    firstname: '',
    surname: '',
    position: 'it'
};

export default function AddUser({ isOpen, onClose}) {
    const [formData, setFormData] = useState(initialFormData);
    // กด ESC เพื่อปิด add-modal
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
    
    // isOpen check
    if (!isOpen) {
        return null;
    }

    // update input ตาม value
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
        setFormData(prevState => ({
            ...prevState,
        }));
    };

    // input
    const defaultInput = (label, name, placeholder, addClass) => (
        <InputField 
            label={label} 
            name={name} 
            value={formData[name]}
            placeholder={placeholder}
            onChange={handleChange}
            addClass={addClass} />
    );

    const handleConfirmUser = () => {
        fetch('http://localhost:3000/adduser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
        .then(response => response.json())
        .then(result => {
            if (result.message === 'User added successfully!') {
                // ทำอะไรก็ได้หลังจากเพิ่มผู้ใช้เสร็จสิ้น (เช่น ปิด modal)
                onClose();
            } else {
                console.error('Failed to add user.', result.message);
            }
        })
        .catch(err => {
            console.error('Error:', err);
        });
    };
    

    // เวลา
    moment.locale('th');
    const currentDateTime = moment().format('DD MMMM YYYY');

    return (
        <div className='overlay' onClick={handleOutsideClick}>
            <div className='modal'>
                {/* Header */}
                <button className='absolute top-3 right-4' onClick={onCloseHandle}>X</button>
                <div className="flex justify-between font-bold text-[20px]">
                    <p>เพิ่มผู้ใช้งาน</p>
                    <p className="mr-5">{currentDateTime}</p>
                </div>
                {/* Body */}
                    <>
                    <div className=''>
                        <header className='font-semibold mt-1'></header>
                            <div className='input-bew'>
                                <div className=''>
                                    Username
                                    <div className=''>
                                        <input
                                            type="text"
                                            name="username"
                                            value={formData.username}
                                            className="inputfield"
                                            onChange={handleChange}
                                            placeholder="Username"
                                        />
                                    </div>
                                </div>
                                <div className=''>
                                    Password
                                    <div className=''>
                                        <input
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            className="inputfield"
                                            onChange={handleChange}
                                            placeholder="password"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className='input-bew'>
                                {defaultInput("คำนำ", "prefix", "", "inputVerySmall")}
                                {defaultInput("ชื่อ", "firstname", "...")}
                                {defaultInput("นามสกุล", "surname", "...")}
                            </div>
                            <div className='mt-4'>
                                ตำแหน่ง<br/>
                                <select name="position" className='inputfield' value={formData.position} onChange={handleChange}>
                                    <option value="it">IT</option>
                                    <option value="audit">Audit</option>
                                    <option value="manager">Manager</option>
                                </select>
                            </div>
                        </div>
                    </>
                {/* Footer */}
                <div className='absolute bottom-2 right-2 flex space-x-1'>
                    <button onClick={handleConfirmUser} className='px-2 py-2 bg-green-500 text-white rounded-md'>
                        ยืนยัน
                    </button>
                </div>
            </div>
        </div>
    );
};