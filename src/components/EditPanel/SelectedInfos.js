import React from "react";
import './SpecSelectedInfos.css'
import { InputLabel, TextField } from "@mui/material";

function SelectedInfos({selectedData}){

    const infos = selectedData.node ? ["name","code", "parents", "children"] : ["condition","from", "to", "bidirectional"]

    const display = infos.map( info => {
        return <div className="flexC grow"> <InputLabel>{info}</InputLabel> <TextField multiline InputProps={{readOnly: true, }} value={selectedData[info]}/> </div>
    })

    return (
        <div className='container flexC bordered spaced'>
        <div className='infosTitle'> Specification's Infos</div>
        <div className='fullSeparator'/>
        <div id="infosContainer" className='infosContainer flexC' > 
            {display}
        </div>
        </div>
    )
}

export default SelectedInfos