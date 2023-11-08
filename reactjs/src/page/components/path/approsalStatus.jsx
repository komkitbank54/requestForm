// Approval status constants
const APPROVE = 'Approve';
const DENY = 'Deny';
const PENDING = 'Pending';
const STATUS_MAP = {
  [`${APPROVE},${APPROVE},${APPROVE}`]: 'รอคณะกรรมการอนุมัติ',
  [`${DENY},*,*`]: 'ไม่ได้รับการอนุมัติ',
  [`${PENDING},*,*`]: 'รอผู้ดำเนินการ',
  [`*,${PENDING},*`]: 'รอหัวหน้าฝ่ายอนุมัติ',
  [`*,*,${PENDING}`]: 'รอฝ่ายกำกับอนุมัติ',
};

export function determineApproveStatus(item) {
  const key = [item.headDepaApprove, item.headITApprove, item.auditApprove]
    .map(status => status === DENY ? DENY : status === PENDING ? PENDING : '*')
    .join(',');

  return STATUS_MAP[key] || 'กำลังดำเนินการ';
}
