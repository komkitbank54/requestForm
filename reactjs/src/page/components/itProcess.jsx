
// itProcess.jsx
import React, { useState , useEffect , forwardRef } from 'react';
import { RadioWithoutInput, RadioWithInput } from './checkbox';

import DatePicker from "react-datepicker";
import { InputField, InputDisabled } from './input';
import moment from 'moment';
import 'moment/locale/th';

// import css
import '../css/add.css';
import "react-datepicker/dist/react-datepicker.css";

function ItProcessModal({ isOpen, onClose, onConfirm, formData, setFormData }) {
    const [dates, setDates] = useState({
        reqFinishDate: formData.reqFinishDate || new Date(),
        headDepaDate: formData.headDepaDate || new Date(),
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
        const firstName = localStorage.getItem('firstname');
        const lastName = localStorage.getItem('surname');
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
            headDepaDate: currentDateFormat,
            manaName: `${firstName} ${lastName}`,
            headDepaName: `${firstName} ${lastName}`
            
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
    const currentDateFormat = moment().format('YYYY-MM-DD');
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
                            <header className='font-semibold mt-1'>ส่วนที่ 2 - รายละเอียดการขอเปลี่ยนแปลง</header>
                            <div className='input-bew'>
                                <div>
                                    {manageInput("ชื่อผู้ดำเนินการ", "manaName")}
                                </div>
                                <div className=''>
                                    {defaultInput("ชื่อผู้ช่วยดำเนินการ", "mana2Name", "( . . ถ้ามี . . )")}
                                </div>
                            </div>
                            <div className='mt-4'>
                                วันที่คาดว่าจะดำเนินการ<br/>
                                <DatePicker
                                    selected={dates.reqFinishDate}
                                    onChange={(date) => handleDateChange('reqFinishDate', date)}
                                    customInput={<CustomInput />}
                                    dateFormat="dd/MM/yyyy"
                                />
                            </div>
                            <div className='mt-4'>
                                {defaultInput("แผนการเปลี่ยนแปลง", "implementPlan", "", "inputLarge")}
                            </div>
                            <div className='mt-4'>
                                <header>การทดสอบก่อนดำเนินการเปลี่ยนแปลง</header>
                                <div className='flex'>
                                    {presetRadio("changeTest", "changeTest", "มี", "1")}
                                    {presetRadio("changeTest", "changeTest", "ไม่มี", "2")}
                                </div>
                                {defaultInput("", "testInfo", "ข้อมูลเพิ่มเติม", "inputLarge",)}
                            </div>
                        </div>
                    </>
                )}
                {/* Page 5 */}
                {currentStep === 2 && (
                    <>
                        <header className='font-semibold mt-1'>ส่วนที่ 2 - รายละเอียดการขอเปลี่ยนแปลง</header>
                        <div className='mt-4'>
                            {defaultInput("ขั้นตอนการนำระบบกลับคืน(Rollback Plan) ในกรณีที่การเปลี่ยนแปลงไม่สำเร็จ", "rollbackPlan", "รายละเอียดอ้างอิง", "inputLarge",)}
                        </div>
                        <div className="mt-4">
                            <header>
                                ช่องทางสื่อสารถึงผู้ใช้ระบบ
                            </header>
                            <div className='flex items-center'>
                                {presetRadio("userContact", "userContact", "Email", "email")}
                                {presetRadio("userContact", "userContact", "Internet", "internet")}
                                {presetRadio("userContact", "userContact", "โทรศัพท์", "phone")}
                                {presetRadio("userContact", "userContact", "Fax", "fax")}
                                {customRadio("userContact", "userContact", "อื่นๆ")}
                            </div>
                        </div>
                        <div className='mt-4'>
                                <header>
                                    หัวหน้าส่วนงาน
                                </header>
                                <div className='flex space-x-2'>
                                    {manageInput("", "headDepaName")}
                                    <button className="relative inputfield flex items-center justify-center" disabled>
                                        <div className='absolute left-2'>
                                            <img src={require('../img/calendar.png')} className='icon' alt="calendar" />
                                        </div>
                                        <div className='font-semibold'>
                                            {currentDateTime}
                                        </div>
                                    </button>
                                </div>
                                <div className='mt-2 flex items-center'>
                                    {presetRadio("headDepaApprove", "headDepaApprove", "อนุมัติ", "Approve")}
                                    {presetRadio("headDepaApprove", "headDepaApprove", "ไม่อนุมัติ", "Deny")}
                                    {defaultInput("", "headDepaComment", "เหตุผล",)}
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
                    {currentStep < 2 ? (
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

export default ItProcessModal;
