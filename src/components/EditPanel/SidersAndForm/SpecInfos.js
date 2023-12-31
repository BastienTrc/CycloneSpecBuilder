import { Checkbox, FormControl, FormControlLabel, InputLabel, MenuItem, Select, TextField, IconButton} from '@mui/material';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import './SpecSelectedInfos.css'
import React from 'react';
import { getNetwork } from '../EditPanel';

var infos = {title:"",  goal:"", extensionForm: "", debug:false}
var varList = [];
var invariantList = [];
var goal = {properties:"",  one:"", two:"", three:"", path:"", reach:[]}
var nodeList = [];
var network;


function SpecInfos({reloadInfos}) {
    
    const [reloadNodesList, setReloadNodesList] = React.useState(0); // Used to update select items
    const [reloadVariables, setReloadVariables] = React.useState(0); // Used to update select items
    const [reloadInvariants, setReloadInvariants] = React.useState(0); // Used to update invariants
    const [checkMode, setCheckMode] = React.useState("");
    function editCheckMode(value){
        goal.one = value;
        setCheckMode(value);
    }
    
    React.useEffect( () => {
        network = getNetwork()
        if (!network){
            return
        }
        nodeList = network.body.nodeIndices.map(nodeId => {return network.body.data.nodes.get(nodeId).label})
        setReloadNodesList(Math.random())
        
        
        // Update reach select menu when user add and remove nodes
        network.body.data.nodes._subscribers.remove[1] = ((eventName, event) => {
            let nodeLabel = event.oldData[0].label
            nodeList = nodeList.filter(e => e !== nodeLabel);

            goal.reach = goal.reach.filter(e => e !== nodeLabel); // Delete from options if checked earlier
            for (let i = 0; i < invariantList.length; i++){
                invariantList[i].in = invariantList[i].in.filter(e => e !== nodeLabel);
            }
            setReloadNodesList(Math.random())
        })
        network.body.data.nodes._subscribers.add[1] = ((eventName, event) => {
            nodeList.push(event.items[0]);
            
            setReloadNodesList(Math.random())
        })
        // Update selections and reach options if a node label is edited
        network.body.data.nodes._subscribers.update[1] = ((eventName, event) => {
            let oldLabel = event.oldData[0].label;
            let index = nodeList.indexOf(oldLabel)
            if (index !== -1){
                nodeList[index] = network.body.data.nodes.get(event.items[0]).label

                index = goal.reach.indexOf(oldLabel)
                if (index !== -1){
                    goal.reach[index] = network.body.data.nodes.get(event.items[0]).label
                }

                for (let i = 0; i < invariantList.length; i++){
                    index = invariantList[i].in.indexOf(oldLabel)
                    if (index !== -1){
                        invariantList[i].in[index] = network.body.data.nodes.get(event.items[0]).label
                    }
                }
                setReloadNodesList(Math.random())
            }
        })
    }, [reloadInfos])

    function deleteInvariant(index){
        let element = invariantList[index]
        invariantList = invariantList.filter(e => e !== element)
        setReloadInvariants(Math.random())

    }

    function addInvariant(){
        invariantList.push({name: "", condition:"", in:[]})
        setReloadInvariants(Math.random())
    }

    function deleteVar(index){
        let element = varList[index]
        varList = varList.filter(e => e !== element)
        setReloadVariables(Math.random())
    }

    function addVar(){
        varList.push({varType:"", name:"", condition:""})
        setReloadVariables(Math.random())
    }

    return (
        <div className='container flexC bordered spaced'>
        <div className='infosTitle'> Specification's Infos</div>
        <div className='fullSeparator'/>
        <div id="infosContainer" className='infosContainer flexC' key={reloadInfos}> 
        <TextField label="Graph name" variant="outlined" defaultValue={infos.title} onChange={(event) => infos.title = event.target.value}/>
       
        { varList.length !== 0 ? 
        <div key={reloadVariables} className='flexC bordered varContainer'> 
        {varList.map((property, index) => {
            return(
                <div className='varOptionsContainer flexC'>
                <div className='flex alignC'>
                <FormControl size='small'>
                <InputLabel>Type</InputLabel>
                <Select sx={{minWidth:"80px"}}
                label="varType"
                size='small'
                defaultValue={property.varType}
                onChange={(event) => property.varType = event.target.value}>
                <MenuItem value={"int"}>int</MenuItem>
                <MenuItem value={"bool"}>bool</MenuItem>
                </Select>
                </FormControl>
                <TextField sx={{marginLeft:"4px"}} label="name" variant="outlined" multiline={true} defaultValue={property.name} size='small' onChange={(event) => property.name = event.target.value}/>
                </div>
                <div className='flex grow'>
                <TextField className='flex grow' label="condition" variant="outlined" multiline={true} size='small' defaultValue={property.condition} onChange={(event) => property.condition = event.target.value}/>
                <IconButton aria-label="delete" size='small' onClick={() => deleteVar(index)}>
                <RemoveCircleOutlineIcon />
                </IconButton>
                </div>
                </div>)
        })} 
        </div> 
        : ""}
        <IconButton aria-label="delete" onClick={() => addVar()} sx={{borderRadius:"5%"}}>
            Add variable <AddCircleOutlineIcon/>
        </IconButton>
                
        { invariantList.length !== 0 ? 
        <div className='flexC bordered varContainer'> 
        {invariantList.map((invariant, index) => {
            return(
                <div className='varOptionsContainer flexC'>
                <TextField className='flex grow' label="Condition" variant="outlined" multiline={true} size='small' defaultValue={invariant.condition} onChange={(event) => invariant.condition = event.target.value}/>
                
                <div className='flex grow'>
                <TextField sx={{ maxWidth:"150px"}} className='flex grow' label="Name" variant="outlined" size='small' defaultValue={invariant.name} onChange={(event) => invariant.name = event.target.value}/>
                <FormControl size='small'>
                <InputLabel>In</InputLabel>
                <Select sx={{minWidth:"60px", maxWidth:"100px"}}
                label="varType"
                size='small'
                multiple
                defaultValue={invariant.in}
                onChange={(event) => invariant.in = event.target.value}>
                {nodeList.map(nodeLabel => {
                    return <MenuItem value={nodeLabel}>{nodeLabel}</MenuItem>
                })}
                </Select>
                </FormControl>
                 <IconButton aria-label="delete" size='small' onClick={() => deleteInvariant(index)}>
                <RemoveCircleOutlineIcon />
                </IconButton>
                </div>
                </div>)
        })} 
        </div> 
        : ""}
        <IconButton aria-label="delete" onClick={() => addInvariant()} sx={{borderRadius:"5%"}}>
            Add invariant <AddCircleOutlineIcon/>
        </IconButton>

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
    <TextField label="Path length" variant="outlined" multiline={true} defaultValue={goal.three} onChange={(event) => goal.three = event.target.value}/>
    <TextField label="Path (optional)" variant="outlined" multiline={true} defaultValue={goal.path} onChange={(event) => goal.path = event.target.value}/>
    <FormControl key = {reloadNodesList}>
    <InputLabel> Reach </InputLabel>
    <Select
    multiple
    label="reach"
    defaultValue={goal.reach}
    onChange={(event) => goal.reach = event.target.value}>
    {nodeList.map(nodeLabel => {
        return <MenuItem value={nodeLabel}>{nodeLabel}</MenuItem>
    })}
    </Select> 
    </FormControl>
    
    <FormControl>
    <Select
    sx={{ '& legend': { display: 'none' }, '& fieldset': { top: 0 },}} 
    label="traceExtension"
    defaultValue={infos.extensionForm}
    onChange={(event) => infos.extensionForm = event.target.value}
    displayEmpty>
    <MenuItem value={""}>No trace </MenuItem>
    <MenuItem value={"trace"}>Trace: .trace </MenuItem>
    <MenuItem value={"dot"}>Trace: .dot </MenuItem>
    <MenuItem value={"png"}>Trace: .png </MenuItem>
    </Select> 
    </FormControl>
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
    debugger;
    let res = {
        title: infos.title,
        invariants: invariantList,
        variables:  varList.map(property => {
            return `${property.varType} ${property.name} ${property.condition ? `where ${property.condition}` : ""};\n`
        }).join(""),
        goal:  `${goal.properties}\n${goal.one} ${goal.two} ${goal.three} ${goal.path ? "condition "+goal.path : ""} ${goal.reach.length !== 0 ? `reach (${goal.reach.join(",")})` : ""}`,
        extensionForm: infos.extensionForm,
        debug: infos.debug
    }
    return res;
}

export function setSpecInfos(content){
    varList = []; // Reset variables
    if (content === "" || !content){
        infos = {title:"", goal:"", extensionForm: "", debug:false}
        goal = {properties:"", one:"", two:"", three:"", path:"", reach:[]}
        invariantList = [];
        return;
    }
    if (content.extensionForm === undefined){
        content.extensionForm = "";
    }
    infos = content;
    let varIterator = content.variables.matchAll(/(int|bool)\s+(.*?)\s*(?:where\s+(.*?))?;/g)
    let currentVar = varIterator.next();
    while (!currentVar.done){
        varList.push({
            varType: currentVar.value[1],
            name: currentVar.value[2],
            condition: currentVar.value.length === 4 ? currentVar.value[3] : ""
        })
        currentVar = varIterator.next();
    }
    invariantList = content.invariants


    let goalParsed = content.goal.match(/((?:(?:.|\s)*;\s*)*)(check|enumerate|upto|reach) \s*([^ ]*)\s*([^ ]*)\s*(?:condition\s*([^ ]*))?\s*(?:reach\s*\((.*)\))?/);
    if (goalParsed === null || goalParsed === undefined){
        return;
    }
    goal.properties = goalParsed[1]?.trim();
    goal.one = goalParsed[2];
    goal.two = goalParsed[3]?.trim();
    goal.three = goalParsed[4]?.trim();
    if (goalParsed[5] !== undefined){
        goal.path = goalParsed[5]?.trim();
    }
    if (goalParsed[6] !== undefined){
        goal.reach = goalParsed[6]?.replace(/\s*/,'').split(",");
    }
}
