import React from 'react';
import './App.css';

async function onClick() {
  const val = await fetch('http://localhost:4000')
    .then((response) => {
      return response.json()
    }, error => {
      return error
    })
  console.log(val);

}

function App() {
  return (
    <div className="App">
      <button onClick={onClick}>
        Test
      </button>
    </div>
  );
}

export default App;
