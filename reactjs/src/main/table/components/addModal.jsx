// addModal.jsx
import React, { useState , useEffect , forwardRef } from 'react';
import { RadioWithoutInput, RadioWithInput } from './checkbox';

import DatePicker from "react-datepicker";
import InputField from './input';
import moment from 'moment';
import 'moment/locale/th';

// import css
import '../../css/add.css';
import "react-datepicker/dist/react-datepicker.css";

function AddModal({ isOpen, onClose, onConfirm, formData, setFormData }) {
    const [startDate, setStartDate] = useState(formData.useDate || new Date());
    const [currentStep, setCurrentStep] = useState(1);

    
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

    // คลิกข้างนอกเพื่อออก
    const handleOutsideClick = (event) => {
        if (event.target === event.currentTarget) {
            onClose();
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
            setFormData={setFormData} />
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
    moment.locale('th'); // <--- เวลาตามประเทศ
    const currentDateTime = moment().format('DD MMMM YYYY');

    const ExampleCustomInput = forwardRef(({ value, onClick }, ref) => (
        <button className="inputfield" onClick={onClick} ref={ref}>
            {value}
        </button>
    ));

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
                <button className='absolute top-3 right-4' onClick={onClose}>X</button>
                <div className="flex justify-between font-bold text-[20px]">
                    <p>แบบฟอร์มร้องขอการเปลี่ยนแปลง</p>
                    <p className="mr-5">{currentDateTime}</p>
                </div>
                {/* Step 1 */}
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
                                        showIcon
                                        selected={startDate}
                                        onChange={(date) => {
                                            setStartDate(date);
                                            const formattedDate = moment(date).format("DD/MM/YYYY");
                                            setFormData(prevState => ({
                                                ...prevState,
                                                useDate: formattedDate,
                                            }));
                                        }}
                                        customInput={<ExampleCustomInput />}
                                        dateFormat="dd/MM/yyyy"
                                    />
                                </div>
                                <div>
                                    <div className=''>ขอบข่ายการเปลี่ยนแปลง</div>
                                    <div className="pt-2">
                                        {presetRadio("changeLengh", "changeLengh", "GCAP", "GCAP")}
                                        {customRadio("changeLengh", "changeLengh", "อื่นๆ")}
                                        {/* <RadioWithoutInput 
                                            groupName="group1"
                                            fieldName="changeLengh"
                                            label="GCAP"
                                            value="GCAP"
                                            setFormData={setFormData} />
                                        <RadioWithInput 
                                            groupName="group1"
                                            fieldName="changeLengh"
                                            label="อื่นๆ"
                                            setFormData={setFormData} /> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
                {/* Step 2 */}
                {currentStep === 2 && (
                    <>
                        <div className=''>
                            <header className='font-semibold mt-1'>ส่วนที่ 2 - รายละเอียดการขอเปลี่ยนแปลง</header>
                            <header className='input-bew mt-3'>
                                ประเภทการเปลี่ยนแปลง
                            </header>
                            <div className='flex space-x-[46px]'>
                                {presetRadio("changeType", "changeType", "การเปลี่ยนแปลงแบบปกติ", "normal")}
                                {presetRadio("changeType", "changeType", "การเปลี่ยนแปลงแบบฉุกเฉิน", "urgency")}
                            </div>
                            <header className='input-bew'>
                                อุปกรณ์ที่จะเปลี่ยนแปลง
                            </header>
                            <div className='flex'>
                                {presetRadio("changeTool", "changeTool", "อุปกรณ์เครือข่าย", "local")}
                                {presetRadio("changeTool", "changeTool", "อุปกรณ์แม่ข่าย", "server")}
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
                {/* Footer */}
                    {currentStep === 1 && (
                        <button onClick={nextPage} className='absolute bottom-2 right-2 px-3 py-2 bg-blue-500 text-white rounded-md'>
                            ต่อไป
                        </button>
                    )}
                    {currentStep === 2 && (
                        <>
                            <div className='absolute bottom-2 right-2 flex space-x-1'>
                                <button onClick={prevPage} className=' px-2 py-2 bg-blue-500 text-white rounded-md'>
                                    ย้อนกลับ
                                </button>
                                <button onClick={onConfirm} className='px-2 py-2 bg-green-500 text-white rounded-md'>
                                    ยืนยัน
                                </button>
                            </div>
                        </>
                    )}
            </div>
        </div>
    );
}

export default AddModal;
