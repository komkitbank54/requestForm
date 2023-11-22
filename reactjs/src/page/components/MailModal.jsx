// components/MailModal.jsx
import React, { useState } from 'react';

export default function MailSend({ isOpen, onClose, formData }) {
    const [isSending, setIsSending] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(false);

    //การส่งอีเมลล์ จะใช้ backend 2 ฝั่งคือฝั่ง nodejs(port 3000) กับ php(port 8080)
    //ใช้งาน Nodejs สำหรับเข้าฐานข้อมูลเพื่อ generate token และอัพเดตข้อมูลต่างๆลงในตาราง
    //หลังจากอัพเดตข้อมูลเสร็จจะใช้ PHP ในการส่งอีเมลล์ออก
    const handleSendMail = async () => {
        setIsSending(true);
        setButtonDisabled(true);
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
                    genlink: confirmationLink,
                    aprf: recipient.aprf,
                    aid: formData.id, // The ID of the item
                    requestName: formData.requestName,
                    requestDate: formData.requestDate,
                    changeLengh: formData.changeLengh,
                    jobGroup: formData.jobGroup,
                    jobRank: formData.jobRank,
                    requestPhone: formData.requestPhone,
                    requestMail: formData.requestMail,
                    changeTool: formData.changeTool,
                    changeToolInfo: formData.changeToolInfo,
                    scodeName: formData.scodeName,
                    scodeFromVersion: formData.scodeFromVersion,
                    scodeToVersion: formData.scodeToVersion,
                    changeCoz: formData.changeCoz,
                    changeEff: formData.changeEff,
                    manaName: formData.manaName,
                    reqFinishDate: formData.reqFinishDate,
                    implementPlan: formData.implementPlan,
                    testInfo: formData.testInfo,
                    rollbackPlan: formData.rollbackPlan,
                    headITName: formData.headITName,
                    headITEsti: formData.headITEsti,
                    headITEstiComment: formData.headITEstiComment,
                    auditName: formData.auditName,
                    auditComment: formData.auditComment,
                    timeshow: formData.timeshow
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
        onClose(); // Close modal after sending email

        // Re-enable the button after 30 seconds
        setTimeout(() => {
            setButtonDisabled(false);
            setIsSending(false);
        }, 30000); // 30 seconds (Milli Second)
    };
    

    if (!isOpen) {
        return null;
    }

    return (
        <div className='overlay'>
            <div className='login-modal'>
                <header>
                    <p className='text-[22px] font-bold'>ยืนยันที่จะส่งอีเมลล์ขออนุมัติไหม?</p>
                </header>
                <div className='mt-4 text-[18px]'>
                    ส่งเมลล์ให้กรรมการ ดังต่อไปนี้
                </div>
                <div className='mt-2'>
                    1) <input type="text" name='ref1' value='พี่เก่ง' className='inputfield' disabled/>
                    <input type="text" name='ref1' value='test@gmail.com' className='inputfield' disabled/>
                </div>
                <div className='mt-1'>
                    2) <input type="text" name='ref1' value='พี่นนท์' className='inputfield' disabled/>
                    <input type="text" name='ref1' value='test2@gmail.com' className='inputfield' disabled/>
                </div>
                <p className='mt-6 text-end text-red-500 text-[15px]'>*โปรดระวังการส่งอีเมลล์ซ้ำ</p>
                <div className='flex justify-end'>
                    <button onClick={onClose} className='mr-2'>Cancel</button>
                    <button 
                        onClick={handleSendMail} 
                        className='bg-green-500 text-white p-2 rounded disabled:bg-green-800'
                        disabled={buttonDisabled}>
                        {isSending ? 'กำลังส่ง...' : 'ยืนยัน'}
                    </button>
                </div>
            </div>
        </div>
    );
};
