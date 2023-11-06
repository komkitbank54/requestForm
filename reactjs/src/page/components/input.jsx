// input.jsx
import '../css/input.css'


export const InputField = ({ label, name, value, onChange, placeholder, addClass}) => {
  return (
    <>
      <div className=''>
        {label}
        <div className=''>
            <input
              type="text"
              name={name}
              value={value}
              className={"inputfield "+ addClass}
              onChange={onChange}
              placeholder={placeholder}
            />
        </div>

      </div>
    </>
  );
};

export const InputDisabled = ({ label, name, value, onChange, placeholder, addClass}) => {
  return (
    <>
      <div className=''>
        {label}
        <div className=''>
            <input
              type="text"
              name={name}
              value={value}
              className={"inputfield "+ addClass}
              onChange={onChange}
              placeholder={placeholder}
              disabled
            />
        </div>
      </div>
    </>
  );
};