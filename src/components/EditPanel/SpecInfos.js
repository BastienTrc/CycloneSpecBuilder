import { Checkbox, FormControl, FormControlLabel, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import './SpecInfos.css'
import React from 'react';

var infos = {title:"", variables:"",  goal:"", traceWanted:false, extensionForm: "", debug:false}
var goal = {properties:"", one:"", two:"", three:"", path:""}

function SpecInfos() {
    const [traceWanted, setTraceWanted] = React.useState(false);
    function editTraceWanted(value){
        infos.traceWanted = value;
        setTraceWanted(value);
    }

    const [checkMode, setCheckMode] = React.useState("");
    function editCheckMode(value){
        goal.one = value;
        setCheckMode(value);
    }

    React.useEffect( () => {
        setTraceWanted(infos.traceWanted)
    },[])
    
    return (
        <div className='specInfosContainer flexC bordered spaced'>
        <div className='specInfosTitle'> Specification's Infos</div>
        <div className='fullSeparator'/>
        <div id="infosContainer" className='infosContainer flexC'> 
        <TextField label="Graph name" variant="outlined" defaultValue={infos.title} onChange={(event) => infos.title = event.target.value}/>
        <TextField label="Variables" variant="outlined" multiline={true} defaultValue={infos.variables} onChange={(event) => infos.variables = event.target.value}/>
        <TextField label="Properties" variant="outlined" multiline={true} defaultValue={goal.properties} onChange={(event) => goal.properties = event.target.value}/>
        <div className='flex'>
        <FormControl className='grow'>
        <InputLabel>check/enum</InputLabel>
            <Select
                label="checkModeOne"
                defaultValue={goal.one}
                onChange={(event) => editCheckMode(event.target.value)}>
                <MenuItem value={"check"}>check</MenuItem>
                <MenuItem value={"enumerate"}>enumerate</MenuItem>
            </Select>
        </FormControl>
        {checkMode !== "enumerate" ? 
        <><FormControl className='grow'>
        <InputLabel>for/each/upto</InputLabel>
            <Select
                label="traceExtension"
                defaultValue={goal.two}
                onChange={(event) => goal.two = event.target.value}>
                <MenuItem value={"for"}>for</MenuItem>
                <MenuItem value={"each"}>each</MenuItem>
                <MenuItem value={"upto"}>upto</MenuItem>
            </Select> 
        </FormControl></>
        : 
        <TextField  sx={{
            "& .MuiOutlinedInput-root.Mui-focused": {
              "& > fieldset": {
        borderColor: "gray"
              }
            }
          }}
          style={{width:'40%'}} InputProps={{readOnly: true, }} variant="outlined" multiline={false} value="for"/>
        }
        </div>
        <TextField label="State number" variant="outlined" multiline={true} defaultValue={goal.three} onChange={(event) => goal.three = event.target.value}/>
        <TextField label="Path (optional)" variant="outlined" multiline={true} defaultValue={goal.path} onChange={(event) => goal.path = event.target.value}/>
        <FormControlLabel control={<Checkbox id='traceForm' defaultChecked={infos.traceWanted}/>} label="Generate trace" onChange={(event) => editTraceWanted(event.target.checked)}/>
        {traceWanted ? 
        <FormControl>
        <InputLabel>Trace extension</InputLabel>
            <Select
                label="traceExtension"
                defaultValue={infos.extensionForm}
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
        goal:  `${goal.properties}\n${goal.one} ${goal.two} ${goal.three} ${goal.path}`,
        trace: infos.traceWanted,
        traceExtension: infos.extensionForm,
        debug: infos.debug
    }
    return res;
}

export function setSpecInfos(content){
    infos = content;
    let goalParsed = content.goal.match(/((?:(?:.|\s)*;\s*)*)(check|enumerate|upto|reach) \s*([^ ]*)\s*((?:.|\s)*)/);
    if (goalParsed.length >= 5)
    goal.properties = goalParsed[1]?.trim();
    goal.one = goalParsed[2];
    goal.two = goalParsed[3]?.trim();
    goal.three = goalParsed[4]?.trim();
    if (goalParsed[5] !== undefined){
        goal.path = goalParsed[5]?.trim();
    }
}
