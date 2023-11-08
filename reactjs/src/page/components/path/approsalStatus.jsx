    // approsalStatus.jsx
    export const determineApproveStatus = (headDepaApprove, headITApprove, auditApprove) => {
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