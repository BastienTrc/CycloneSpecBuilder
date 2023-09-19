import React, { useState } from 'react';
import './App.css';
import './index.css';
import EditPanel from './components/EditPanel/EditPanel';
import ResultPanel from './components/ResultPanel/ResultPanel';
import Footer from './components/Footer/Footer';



function App() {

  const [showResult, setShowResult] = useState(0)

  return (
    <>
    <div className='App-header '> Still looking for a name </div>
    <div className='appContainer'>
      {showResult === 0 ? <> <EditPanel setShowResult={setShowResult}/></>
      : showResult === 1? <ResultPanel setShowResult={setShowResult} launchSpec={true}/> 
      : <ResultPanel setShowResult={setShowResult} launchSpec={false}/>}
    
    </div>
    <Footer/>
    </>
    );
  }
  
  export default App;
