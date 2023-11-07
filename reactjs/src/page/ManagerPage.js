//ManagerPage.js

import React, { useEffect, useState } from 'react';
import DeleteModal from './components/deleteModal';
import Pagination from './components/pagination';
import AddModal from './components/addModal';
import ItProcessModal from './components/itProcess';
import ManagerApproveModal from './components/managerApprove';
import moment from 'moment';

//Import css
import './css/table.css';
import './fonts/fonts.css';

function ManagerPage({resetPagination}) {
    const [data, setData] = useState([]);
    const [expandedRows, setExpandedRows] = useState({});

    //ประกาศค่าก่อนนับ = 0
    const [totalCount, setTotalCount] = useState(0);
    const [approvedCount, setApprovedCount] = useState(0);
    const [pendingCount, setPendingCount] = useState(0);
    const [deniedCount, setDeniedCount] = useState(0);

    // โชว์ข้อมูล
    useEffect(() => {
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
    
          // กำหนดค่าเริ่มต้น
          let approved = 0;
          let pending = 0;
          let denied = 0;
    
          // นับข้อมูลตามดาต้าจากเงื่อนไข
          updatedData.forEach(item => {
            if (item.headITApprove === 'Approve' && item.headDepaApprove === 'Approve' && item.auditApprove === 'Approve') {
              approved++;
            }
            if (['รอหัวหน้าฝ่ายอนุมัติ', 'รอฝ่ายกำกับภายในอนุมัติ', 'รอคณะกรรมการอนุมัติ', 'รอผู้ดำเนินการ', 'กำลังดำเนินการ'].includes(item.approveStatus)) {
                pending++;
            }
            if (item.headITApprove === 'Deny' || item.headDepaApprove === 'Deny' || item.auditApprove === 'Deny') {
              denied++;
            }
          });
    
          // อัพเดตจำนวนหลังนับ
          setTotalCount(approved+pending+denied);
          setApprovedCount(approved);
          setPendingCount(pending); // Total pending count
          setDeniedCount(denied);
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

    // โชว์ข้อมูล row ต่างๆ
    const DetailRow = ({ item }) => {
      return (
          <div className="detailRow">
              {/* รายละเอียดหลังจากคลิก row */}
              <div className='detailCell'>
                  <p><label className='font-bold'>เบอร์</label> {item.requestPhone}</p>
                  <p><label className='font-bold'>เมลล์</label> {item.requestEmail}</p>
              </div>
              <div className="detailCell">
                  <p><label className='font-bold'>อุปกรณ์ที่จะเปลี่ยนแปลง</label> {item.changeTool}</p>
                  <p><label className='font-bold'>รายละเอียด</label> {item.changeToolInfo}</p> 
                  <p><label className='font-bold'>โปรแกรม/ซอร์ดโค้ด</label> {item.scodeName}</p>
                  <p><label className='font-bold'>จากเวอร์ชั่น</label> {item.scodeFromVersion} <label className='font-bold'>เป็น</label> {item.scodeToVersion}</p>            
              </div>
              <div className="detailCell">
                  <p><label className='font-bold'>สาเหตุเปลี่ยนแปลง</label> {item.changeCoz}</p>
                  <p><label className='font-bold'>ผลกระทบที่อาจเกิด</label> {item.changeEff}</p>
              </div>
              <div className="detailCell">
                  <p><label className='font-bold'>โครงงานเกี่ยวข้อง</label> {item.researchRel}</p>
                  <p><label className='font-bold'>อ้างอิง</label> {item.researchRef}</p>
                  <p><label className='font-bold'>อื่นๆ</label> {item.etc}</p>
              </div>
              <div className="detailCell">
                  <p><label className='font-bold'>ผู้ช่วยดำเนินการ</label> {item.mana2Name}</p>
              </div>
              <div className="detailCell text-right">
                  <p><label className='font-bold'>ผู้ดำเนินการ</label> {item.headDepaApprove}</p>
                  <p><label className='font-bold'>หัวหน้าฝ่ายเทคโนโลยี</label> {item.headITApprove}</p>
                  <p><label className='font-bold'>ฝ่ายกำกับภายใน</label> {item.auditApprove}</p>
              </div>
              <div className='detailCell'>
                
              </div>
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

    // Check Approve
    function determineApproveStatus(headDepaApprove, headITApprove, auditApprove) {
      // If ค่าอะไรก็ตาม = 'Deny', ในตารางจะโชว์ 'ไม่อนุมัติ'
      if (headDepaApprove === 'Deny' || headITApprove === 'Deny' || auditApprove === 'Deny') {
        return 'ไม่ได้รับการอนุมัติ';
      }
      // If Approve ทั้งหมดแล้ว 'รอกรรมการ'
      if (headDepaApprove === 'Approve' && headITApprove === 'Approve' && auditApprove === 'Approve') {
        return 'รอคณะกรรมการอนุมัติ';
      }
      // If ถ้ารอดำเนินการ 'Pending', จะขึ้นว่ารอดำเนินการ
      if (headDepaApprove === 'Pending') {
        return 'รอผู้ดำเนินการ';
      }
      if (headITApprove === 'Pending') {
        return 'รอหัวหน้าฝ่ายอนุมัติ';
      }
      if (auditApprove === 'Pending') {
        return 'รอฝ่ายกำกับอนุมัติ';
      }
      // Default to pending if none of the above conditions are met
      return 'กำลังดำเนินการ';
    }

    return (
        <>
        <div className='flex justify-between shadow-lg bg-[#0e235c] text-[#f1c40f]'>
            <header className='m-4 font-bold text-[28px]'>
                การร้องขอการเปลี่ยนแปลง (Manager)
            </header>
            {/* <img src={require('./img/user.png')} alt='user' className='items-center h-[76px]'/> */}
        </div>
        <div className='flex my-8 relative'>
        <div className='bg-green-500  p-3 shadow-lg m-4 w-[150px] text-center'>
                <label className='font-semibold text-[20px]'>คำร้องทั้งหมด</label>
                <br/>
                <label className='font-bold text-[32px] text-white'>{totalCount}</label>
            </div>
            <div className='bg-green-200  p-3 shadow-lg m-4 w-[150px] text-center'>
                <label className='font-semibold text-[20px]'>อนุมัติแล้ว</label>
                <br/>
                <label className='font-bold text-[32px] text-green-600'>{approvedCount}</label>
            </div>
            <div className='bg-amber-100  p-3 shadow-lg m-4 w-[150px] text-center'>
                <label className='font-semibold text-[19px]'>กำลังดำเนินการ</label>
                <br/>
                <label className='font-bold text-[32px] text-amber-600'>{pendingCount}</label>
            </div>
            <div className='bg-red-100  p-3 shadow-lg m-4 w-[150px] text-center'>
                <label className='font-semibold text-[20px]'>ไม่อนุมัติ</label>
                <br/>
                <label className='font-bold text-[32px] text-red-600'>{deniedCount}</label>
            </div>
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
                    {['ชื่อผู้ร้องขอ', 'ตำแหน่ง', 'ประเภทการเปลี่ยนแปลง', 'ผู้ดำเนินงาน', 'วันที่ต้องการใช้งาน', 'สถานะ'].map(header => <div className="tableCell" key={header}>{header}</div>)}
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
