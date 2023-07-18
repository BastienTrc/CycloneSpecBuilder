import React from 'react';

function StartNode({id, setNodeContent}) {
    
    return(
        <div>
            <button id={id} className='libraryNode' onClick={() => setNodeContent(id)}> {id} </button>
        </div>
    )
}

export default StartNode;