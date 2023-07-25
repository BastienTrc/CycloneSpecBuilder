import { Checkbox, FormControl, FormControlLabel, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import './SpecInfos.css'
import React from 'react';

function SpecInfos() {
    const [traceWanted, setTraceWanted] = React.useState(false);
    const [traceExtension, setTraceExtension] = React.useState("");

    return (
        <div className='specInfosContainer flexC bordered spaced'>
        <div className='specInfosTitle'> Specification's Infos</div>
        <div className='fullSeparator'/>
        <div className='infosContainer flexC'> 
        <TextField id="titleForm" label="Machine Title" variant="outlined" margin='dense'/>
        <TextField id="variablesForm" label="Variables" variant="outlined" margin='dense' multiline={true}/>
        <TextField id="goalForm" label="Goal" variant="outlined" margin='dense' multiline={true}/>
        <FormControlLabel control={<Checkbox />} label="Generate trace" onChange={(event) => setTraceWanted(event.target.checked)}/>
        {traceWanted ? 
        <FormControl>
        <InputLabel id="traceExtensionForm">Trace extension</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="traceExtension"
                onChange={(event) => setTraceExtension(event.target.value)}
            >
                <MenuItem value={"dot"}>Dot file</MenuItem>
                <MenuItem value={"png"}>Png file</MenuItem>
            </Select> 
        </FormControl>
            : ""}
        <FormControlLabel control={<Checkbox />} label="Generate log"/>
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
    }
   
    return infos;
}
