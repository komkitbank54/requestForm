// ManagerPage.js

import React, { useEffect, useState} from 'react';
import moment from 'moment';
import emailjs from 'emailjs-com';

// Import Components
import DeleteModal from './components/deleteModal';
import Pagination from './components/pagination';
import AddModal from './components/addModal';
import ItProcessModal from './components/itProcess';
import ManagerApproveModal from './components/managerApprove';
import { DetailRow } from './components/DetailRow';
import StatusCount from './components/StatusCount';
import { determineApproveStatus } from './components/path/approsalStatus';

// Import CSS
import './css/table.css';
import './fonts/fonts.css';
import './css/tooltip.css';

function ManagerPage({resetPagination}) {
    const [data, setData] = useState([]);
    const [expandedRows, setExpandedRows] = useState({});

    // โชว์ข้อมูล
    useEffect(() => {
        emailjs.init('iA61oT4iJ5dTzO0Ql');
        fetch('http://localhost:3000/show')
        .then(response => response.json())
        .then(fetchedData => {
            // อัพเดต approveStatus ตามสถานะล่าสุด
            const updatedData = fetchedData.map(item => ({
            ...item,
            approveStatus: determineApproveStatus(item.headDepaApprove, item.headITApprove, item.auditApprove),
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
                // อัพเดตดาต้าด้วยข้อมูลที่ edit
                setData(prevData => prevData.map(i => i.id === formData.id ? formData : i));
                setShowITModal(false);
            } else {
                console.error('Failed to edit record.', result.message);
            }
        })
        .catch(err => console.error('Error:', err));
    };

    // Manager Approve
    const [showManagerApproveModal, setShowManagerApproveModal] = useState(false);

    const handleApproveClick = (item) => {
        setFormData(item);
        setShowManagerApproveModal(true);
    };

    const handleConfirmManager = () => {
        fetch('http://localhost:3000/mngapprove', {
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
                setShowManagerApproveModal(false);
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

  // คลิก row
  const toggleRow = (id) => {
      // Toggles the expanded state for a given row
      setExpandedRows(prevRows => ({
          ...prevRows,
          [id]: !prevRows[id]
      }));
  };

// ส่งเมลล์
const sendEmail = (item) => {
    const templateParams = {
        fromEmail:  'gcapit0002@gmail.com',
        toEmail: 'gcapit0002@gmail.com',
        message:    'ชื่อผู้ร้องขอ: ' + item.requestName + ' ' + item.requestSurname + 
                    '\nฝ่าย:' + item.jobGroup
    };

    emailjs.send('service_yi0i5bn', 'template_6s6b257', templateParams)
        .then((response) => {
            console.log('Email successfully sent!', response.status, response.text);
        })
        .catch((err) => {
            console.error('Failed to send email. Error:', err);
        });
};
  
    return (
        <>
            <div className='flex justify-between shadow-lg bg-[#0e235c] text-[#f1c40f]'>
                <header className='m-4 font-bold text-[28px]'>
                    การร้องขอการเปลี่ยนแปลง (Manager)
                </header>
                {/* <img src={require('./img/user.png')} alt='user' className='items-center h-[76px]'/> */}
            </div>
            <div className='flex my-8 relative'>
                <StatusCount  data={data}/>
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
                            {/* {item.id} */}
                            <div className="tableBodyCell">{item.requestName} {item.requestSurname}</div>
                            <div className="tableBodyCell">{item.jobGroup}</div>
                            <div className="tableBodyCell">{item.changeType}</div>
                            <div className="tableBodyCell">{moment(item.useDate).format('DD/MM/YYYY')}</div>
                                <div className="tableBodyCell">{item.manaName}</div>
                            <div className="tableBodyCell flex justify-center relative">{item.approveStatus}</div>
                            <div className="tableBodyCell flex justify-center space-x-5">
                                <div className="tooltip">
                                    <button className="cursor-pointer icon hover:shadow-lg hover:rounded-lg" onClick={() => handleITClick(item)}>
                                        <img src={require('./img/submit.png')} className='icon' alt="submit" />
                                    </button>
                                    <span className="tooltiptext">ลงชื่อผู้ดำเนินการ</span>
                                </div>
                                <div className="tooltip">
                                    <button className="cursor-pointer icon hover:shadow-lg hover:rounded-lg" onClick={() => handleApproveClick(item)}>
                                        <img src={require('./img/approve.png')} className='icon' alt="approve" />
                                    </button>
                                    <span className="tooltiptext">ลงชื่ออนุมัติ</span>
                                </div>
                                {item.headDepaApprove === 'Approve' && item.headITApprove === 'Approve' && item.auditApprove === 'Approve' ?
                                (<div className="tooltip">
                                    <button className="cursor-pointer" onClick={() => sendEmail(item)}><img src={require('./img/send.png')} className='icon' alt="send" /></button>
                                    <span className="tooltiptext">ยืนยันส่งเมล์ให้กรรมการ</span>
                                </div>):
                                (<button className="cursor-default"><img src={require('./img/nosend.png')} className='icon' alt="nosend" /></button>)
                                }
                                <div className="tooltip">
                                    <button className="cursor-pointer icon hover:shadow-lg hover:rounded-lg" onClick={() => handleDeleteClick(item)}>
                                        <img src={require('./img/bin.png')} className='icon' alt="delete" />
                                    </button>
                                    <span className="tooltiptext">ลบ</span>
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
                <ItProcessModal isOpen={showITModal} onClose={() => setShowITModal(false)} onConfirm={handleConfirmIT} formData={formData} setFormData={setFormData}/>
                <ManagerApproveModal isOpen={showManagerApproveModal} onClose={() => setShowManagerApproveModal(false)} onConfirm={handleConfirmManager} formData={formData} setFormData={setFormData}/>
                <DeleteModal isOpen={showModal} onClose={() => setShowModal(false)} onConfirm={handleConfirmDelete} />
            </div>
        </>
    );
}

export default ManagerPage;
