import React, { useEffect, useState } from 'react'
import Table from './components/table'

function Mainpage() {
  const [data, setData] = useState([]);
  console.log(data)

  useEffect(() => {
    fetch('http://localhost:3000/show')
      .then(response => response.json())
      .then(data => setData(data))
      .catch(err => console.error('Error fetching data:', err));
  }, []);

  return (
    <div>
      <Table data={data}/> {/* Pass data to Table */}
    </div>
  )
}

export default Mainpage;
