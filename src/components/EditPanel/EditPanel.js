import './EditPanel.css';
import React from 'react';
import {useState, useEffect} from 'react';
import Canvas from './Canvas';
import SpecInfos from './SpecInfos';
import SelectedInfos from './SelectedInfos';

function EditPanel ({setShowResult}) {
    // Used to reload specInfos panel
    const [reloadInfos, setReloadInfos] = useState("");
    
    const [selectedData, setSelectedData] = useState(undefined);
        
        return (
            <>
            <div className='editPanelContainer'>
            {/* <div className='tabContainer flex'> {tabList} </div> */}
            <Canvas setShowResult={setShowResult} setReloadInfos={setReloadInfos} setSelectedData={setSelectedData} />
            </div>
            {selectedData !== undefined ? <SelectedInfos selectedData={selectedData}/> : <SpecInfos reloadInfos={reloadInfos}/>}
            </>
            )
        }
        
        export default EditPanel;