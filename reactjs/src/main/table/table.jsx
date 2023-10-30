// table.jsx

import React, { useEffect, useState } from 'react';
import DeleteModal from './components/deleteModal';
import Pagination from './components/pagination';
import AddModal from './components/addModal';
import moment from 'moment';

//Import css
import '../css/table.css';
import '../fonts/fonts.css';

function Table({resetPagination}) {
    const [data, setData] = useState([]);
    //fetch data
    useEffect(() => {
      fetch('http://localhost:3000/show')
        .then(response => response.json())
        .then(data => setData(data))
        .catch(err => console.error('Error fetching data:', err));
    }, []);

    // value
    const [formData, setFormData] = useState({
        requestDate: '',
        requestName: '',
        requestSurname: '',
        jobRank: '',
        jobGroup: '',
        requestPhone: '',
        requestEmail: '',
        useDate: '',
        changeLengh: '',
        changeType: '',
        changeTool: '',
        changeToolInfo: '',
        scodeName: '',
        scodeFromVersion: '',
        scodeToVersion: '',
        etc: ''
      });

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


    // Approve
    const handleApproveClick = (item) => {
        let approveValue = item.headDepaApprove === 'Approved' ? 'Unapproved' : 'Approved';
        fetch('http://localhost:3000/approve', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: item.id,
                headDepaApprove: approveValue,
            }),
        })
        .then(response => response.json())
        .then(result => {
            if (result.message === 'Record updated successfully!') {
                setData(prevData => prevData.map(i => i.id === item.id ? { ...i, headDepaApprove: approveValue } : i));
            } else {
                console.error('Failed to approve item.', result.message);
            }
        })
        .catch(err => console.error('Error:', err));
    };

    // Add
    const [showAddModal, setShowAddModal] = useState(false);

    const handleAddClick = (item) => {
        setShowAddModal(true);
    };
    const handleConfirmAdd = () => {
        fetch('http://localhost:3000/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
        .then(response => response.json())
        .then(result => {
            if (result.message === 'Record added successfully!') {
                setData(prevData => [...prevData, formData]);
                setShowAddModal(false);
            } else {
                console.error('Failed to add record.', result.message);
            }
        })
        .catch(err => console.error('Error:', err));
    }

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
                        <button className="cursor-pointer flex px-2 rounded-lg" onClick={() => handleAddClick()}>
                            <img src={require('../img/add.png')} className='h-[22px] w-[22px]' alt="add" />
                            <label className='pl-1'>Add</label>
                        </button>
                    </div>
                </div>
            </div>

            {/* Table Body */}
            <div className="tableBody shadow-lg">
                {currentItems.map(item => (
                    <div className="tableRow" key={item.id}>
                        {/* {item.id} */}
                        <div className="tableBodyCell">{item.requestName} {item.requestSurname}</div>
                        <div className="tableBodyCell">{item.jobRank}</div>
                        <div className="tableBodyCell">{item.jobGroup}</div>
                        <div className="tableBodyCell">{moment(item.useDate).format('DD/MM/YYYY')}</div>
                        <div className="tableBodyCell flex justify-center">
                            <button className="cursor-pointer icon" onClick={() => handleApproveClick(item)}>
                              <img src={require(item.headDepaApprove === 'Approved' ? '../img/approved.png' :'../img/unapproved.png')} className='' 
                                alt={item.headDepaApprove === 'Approved' ? 'Approved' : 'Unapproved'} />
                            </button>
                            {item.headDepaApprove}
                        </div>
                        <div className="tableBodyCell flex justify-center space-x-6">
                            <img src={require('../img/pdf.png')} className='icon' alt="pdf" />
                            <img src={require('../img/edit.png')} className='icon' alt="edit" />
                            <button className="cursor-pointer icon hover:shadow-lg hover:rounded-lg" onClick={() => handleDeleteClick(item)}>
                              <img src={require('../img/bin.png')} className='icon' alt="delete" />
                            </button>
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
            <AddModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} onConfirm={handleConfirmAdd} formData={formData} setFormData={setFormData}/>
            <DeleteModal isOpen={showModal} onClose={() => setShowModal(false)} onConfirm={handleConfirmDelete} />
        </div>
    );
}

export default Table;
