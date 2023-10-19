// AddModal.jsx
import React, { useState } from 'react';  // Import useState
import InputField from './input';
import moment from 'moment';
import 'moment/locale/th';

function AddModal({ isOpen, onClose, onConfirm }) {
    const [formData, setFormData] = useState({
        requestName: '',
        requestSurname: '',
        jobRank: '',
        jobGroup: '',
        requestPhone: '',
        requestEmail: ''
        // ... add other fields as necessary
    });

    //เช็ค Modal
    if (!isOpen) {
        return null;
    }

    // value เมื่อพิมพ์
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // input ทั่วไป
    const defaultInput = (label, name, placeholder) => {
        return (
        <InputField 
            label={label} 
            name={name} 
            value={formData[name]}
            placeholder={placeholder}
            onChange={handleChange}
        />
        );
    };

    // เวลาปัจจุบัน
    moment.locale('th');
    const currentDateTime = moment().format('DD MMMM YYYY');

    return (
        <div className='fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center'>
            <div className='bg-white p-4 rounded-md'>
                <p>กรอกข้อมูล</p>
                <div>
                    {currentDateTime}
                </div>
                {/* input */}
                <div className='flex space-x-4'>
                    {defaultInput( "ชื่อ", "requestName", "จอร์น")}
                    {defaultInput( "นามสกุล", "requestSurname", "สมิธ")}
                </div>
                <div className='flex space-x-4'>
                    {defaultInput( "ตำแหน่ง", "jobRank", "Manager")}
                    {defaultInput( "ฝ่าย", "jobGroup", "IT")}
                </div>
                <div className='flex space-x-4'>
                    {defaultInput( "เบอร์", "requestPhone", "081 234 5678")}
                    {defaultInput( "อีเมลล์", "requestEmail", "example@outlook.co.th")}
                </div>
                <div className='flex justify-end mt-4'>
                    <button onClick={onClose} className='mr-2'>Cancel</button>
                    <button onClick={onConfirm} className='p-2 bg-green-400 text-white rounded border-green-700  hover:bg-green-500 active:bg-green-600 active:bg-whie'>Add</button>
                </div>
            </div>
        </div>
    );
}

export default AddModal;
