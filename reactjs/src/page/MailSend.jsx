
// SendMail.jsx
import React, { useState, useEffect } from 'react';
import './css/mailtable.css';
import moment from 'moment';
import 'moment/locale/th';

function MailSend() {
    const [data, setData] = useState([]);
    const [selectAll, setSelectAll] = useState(false);

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

    // checkbox เลือก id ของ row นั้นๆ
    const handleCheck = (id) => {
        const newData = data.map(item => {
            if (item.id === id) {
                return {...item, isChecked: !item.isChecked};
            }
            return item;
        });
        setData(newData);
        setSelectAll(newData.every(item => item.isChecked));
    };

    moment.locale('th');
    const currentDate = moment().add(543, 'years').format('DD/MM/YYYY');
    const currentMonth = moment().add(543, 'years').format('MMMM YYYY');

    // Action กดปุ่มยืนยัน (Taximail)
    const handleSendMail = async () => {
        const selectedData = data.filter(item => item.isChecked).map(item => ({
            ename: item.ename,
            email: item.email,
            epdf: item.epdf,
            edate: currentDate,
            emonth: currentMonth,
            attachment: {
                filename: item.epdf,
                path: `http://localhost:8080/pdf/${item.epdf}`
            }
        }));
        try {
            for (const emailDetails of selectedData) {
                await fetch('http://localhost:8080/send_email.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(emailDetails) // Send only emailDetails
                });
            }
            console.log("Emails sent");
        } catch (error) {
            console.error('Error:', error);
        }
    };

      
    // เลือกทั้งหมด
    const handleSelectAll = () => {
        const newSelectAll = !selectAll;
        const newData = data.map(item => ({
            ...item,
            isChecked: newSelectAll
        }));
        setData(newData);
        setSelectAll(newSelectAll);
    };

    return (
        <div className='justify-center'>
            <div className='table'>
                <div className='thead'>
                    <div className='trow'>
                        <div className='thcell'>
                            <input
                                type="checkbox"
                                checked={selectAll}
                                onChange={handleSelectAll}
                            />
                            All
                        </div>
                        <div className='thcell'>ID</div>
                        <div className='thcell'>Code</div>
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
                            <div className='tdcell'>{item.ecode}</div>
                            <div className='tdcell'>{item.ename}</div>
                            <div className='tdcell'>{item.email}</div>
                        </div>
                    ))}
                </div>
            </div>
            <button className='justify-center sendbtn' onClick={handleSendMail}>Send Email</button>
        </div>
    );
}

export default MailSend;
