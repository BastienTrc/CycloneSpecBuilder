import './BlockList.css'
import React from 'react';
import { useState, useEffect } from 'react';


const BlockList = () => {
    // TODO Generate dynamically after
    const [blocks,setBlocks] = useState([
        { title: 'StartNode', id: 1 },
        { title: 'FinalNode', id: 3 }
      ]);
    
      const blockList = blocks.map(block =>(
              <li key={block.id}>
                <div className='copyDraggable blockLeft'>{block.title}</div>
              </li>)
      );
      
      return (
        <div className='blockListContainer'>
        <div className='title'> BlockListPanel </div>
        <ul className='blockList'>{blockList}</ul>
        {/* <button onClick={() => setBlocks(blocks.concat({title: 'newNode', id: 5}))}> add </button>  */}
        </div>
      );
}

export default BlockList;