// input.jsx
import React, { useRef } from 'react';
import '../../css/input.css'


function InputField({ label, name, value, onChange, placeholder}) {
    const spanRef = useRef(null);

  return (
    <>
      <div className=''>
        {label}
        <div className=''>
            <input
              type="text"
              name={name}
              value={value}
              className="inputfield"
              onChange={onChange}
              placeholder={placeholder}
            />
        </div>
        <span ref={spanRef} style={{ visibility: 'hidden', position: 'absolute', top: '-9999px' }}>{value}</span>
        <label className='pr-3'></label>
      </div>
    </>
  );
}

export default InputField;
