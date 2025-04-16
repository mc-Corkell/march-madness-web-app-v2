import React, { useEffect, useState } from 'react';

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const events = new EventSource('http://localhost:3001/freethrows');

    events.onmessage = event => {
      const parsed = JSON.parse(event.data);
      console.log('Update:', parsed);
      setData(parsed);
    };

    return () => events.close();
  }, []);

  return (
    <div>
      <h1>Live Data from Server</h1>
      <pre>{data ? JSON.stringify(data, null, 2) : 'Waiting for updates...'}</pre>
    </div>
  );
}

export default App;
