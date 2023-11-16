import React, { useState, useEffect } from 'react';
import './css/mailtable.css';
import axios from 'axios';

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

    // Action กดปุ่มยืนยัน (Taximail)
    const handleSendMail = () => {
        const selectedData = data.filter(item => item.isChecked).map(item => {
          return {
            email: item.email,
            ename: item.ename,
            templateKey: '178746555923d0bc71', // แทนที่ด้วย Template Key ของคุณ
            // ... ข้อมูลอื่นๆ ที่จำเป็น
          };
        });
      
        axios.post('http://localhost:3000/sendmail', selectedData)
          .then(response => {
            console.log('Emails sent:', response);
          })
          .catch(error => {
            console.error('Error sending emails:', error);
          });
      };
      
    // Action กดปุ่มยืนยัน (MailerSend)
    // const handleSendMail = () => {
    //     const selectedRecipients = data.filter(item => item.isChecked).map(item => item.email);
    //     const selectedItems = data.filter(item => item.isChecked);
    //     const selectedEmails = selectedItems.map(item => item.email);
    //     const pdfFiles = selectedItems.map(item => item.epdf);
      
    //     if (selectedRecipients.length === 0) {
    //       alert("No recipients selected");
    //       return;
    //     }
      
    //     fetch('http://localhost:3000/sendmail', {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json',
    //       },
    //       body: JSON.stringify({
    //         emails: selectedEmails,
    //         pdfs: pdfFiles,
    //         recipients: selectedRecipients,
    //         subject: "This is a Subject",
    //         htmlContent: "<strong>This is the HTML content</strong>",
    //         textContent: "This is the text content"
    //       }),
    //     })
    //     .then(response => response.json())
    //     .then(data => {
    //       alert(data.message);
    //     })
    //     .catch(err => {
    //       console.error('Error sending email:', err);
    //       alert('Failed to send email');
    //     });
    //   };

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
