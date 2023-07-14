import React from 'react';
import './App.css';
import './index.css';
import BlockList from './components/BlockListPanel/BlockList';
import EditPanel from './components/EditPanel/EditPanel';
import ResultPanel from './components/ResultPanel/ResultPanel';
import Footer from './components/Footer/Footer';



function App() {

  return (
    <>
    <div className='App-header notDropZone'> HEADER </div>
    <div className='appContainer'>
      <BlockList/>
      <EditPanel/>
      <ResultPanel/>
    
    </div>
    <Footer/>
    </>
    );
  }
  
  export default App;
