
// itProcess.jsx
import React, { useState , useEffect } from 'react';

import { InputField, InputDisabled } from './input';
import moment from 'moment';
import 'moment/locale/th';

// import css
import '../css/add.css';
import "react-datepicker/dist/react-datepicker.css";

export default function ItFinishModal({ isOpen, onClose, onConfirm, formData, setFormData }) {
    const [currentStep, setCurrentStep] = useState(1);

    // กด ESC เพื่อปิด add-modal
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                setCurrentStep(1);
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
        setCurrentStep(1);
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
        const firstName = localStorage.getItem('firstname');
        const lastName = localStorage.getItem('surname');
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
            userChange: `${firstName} ${lastName}`,
            changeStatue: 'เสร็จสิ้น',
            finishDate: currentDateFormat
            
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

    const manageInput = (label, name, placeholder, addClass) => (
        <InputDisabled 
            label={label} 
            name={name} 
            value={`${localStorage.getItem('firstname')} ${localStorage.getItem('surname')}`} // directly using localStorage values
            placeholder={placeholder}
            onChange={handleChange}
            addClass={addClass} 
            />
    );

    // เวลา
    moment.locale('th');
    const currentDateTime = moment().format('DD MMMM YYYY');
    const currentDateFormat = moment().format('YYYY-MM-DD');

    return (
        <div className='overlay' onClick={handleOutsideClick}>
            <div className='modal'>
                {/* Header */}
                <button className='absolute top-3 right-4' onClick={onCloseHandle}>X</button>
                <div className="flex justify-between font-bold text-[20px]">
                    <p>ยืนยันสถานะการเปลี่ยนแปลง</p>
                    <p className="mr-5">{currentDateTime}</p>
                </div>
                {/* Page 1 */}
                {currentStep === 1 && (
                    <>
                        <div className=''>
                            <header className='font-semibold mt-1'>ส่วนที่ 1 - รายละเอียดการดำเนินการ</header>
                            <div className='input-bew'>
                                    {manageInput("ชื่อผู้เปลี่ยน", "userChange")}
                                <div>
                                    <label>วันที่เสร็จสิ้น</label>
                                    <button className="relative inputfield flex items-center justify-center" disabled>
                                        <div className='absolute left-2'>
                                            <img src={require('../img/calendar.png')} className='icon' alt="edit" />
                                        </div>
                                        <div className='font-semibold'>
                                            {currentDateTime}
                                        </div>
                                    </button>
                                </div>
                            </div>
                            <div className='mt-4'>
                                {defaultInput("ผลการเปลี่ยนแปลง(ถ้ามี)", "changeResult", "รายละเอียด..", "inputLarge")}
                            </div>
                            <div className='mt-4'>
                                {defaultInput("การปรับปรุงเอกสารสนับสนุนระบบ(ถ้ามี)", "changeResName", "รายละเอียด..", "inputLarge",)}
                            </div>
                        </div>
                    </>
                )}
                {/* Footer */}
                <div className='absolute bottom-2 right-2 flex space-x-1'>
                    <button onClick={onConfirm} className='px-2 py-2 bg-green-500 text-white rounded-md'>
                        ยืนยัน
                    </button>
                </div>
            </div>
        </div>
    );
};
