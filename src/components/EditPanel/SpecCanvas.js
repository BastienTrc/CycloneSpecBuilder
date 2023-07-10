import React from "react";
import './EditPanel.css'

function SpecCanvas({panel}){
    return (
        <div className='canvas'>
        <div> {panel?.name} </div>
        </div>
    )
}

export default SpecCanvas