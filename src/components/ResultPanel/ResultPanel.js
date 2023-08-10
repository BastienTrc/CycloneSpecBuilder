import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { compileCode } from '../../utils/spec/compileCode';
import { getCompiledCode } from '../../utils/spec/compileGraph';
import { FormControl, MenuItem, Select, InputLabel } from '@mui/material';
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/theme-iplastic";
import "ace-builds/src-noconflict/ext-language_tools";
import CycloneMode from '../EditPanel/ace/mode-cyclone';
import './ResultPanel.css';


var networkData;
var pageInit = false;
var aceEditor;
var pngWanted;

function ResultPanel ({setShowResult, launchSpec}) {
    
    const aceEditorRef = useRef(null);
    const [terminalContent, setTerminalContent] = useState(''); 
    const [isRunning, setIsRunning] = useState(false)  
    const [imageBytes, setImageBytes] = useState("");
    const [showEditor, setShowEditor] = useState(!launchSpec)
    
    useEffect( () => {
        const cycloneMode = new CycloneMode();
        aceEditor = aceEditorRef.current.editor
        if(aceEditorRef.current != null){
            aceEditor.session.setMode(cycloneMode);
        }

        let code = getCompiledCode() 
        if(/option-output *= *"png";/.test(code)){ // Check if png wanted and replace code with right syntax
            pngWanted = true;
            code = code.replace(/option-output *= *"png";/,'option-output = "dot";')
        }
        aceEditor.setValue(code, 1);

        // For unknown reason, useEffect called twice, making solver crash
        if (!pageInit && launchSpec){ 
            pageInit = true;
            compileSpec()
        }
    }, []) 
    
    
    function backToGraph(){
        networkData = compileCode(aceEditor.getValue(), pngWanted)
        // Will allow useEffect on next display of the page
        pageInit = false;
        setShowResult(0);
    }
    
    async function compileSpec(){
        let code = aceEditorRef?.current?.editor.getValue();
        let extension = pngWanted ? "png" : code.match(/option-output *= *(.*);/)?.[1].replaceAll('"','').trim() ;
        if (code === ""){
            setTerminalContent("Specification is empty, check cancelled.")
        }
        setIsRunning(true)
        setTerminalContent("Specification is being checked...")
        setImageBytes("")
        await axios({
            method: "POST",
            url:"/compileCode", 
            data: {
                specCode : code,
                extension : extension ? extension : "" // default mode is png
            }
        })
        .then((response) => {
            setIsRunning(false)
            if (extension === "png"){
                setImageBytes(response.data.image)
            } 
            setTerminalContent(response.data.terminal)
        }).catch((error) => {
            setIsRunning(false)
            if (error.response) {
                console.log(error.response)
            }
            setTerminalContent(error.response.data)
        })
    }

    function changeExtension(value){
        if (value === undefined){
            return;
        }
        if (value === "png"){ // Remove option-trace
            value = "dot"
            pngWanted = true;
        } else {
            pngWanted = false;
        }
        
        let code = aceEditor.getValue();
        if (value === ""){ // Remove option-trace
            code = code.replace(/option-output.*?; *\n/,'').replace(/option-trace.*?; *\n/,'')
            aceEditor.setValue(code, 1)
            return;
        }

        if (/option-trace.*?false.*?;/.test(code)){ // switch false -> true
            code = code.replace(/option-trace.*?false.*?;/,`option-trace = true;`)
        } else if (!/option-trace.*?;/.test(code)){ // add option-trace="true"
            code = `option-trace = true;\n${code}`
        }
        if (/option-output.*?;/.test(code)){ // switch extension
            code = code.replace(/option-output.*?;/,`option-output = "${value}";`)
        } else { // add option-output=...
            code = `option-output = "${value}";\n${code}`
        }
        aceEditor.setValue(code, 1)
        
    }
 
    
    return (
        <div className='resultPanel flex grow'>
    
        <div className='sideContainer flexC bordered'> 
        <div className='buttonContainer flex evenly spaced'>
        <button className='resultButton backBtn' onClick={() => backToGraph()}> Back to graph</button>
        <FormControl>
            <Select sx={{ "& fieldset": { border: 'none' }, height: '100%'}} className='resultButton' size="small"
                label="traceExtension"
                onChange={(event) => changeExtension(event.target.value)}
                displayEmpty
                defaultValue={undefined}>
                <MenuItem value={undefined}>Select trace type </MenuItem>
                <MenuItem value={""}>No trace </MenuItem>
                <MenuItem value={"trace"}>Trace: .trace </MenuItem>
                <MenuItem value={"dot"}>Trace: .dot </MenuItem>
                <MenuItem value={"png"}>Trace: .png </MenuItem>
            </Select> 
        </FormControl>
        <button className='resultButton' disabled={isRunning} onClick={(event) => compileSpec()}> Run </button> 
        <button className='resultButton' onClick={() => setShowEditor(!showEditor)}> Show/Hide Editor </button> 
        </div>
        <div className='fullSeparator'/>
        <pre className='terminal ' > {terminalContent}</pre>
        {imageBytes ? <img src={"data:image/png;base64,"+imageBytes} className='traceImage'/> : ""}
        </div>

        <AceEditor className='bordered spaced flex grow'
        style={{visibility : showEditor ? "visible" : "hidden"}}
        ref={aceEditorRef}
        mode="text"
        theme="iplastic"
        editorProps={{ $blockScrolling: true }}
        showPrintMargin={false}
        onChange={(val) => {}}
        height='calc(83vh-8px)'
        width='fit-content'
        name='codeContainer'
        />

        </div>
        )
    }
    
    export default ResultPanel
    
    export function getData(){
        return networkData;
    }