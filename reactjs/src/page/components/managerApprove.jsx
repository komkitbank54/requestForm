
// itProcess.jsx
import React, { useState , useEffect } from 'react';
import { RadioWithoutInput } from './checkbox';

import { InputField, InputDisabled } from './input';
import moment from 'moment';
import 'moment/locale/th';

// import css
import '../css/add.css';
import "react-datepicker/dist/react-datepicker.css";

function ManagerApproveModal({ isOpen, onClose, onConfirm, formData, setFormData }) {
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
            headITName: `${firstName} ${lastName}`,
            headITDate: currentDateFormat
            
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

    // Checkbox ที่ไม่มี input
    const presetRadio = (groupName, fieldName, label, value) => (
        <RadioWithoutInput 
            groupName={groupName}
            fieldName={fieldName}
            label={label}
            value={value}
            setFormData={setFormData}
            />
    );

    // เวลา
    moment.locale('th');
    const currentDateTime = moment().format('DD MMMM YYYY');
    const currentDateFormat = moment().format('YYYY-MM-DD');

    // หน้าต่อไป
    const nextPage = () => {
        setCurrentStep(prev => prev + 1);
    }

    // หน้าก่อน
    const prevPage = () => {
        setCurrentStep(prev => prev - 1);
    }

    return (
        <div className='overlay' onClick={handleOutsideClick}>
            <div className='modal'>
                {/* Header */}
                <button className='absolute top-3 right-4' onClick={onCloseHandle}>X</button>
                <div className="flex justify-between font-bold text-[20px]">
                    <p>แบบฟอร์มร้องขอการเปลี่ยนแปลง</p>
                    <p className="mr-5">{currentDateTime}</p>
                </div>
                {/* Page 1 */}
                {currentStep === 1 && (
                    <>
                        <div className=''>
                            <header className='font-semibold mt-1'>ส่วนที่ 1 - หัวหน้าฝ่ายเทคโนโลยีสารสนเทศให้การอนุมัติ</header>
                            <div className='mt-4'>
                                <header>
                                    หัวหน้าฝ่ายเทคโนโลยีสารสนเทศ
                                </header>
                                <div className='flex space-x-2'>
                                    {manageInput("", "headITName")}
                                    <button className="relative inputfield flex items-center justify-center" disabled>
                                        <div className='absolute left-2'>
                                            <img src={require('../img/calendar.png')} className='icon' alt="edit" />
                                        </div>
                                        <div className='font-semibold'>
                                            {currentDateTime}
                                        </div>
                                    </button>
                                </div>
                                <div className='ml-2 mt-2 flex items-center'>
                                    <header>ประเมินความเสี่ยง</header>
                                    {presetRadio("headITEsti", "headITEsti", "ต่ำ", "low")}
                                    {presetRadio("headITEsti", "headITEsti", "กลาง", "Medium")}
                                    {presetRadio("headITEsti", "headITEsti", "สูง", "high")}
                                </div>
                                <div className='mt-2 flex items-center'>
                                    {presetRadio("headITApprove", "headITApprove", "อนุมัติ", "Approve")}
                                    {presetRadio("headITApprove", "headITApprove", "ไม่อนุมัติ", "Deny")}
                                </div>
                                <div className='mt-2 flex items-center'>
                                    {defaultInput("", "headITEstiComment", "ความคิดเห็นเพิ่มเติม", "inputLarge")}
                                </div>
                            </div>
                        </div>
                    </>
                )}
                {/* Footer */}
                <div className='absolute bottom-2 right-2 flex space-x-1'>
                    {currentStep > 1 && (
                        <button onClick={prevPage} className='px-2 py-2 bg-blue-500 text-white rounded-md'>
                            ย้อนกลับ
                        </button>
                    )}
                    {currentStep < 1 ? (
                        <button onClick={nextPage} className='px-3 py-2 bg-blue-500 text-white rounded-md'>
                            ต่อไป
                        </button>
                    ) : (
                        <button onClick={onConfirm} className='px-2 py-2 bg-green-500 text-white rounded-md'>
                            ยืนยัน
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ManagerApproveModal;
