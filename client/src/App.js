import React, { useEffect } from 'react';

function App() {
  useEffect(() => {
    fetch('http://localhost:5000/api/data')
      .then(res => res.json())
      .then(data => console.log(data));
  }, []);

  return <div>Katie's Basic Website Woohoo</div>;
}

export default App;
