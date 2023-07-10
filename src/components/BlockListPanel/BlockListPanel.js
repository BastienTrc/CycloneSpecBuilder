import StartNode from './Blocks/StartNode';
import FinalNode from './Blocks/FinalNode';
import './BlockListPanel.css'
import { useState, useEffect } from 'react';


const BlockListPanel = () => {
    // TODO Generate dynamically after
    const blocks = [
        { title: 'StartNode', id: 1 },
        { title: 'FinalNode', id: 3 }
      ];
    
      const blockList = blocks.map(block =>(
       
              <li key={block.id}>
                <div className='copyDraggable'>{block.title}</div>
              </li>)
       
      );
      
      return (
        <div>
        <div className='title'> BlockListPanel </div>
        <ul className='.listPanelBlocks'>{blockList}</ul>
        </div>
      );
}

export default BlockListPanel;