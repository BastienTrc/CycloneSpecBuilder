import React, { useState } from 'react';
import './App.css';
import './index.css';
import BlockList from './components/BlockListPanel/BlockList';
import EditPanel from './components/EditPanel/EditPanel';
import ResultPanel from './components/ResultPanel/ResultPanel';
import Footer from './components/Footer/Footer';



function App() {

  const [showResult, setShowResult] = useState(false)

  return (
    <>
    <div className='App-header '> HEADER </div>
    <div className='appContainer'>
      {showResult ? <ResultPanel setShowResult={setShowResult}/> : <><BlockList/> <EditPanel setShowResult={setShowResult}/></>}
    
    </div>
    <Footer/>
    </>
    );
  }
  
  export default App;
