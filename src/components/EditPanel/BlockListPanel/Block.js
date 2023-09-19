import React from 'react';

function Block({id, addNode}) {
    let className = "libraryNode "+id; // If id is abstract will add dashed lines
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
            <button id={id} className={className} onClick={() => addNode(id)}> {id} </button>
        </div>
    )
}

export default Block;