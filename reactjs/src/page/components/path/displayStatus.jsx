import React from 'react'

      //Display Status
      function displayStatus(approvalValue) {
        switch (approvalValue) {
          case 'Approve':
            return (
                    <div className='flex items-center text-green-600'>
                        อนุมัติ<img src={require('./img/approve.png')} className='smicon' alt="approve" />
                    </div>
            )
          case 'Deny':
            return (
                <div className='flex items-center text-red-600'>
                    ไม่อนุมัติ<img src={require('./img/deny.png')} className='smicon' alt="deny" />
                </div>
        )
          case 'Pending':
            return (
                <div className='flex items-center text-yellow-700'>
                    รออนุมัติ..<img src={require('./img/pending.png')} className='smicon' alt="pending" />
                </div>
        )
          default:
            return (
                <div className='flex items-center text-red-600'>
                    ไม่พบสถานะ<img src={require('./img/deny.png')} className='smicon' alt="pending" />
                </div>
        ) // สำหรับค่าที่ไม่ตรงกับเงื่อนไขใด ๆ
        }
      }

export default displayStatus