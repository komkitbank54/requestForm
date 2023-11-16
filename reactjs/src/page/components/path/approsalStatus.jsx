    // approsalStatus.jsx
    export const determineApproveStatus = (headDepaApprove, headITApprove, auditApprove, ceoApprove) => {
        // If ค่าอะไรก็ตาม = 'Deny', ในตารางจะโชว์ 'ไม่อนุมัติ'
        if (headDepaApprove === 'Deny' || headITApprove === 'Deny' || auditApprove === 'Deny') {
          return (
            <div className="text-red-700">
              ไม่ได้รับการอนุมัติ
            </div>
          );
        }
        // If Approve ทั้งหมดแล้ว 'รอกรรมการ'
        if (headDepaApprove === 'Approve' && headITApprove === 'Approve' && auditApprove === 'Approve' && ceoApprove === 'Approve') {
          return (
            <div className="text-green-700">
              ได้รับการอนุมัติ
            </div>
          );
        }
        // If ถ้ารอดำเนินการ 'Pending', จะขึ้นว่ารอดำเนินการ
        if (headDepaApprove === 'Pending') {
          return 'รอผู้ดำเนินการ..';
        }
        if (headITApprove === 'Pending') {
          return 'รอหัวหน้าฝ่ายอนุมัติ..'
        }
        if (auditApprove === 'Pending') {
          return 'รอฝ่ายกำกับอนุมัติ..';
        }
        if (ceoApprove === 'Pending') {
          return 'รอคณะกรรมการอนุมัติ..';
        }
        // Default to pending if none of the above conditions are met
        return 'กำลังดำเนินการ..';
      }