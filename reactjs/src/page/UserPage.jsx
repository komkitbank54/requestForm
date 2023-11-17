// UserPage.js

import React, { useEffect, useState } from 'react';
import moment from 'moment';

// Import Components
import Pagination from './components/pagination';
import AddModal from './components/addModal';
import Login from '../components/Login';
import { DetailRowUser } from './components/DetailRow';
import StatusCount from './components/StatusCount';
import { determineApproveStatus } from './components/path/approsalStatus';

// Import CSS
import './css/table.css';
import './fonts/fonts.css';
import './css/button.css'

function UserPage({resetPagination}) {
    const [data, setData] = useState([]);
    const [expandedRows, setExpandedRows] = useState({});

    // โชว์ข้อมูล
    useEffect(() => {
    fetch('http://localhost:3000/show')
        .then(response => response.json())
        .then(fetchedData => {
        // อัพเดต approveStatus ตามสถานะล่าสุด
        const updatedData = fetchedData.map(item => ({
            ...item,
            approveStatus: determineApproveStatus(item.headDepaApprove, item.headITApprove, item.auditApprove, item.ceoApprove),
        }));

        // โหลดข้อมูล
        setData(updatedData);

        })
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
                <StatusCount data={data}/>
                <div className='absolute right-4 bottom-0'>
                    <button className="userAddBtn items-center" onClick={() => handleAddClick()}>
                        <img src={require('./img/add.png')} className='h-[22px] w-[22px] mr-1' alt="add" />
                        กรอกข้อมูลร้องขอการเปลี่ยนแปลง
                    </button>
                </div>
            </div>
            <div className="table">
                {/* Table Header */}
                <div className="tableHeader">
                    <div className="tableHRow">
                        {['ชื่อผู้ร้องขอ', 'ฝ่ายงาน', 'วันที่ต้องการใช้งาน', 'ชื่อผู้ดำเนินงาน', 'สถานะดำเนินการ', 'สถานะการอนุมัติ'].map(header => <div className="tableCell" key={header}>{header}</div>)}
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
                                <div className="tableBodyCell">{item.changeStatue}</div>
                                <div className="tableBodyCell flex justify-center relative">{item.approveStatus}</div>
                            </div>
                            {/* Detail row - โชว์/ซ่อน based on state */}
                            {expandedRows[item.id] && <DetailRowUser item={item} />}
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
