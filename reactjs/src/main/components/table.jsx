// table.jsx
import React, { useEffect, useState } from 'react';
import '../css/table.css';
import '../fonts/fonts.css'
import DeleteModal from './deleteModal';
import Pagination from './pagination';

function Table({data = [], resetPagination, setData }) {

    // ทำให้เริ่มต้นหน้า 1 ตลอด
    useEffect(() => {
        setCurrentPage(1);
      }, [resetPagination]);
    const [currentPage, setCurrentPage] = useState(1);
    
    // ข้อมูลต่อ 1 หน้า
    const itemsPerPage = 10;
    
    // เพิ่มหน้าใหม่ เมื่อเกิน 10 ข้อมูล
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
    const handleNextPage = () => {
      if (currentPage < Math.ceil(data.length / itemsPerPage)) {
        setCurrentPage(prevPage => prevPage + 1);
      }
    };
  
    const handlePrevPage = () => {
      if (currentPage > 1) {
        setCurrentPage(prevPage => prevPage - 1);
      }
    };

    const totalPages = Math.ceil(data.length / itemsPerPage);

    const handlePageClick = (pageNum) => {
      setCurrentPage(pageNum);
    };

  
  // delete
  const [showModal, setShowModal] = useState(false);  // <-- State to control the modal
  const [itemToDelete, setItemToDelete] = useState(null);  // <-- State to hold the item to be deleted

  const handleDeleteClick = (item) => {
      setItemToDelete(item);
      setShowModal(true);
  };

  const handleConfirmDelete = () => {
      fetch(`http://localhost:3000/delete?id=${itemToDelete.id}`, {  // <-- Adjust the URL if needed
          method: 'DELETE'
      })
      .then(response => {
          if (response.ok) {
              setShowModal(false);
              // Refresh data or filter out the deleted item here
              setData(prevData => prevData.filter(i => i.id !== itemToDelete.id));
          } else {
              console.error('Failed to delete item.');
          }
      });
  };


    
  return (
    <div className="table">
      <div className="tableHeader">
        <div className="tableHRow">
          {/* <div className="tableCell">id</div> */}
          <div className="tableCell">ชื่อผู้ร้องขอ</div>
          <div className="tableCell">ตำแหน่ง</div>
          <div className="tableCell">ฝ่ายงาน</div>
          <div className="tableCell">วันที่ขอใช้งาน</div>
          <div className='tableCell flex justify-center'>
            <botton className="flex px-2 rounded-lg">
              <img src={require('../img/add.png')} className='h-[22px] w-[22px]' alt="add"/>
              <label className='pl-1'>Add</label>
            </botton>
          </div>
        </div>
      </div>
      <div className="tableBody shadow-lg">
      {currentItems.map(item => (
          <div className="tableRow " key={item.id}>
            {/* <div className="tableBodyCell">{item.id}</div> */}
            <div className="tableBodyCell">{item.requestName} {item.requestSurname}</div>
            <div className="tableBodyCell">{item.jobRank}</div>
            <div className="tableBodyCell">{item.jobGroup}</div>
            <div className="tableBodyCell">{item.useDate}</div>
            <div className="tableBodyCell flex justify-center space-x-6">
                <img src={require('../img/pdf.png')} className='icon' alt="pdf"/>
                <img src={require('../img/edit.png')} className='icon' alt="edit"/>
                <img src={require('../img/bin.png')} className='icon' alt="delete" onClick={() => handleDeleteClick(item)}/> {/* <-- Add onClick event */}
            </div>
          </div>
        ))}
      </div>
      <div className='tableFooter'>
          <div className='tableFRow'>
            <Pagination 
                currentPage={currentPage} 
                totalPages={totalPages} 
                handlePrevPage={handlePrevPage}
                handleNextPage={handleNextPage}
                handlePageClick={handlePageClick}/>
          </div>
      </div>
      <DeleteModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onConfirm={handleConfirmDelete}/>
    </div>
  )
}

export default Table