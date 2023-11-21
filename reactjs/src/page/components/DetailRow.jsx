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
            <div><label className='font-bold'>อุปกรณ์ที่จะเปลี่ยนแปลง</label> {item.changeTool}</div>
            <div><label className='font-bold'>รายละเอียด</label> {item.changeToolInfo}</div> 
            <div><label className='font-bold'>โปรแกรม/ซอร์ดโค้ด</label> {item.scodeName}</div>
            <div><label className='font-bold'>จากเวอร์ชั่น</label> {item.scodeFromVersion} <label className='font-bold'>เป็น</label> {item.scodeToVersion}</div>            
        </div>
        <div className="detailCell">
            <div><label className='font-bold'>สาเหตุเปลี่ยนแปลง</label> {item.changeCoz}</div>
            <div><label className='font-bold'>ผลกระทบที่อาจเกิด</label> {item.changeEff}</div>
        </div>
        <div className="detailCell">
            <div><label className='font-bold'>โครงงานเกี่ยวข้อง</label> {item.researchRel}</div>
            <div><label className='font-bold'>อ้างอิง</label> {item.researchRef}</div>
            <div><label className='font-bold'>อื่นๆ</label> {item.etc}</div>
        </div>
        <div className="detailCell">
            <div><label className='font-bold'>ผู้ช่วยดำเนินการ</label> {item.mana2Name}</div>
            <div><label className='font-bold'>วันที่คาดว่าจะเสร็จ</label> {moment(item.reqFinishDate).format('DD/MM/YYYY')}</div>
            <div><label className='font-bold'>แผนดำเนินการ</label> {item.implementPlan}</div>
        </div>
        <div className='detailCell'>
            <div><label className='font-bold'>ผลการเปลี่ยนแปลง</label> {item.changeResult}</div>
            <div><label className='font-bold'>ชื่อผู้เปลี่ยน</label> {item.userChange}</div>
            <div><label className='font-bold'>วันที่เสร็จสิ้น</label> {moment(item.finishDate).format('DD/MM/YYYY')}</div>
            <div><label className='font-bold'>การปรับปรุงเอกสาร</label> {item.changeResName}</div>
        </div>
        <div className="detailCell text-right">
            <div className='flex space-x-2'><label className='font-bold'>ผู้ดำเนินการ</label> {displayStatus(item.headDepaApprove)}</div>
            <div className='flex space-x-2'><label className='font-bold'>หัวหน้าฝ่ายเทคโนโลยี</label> {displayStatus(item.headITApprove)}</div>
            <div className='flex space-x-2'><label className='font-bold'>ฝ่ายกำกับภายใน</label> {displayStatus(item.auditApprove)}</div>
            <div className='flex space-x-2'><label className='font-bold'>คณะกรรมการ</label> {displayStatus(item.ref1Approve)}</div>
        </div>
    </div>
    );
};

export const DetailRow = ({ item }) => {
    return (
        <div className="detailRow">
            {/* รายละเอียดหลังจากคลิก row */}
            <div className='detailCell'>
                <div><label className='font-bold'>ตำแหน่ง</label> {item.jobRank}</div>
                <div><label className='font-bold'>เบอร์</label> {item.requestPhone}</div>
                <div><label className='font-bold'>เมลล์</label> {item.requestEmail}</div>
                <div><label className='font-bold'>ขอบข่ายที่เปลี่ยน</label> {item.changeLengh}</div>
            </div>
            <div className="detailCell">
                <div><label className='font-bold'>อุปกรณ์ที่จะเปลี่ยนแปลง</label> {item.changeTool}</div>
                <div><label className='font-bold'>รายละเอียด</label> {item.changeToolInfo}</div> 
                <div><label className='font-bold'>โปรแกรม/ซอร์ดโค้ด</label> {item.scodeName}</div>
                <div><label className='font-bold'>จากเวอร์ชั่น</label> {item.scodeFromVersion} <label className='font-bold'>เป็น</label> {item.scodeToVersion}</div>            
            </div>
            <div className="detailCell">
                <div><label className='font-bold'>สาเหตุเปลี่ยนแปลง</label> {item.changeCoz}</div>
                <div><label className='font-bold'>ผลกระทบที่อาจเกิด</label> {item.changeEff}</div>
            </div>
            <div className="detailCell">
                <div><label className='font-bold'>โครงงานเกี่ยวข้อง</label> {item.researchRel}</div>
                <div><label className='font-bold'>อ้างอิง</label> {item.researchRef}</div>
                <div><label className='font-bold'>อื่นๆ</label> {item.etc}</div>
            </div>
            <div className="detailCell">
                <div><label className='font-bold'>สถานะดำเนินการ</label> {item.changeStatue}</div>
                <div><label className='font-bold'>ผู้ช่วยดำเนินการ</label> {item.mana2Name}</div>
                <div><label className='font-bold'>วันที่คาดว่าจะเสร็จ</label> {moment(item.reqFinishDate).format('DD/MM/YYYY')}</div>
                <div><label className='font-bold'>แผนดำเนินการ</label> {item.implementPlan}</div>
            </div>
            <div className='detailCell'>
                <div><label className='font-bold'>สถานะดำเนินการ</label> {item.changeStatue}</div>
                <div><label className='font-bold'>ผลการเปลี่ยนแปลง</label> {item.changeResult}</div>
                <div><label className='font-bold'>ชื่อผู้เปลี่ยน</label> {item.userChange}</div>
                <div><label className='font-bold'>วันที่เสร็จสิ้น</label> {moment(item.finishDate).format('DD/MM/YYYY')}</div>
                <div><label className='font-bold'>การปรับปรุงเอกสาร</label> {item.changeResName}</div>
            </div>
            <div className="detailCellA">
                <div className='flex space-x-2'><label className='font-bold'>ผู้ดำเนินการ</label> {displayStatus(item.headDepaApprove)}</div>
                <div className='flex space-x-2'><label className='font-bold'>หัวหน้าฝ่ายเทคโนโลยี</label> {displayStatus(item.headITApprove)}</div>
                <div className='flex space-x-2'><label className='font-bold'>ฝ่ายกำกับภายใน</label> {displayStatus(item.auditApprove)}</div>
                <div className='flex space-x-2'><label className='font-bold'>คณะกรรมการ</label> {displayStatus(item.ref1Approve)}</div>
            </div>
        </div>
    );
};
