// AddModal.jsx
import DatePicker from "react-datepicker";
import React, { useState, forwardRef } from 'react';  // Import useState
import InputField from './input';
import moment from 'moment';
import 'moment/locale/th';


// import css
import '../../css/input.css';
import "react-datepicker/dist/react-datepicker.css";

function AddModal({ isOpen, onClose, onConfirm, formData, setFormData }) {
    const [startDate, setStartDate] = useState(formData.useDate || new Date()); // เลือกวันที่
    const [selectedOption, setSelectedOption] = useState(formData.changeLengh || '');  // value = 'gcap' or 'etc'
    const [etcValue, setEtcValue] = useState('');

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

    // input วันที่
    const ExampleCustomInput = forwardRef(({ value, onClick }, ref) => (
      <button className="inputfield" onClick={onClick} ref={ref}>
        {value}
      </button>
    ));

    // Checkbox
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

    return (
        <div className='fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center'>
            <div className='bg-white p-4 rounded-md'>
                <div className="flex justify-between font-bold text-[18px]">
                    <p>กรอกข้อมูล</p>
                    <p className="">{currentDateTime}</p>
                </div>
                {/* input */}
                <div className='flex space-x-4 pt-5'>
                    {defaultInput( "ชื่อ", "requestName", "จอร์น" )}
                    {defaultInput( "นามสกุล", "requestSurname", "สมิธ" )}
                </div>
                <div className='flex space-x-4'>
                    {defaultInput( "ตำแหน่ง", "jobRank", "Manager" )}
                    {defaultInput( "ฝ่าย", "jobGroup", "IT" )}
                </div>
                <div className='flex space-x-4'>
                    {defaultInput( "เบอร์", "requestPhone", "081 234 5678" )}
                    {defaultInput( "อีเมลล์", "requestEmail", "example@outlook.co.th" )}
                </div>
                <div className='flex space-x-4'>
                    {/* เลือกวันที่ */}
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
                    {/* checkbox gcap/etc */}
                    <div>
                        <div>
                            ขอบข่ายการเปลี่ยนแปลง
                        </div>
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
                            {selectedOption !== 'gcap' && (
                                <input
                                    type="text"
                                    className="inputfield input-ect"
                                    placeholder="เพิ่มเติม"
                                    value={etcValue}
                                    onChange={(e) => {
                                        setEtcValue(e.target.value);
                                        setFormData(prevState => ({
                                            ...prevState,
                                            changeLengh: e.target.value,
                                        }));
                                    }}
                                />
                            )}
                        </div>
                    </div>
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