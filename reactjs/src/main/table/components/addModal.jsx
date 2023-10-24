import React, { useState , useEffect , forwardRef } from 'react';
import DatePicker from "react-datepicker";
import InputField from './input';
import moment from 'moment';
import 'moment/locale/th';

// import css
import '../../css/add.css';
import "react-datepicker/dist/react-datepicker.css";

function AddModal({ isOpen, onClose, onConfirm, formData, setFormData }) {
    const [startDate, setStartDate] = useState(formData.useDate || new Date());
    const [selectedOption, setSelectedOption] = useState(formData.changeLengh || '');
    const [etcValue, setEtcValue] = useState('');
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
    const defaultInput = (label, name, placeholder) => (
        <InputField 
            label={label} 
            name={name} 
            value={formData[name]}
            placeholder={placeholder}
            onChange={handleChange}
        />
    );

    // เวลา
    moment.locale('th'); // <--- เวลาตามประเทศ
    const currentDateTime = moment().format('DD MMMM YYYY');

    const ExampleCustomInput = forwardRef(({ value, onClick }, ref) => (
        <button className="inputfield" onClick={onClick} ref={ref}>
            {value}
        </button>
    ));

    // เช็ค value gcap / etc.
    const handleOptionChange = (e) => {
        setSelectedOption(e.target.value);
        if (e.target.value === 'gcap') {
            setEtcValue('');
            setFormData(prevState => ({
                ...prevState,
                changeLengh: 'gcap',
            }));
        } else {
            setFormData(prevState => ({
                ...prevState,
                changeLengh: etcValue,
            }));
        }
    }

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
                    <p>กรอกข้อมูล</p>
                    <p className="mr-5">{currentDateTime}</p>
                </div>
                {/* Step 1 */}
                {currentStep === 1 && (
                    <>
                    <div className=''>
                        <label className='font-semibold'>Step 1 - ข้อมูลผู้ร้องขอ</label>
                            <div className='input-bew space-x-4 mt-3'>
                                {defaultInput("ชื่อ", "requestName", "จอร์น")}
                                {defaultInput("นามสกุล", "requestSurname", "สมิธ")}
                            </div>
                            <div className='input-bew space-x-4'>
                                {defaultInput("ตำแหน่ง", "jobRank", "Manager")}
                                {defaultInput("ฝ่าย", "jobGroup", "IT")}
                            </div>
                            <div className='input-bew space-x-4'>
                                {defaultInput("เบอร์", "requestPhone", "081 234 5678")}
                                {defaultInput("อีเมลล์", "requestEmail", "example@outlook.co.th")}
                            </div>
                            <div className='input-bew space-x-4'>
                            <div>
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
                                <div>ขอบข่ายการเปลี่ยนแปลง</div>
                                <div className="pt-2">
                                    <label>
                                        <input
                                            type="radio"
                                            value="gcap"
                                            checked={selectedOption === 'gcap'}
                                            onChange={handleOptionChange}
                                        />
                                        GCAP
                                    </label>
                                    <label>
                                        <input
                                            type="radio"
                                            value={etcValue}
                                            checked={selectedOption !== 'gcap'}
                                            onChange={handleOptionChange}
                                        />
                                        อื่นๆ
                                    </label>
                                    {selectedOption !== 'gcap' ? (
                                        <input
                                            type="text"
                                            className="inputfield input-ect"
                                            placeholder="ระบุ..."
                                            value={etcValue}
                                            onChange={(e) => {
                                                setEtcValue(e.target.value);
                                                setFormData(prevState => ({
                                                    ...prevState,
                                                    changeLengh: e.target.value,
                                                }));
                                            }}
                                        />
                                    ):
                                        <input
                                            type="text"
                                            className="inputfield input-ect"
                                            placeholder="ระบุ..."
                                            disabled
                                        />
                                    }
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
                            <label className='font-semibold'>Step 2 - รายละเอียดการขอเปลี่ยนแปลง</label>
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
