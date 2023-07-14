import React from 'react';
import './Nodes.css';
import {getNetwork} from './../../EditPanel/SpecCanvas';



function StartNode({id, setNodeContent}) {

    function addNode(){
        let network = getNetwork();
        if (!network){
            alert("Can't get canvas, maybe no editor opened?");
            return;
        }
        setNodeContent("Start")
        network.addNodeMode()
    }
    
    return(
        <div>
            <button className='libraryNode' onClick={() => addNode()}> Start  </button>
        </div>
    )
}

export default StartNode;