// DeleteModal.jsx
import React from 'react';

export default function DeleteModal({ item, isOpen, onClose, onDataDeleted }) {
    const handleConfirmDelete = () => {
        fetch(`http://localhost:3000/delete?id=${item.id}`, { method: 'DELETE' })
        .then(response => {
            if (response.ok) {
                onDataDeleted(item.id);
                onClose();
            } else {
                console.error('Failed to delete item.');
            }
        })
        .catch(err => console.error('Error:', err));
    };

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
                    <button onClick={handleConfirmDelete} className='bg-red-500 text-white p-2 rounded'>Delete</button>
                </div>
            </div>
        </div>
    );
}
