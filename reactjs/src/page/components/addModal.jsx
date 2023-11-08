// addModal.jsx
import React, { useState , useEffect , forwardRef } from 'react';
import { RadioWithoutInput, RadioWithInput } from './checkbox';

import DatePicker from "react-datepicker";
import { InputField } from './input';
import moment from 'moment';
import 'moment/locale/th';

// import css
import '../css/add.css';
import "react-datepicker/dist/react-datepicker.css";

function AddModal({ isOpen, onClose, onConfirm, formData, setFormData }) {
    const [dates, setDates] = useState({
        useDate: formData.useDate || new Date(),
        reqFinishDate: formData.reqFinishDate || new Date(),
        // headDepaDate: formData.headDepaDate || new Date(),
        // headITDate: formData.headITDate || new Date(),
        // auditDate: formData.auditDate || new Date(),
        // refITApproveDate: formData.refITApproveDate || new Date()
    });
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
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
        setFormData(prevState => ({
            ...prevState,
            requestDate: currentDateFormat,
            headDepaDate: currentDateFormat,
            headITDate: currentDateFormat,
            auditDate: currentDateFormat,
            refITApproveDate: currentDateFormat
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

    // Checkbox ที่มี input
    const customRadio = (groupName, fieldName, label) => (
        <RadioWithInput 
            groupName={groupName}
            fieldName={fieldName}
            label={label}
            setFormData={setFormData} />
    );

    // เวลา
    moment.locale('th');
    const currentDateTime = moment().format('DD MMMM YYYY');
    const currentDateFormat = moment().format('YYYY-MM-DD h:mm:ss');
    const CustomInput = forwardRef(({ value, onClick }, ref) => (
        <button className="relative inputfield flex items-center justify-center" onClick={onClick} ref={ref}>
            <div className='absolute left-2'>
                <img src={require('../img/calendar.png')} className='icon' alt="edit" />
            </div>
            <div className='font-semibold'>
                {value}
            </div>
        </button>
    ));
    // Function to handle date changes
    const handleDateChange = (dateKey, dateValue) => {
        setDates(prevDates => ({
            ...prevDates,
            [dateKey]: dateValue
        }));
        const formattedDate = moment(dateValue).format("YYYY-MM-DD");
        setFormData(prevState => ({
            ...prevState,
            [dateKey]: formattedDate,
        }));
    };

    // หน้าต่อไป
    const nextPage = () => {
        setCurrentStep(prev => prev + 1);
    }

    // หน้าก่อน
    const prevPage = () => {
        setCurrentStep(prev => prev - 1);
    }

    return (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center' onClick={handleOutsideClick}>
            <div className='relative bg-white p-4 rounded-md w-[550px] h-[500px]'>
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
                        <header className='font-semibold mt-1'>ส่วนที่ 1 - ข้อมูลผู้ร้องขอ</header>
                            <div className='input-bew'>
                                {defaultInput("ชื่อ", "requestName", "จอร์น")}
                                {defaultInput("นามสกุล", "requestSurname", "สมิธ")}
                            </div>
                            <div className='input-bew'>
                                {defaultInput("ตำแหน่ง", "jobRank", "Manager")}
                                {defaultInput("ฝ่าย", "jobGroup", "IT")}
                            </div>
                            <div className='input-bew'>
                                {defaultInput("เบอร์", "requestPhone", "081 234 5678")}
                                {defaultInput("อีเมลล์", "requestEmail", "example@outlook.co.th")}
                            </div>
                            <div className='input-bew'>
                                <div className=''>
                                    วันที่ต้องการใช้งาน<br/>
                                    <DatePicker
                                        selected={dates.useDate}
                                        onChange={(date) => handleDateChange('useDate', date)}
                                        customInput={<CustomInput />}
                                        dateFormat="dd/MM/yyyy"
                                    />
                                </div>
                                <div>
                                    <div className=''>ขอบข่ายการเปลี่ยนแปลง</div>
                                    <div className="pt-2">
                                        {presetRadio("changeLengh", "changeLengh", "GCAP", "GCAP")}
                                        {customRadio("changeLengh", "changeLengh", "อื่นๆ")}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
                {/* Page 2 */}
                {currentStep === 2 && (
                    <>
                        <div className=''>
                            <header className='font-semibold mt-1'>ส่วนที่ 2 - รายละเอียดการขอเปลี่ยนแปลง</header>
                            <header className='input-bew mt-3'>
                                ประเภทการเปลี่ยนแปลง
                            </header>
                            <div className='flex space-x-[46px]'>
                                {presetRadio("changeType", "changeType", "การเปลี่ยนแปลงแบบปกติ", "ปกติ")}
                                {presetRadio("changeType", "changeType", "การเปลี่ยนแปลงแบบฉุกเฉิน", "ฉุกเฉิน")}
                            </div>
                            <header className='input-bew'>
                                อุปกรณ์ที่จะเปลี่ยนแปลง
                            </header>
                            <div className='flex'>
                                {presetRadio("changeTool", "changeTool", "อุปกรณ์เครือข่าย (Local)", "local")}
                                {presetRadio("changeTool", "changeTool", "อุปกรณ์แม่ข่าย (Server)", "server")}
                            </div>
                            <div className=''>
                                {defaultInput("", "changeToolInfo", "รายละเอียด", "inputLarge")}
                            </div>
                            <div className='flex space-x-6 mt-4'>
                                <span className='flex mb-auto items-center'>
                                    {defaultInput("โปรแกรม / ซอร์สโค้ด", "scodeName", "ชื่อระบบ", "inputScode")}
                                </span>
                                <span className='flex'>
                                    {defaultInput("จากเวอร์ชั่น", "scodeFromVersion", "เก่า", "inputScodeVer")}
                                    {defaultInput("เป็นเวอร์ชั่น", "scodeToVersion", "ใหม่", "inputScodeVer")}
                                </span>
                            </div>
                            <div className='mt-4'>
                                {defaultInput("อื่นๆ เพิ่มเติม", "etc", "ระบุ.....", "inputLarge",)}
                            </div>
                        </div>
                    </>
                )}
                {/* Page 3 */}
                {currentStep === 3 && (
                    <>
                        <div className=''>
                            <header className='font-semibold mt-1'>ส่วนที่ 3 - รายละเอียดการขอเปลี่ยนแปลง</header>
                            <div className='flex space-x-[46px] mt-4'>
                                {defaultInput("สาเหตุที่ต้องเปลี่ยนแปลง", "changeCoz", "( . . ใช้งานไม่ได้ . . )", "inputLarge",)}
                            </div>
                            <div className='flex space-x-[46px] mt-4'>
                                {defaultInput("โครงงานที่เกี่ยวข้อง (ถ้ามี)", "researchRel", "ชื่อโครงงาน")}
                                {defaultInput("อ้างอิง", "researchRef", "เอกสารใบคำร้อง")}
                            </div>
                            <div className='flex space-x-[46px] mt-4'>
                                {defaultInput("ความเสี่ยงและผลกระทบที่อาจเกิดจากการเปลี่ยนแปลง", "changeEff", "( . . ไฟดับ . . )", "inputLarge",)}
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
                    {currentStep < 3     ? (
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

export default AddModal;
