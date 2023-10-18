// main.jsx
import React, { useEffect, useState } from 'react'
import Table from './components/table'
import './fonts/fonts.css';

function Mainpage() {
  const [data, setData] = useState([]);
  console.log(data)

  //fetch data
  useEffect(() => {
    fetch('http://localhost:3000/show')
      .then(response => response.json())
      .then(data => setData(data))
      .catch(err => console.error('Error fetching data:', err));
  }, []);

  return (
    <>
      <section>
        {/* table */}
        <div className='w-[50%]'>
          <Table data={data} setData={setData}/>
        </div>
      </section>
    </>
  )
}

export default Mainpage;
