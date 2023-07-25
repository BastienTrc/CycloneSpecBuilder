import { Checkbox, FormControl, FormControlLabel, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import './SpecInfos.css'
import React from 'react';

var extensionForm = "";

function SpecInfos() {
    const [traceWanted, setTraceWanted] = React.useState(false);
    const [traceExtension, setTraceExtension] = React.useState("");
    function editExtensionForm(content){
        extensionForm = content;
        setTraceExtension(content);
    }

    return (
        <div className='specInfosContainer flexC bordered spaced'>
        <div className='specInfosTitle'> Specification's Infos</div>
        <div className='fullSeparator'/>
        <div className='infosContainer flexC'> 
        <TextField id="titleForm" label="Machine Title" variant="outlined" margin='dense'/>
        <TextField id="variablesForm" label="Variables" variant="outlined" margin='dense' multiline={true}/>
        <TextField id="goalForm" label="Goal" variant="outlined" margin='dense' multiline={true}/>
        <FormControlLabel control={<Checkbox id='traceForm'/>} label="Generate trace" onChange={(event) => setTraceWanted(event.target.checked)}/>
        {traceWanted ? 
        <FormControl>
        <InputLabel>Trace extension</InputLabel>
            <Select
                label="traceExtension"
                onChange={(event) => editExtensionForm(event.target.value)}>
                <MenuItem value={"dot"}>Dot file</MenuItem>
                <MenuItem value={"png"}>Png file</MenuItem>
            </Select> 
        </FormControl>
            : ""}
        <FormControlLabel control={<Checkbox id="debugForm"/>} label="Generate log"/>
        </div>
        </div>
        )
    }
    
export default SpecInfos;

/**
 * 
 * @returns json containing title, variables and goal
 */
export function getSpecInfos(){
    let infos = {
        title: document.getElementById("titleForm")?.value,
        variables:  document.getElementById("variablesForm")?.value,
        goal:  document.getElementById("goalForm")?.value,
        trace: document.getElementById("traceForm")?.checked,
        traceExtension: extensionForm,
        debug: document.getElementById("debugForm")?.checked,
    }
    return infos;
}
