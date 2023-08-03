import { compileCode } from '../../utils/compile/compileCode';
import { getCompiledCode } from '../../utils/compile/compileGraph';
import './ResultPanel.css';
import React, { useState, useEffect, useRef } from 'react';
import { loadSpec, saveSpec } from '../../utils/compile/saveLoad';
import axios from 'axios';
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/theme-iplastic";
import "ace-builds/src-noconflict/ext-language_tools";
import CycloneMode from '../EditPanel/ace/mode-cyclone';


var data;
var init = false;
const machineRegex = /(?:machine|graph) (.*?) *{/

function ResultPanel ({setShowResult}) {
    
    const aceEditorRef = useRef(null);
    
    useEffect(() => {
        debugger;
        
        const cycloneMode = new CycloneMode();
            if(aceEditorRef.current != null){
                aceEditorRef.current.editor.session.setMode(cycloneMode);
            }

        // aceEditorRef.current.editor.setValue(getCompiledCode());
        aceEditorRef.current.editor.setValue(getCompiledCode(), 1);

    }, []) 
    
    const [terminalContent, setTerminalContent] = useState('');   
    
    function backToGraph(){
        debugger;
        data = compileCode(aceEditorRef.current.editor.getValue())
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
                specCode : aceEditorRef?.current?.editor.getValue()
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
    
    function doSaveSpec(){
        let code = aceEditorRef.current.editor.getValue()
        let title = code.match(machineRegex)?.[1];
        saveSpec(code, title)
    }

    function doSetSpecCode(code){
        aceEditorRef.current.editor.setValue(code, 1);
    }
    
    return (
        <div className='resultPanel flex grow'>
        {/* <textarea contentEditable="true" id="codeContainer" className='bordered spaced flex grow3' defaultValue={specCode}/>  */}
        
        {/* <div className='bordered spaced flex' id='editorContainer'> */}
            <AceEditor className='bordered spaced flex'
            ref={aceEditorRef}
            mode="text"
            theme="iplastic"
            editorProps={{ $blockScrolling: true }}
            showPrintMargin={false}
            onChange={(val) => {}}
            width='50%'
            height='calc(83vh-8px)'
            name='codeContainer'
        />
        {/* </div> */}
        <div className='sideContainer flexC grow bordered spaced'> 
        <div className='buttonContainer flex evenly spaced'>
        <button className='resultButton backBtn' onClick={() => backToGraph()}> Back to graph</button>
        <button className='resultButton' onClick={(event) => compileSpec()}> Run </button> 
        <button className='resultButton' onClick={(event) => stopSpec()}> Stop </button> 
        <button className='resultButton' onClick={() => doSaveSpec()}> Save</button>
        <button className='resultButton' onClick={() => loadSpec(doSetSpecCode)}> Upload</button>
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