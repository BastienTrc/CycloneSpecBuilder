import { Checkbox, FormControl, FormControlLabel, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import './SpecInfos.css'
import React from 'react';

var infos = {title:"", variables:"", goal:"", traceWanted:false, extensionForm: "", debug:false}

function SpecInfos() {
    const [traceWanted, setTraceWanted] = React.useState(false);
    function editTraceWanted(value){
        infos.traceWanted = value;
        setTraceWanted(value);
    }

    React.useEffect( () => {
        setTraceWanted(infos.traceWanted)
    },[])
    
    return (
        <div className='specInfosContainer flexC bordered spaced'>
        <div className='specInfosTitle'> Specification's Infos</div>
        <div className='fullSeparator'/>
        <div className='infosContainer flexC'> 
        <TextField id="titleForm" label="Machine Title" variant="outlined" margin='dense' defaultValue={infos.title} onChange={(event) => infos.title = event.target.value}/>
        <TextField id="variablesForm" label="Variables" variant="outlined" margin='dense' multiline={true} defaultValue={infos.variables} onChange={(event) => infos.variables = event.target.value}/>
        <TextField id="goalForm" label="Goal" variant="outlined" margin='dense' multiline={true} defaultValue={infos.goal} onChange={(event) => infos.goal = event.target.value}/>
        <FormControlLabel control={<Checkbox id='traceForm' defaultChecked={infos.traceWanted}/>} label="Generate trace" onChange={(event) => editTraceWanted(event.target.checked)}/>
        {traceWanted ? 
        <FormControl>
        <InputLabel>Trace extension</InputLabel>
            <Select
                label="traceExtension"
                onChange={(event) => infos.extensionForm = event.target.value}>
                <MenuItem value={"dot"}>Dot file</MenuItem>
                <MenuItem value={"png"}>Png file</MenuItem>
            </Select> 
        </FormControl>
            : ""}
        <FormControlLabel control={<Checkbox id="debugForm" defaultChecked={infos.debug}/>} label="Generate log" onChange={(event) => infos.debug = event.target.checked}/>
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
    let res = {
        title: infos.title,
        variables:  infos.variables,
        goal:  infos.goal,
        trace: infos.traceWanted,
        traceExtension: infos.extensionForm,
        debug: infos.debug
    }
    return res;
}

export function setSpecInfos(content){
    infos = content;
}
