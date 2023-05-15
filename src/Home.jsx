import React from 'react'

const Home = () => {

    const automatePos = () => {
        window.electron.send('toMain', 'ping');
    }

    return (
        <>
            <h1 className="text-4xl text-black-500 uppercase">Studio Macros!</h1>
            <button onClick={() => {  }} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full'>Automate</button>
        </>
    )
}

export default Home