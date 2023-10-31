// table.jsx

import React, { useEffect, useState } from 'react';
import Pagination from './components/pagination';
import AddModal from './components/addModal';
import moment from 'moment';

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
            <div className='flex justify-center'>
                <button className="userAddBtn" onClick={() => handleAddClick()}>
                    <img src={require('./img/add.png')} className='h-[22px] w-[22px]' alt="add" />
                    กรอกข้อมูลร้องขอการเปลี่ยนแปลง
                </button>
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
                                <img src={require(item.headDepaApprove === 'Approved' ? './img/approved.png' :'./img/unapproved.png')} className='icon' 
                                alt={item.headDepaApprove === 'Approved' ? 'Approved' : 'Denied'} />
                                <span className=''>
                                    {item.headDepaApprove}
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
                <AddModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} onConfirm={handleConfirmAdd} formData={formData} setFormData={setFormData}/>
            </div>
        </>
    );
}

export default UserPage;
