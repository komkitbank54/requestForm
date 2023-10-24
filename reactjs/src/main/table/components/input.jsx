// input.jsx
import '../../css/input.css'


function InputField({ label, name, value, onChange, placeholder}) {

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
        <label className='pr-3'></label>
      </div>
    </>
  );
}

export default InputField;
