// StatusCount.jsx

import React, { useState, useEffect } from 'react';
import '../css/statushover.css';

const StatusCount = ({ data }) => {
    //ประกาศค่าก่อนนับ = 0
    const [totalCount, setTotalCount] = useState(0);
    const [approvedCount, setApprovedCount] = useState(0);
    const [pendingCount, setPendingCount] = useState(0);
    const [deniedCount, setDeniedCount] = useState(0);

    // โชว์ข้อมูล
    useEffect(() => {
        let approved = 0;
        let pending = -1;
        let denied = 0;
    
        data.forEach(item => {
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
    
        setTotalCount(approved + pending + denied);
        setApprovedCount(approved);
        setPendingCount(pending);
        setDeniedCount(denied);
    }, [data]);
    

  return (
    <>
            <div className='status bg-green-500 shadow-lg w-[150px]'>
                <label className='font-semibold text-[20px]'>คำร้องทั้งหมด</label>
                <br/>
                <label className='font-bold text-[32px] text-white'>{totalCount}</label>
                <div className="glow-wrap">
                  <i className="glow"></i>
                </div>
            </div>
            <div className='status bg-green-200 shadow-lg w-[150px] text-center'>
                <label className='font-semibold text-[20px]'>อนุมัติแล้ว</label>
                <br/>
                <label className='font-bold text-[32px] text-green-600'>{approvedCount}</label>
                <div className="glow-wrap">
                  <i className="glow"></i>
                </div>
            </div>
            <div className='status bg-amber-100  shadow-lg w-[150px] text-center'>
                <label className='font-semibold text-[19px]'>กำลังดำเนินการ</label>
                <br/>
                <label className='font-bold text-[32px] text-amber-600'>{pendingCount}</label>
                <div className="glow-wrap">
                  <i className="glow"></i>
                </div>
            </div>
            <div className='status bg-red-100 shadow-lg w-[150px] text-center'>
                <label className='font-semibold text-[20px]'>ไม่อนุมัติ</label>
                <br/>
                <label className='font-bold text-[32px] text-red-600'>{deniedCount}</label>
                <div className="glow-wrap">
                  <i className="glow"></i>
                </div>
            </div>
    </>
  )
}

export default StatusCount