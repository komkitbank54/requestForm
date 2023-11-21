// DeleteModal.jsx
import React from 'react';

export default function DeleteModal({ isOpen, onClose, onConfirm }) {
    if (!isOpen) {
        return null;
    }

    return (
        <div className='overlay'>
            <div className='login-modal'>
                <p className='text-[22px] font-bold'>ยืนยันที่จะลบข้อมูลไหม?</p>
                <label className='text-red-500 text-[15px]'>*ข้อมูลที่ลบจะไม่สามารถกู้คืนได้</label>
                <div className='flex justify-end mt-4'>
                    <button onClick={onClose} className='mr-2'>Cancel</button>
                    <button onClick={onConfirm} className='bg-red-500 text-white p-2 rounded'>Delete</button>
                </div>
            </div>
        </div>
    );
};