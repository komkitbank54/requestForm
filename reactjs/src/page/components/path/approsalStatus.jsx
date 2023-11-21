// approsalStatus.jsx
export const determineApproveStatus = (headDepaApprove, headITApprove, auditApprove, ref1Approve) => {
  if (headDepaApprove === 'Deny' || headITApprove === 'Deny' || auditApprove === 'Deny') {
    return 'ไม่ได้รับการอนุมัติ';
  }
  if (headDepaApprove === 'Approve' && headITApprove === 'Approve' && auditApprove === 'Approve' && ref1Approve === 'Approve') {
    return 'ได้รับการอนุมัติ';
  }
  if (headDepaApprove === 'Pending') {
    return 'รอผู้ดำเนินการ..';
  }
  if (headITApprove === 'Pending') {
    return 'รอหัวหน้าฝ่ายอนุมัติ..';
  }
  if (auditApprove === 'Pending') {
    return 'รอฝ่ายกำกับอนุมัติ..';
  }
  if (ref1Approve === 'Pending') {
    return 'รอคณะกรรมการอนุมัติ..';
  }
  return 'กำลังดำเนินการ..';
}
