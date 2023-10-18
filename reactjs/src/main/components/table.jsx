// table.jsx

import React, { useEffect, useState } from 'react';
import '../css/table.css';
import '../fonts/fonts.css'

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

    const totalPages = Math.ceil(data.length / itemsPerPage);

    const handlePageClick = (pageNum) => {
      setCurrentPage(pageNum);
    };

    // Render pagination numbers
    const renderPaginationNumbers = () => {
        let numbers = [];

        for(let i = 1; i <= totalPages; i++) {
            numbers.push(
              <>
                <div className='p-1'>
                  <span 
                      key={i}
                      onClick={() => handlePageClick(i)}
                      className={`ease-in-out duration-300 bg-white rounded-[20px] p-2 cursor-pointer ${currentPage === i ? 'font-bold text-[22px]' : ''}`}
                  >
                      {i}
                  </span>
                </div>
              </>
            );
        }

        return numbers;
    };
    
  return (
    <div className="table ">
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
                <img src={require('../img/bin.png')} className='icon' alt="delete"/>
            </div>
          </div>
        ))}
      </div>
      <div className='tableFooter'>
          <div className='tableFRow'>
            <button onClick={handlePrevPage} disabled={currentPage === 1} className='mr-2'>
                {currentPage === 1 
                    ? <img className='w-6 h-6' src={require('../img/cantBack.png')} alt='cantback'/>
                    : <img className='w-6 h-6' src={require('../img/back.png')} alt='back'/>}
            </button>
            {/* Render pagination numbers here */}
            {renderPaginationNumbers()}
            <button onClick={handleNextPage} disabled={currentPage === totalPages} className='ml-2'>
                {currentPage === totalPages 
                    ? <img className='w-6 h-6' src={require('../img/cantNext.png')} alt='cantnext'/>
                    : <img className='w-6 h-6' src={require('../img/next.png')} alt='next'/>}
            </button>
          </div>
      </div>
    </div>
  )
}

export default Table