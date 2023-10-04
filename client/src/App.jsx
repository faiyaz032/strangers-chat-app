import { useState } from 'react';
import Chat from './components/Chat';

function App() {
  const [findStranger, setFindStranger] = useState(false);

  return (
    <div>
      <div className="header">
        <h1>Chit Chat With Strangers</h1>
      </div>

      {findStranger ? (
        <Chat />
      ) : (
        <div className="find-stranger-btn-container">
          <button className="find-stranger-btn" onClick={() => setFindStranger(true)}>
            Find Stranger
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
