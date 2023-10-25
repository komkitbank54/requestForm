// checkbox.jsx

import React from 'react';

//import css
import '../../css/add.css';
import '../../css/input.css';

export const RadioWithoutInput = ({ fieldName, label, value, setFormData, groupName }) => {
    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [fieldName]: e.target.value }));
    };
    
    return (
        <div>
            <input 
                type="radio" 
                name={groupName}
                value={value}
                onChange={handleChange}
            />
            <label className='ml-1'>{label}</label>
        </div>
    );
};

export const RadioWithInput = ({ fieldName, label, setFormData, groupName }) => {
    const [isChecked, setIsChecked] = React.useState(false);
    const [inputValue, setInputValue] = React.useState(''); // เพิ่ม state สำหรับค่า input
    const radioRef = React.useRef(null);
    
    const handleRadioChange = (e) => {
        setIsChecked(e.target.checked);
        if (e.target.checked) {
            setFormData(prev => ({ ...prev, [fieldName]: '' }));
        }
    };

    const handleInputChange = (e) => {
        setInputValue(e.target.value); // เปลี่ยนค่าของ inputValue state แทน
        setFormData(prev => ({ ...prev, [fieldName]: e.target.value }));
    };
    
    React.useEffect(() => {
        const checkRadioStatus = () => {
            if (radioRef.current && !radioRef.current.checked && isChecked) {
                setIsChecked(false);
                setInputValue(''); // รีเซ็ตค่าของ input
            }
        };

        document.addEventListener('change', checkRadioStatus);
        return () => document.removeEventListener('change', checkRadioStatus);
    }, [isChecked]);

    return (
        <div>
            <input 
                ref={radioRef}
                type="radio" 
                name={groupName}
                onChange={handleRadioChange}
            />
            <label className='ml-1'>{label}</label>
            <input 
                type="text" 
                onChange={handleInputChange} 
                disabled={!isChecked} 
                className='inputfield inputRadioSize' 
                placeholder='ระบุ...'
                value={inputValue} // กำหนดค่าของ input
            />
        </div>
    );
};
