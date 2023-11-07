// UserPage.js

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
    const [expandedRows, setExpandedRows] = useState({});

    //Show fetch data
    useEffect(() => {
      fetch('http://localhost:3000/show')
        .then(response => response.json())
        .then(data => setData(data))
        .catch(err => console.error('Error fetching data:', err));
    }, []);

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
        userContact: '',
        headDepaName: '',
        headDepaComment: '',
        headDepaDate: '',
        headITName: '',
        headITApprove: '',
        headITEsti: '',
        headITEstiComment: '',
        headITDate: '',
        auditName: '',
        auditComment: '',
        auditDate: '',
        refITName1: '',
        refITName2: '',
        refITName3: '',
        refITApprove: ''
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

    // โชว์ข้อมูล row ต่างๆ
    const DetailRow = ({ item }) => {
        // Here you can return a JSX layout for your detailed row
        return (
            <div className="detailRow">
                {/* Include more data fields from the item as needed */}
                <div className="detailCell">
                    <p>อุปกรณ์ที่จะเปลี่ยนแปลง: {item.changeTool}</p>
                    <p>รายละเอียด: {item.changeToolInfo}</p> 
                    <p>โปรแกรม/ซอร์ดโค้ด: {item.scodeName}</p>
                    <p>จากเวอร์ชั่น {item.scodeFromVersion} เป็น {item.scodeToVersion}</p>            
                </div>
                <div className="detailCell">
                    <p>สาเหตุเปลี่ยนแปลง: {item.changeCoz}</p>
                    <p>โครงงานเกี่ยวข้อง: {item.researchRel}</p>
                    <p>อ้างอิง: {item.researchRef}</p>
                    <p>ผลกระทบที่อาจเกิด: {item.changeEff}</p>
                </div>
                <div className="detailCell">
                    <p>อื่นๆ: {item.etc}</p>
                </div>
                <div className="detailCell">
                    <p>ผู้ช่วยดำเนินการ: {item.mana2Name}</p>
                </div>
                <div className="detailCell text-right">
                    <p>ผู้ดำเนินการ: {item.headDepaApprove}</p>
                    <p>หัวหน้าฝ่ายเทคโนโลยี: {item.headITApprove}</p>
                    <p>ฝ่ายกำกับภายใน: {item.auditApprove}</p>
                </div>
                {/* ...other fields */}
            </div>
        );
    };
    // คลิก row
    const toggleRow = (id) => {
        // Toggles the expanded state for a given row
        setExpandedRows(prevRows => ({
            ...prevRows,
            [id]: !prevRows[id]
        }));
    };


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
                        {['ชื่อผู้ร้องขอ', 'ฝ่ายงาน', 'วันที่ต้องการใช้งาน', 'ผู้ดำเนินการ', 'สถานะ'].map(header => <div className="tableCell" key={header}>{header}</div>)}
                    </div>
                </div>

                {/* Table Body */}
                <div className="tableBody shadow-lg">
                    {currentItems.map(item => (
                        <>
                            <div className="tableRow" key={item.id} onClick={() => toggleRow(item.id)}>
                                {/* {item.id} */}
                                <div className="tableBodyCell">{item.requestName} {item.requestSurname}</div>
                                <div className="tableBodyCell">{item.jobGroup}</div>
                                <div className="tableBodyCell">{moment(item.useDate).format('DD/MM/YYYY')}</div>
                                <div className="tableBodyCell">{item.manaName}</div>
                                <div className="tableBodyCell flex justify-center relative">
                                    {/* <img src={require(item.headDepaApprove === 'Approved' ? './img/approved.png' :'./img/unapproved.png')} className='icon' 
                                    alt={item.headDepaApprove === 'Approved' ? 'Approved' : 'Denied'} /> */}
                                    <span className=''>
                                        {item.approveStatus}
                                    </span>
                                </div>
                            </div>
                            {/* Detail row - shown/hidden based on state */}
                            {expandedRows[item.id] && <DetailRow item={item} />}
                        </>
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
