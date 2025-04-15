import React, { useEffect } from 'react';

function App() {
  useEffect(() => {
    fetch('http://localhost:3001/api/data')
      .then(res => res.json())
      .then(data => console.log(data))
      .catch(error => console.error('Error:', error));
  }, []);

  return <div>Katie's Basic Website Woohoo</div>;
}

export default App;
