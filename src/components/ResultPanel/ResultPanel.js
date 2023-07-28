import { compileCode } from '../../utils/compile/compileCode';
import { initCompile } from '../../utils/compile/compileGraph';
import './ResultPanel.css';
import React, { useState, useEffect } from 'react';

var data;
var init = false;

function ResultPanel ({setShowResult}) {
    
    const [specCode, setSpecCode] = useState('');
    
    function backToGraph(){
        data = compileCode(document.getElementById('codeContainer')?.value)
        if (data.nodes === 0 || data.edges === 0){
            return;
        }
        // Will allow useEffect on next display of the page
        init = false;
        setShowResult(false);
    }
    
    useEffect( () => {
        initCompile(setSpecCode);
        // Use effect is launched twice
        if (!init){
            init = true;
            // Enable tab input in textareas
            var textarea = document.getElementById('codeContainer');
            textarea?.addEventListener("keydown", (e) => {
                if(e.key === "Tab"){
                    e.preventDefault();
                    if (!e.repeat){
                        let pos = textarea.selectionStart;
                        textarea.value = textarea?.value.substring(0, pos) + "\t" + textarea?.value.substring(pos);
                        textarea.selectionStart = pos + 1;
                        textarea.selectionEnd = pos + 1;
                    }
                }
            })
        }
    },[])
    
    return (
        <div className='resultPanel flex grow'>
        {/* <div className='sideContainer flexC bordered spaced'>tabContainer</div> */}
        <textarea contentEditable="true" id="codeContainer" className='bordered spaced flex grow3' defaultValue={specCode}/> 
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
    
    export default ResultPanel
    
    export function getData(){
        return data;
    }