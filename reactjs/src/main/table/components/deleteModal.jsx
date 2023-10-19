// DeleteModal.jsx
import React from 'react';

function DeleteModal({ isOpen, onClose, onConfirm }) {
    if (!isOpen) {
        return null;
    }

    return (
        <div className='fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center'>
            <div className='bg-white p-4 rounded-md'>
                <p>ต้องการที่จะลบข้อมูลไหม?</p>
                <div className='flex justify-end mt-4'>
                    <button onClick={onClose} className='mr-2'>Cancel</button>
                    <button onClick={onConfirm} className='bg-red-500 text-white p-2 rounded'>Delete</button>
                </div>
            </div>
        </div>
    );
}

export default DeleteModal;
