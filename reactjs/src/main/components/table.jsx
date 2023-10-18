// table.jsx

import React, { useEffect, useState } from 'react';
import '../css/table.css';

function Table({data = [], resetPagination }) {

    useEffect(() => {
        setCurrentPage(1);
      }, [resetPagination]);

    const [currentPage, setCurrentPage] = useState(1);
    
    const itemsPerPage = 10;
    
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

  return (
    <div className="table">
      <div className="tableHeader">
        <div className="tableHRow">
          <div className="tableCell">id</div>
          <div className="tableCell">ชื่อผู้ร้องขอ</div>
          <div className="tableCell">ตำแหน่ง</div>
          <div className="tableCell">ฝ่ายงาน</div>
          <div className="tableCell">วันที่ขอใช้งาน</div>
          <div className='tableCell'></div>
        </div>
      </div>
      <div className="tableBody">
      {currentItems.map(item => (
          <div className="tableRow " key={item.id}>
            <div className="tableBodyCell">{item.id}</div>
            <div className="tableBodyCell">{item.requestName} {item.requestSurname}</div>
            <div className="tableBodyCell">{item.jobRank}</div>
            <div className="tableBodyCell">{item.jobGroup}</div>
            <div className="tableBodyCell">{item.useDate}</div>
            <div className="tableBodyCell flex justify-center space-x-6">
                <img src={require('../img/pdf.png')} className='icon' alt="pdf"/>
                <img src={require('../img/edit.png')} className='icon' alt="edit"/>
                <img src={require('../img/bin.png')} className='icon' alt="delete"/>
            </div>
          </div>
        ))}
      </div>
      <div className='tableFooter'>
    <div className='tableFRow'>
      <button className='' onClick={handlePrevPage} disabled={currentPage === 1}>{currentPage === 1 ? <img className='w-8 h-8' src={require('../img/cantBack.png')} alt='cantback'/> : <img className='w-8 h-8' src={require('../img/back.png')} alt='back'/>}</button>
      <span className='bg-white border-2 border-black rounded-lg p-1 m-2'>{currentPage}/{Math.ceil(data.length / itemsPerPage)}</span>
      <button className='' onClick={handleNextPage} disabled={currentPage === Math.ceil(data.length / itemsPerPage)}>{currentPage === Math.ceil(data.length / itemsPerPage) ? <img className='w-8 h-8' src={require('../img/cantNext.png')} alt='cantnext'/> : <img className='w-8 h-8' src={require('../img/next.png')} alt='next'/>}</button>
    </div>
  </div>
    </div>
  )
}

export default Table