// main.jsx
import React from 'react'
import Table from './table/table'
import './fonts/fonts.css';

function MainPage() {


  return (
    <>
      <section>
        {/* table */}
        <div className=''>
          <Table/>
        </div>
      </section>
    </>
  )
}

export default MainPage;
