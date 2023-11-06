// table.jsx

import React, { useEffect, useState } from 'react';
import Pagination from './components/pagination';
import AddModal from './components/addModal';
import moment from 'moment';
import Login from '../components/Login';

//Import css
import './css/table.css';
import './fonts/fonts.css';
import './css/button.css'

function UserPage({resetPagination}) {
    const [data, setData] = useState([]);
    //Show fetch data
    useEffect(() => {
      fetch('http://localhost:3000/show')
        .then(response => response.json())
        .then(data => setData(data))
        .catch(err => console.error('Error fetching data:', err));
    }, []);

    // const RefreshData = () => {
    //     useEffect(() => {
    //         fetch('http://localhost:3000/show')
    //           .then(response => response.json())
    //           .then(data => setData(data))
    //           .catch(err => console.error('Error fetching data:', err));
    //       }, []);
    // }

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
        etc: '',
        changeCoz: '',
        researchRel: '',
        researchRef: '',
        changeEff: '',
        manaName: '',
        manaRank: '',
        mana2Name: '',
        mana2Rank: '',
        reqFinishDate: '',
        implementPlan: '',
        changeTest: '',
        testInfo: '',
        rollbackPlan: '',
        // rollbackInfo: '',
        userContact: '',
        headDepaName: '',
        // headDepaApprove: '',
        headDepaComment: '',
        headDepaDate: '',
        headITName: '',
        headITApprove: '',
        headITEsti: '',
        headITEstiComment: '',
        headITDate: '',
        divisionName: '',
        divisionComment: '',
        divisionDate: '',
        refITName1: '',
        refITName2: '',
        refITName3: '',
        refITApprove: ''
        // refITComment: ''
        // actualDate: '',
        // finishDate: '',
        // changeStatue: '',
        // changeResult: '',
        // userChange: '',
        // userChangeDate: '',
        // changeResName: ''
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

    // Login
    const [showLoginModal, setShowLoginModal] = useState(false);
    const handleLoginClick = (item) => {
        setShowLoginModal(true);
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

    return (
        <>
            <div className='flex justify-between shadow-lg bg-[#0e235c] text-[#f1c40f]'>
                <header className='m-4 font-bold text-[28px]'>
                    การร้องขอการเปลี่ยนแปลง
                </header>
                <button className="loginAddBtn items-center" onClick={() => handleLoginClick()}>
                    Login
                </button>
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
                        {['ชื่อผู้ร้องขอ', 'ฝ่ายงาน', 'วันที่ขอใช้งาน', 'วันที่ต้องการใช้งาน', 'สถานะ'].map(header => <div className="tableCell" key={header}>{header}</div>)}
                    </div>
                </div>

                {/* Table Body */}
                <div className="tableBody shadow-lg">
                    {currentItems.map(item => (
                        <div className="tableRow" key={item.id}>
                            {/* {item.id} */}
                            <div className="tableBodyCell">{item.requestName} {item.requestSurname}</div>
                            <div className="tableBodyCell">{item.jobGroup}</div>
                            <div className="tableBodyCell">{moment(item.requestDate).format('DD/MM/YYYY')}</div>
                            <div className="tableBodyCell">{moment(item.useDate).format('DD/MM/YYYY')}</div>
                            <div className="tableBodyCell flex justify-center relative">
                                {/* <img src={require(item.headDepaApprove === 'Approved' ? './img/approved.png' :'./img/unapproved.png')} className='icon' 
                                alt={item.headDepaApprove === 'Approved' ? 'Approved' : 'Denied'} /> */}
                                <span className=''>
                                    {item.approveStatus}
                                </span>
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
                <Login isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} onConfirm={handleConfirmAdd} formData={formData} setFormData={setFormData}/>
                <AddModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} onConfirm={handleConfirmAdd} formData={formData} setFormData={setFormData}/>
            </div>
        </>
    );
}

export default UserPage;
