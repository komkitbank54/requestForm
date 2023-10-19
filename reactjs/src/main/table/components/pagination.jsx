// pagination.jsx
import React from 'react';

function Pagination({ currentPage, totalPages, handlePrevPage, handleNextPage, handlePageClick }) {
    
    // จำนวนหน้าที่แสดง (10 หน้า)
    const renderPaginationNumbers = () => {
        let numbers = [];
        let start, end;
        
        if (totalPages <= 10) {
            start = 1;
            end = totalPages;
        } else if (currentPage <= 5) {
            start = 1;
            end = 10;
        } else if (currentPage >= totalPages - 4) {
            start = totalPages - 9;
            end = totalPages;
        } else {
            start = currentPage - 5;
            end = currentPage + 5;
        }
        // loop หน้าให้ครบตามข้อมูล
        for (let i = start; i <= end; i++) {
            numbers.push(
                <div className='p-1' key={i}>
                    <span 
                        onClick={() => handlePageClick(i)}
                        className={`ease-in-out duration-300 bg-white rounded-[20px] p-2 cursor-pointer ${currentPage === i ? 'font-bold text-[22px]' : ''}`}
                    >
                        {i}
                    </span>
                </div>
            );
        }
        return numbers;
    };

    return (
        <div className='tableFooter'>
            <div className='tableFRow'>
                <button onClick={handlePrevPage} disabled={currentPage === 1} className='mr-2'>
                    {currentPage === 1 
                        ? <img className='w-6 h-6' src={require('../../img/cantBack.png')} alt='cantback'/>
                        : <img className='w-6 h-6' src={require('../../img/back.png')} alt='back'/>}
                </button>
                {renderPaginationNumbers()}
                <button onClick={handleNextPage} disabled={currentPage === totalPages} className='ml-2'>
                    {currentPage === totalPages 
                        ? <img className='w-6 h-6' src={require('../../img/cantNext.png')} alt='cantnext'/>
                        : <img className='w-6 h-6' src={require('../../img/next.png')} alt='next'/>}
                </button>
            </div>
        </div>
    );
}

export default Pagination;
