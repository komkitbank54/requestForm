// DetailRow.js
import React from 'react';
import displayStatus from './path/displayStatus';
import moment from 'moment';

// Import CSS
import '../css/table.css'

export const DetailRowUser = ({ item }) => {
    return (
    <div className="detailRow">
        {/* รายละเอียดหลังจากคลิก row */}
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
            <p className='flex space-x-2'><label className='font-bold'>ผู้ดำเนินการ</label> {displayStatus(item.headDepaApprove)}</p>
            <p className='flex space-x-2'><label className='font-bold'>หัวหน้าฝ่ายเทคโนโลยี</label> {displayStatus(item.headITApprove)}</p>
            <p className='flex space-x-2'><label className='font-bold'>ฝ่ายกำกับภายใน</label> {displayStatus(item.auditApprove)}</p>
            <p className='flex space-x-2'><label className='font-bold'>คณะกรรมการ</label> {displayStatus(item.ceoApprove)}</p>
        </div>
    </div>
    );
};

export const DetailRow = ({ item }) => {
    return (
        <div className="detailRow">
            {/* รายละเอียดหลังจากคลิก row */}
            <div className='detailCell'>
                <p><label className='font-bold'>ตำแหน่ง</label> {item.jobRank}</p>
                <p><label className='font-bold'>เบอร์</label> {item.requestPhone}</p>
                <p><label className='font-bold'>เมลล์</label> {item.requestEmail}</p>
                <p><label className='font-bold'>ขอบข่ายที่เปลี่ยน</label> {item.changeLengh}</p>
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
                <p><label className='font-bold'>วันที่คาดว่าจะดำเนินการ</label> {moment(item.reqFinishDate).format('DD/MM/YYYY')}</p>
                <p><label className='font-bold'>แผนดำเนินการ</label> {item.implementPlan}</p>
            </div>
            <div className="detailCellA">
                  <p className='flex space-x-2'><label className='font-bold'>ผู้ดำเนินการ</label> {displayStatus(item.headDepaApprove)}</p>
                  <p className='flex space-x-2'><label className='font-bold'>หัวหน้าฝ่ายเทคโนโลยี</label> {displayStatus(item.headITApprove)}</p>
                  <p className='flex space-x-2'><label className='font-bold'>ฝ่ายกำกับภายใน</label> {displayStatus(item.auditApprove)}</p>
                  <p className='flex space-x-2'><label className='font-bold'>คณะกรรมการ</label> {displayStatus(item.ceoApprove)}</p>
            </div>
            <div className='detailCell'>
            </div>
        </div>
    );
};
