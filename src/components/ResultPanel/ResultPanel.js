import { getResult, initCompile } from '../../utils/compile/compileGraph';
import './ResultPanel.css';
import React, { useState, useEffect } from 'react';

function ResultPanel ({setShowResult}) {
    
    const [specCode, setSpecCode] = useState(``);
    
    function setMyResult(compiledCode){
        setSpecCode(compiledCode)
    }

    function backToGraph(){
        setShowResult(false);
    }
    
    useEffect( () => {
        initCompile(setMyResult);
        getResult();
    },[])
    
    return (
        <div className='resultPanel flex grow'>
            <div className='sideContainer flexC bordered spaced'>tabContainer</div>
            <textarea className='codeContainer bordered spaced flex grow3' defaultValue={specCode}></textarea> 
            <div className='sideContainer flexC grow bordered spaced'> 
                <div className='buttonContainer flex evenly spaced'>
                    <button className='resultButton backBtn' onClick={() => backToGraph()}> Back to graph</button>
                    <button className='resultButton' disabled={true}> Run </button> 
                    <button className='resultButton' disabled={true}> Stop </button> 
                    <button className='resultButton' disabled={true}> Save</button>
                    <button className='resultButton' disabled={true}> Upload</button>
                </div>
                <div className='fullSeparator'/>
                <pre className='terminal'> Terminal ?</pre>
            </div>
        </div>
        )
    }
    
    export default ResultPanel; 