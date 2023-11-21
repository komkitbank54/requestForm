// DeleteModal.jsx
import React from 'react';

function MailSend({ isOpen, onClose, onConfirm }) {
    if (!isOpen) {
        return null;
    }

    return (
        <div className='overlay'>
            <div className='login-modal'>
                <p>ยืนยันที่จะส่งอีเมลล์ไหม?</p>
                <div className='flex justify-end mt-4'>
                    <button onClick={onClose} className='mr-2'>Cancel</button>
                    <button onClick={onConfirm} className='bg-green-500 text-white p-2 rounded'>ยืนยัน</button>
                </div>
            </div>
        </div>
    );
}

export default MailSend;
