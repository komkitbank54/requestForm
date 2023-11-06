//ITPage.js

import React, { useEffect, useState } from 'react';
import DeleteModal from './components/deleteModal';
import Pagination from './components/pagination';
import AddModal from './components/addModal';
import ItProcessModal from './components/itProcess';
import moment from 'moment';

//Import css
import './css/table.css';
import './fonts/fonts.css';

function ManagerPage({resetPagination}) {
    const [data, setData] = useState([]);
    //Show fetch data
    useEffect(() => {
      fetch('http://localhost:3000/show')
        .then(response => response.json())
        .then(data => setData(data))
        .catch(err => console.error('Error fetching data:', err));
    }, []);

    const [formData, setFormData] = useState({
        manaName: '',
        manaRank: '',
        mana2Name: '',
        mana2Rank: '',
        reqFinishDate: '',
        implementPlan: '',
        changeTest: '',
        testInfo: '',
        rollbackPlan: '',
        userContact: '',
        headDepaName: '',
        headDepaComment: '',
        headDepaDate: '',
        approveStatus: ''
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
        let approveValue = item.headDepaApprove === 'Approved' ? 'Denied' : 'Approved';
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

    // It Process
    const [showITModal, setShowITModal] = useState(false);

    const handleITClick = (item) => {
        setFormData(item);
        setShowITModal(true);
    };

    const handleConfirmIT = () => {
        fetch('http://localhost:3000/itprocess', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
        .then(response => response.json())
        .then(result => {
            if (result.message === 'Record updated successfully!') {
                // Update the data state with the new edited data
                setData(prevData => prevData.map(i => i.id === formData.id ? formData : i));
                setShowITModal(false);
            } else {
                console.error('Failed to edit record.', result.message);
            }
        })
        .catch(err => console.error('Error:', err));
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
        <>
        <div className='flex justify-between shadow-lg bg-[#0e235c] text-[#f1c40f]'>
            <header className='m-4 font-bold text-[28px]'>
                การร้องขอการเปลี่ยนแปลง (IT)
            </header>
            {/* <img src={require('./img/user.png')} alt='user' className='items-center h-[76px]'/> */}
        </div>
        <div className='flex my-8 relative'>
            <div className='bg-green-500  p-3 shadow-lg m-4 w-[150px] text-center'>
                <label className='font-semibold text-[20px]'>Total Request</label>
                <br/>
                <label className='font-bold text-[32px] text-white'>32</label>
            </div>
            <div className='bg-green-200  p-3 shadow-lg m-4 w-[150px] text-center'>
                <label className='font-semibold text-[20px]'>Approved</label>
                <br/>
                <label className='font-bold text-[32px] text-green-600'>10</label>
            </div>
            <div className='bg-amber-100  p-3 shadow-lg m-4 w-[150px] text-center'>
                    <label className='font-semibold text-[20px]'>Pending</label>
                    <br/>
                    <label className='font-bold text-[32px] text-amber-600'>12</label>
                </div>
            <div className='bg-red-100  p-3 shadow-lg m-4 w-[150px] text-center'>
                <label className='font-semibold text-[20px]'>Denied</label>
                <br/>
                <label className='font-bold text-[32px] text-red-600'>10</label>
            </div>
            <div className='absolute right-4 bottom-0'>
                <button className="userAddBtn items-center" onClick={() => handleAddClick()}>
                    <img src={require('./img/add.png')} className='h-[22px] w-[22px]' alt="add" />
                    กรอกข้อมูลร้องขอการเปลี่ยนแปลง
                </button>
            </div>
        </div>
        <div className="table">
            {/* Table Header */}
            <div className="tableHeader">
                <div className="tableHRow">
                    {['ชื่อผู้ร้องขอ', 'ตำแหน่ง', 'ประเภทการเปลี่ยนแปลง', 'ผู้ดำเนินงาน', 'วันที่ต้องการใช้งาน', 'สถานะ'].map(header => <div className="tableCell" key={header}>{header}</div>)}
                    <div className='tableCell flex justify-center'>
                    </div>
                </div>
            </div>

            {/* Table Body */}
            <div className="tableBody shadow-lg">
                {currentItems.map(item => (
                    <div className="tableRow" key={item.id}>
                        {item.id}
                        <div className="tableBodyCell">{item.requestName} {item.requestSurname}</div>
                        <div className="tableBodyCell">{item.jobRank}</div>
                        <div className="tableBodyCell">{item.changeType}</div>
                        <div className="tableBodyCell">{item.manaName}</div>
                        <div className="tableBodyCell">{moment(item.useDate).format('DD/MM/YYYY')}</div>
                        <div className="tableBodyCell flex justify-center relative">
                            <button className="cursor-pointer icon absolute left-2" onClick={() => handleApproveClick(item)}>
                              {/* <img src={require(item.approveStatus === 'Approved' ? './img/approved.png' :'./img/unapproved.png')} className='' 
                                alt={item.approveStatus === 'Approved' ? 'Approved' : 'Denied'} /> */}
                            </button>
                            <span className=''>
                                {item.approveStatus}
                            </span>
                        </div>
                        <div className="tableBodyCell flex justify-center space-x-6">
                            <button className="cursor-pointer icon hover:shadow-lg hover:rounded-lg" onClick={() => handleITClick(item)}>
                                <img src={require('./img/submit.png')} className='icon' alt="submit" />
                            </button>
                            <button className="cursor-pointer icon hover:shadow-lg hover:rounded-lg" onClick={() => handleApproveClick(item)}>
                                <img src={require('./img/approve.png')} className='icon' alt="approve" />
                            </button>
                            <button className="cursor-pointer icon hover:shadow-lg hover:rounded-lg" onClick={() => handleDeleteClick(item)}>
                                <img src={require('./img/bin.png')} className='icon' alt="delete" />
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
            <ItProcessModal isOpen={showITModal} onClose={() => setShowITModal(false)} onConfirm={handleConfirmIT} formData={formData} setFormData={setFormData}/>
            <DeleteModal isOpen={showModal} onClose={() => setShowModal(false)} onConfirm={handleConfirmDelete} />
        </div>
        </>
    );
}

export default ManagerPage;
