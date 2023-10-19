// table.jsx
import React, { useEffect, useState } from 'react';
import '../css/table.css';
import '../fonts/fonts.css';
import DeleteModal from './components/deleteModal';
import Pagination from './components/pagination';

function Table({ data = [], resetPagination, setData }) {

    const ITEMS_PER_PAGE = 10;

    // Page
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
    const currentItems = data.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    useEffect(() => {
        setCurrentPage(1);
    }, [resetPagination]);

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
    };

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(prev => prev - 1);
    };

    const handlePageClick = (pageNum) => {
        setCurrentPage(pageNum);
    };


    // Delete
    const [showModal, setShowModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    const handleDeleteClick = (item) => {
        setItemToDelete(item);
        setShowModal(true);
    };

    const handleConfirmDelete = () => {
        fetch(`http://localhost:3000/delete?id=${itemToDelete.id}`, { method: 'DELETE' })
        .then(response => {
            if (response.ok) {
                setShowModal(false);
                setData(prevData => prevData.filter(i => i.id !== itemToDelete.id));
            } else {
                console.error('Failed to delete item.');
            }
        });
    };

    return (
        <div className="table">
            {/* Table Header */}
            <div className="tableHeader">
                <div className="tableHRow">
                    {['ชื่อผู้ร้องขอ', 'ตำแหน่ง', 'ฝ่ายงาน', 'วันที่ขอใช้งาน', 'สถานะ'].map(header => <div className="tableCell" key={header}>{header}</div>)}
                    <div className='tableCell flex justify-center'>
                        <botton className="flex px-2 rounded-lg">
                            <img src={require('../img/add.png')} className='h-[22px] w-[22px]' alt="add" />
                            <label className='pl-1'>Add</label>
                        </botton>
                    </div>
                </div>
            </div>

            {/* Table Body */}
            <div className="tableBody shadow-lg">
                {currentItems.map(item => (
                    <div className="tableRow" key={item.id}>
                        <div className="tableBodyCell">{item.requestName} {item.requestSurname}</div>
                        <div className="tableBodyCell">{item.jobRank}</div>
                        <div className="tableBodyCell">{item.jobGroup}</div>
                        <div className="tableBodyCell">{item.useDate}</div>
                        <div className="tableBodyCell">{item.headDepaApprove}</div>
                        <div className="tableBodyCell flex justify-center space-x-6">
                            <img src={require('../img/pdf.png')} className='icon' alt="pdf" />
                            <img src={require('../img/edit.png')} className='icon' alt="edit" />
                            <botton className="cursor-pointer icon hover:shadow-lg hover:rounded-lg" onClick={() => handleDeleteClick(item)}>
                              <img src={require('../img/bin.png')} className='' alt="delete" />
                            </botton>
                        </div>
                    </div>
                ))}
            </div>

            {/* Table Footer */}
            <div className='tableFooter'>
                <Pagination 
                    currentPage={currentPage} 
                    totalPages={totalPages} 
                    handlePrevPage={handlePrevPage}
                    handleNextPage={handleNextPage}
                    handlePageClick={handlePageClick}
                />
            </div>

            <DeleteModal isOpen={showModal} onClose={() => setShowModal(false)} onConfirm={handleConfirmDelete} />
        </div>
    );
}

export default Table;
