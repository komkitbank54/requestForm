// AuditPage.js

import React, { useEffect, useState } from 'react';
import moment from 'moment';

// Import Components
import Pagination from './components/pagination';
import AddModal from './components/addModal';
import AuditApproveModal from './components/auditApprove';
import { DetailRow } from './components/DetailRow';
import { StatusCount } from './components/StatusCount';
import { determineApproveStatus } from './components/path/approsalStatus';

// Import CSS
import './css/table.css';
import './fonts/fonts.css';

function AuditPage({resetPagination}) {
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
            approveStatus: determineApproveStatus(item.headDepaApprove, item.headITApprove, item.auditApprove, item.ref1Approve),
          }));
    
          // โหลดข้อมูล
          setData(updatedData);
        })
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

    // Audit Approve
    const [showAuditApproveModal, setShowAuditApproveModal] = useState(false);

    const handleApproveClick = (item) => {
        setFormData(item);
        setShowAuditApproveModal(true);
    };

    const handleConfirmAudit = () => {
        fetch('http://localhost:3000/ref1Approve', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
        .then(response => response.json())
        .then(result => {
            if (result.message === 'Record updated successfully!') {
                // อัพเดตดาต้าด้วยข้อมูลที่ edit
                setData(prevData => prevData.map(i => i.id === formData.id ? formData : i));
                setShowAuditApproveModal(false);
            } else {
                console.error('Failed to edit record.', result.message);
            }
        })
        .catch(err => console.error('Error:', err));
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
                การร้องขอการเปลี่ยนแปลง (Audit)
            </header>
            {/* <img src={require('./img/user.png')} alt='user' className='items-center h-[76px]'/> */}
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
                    {['ชื่อผู้ร้องขอ', 'ฝ่าย', 'ประเภทการเปลี่ยนแปลง', 'วันที่ต้องการใช้งาน', 'ผู้ดำเนินงาน', 'สถานะ'].map(header => <div className="tableCell" key={header}>{header}</div>)}
                    <div className='tableCell flex justify-center'>
                    </div>
                </div>
            </div>

            {/* Table Body */}
            <div className="tableBody shadow-lg">
                {currentItems.map(item => (
                  <>
                    <div className="tableRow" key={item.id} onClick={() => toggleRow(item.id)}>
                        {item.id}
                        <div className="tableBodyCell">{item.requestName} {item.requestSurname}</div>
                        <div className="tableBodyCell">{item.jobGroup}</div>
                        <div className="tableBodyCell">{item.changeType}</div>
                        <div className="tableBodyCell">{moment(item.useDate).format('DD/MM/YYYY')}</div>
                        <div className="tableBodyCell">{item.manaName}</div>
                        <div className="tableBodyCell flex justify-center relative">{item.approveStatus}</div>
                        <div className="tableBodyCell flex justify-center space-x-6">
                            <div className='tooltip'>
                                {item.headITApprove === 'Pending' ? 
                                    (<div>
                                        <button className="cursor-pointer icon hover:shadow-lg hover:rounded-lg" onClick={() => handleApproveClick(item)}>
                                            <img src={require('./img/approve.png')} className='icon' alt="approve" />
                                        </button>
                                        <span className="tooltiptext">ลงชื่ออนุมัติ</span>
                                    </div>):
                                    (<div>
                                        <button className="icon hover:shadow-lg hover:rounded-lg" onClick={() => handleApproveClick(item)} disabled>
                                            <img src={require('./img/noapprove.png')} className='icon' alt="approve" />
                                        </button>
                                    </div>)
                                }
                            </div>
                        </div>
                    </div>
                    {/* Detail row - โชว์/ซ่อน based on state */}
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
            <AddModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} onConfirm={handleConfirmAdd} formData={formData} setFormData={setFormData}/>
            <AuditApproveModal isOpen={showAuditApproveModal} onClose={() => setShowAuditApproveModal(false)} onConfirm={handleConfirmAudit} formData={formData} setFormData={setFormData}/>
        </div>
        </>
    );
}

export default AuditPage  ;
