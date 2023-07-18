import React from 'react';
import { getNetwork } from '../../../utils/canvasInit';



function FinalNode({id, setNodeContent}) {
    
    return(
        <div>
            <button id={id} className='libraryNode' onClick={() => setNodeContent(id)}> End  </button>
        </div>
    )
}

export default FinalNode;