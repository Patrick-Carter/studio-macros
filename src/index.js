import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
//import screenshot from './scripts/screenshot';

const App = () => {
  window.electron.receive('screenshot', (data) => {
    console.log(data); // prints "pong"
  });

  const automatePos = () => {
    // screenshot((data) => {
    //   window.electron.send('screenshot', { img: data });
    // })

    window.electron.send('screenshot', 'yep');
  }

  return (
    <div className="App">
      <h1 className="text-4xl text-black-500 uppercase">Studio Macros!</h1>
      <button onClick={automatePos} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full'>Automate</button>
    </div>
  );
};

const root = createRoot(document.getElementById('root'));
root.render(<App />);
