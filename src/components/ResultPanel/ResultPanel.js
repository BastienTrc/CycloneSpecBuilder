import './ResultPanel.css';
import React from 'react';

function ResultPanel () {
    return (
    <div className='resultPanel notDropZone'>
    <button> Launch </button> 
    <button> End</button>
    <div className='consoleContainer'>Result panel </div>
    </div>
    )
}

export default ResultPanel; 