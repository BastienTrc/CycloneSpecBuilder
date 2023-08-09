import './EditPanel.css';
import React from 'react';
import {useState, useEffect} from 'react';
import Canvas from './Canvas';
import SpecInfos from './SpecInfos';

function EditPanel ({setShowResult}) {
    // Used to reload specInfos panel
    const [reloadVar, setReloadVar] = useState("");
    
    // // List of all the tabs
    // const [tabs,setTabs] = useState([
    //     {name:'tab1', id:"tab1"},
    //     {name:'tab2', id:"tab2"},
    //     {name:'tab3', id:"tab3"},
    // ]); 
    
    // // Current tab
    // const [activeTabId, setActiveTabId] = useState("");
    // useEffect(() => {
    //     setTab("tab1");
    // },[])
    
    // // List of the html buttons representing the tabs
    // const tabList = tabs.map( tab => (
    //     <button className="canvasTab bordered" id={tab.id.toString()} onClick={() => setTab(tab.id)}> {tab.name}</button>
    //     ));
        
    //     /**
    //     * Set active tab and add corresponding css class
    //     * @param {String} id 
    //     */
    //     function setTab(id){
    //         let oldTab = document.getElementById(activeTabId);
    //         oldTab?.classList.remove("active");
            
    //         setActiveTabId(id)
    //         document.getElementById(id)?.classList.add("active");
    //     }
        
        return (
            <>
            <div className='editPanelContainer'>
            {/* <div className='tabContainer flex'> {tabList} </div> */}
            <Canvas setShowResult={setShowResult} setReloadVar={setReloadVar} /*panel={tabs[parseInt(activeTabId.split("tab")[1]) - 1]}*/ />
            </div>
            <SpecInfos reloadVar={reloadVar}/>
            </>
            )
        }
        
        export default EditPanel;