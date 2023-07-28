import React from 'react';

function Nodes({id, setNodeContent}) {
    let className = "libraryNode ";
    // Add all modifiers for style
    let modifiers = ["Start", "Normal", "Final"];
    modifiers.forEach( modifier => {
        if (id.includes(modifier)){
            className += modifier+" ";
        }
    })
    // Can't check this one with previous
    if (id.includes("StartNormalFinal")){
        className = "libraryNode StartFinal Normal";
    }
    // Needed to avoid className with: Start/Final/StartFinal
    if (id.includes("StartFinal")){
        className = "libraryNode StartFinal";
    }

    
    return(
        <div>
            <button id={id} className={className} onClick={() => setNodeContent(id)}> {id} </button>
        </div>
    )
}

export default Nodes;