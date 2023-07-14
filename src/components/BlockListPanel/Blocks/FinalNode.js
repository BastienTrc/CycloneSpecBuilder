import React from 'react';
import './Nodes.css'
import {getNetwork} from './../../EditPanel/SpecCanvas'



function FinalNode({id, setNodeContent}) {

    function addNode(){
        let network = getNetwork();
        if (!network){
            alert("Can't get canvas, maybe no editor opened?")
        }
        setNodeContent("End")
        network.addNodeMode()
    }
    
    return(
        <div>
            <button className='libraryNode' onClick={() => addNode()}> End  </button>
        </div>
    )
}

export default FinalNode;