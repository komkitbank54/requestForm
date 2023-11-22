// components/MailModal.jsx
import React from 'react';

export default function MailSend({ isOpen, onClose, formData }) {

    //การส่งอีเมลล์ จะใช้ backend 2 ฝั่งคือฝั่ง nodejs(port 3000) กับ php(port 8080)
    //ใช้งาน Nodejs สำหรับเข้าฐานข้อมูลเพื่อ generate token และอัพเดตข้อมูลต่างๆลงในตาราง
    //หลังจากอัพเดตข้อมูลเสร็จจะใช้ PHP ในการส่งอีเมลล์ออก
    const handleSendMail = async () => {
        try {
            const recipients = [
                // aprf คือ approveField ชื่อฟิลว์ใน table . ปัจจุบันส่งได้ 2ฟิลว์ คือ ref1Approve, ref2Approve
                // ถ้าต้องการส่งมากกว่านี้ต้องเพิ่มฟิลว์ใน table ก่อน
                { refName: 'Tester Name', refMail: 'bank16211@gmail.com', aprf: 'ref1Approve'},
                { refName: 'Tester2 Name2', refMail: 'gcapit0001@gmail.com', aprf: 'ref2Approve'}
            ];

            // ส่งคำขอเพื่อสร้าง token และอัพเดตฐานข้อมูล   
            // Loop through each recipient to send an email
            for (const recipient of recipients) {
                const tokenResponse = await fetch('http://localhost:3000/gentoken', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ id: formData.id, emailAddress: formData.email, aprf: recipient.aprf }) // ตัวอย่าง
                });
                const tokenResult = await tokenResponse.json();
        
                if (!tokenResponse.ok) {
                    throw new Error(`HTTP error! Status: ${tokenResponse.status}`);
                }
        
                // สร้าง Confirmation Link
                const confirmationLink = tokenResult.confirmationLink;

                const emailDetails = {
                    refName: recipient.refName,
                    refMail: recipient.refMail,
                    aid: formData.id,  // The ID of the item
                    genlink: confirmationLink,
                    aprf: recipient.aprf
                };
                
                // ส่งอีเมลด้วย API PHP
                const mailResponse = await fetch('http://localhost:8080/approve_mail.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(emailDetails)
                });
    
                if (!mailResponse.ok) {
                    throw new Error(`HTTP error! Status: ${mailResponse.status}`);
                }
            }
    
            console.log("Emails sent!");
            onClose();
        } catch (error) {
            console.error('Error:', error);
        }
    };
    

    if (!isOpen) {
        return null;
    }

    return (
        <div className='overlay'>
            <div className='login-modal'>
                <p>ยืนยันที่จะส่งอีเมลล์ไหม?</p>
                <div className='flex justify-end mt-4'>
                    <button onClick={onClose} className='mr-2'>Cancel</button>
                    <button onClick={handleSendMail} className='bg-green-500 text-white p-2 rounded'>ยืนยัน</button>
                </div>
            </div>
        </div>
    );
};
