import React, { useState, useEffect } from 'react';
import './css/mailtable.css';

function MailSend() {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3000/showmail')
        .then(response => response.json())
        .then(fetchedData => {
            const updatedData = fetchedData.map(item => ({
                ...item,
                isChecked: false
            }));
            setData(updatedData);
        })
        .catch(err => console.error('Error fetching data:', err));
    }, []);

    const handleCheck = (id) => {
        const newData = data.map(item => {
            if (item.id === id) {
                return {...item, isChecked: !item.isChecked};
            }
            return item;
        });
        setData(newData);
    };

    const handleAlert = () => {
        const selectedIds = data.filter(item => item.isChecked).map(item => item.id);
        alert("Selected IDs: " + selectedIds.join(", "));
    };

    return (
        <div className='justify-center'>
            <div className='table'>
                <div className='thead'>
                    <div className='trow'>
                        <div className='thcell'>Check</div>
                        <div className='thcell'>ID</div>
                        <div className='thcell'>Name</div>
                        <div className='thcell'>Email</div>
                    </div>
                </div>
                <div className='tbody'>
                    {data.map((item, index) => (
                        <div className='trow' key={index}>
                            <div className='tdcell'>
                                <input
                                    type="checkbox"
                                    checked={item.isChecked}
                                    onChange={() => handleCheck(item.id)}
                                />
                            </div>
                            <div className='tdcell'>{item.id}</div>
                            <div className='tdcell'>{item.ename}</div>
                            <div className='tdcell'>{item.email}</div>
                        </div>
                    ))}
                </div>
            </div>
            <button onClick={handleAlert}>Show Selected IDs</button>
        </div>
    );
}

export default MailSend;
