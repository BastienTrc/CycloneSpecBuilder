import { compileCode } from '../../utils/compile/compileCode';
import { initCompile } from '../../utils/compile/compileGraph';
import './ResultPanel.css';
import React, { useState, useEffect } from 'react';
import { loadSpec, saveSpec } from '../../utils/compile/saveLoad';
import axios from 'axios';

var data;
var init = false;
const machineRegex = /(?:machine|graph) (.*?) *{/

function ResultPanel ({setShowResult}) {
    
    const [specCode, setSpecCode] = useState('');   
    const [terminalContent, setTerminalContent] = useState('');   
    
    function backToGraph(){
        data = compileCode(document.getElementById('codeContainer')?.value)
        // Will allow useEffect on next display of the page
        init = false;
        setShowResult(false);
    }
    
    async function compileSpec(){
        setTerminalContent("Specification is being checked...")
        await axios({
            method: "POST",
            url:"/compileCode", 
            data: {
                specCode : document.getElementById('codeContainer')?.value
            }
        })
        .then((response) => {
            setTerminalContent(response.data.terminal)
        }).catch((error) => {
            if (error.response) {
                console.log(error.response)
            }
            setTerminalContent(error.response.data)
        })
    }

    async function stopSpec(){
        setTerminalContent("Not yet implemented")
       
    }
    
    useEffect( () => {
        initCompile(setSpecCode);
        // Use effect is launched twice
        if (!init){
            init = true;
            // Enable tab input in textareas
            var textarea = document.getElementById('codeContainer');
            if (textarea === null){
                return;
            }
            textarea.addEventListener("keydown", (e) => {
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
    
    function initSaveSpec(){
        let title = specCode.match(machineRegex)?.[1];
        saveSpec(specCode, title)
    }
    
    return (
        <div className='resultPanel flex grow'>
        {/* <div className='sideContainer flexC bordered spaced'>tabContainer</div> */}
        <textarea contentEditable="true" id="codeContainer" className='bordered spaced flex grow3' defaultValue={specCode}/> 
        <div className='sideContainer flexC grow bordered spaced'> 
        <div className='buttonContainer flex evenly spaced'>
        <button className='resultButton backBtn' onClick={() => backToGraph()}> Back to graph</button>
        <button className='resultButton' onClick={(event) => compileSpec()}> Run </button> 
        <button className='resultButton' onClick={(event) => stopSpec()}> Stop </button> 
        <button className='resultButton' onClick={() => initSaveSpec()}> Save</button>
        <button className='resultButton' onClick={() => loadSpec(setSpecCode)}> Upload</button>
        </div>
        <div className='fullSeparator'/>
        <textarea readOnly className='terminal grow' defaultValue={terminalContent}/>
        </div>
        </div>
        )
    }
    
    export default ResultPanel
    
    export function getData(){
        return data;
    }