import React from 'react';
import './App.css';

async function onClick() {
  const val = await fetch('http://localhost:4000')
    .then((response) => {
      return response.json()
    }, error => {
      return error
    })
  console.log(val.data);
}

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      text: ''
    }
  }

  // updateText()

  render() {
    const { text } = this.state;

    return (
      <div className="App">
        {/* <input>{text}</input> */}
        <button onClick={onClick}>
          Test
        </button>
      </div>
    );
  }
}

export default App;
