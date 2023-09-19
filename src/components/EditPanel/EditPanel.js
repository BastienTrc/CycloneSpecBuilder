import React, { useEffect } from "react";
import { Network } from "vis-network/standalone";
import { DataSet } from "vis-data/standalone"
import './EditPanel.css';
import FormDialog from './SidersAndForm/FormDialog'
import ContextMenu from "../../utils/canvas/ContextMenu";
import SpecInfos, { setSpecInfos } from "./SidersAndForm/SpecInfos";
import { switchNodeContent, createSwitchButton } from "../../utils/canvas/canvasUtils";
import { compileGraph } from "../../utils/spec/compileGraph";
import { getData } from "../ResultPanel/ResultPanel";
import { loadSpec, saveSpec } from '../../utils/spec/saveLoad';

import compileImg from "../../resources/compileIcon.png";
import clearImg from "../../resources/clearIcon.png";
import loadImg from "../../resources/loadIcon.png";
import saveImg from "../../resources/saveIcon.png";
import SelectedItemInfos from "./SidersAndForm/SelectedItemInfos";
import BlockList from "./BlockListPanel/BlockList";



var network;
// Text displayed in the header of the canvas
var canvasInfo;
var addNodeMode = false;
var edgeMode = false;
var deleteMode = false;
var codeMode = false;
var selectedButton;
const linkKey = 'l'
const deleteKey = 'd'
const codeKey = 'c'

var switchButtons = [];

// Following functions are declared outside of Canvas function to be exported BUT are defined inside Canvas function to access some states
var doCancelAction;
var doLinkSeveralNodes;

var hasBeenInit; // initCanvas is run twice in dev mode, causing problem with eventListeners
var nodeID; // ID of the node to change type

// Used as an intermediary between form and canvas to edit nodes and edges
var selectedItemLabel = ""
export function setSelectedItemLabel(value){
    selectedItemLabel = value;
}


function EditPanel({ setShowResult}){
    const [reloadInfos, setReloadInfos] = React.useState("");
    // Data to display on rightPanel
    const [selectedData, setSelectedData] = React.useState(undefined); 
    // Used to show the dialog
    const [open, setOpen] = React.useState(false);
    
    const [menuPosition, setMenuPosition] = React.useState({x:"0px",y:"0px"});
    const [menuVisible, setMenuVisible] = React.useState(false);
    
    const networkOptions = {
        manipulation: {
            enabled: false,
            addNode: function(nodeData,callback) {
                let content = selectedItemLabel;
                nodeData.id = content+(++counter);
                nodeData.label = content+counter;
                nodeData.group = content;
                nodeData.code = "";
                callback(nodeData);
                getNetwork().addNodeMode(); // Allow several add of nodes
            },
            addEdge: function(edgeData,callback) {
                let network = getNetwork()
                let connectedNodes = network.getConnectedNodes(edgeData.from, "to")
                if (severalMode !== "false"){
                    let edgeLabel = selectedItemLabel
                    network.body.nodeIndices.forEach( nodeId => {
                        // If will link to itself and in Plus mode, return
                        if ((nodeId === edgeData.from && severalMode === "plus") || connectedNodes.includes(nodeId) ){
                            return;
                        }
                        edgeData.to = nodeId
                        edgeData.id = hash(edgeData+nodeId+Math.random())
                        edgeData.label = edgeLabel
                        callback({...edgeData}); // Make a copy or else will share the same object
                        network.addEdgeMode();
                    })
                    callback()
                    return;
                }
                if (connectedNodes.includes(edgeData.to)){
                    window.alert("Edge already exist")
                    callback()
                    return;
                }
                if (edgeData.from === edgeData.to) {
                    var r = window.confirm("Do you want to connect the node to itself?");
                    if (r === true) {
                        callback(edgeData);
                        network.addEdgeMode(); // Allow several add of edges
                    }
                }
                else {
                    callback(edgeData);
                    network.addEdgeMode(); // Allow several add of edges
                }
            },
            editNode: function(nodeData,callback) {
                nodeData.label = selectedItemLabel;
                callback(nodeData);
            },
            editEdge: {
                editWithoutDrag: function(edgeData,callback) {
                    edgeData.label = selectedItemLabel;
                    callback(edgeData);
                },
            },
            
        },
        height: "90%",
        edges: {
            arrows:{
                to:{
                    enabled: true,
                    type: "vee",
                },
            },
            smooth:{
                type: 'curvedCW', 
                roundness: 0.025
            }, // Straight line or not
        },
        physics: { // Physics are enabled to avoid overlap
            enabled : true,
            barnesHut: {
                springConstant: 0,
                centralGravity: 0, // Prevent node to be attracted by the center
                avoidOverlap: 1, 
                damping: 1, // Reduce velocity / inertia of nodes when repulsed
                gravitationalConstant: -800,
            }
        },
        interaction: {
            multiselect: true,
            navigationButtons: true
        },
        nodes: {
            shape: "box"
        },
        groups: {
            // By default, a node i abstract
            Abstract: {color:{background:'white', border:'black', highlight:{background:"white"}}, shapeProperties: { borderDashes: [5,2]}, shape:"box" },
            Start: {color:{background:'lightgreen', border:'black', highlight:{background:"lightgreen"}}, shapeProperties: {borderDashes: [5,2]}, shape:"box"},
            Final: {color:{background:'lightcoral', border:'black', highlight:{background:"lightcoral"}}, shapeProperties: {borderDashes: [5,2]}, shape:"box"},
            StartFinal: {color:{background:'lightblue', border:'black', highlight:{background:"lightblue"}}, shapeProperties: {borderDashes: [5,2]}, shape:"box"},
            
            Normal: {color:{background:'white', border:'black', highlight:{background:"white"}}},
            StartNormal: {color:{background:'lightgreen', border:'black', highlight:{background:"lightgreen"}}},
            NormalFinal: {color:{background:'lightcoral', border:'black', highlight:{background:"lightcoral"}}},
            StartNormalFinal: {color:{background:'lightblue', border:'black', highlight:{background:"lightblue"}}},
            
        },
        //TODO Remove seed, just for example
        layout:{
            randomSeed: "0.689730575122681:1689865843039"
        }
    }
    
    
    useEffect( () => {
        if (hasBeenInit){
            return;
        }
        hasBeenInit = true;
        
        
        // create a container for the network
        var container = document.getElementById("canvasContainer");
        if (!container){
            return; //TODO Better handling
        }
        
        var data = getData();
        if (data === undefined || data.nodes === undefined){
            data = {}
            // data = generateData()
        }
        data.nodes = new DataSet(data.nodes);
        data.edges = new DataSet(data.edges);
        
        // @ts-ignore Error checking problem with vis-network
        network = new Network(container, data, networkOptions);
        
        doCancelAction = () =>  {
            setMenuVisible(false);
            network.unselectAll();
            cancelAddNodeMode();
            
            // Cancel by clicking the right switch button
            let id = "";
            if (edgeMode){
                getNetwork().disableEditMode();
                setCanvasInfo("Ready to draw!");
                selectedButton?.classList.remove('selected');
                edgeMode = false;
            } else if (deleteMode){
                id = 'switchDeleteMode'
            }
            
            switchButtons.forEach((switchButton => {
                if (switchButton.htmlFor === id){
                    switchButton.click();
                }
            }));
        }
        
        doLinkSeveralNodes = (excludeItself, withLabel) => {
            if (edgeMode){
                getNetwork().disableEditMode();
                setCanvasInfo("Ready to draw!");
                selectedButton?.classList.remove('selected');
                edgeMode = false;
                // if user clicked twice on the same button
                if (selectedButton.id === "EdgeNode"+ (excludeItself ? "Plus" : "Star")){
                    return;
                }
            } 
            // Only one mode can be activated at a time.
            cancelAction();
            // Reset node content
            setSelectedItemLabel("")
            if (withLabel){
                // open dialog for edges label
                setOpen(true)
            }
            setSeveralMode(excludeItself ? "plus" : "star")
            getNetwork().addEdgeMode();
            setCanvasInfo("Select the node that will be linked to the others");
            selectedButton = document.getElementById("EdgeNode"+ (excludeItself ? "Plus" : "Star"))
            selectedButton?.classList.add('selected');
            edgeMode = true;
        }
        
        initNetworkEvents(network);
        initKeyEvents();
        initCanvasHeader();
    },[]);
    
    function initNetworkEvents(network){
        // Add listener in delete mode, click an element to delete it
        network.on("click", function (params) {
            setMenuVisible(false);
            setSelectedData(undefined)
            if (deleteMode){
                if (network.getSelectedNodes().length === 0 && network.getSelectedEdges().length === 0){
                    return;
                }
                network.deleteSelected();
                network.unselectAll(); // Needed to avoid a bug when deleting several nodes successively. 
                return
            } else if (!edgeMode && network.getSelectedNodes().length === 1){
                let nodeId = network.getSelectedNodes()[0];
                let nodes =  network.body.data.nodes;
                let node = nodes.get(nodeId);
                
                setSelectedData({
                    node: true,
                    name: node.label,
                    code: node.code,
                    parents: network.getConnectedNodes(nodeId, "from").map(id => {return nodes.get(id).label}).join(", "),
                    children: network.getConnectedNodes(nodeId, "to").map(id => {return nodes.get(id).label}).join(", "),
                })
            } else if (!edgeMode && network.getSelectedEdges().length === 1){
                let edgeId = network.getSelectedEdges()[0];
                let edges = network.body.data.edges;
                let edge = edges.get(edgeId);
                
                let nodes =  network.body.data.nodes;
                let fromNode = nodes.get(edge.from);
                let toNode = nodes.get(edge.to);
                setSelectedData({
                    node: false,
                    condition: edge.label,
                    from: fromNode.label,
                    to: toNode.label,
                    bidirectional: network.getConnectedNodes(fromNode.id, "from").includes(toNode.id)
                })
            }
            
        });
        // Display type menu on rightclick
        network.on("oncontext", function (params) {
            params.event.preventDefault();
            nodeID = network.getNodeAt(params.pointer.DOM)
            if (!nodeID){
                return;
            }
            let DOMpos = network.canvasToDOM(network.getPosition(nodeID))
            setMenuPosition({x:DOMpos.x, y:DOMpos.y})
            setMenuVisible(true)
            network.unselectAll(); 
        });
        
        network.on("doubleClick", function (params) {
            let selected= network.getSelection()
            if (selected.nodes.length !== 0 || selected.edges.length !== 0){
                showDialog();
                return
            } 
            if (codeMode){
                switchCodeMode()
            }
            compileGraph(network)
            showResult(2) // Show editor without compiling
        });
    }
    
    function initKeyEvents(){
        let canvasContainer = document.getElementById("canvasContainer")
        // Add listeners on Keydown
        canvasContainer?.addEventListener('keydown', (event => {
            // Disable shortcuts when editing a node
            if (event.repeat || open){
                return;
            }
            switch (event.key) {
                case "Escape":      // Cancel addNode action by pressing 'Escape'
                cancelAction();
                break;
                case "Backspace":   // Delete node by pressing 'backspace'
                // Make sure something was selected
                if (network.getSelectedNodes().length === 0 && network.getSelectedEdges().length === 0){ 
                    return;
                }
                network.deleteSelected();
                network.unselectAll();
                break;
                case linkKey:       // Enable link mode
                // Switch only if edgeMode isn't already activated
                if (!edgeMode){
                    switchEdgeMode();
                }
                break;
                case deleteKey:       // Enable delete mode
                // Switch only if deleteMode isn't already activated
                if (!deleteMode){
                    switchButtons[0].click();
                }
                break;
                case codeKey:       // Enable codde mode
                switchButtons[1].click();
                break;
                default:
                break;
            }
        }))
        
        document.getElementById("blockListContainer")?.addEventListener('keydown', (event => {
            if (event.key === 'Escape'){
                cancelAction();
            }
        }))
        
        // Add listener on keyup for link and delete shortcut
        canvasContainer?.addEventListener('keyup', (event => {
            // Disable shortcuts when editing a node
            if (open){
                return;
            }
            switch (event.key) {
                case linkKey:
                if (edgeMode){ // Switch only if edgeMode is disabled
                    switchEdgeMode();
                }
                break;
                case deleteKey:
                if (deleteMode){ // Switch only if deleteMode is disabled
                    switchButtons[0].click()
                }
                break;
                default:
                break;
            }
        }))
    }
    
    /**
    * Add header to canvas featuring infos and editing buttons
    */
    function initCanvasHeader() {
        // initCanvasHeader is called twice for unknown reason. So we need to reset switchButtons
        switchButtons = [];
        
        // Get canvas
        let canvasContainer = document.getElementById("canvasContainer");
        
        // Create header
        let canvasHeader = document.createElement("div");
        canvasHeader.id = 'canvasHeader'
        
        // Create header info div
        canvasInfo = document.createElement("div");
        canvasInfo.id = "canvasInfo";
        setCanvasInfo("Ready to draw!")
        
        // Create delete button
        let deleteButton = createSwitchButton("Delete", switchDeleteMode);
        deleteButton.className = "switchButton";
        
        // Create code display button
        let codeButton = createSwitchButton("Code", switchCodeMode);
        codeButton.className = "switchButton";
        
        // Create compile button
        let compileButton = document.createElement("button");
        compileButton.onclick = compileCanvas;
        
        let compileIcon = document.createElement("img")
        compileIcon.src = compileImg;
        compileButton.appendChild(compileIcon)
        compileButton.className = "imageButton";
        compileIcon.className = "image";
        
        // Create delete button
        let clearButton = document.createElement("button");
        clearButton.onclick = clearCanvas;
        
        let clearIcon = document.createElement("img")
        clearIcon.src = clearImg;
        clearButton.appendChild(clearIcon)
        clearButton.className = "imageButton";
        clearIcon.className = "image";
        
        // Create save button
        let saveButton = document.createElement("button");
        saveButton.onclick = () => saveSpec(network);
        
        let saveIcon = document.createElement("img")
        saveIcon.src = saveImg
        saveButton.appendChild(saveIcon)
        saveButton.className = "imageButton";
        saveIcon.className = "image";
        
        // Create save button
        let importButton = document.createElement("button");
        importButton.onclick = () => loadSpec(network, setReloadInfos);
        
        let importIcon = document.createElement("img")
        importIcon.src = loadImg
        importButton.appendChild(importIcon)
        importButton.className = "imageButton";
        importIcon.className = "image";
        
        
        // Append the  created element to the header
        canvasHeader.appendChild(deleteButton);
        canvasHeader.appendChild(codeButton);
        canvasHeader.appendChild(canvasInfo); 
        canvasHeader.appendChild(saveButton); 
        canvasHeader.appendChild(importButton); 
        canvasHeader.appendChild(clearButton); 
        canvasHeader.appendChild(compileButton); 
        
        // Add header on top of canvas
        canvasContainer?.prepend(canvasHeader);
    } 
    
    
    function clearCanvas(){
        cancelAction();
        network.setData({});
        setNetworkCounter(0);
        setSpecInfos("");
        setReloadInfos(Math.random());
    }

    /**
     * Switch between Edit and Result view
     * @param {number} value 0 is for edit ; 1 and 2 are for Result with and without auto compilation
     */
    function showResult(value) {
        hasBeenInit = false; // Once we show result, canvas will disappear and won't be loaded.
        setShowResult(value)
    }
    
    /**
    * Show dialogForm to edit node
    * @returns 
    */
    function showDialog() {
        let selectedNodes = network.getSelectedNodes();
        let selectedEdges = network.getSelectedEdges();
        
        // Check that a node was selected
        if (selectedNodes.length === 1){
            // Default value of form is current content of the selected node
            setSelectedItemLabel(network.body.data.nodes.get(selectedNodes[0]).label)
        } else if (selectedEdges.length === 1 ){
            // Default value of form is current content of the selected edge
            setSelectedItemLabel(network.body.data.edges.get(selectedEdges[0]).label)
        } else {
            // No node was selected
            return;
        }
        
        // setSelectedItemLabel(nodeContent);
        setOpen(true);
    }
    
    function cancelAddNodeMode(){
        if (addNodeMode){
            network.disableEditMode();
            addNodeMode = false;
            selectedButton?.classList.remove("selected");
            setCanvasInfo("Ready to draw!");
        }
    }
    
    function compileCanvas(){
        // Switch into the right mode. (Could have been handled in compile(network) but need to toggle button)
        if (codeMode){
            switchCodeMode();
        }
        compileGraph(network);
        showResult(1); // Show result and compile
    }
    
    
    function switchDeleteMode() {
        if (deleteMode){
            deleteMode = false;
            setCanvasInfo ("Ready to draw!");
            return;
        }
        // Only one mode can be activated at a time.
        cancelAction();
        deleteMode = true;
        setCanvasInfo ("Click to delete a node/edge.");
    }
    
    function switchCodeMode() {
        switchNodeContent(selectedItemLabel);
        if (codeMode){
            codeMode = false;
            setCanvasInfo ("Ready to draw!");
            return;
        }
        cancelAddNodeMode()
        // Here, we may have several mode running
        codeMode = true;
        setCanvasInfo ("Now seeing the code in the nodes");
    }
    
    /**
    * Set the content (label in vis-js) of the node that will be added
    * @param {String} id The id of the node to add
    */
    function addNode(id){
        if (!network){
            alert("Can't find network");
            return;
        }
        // If user click twice on same node
        if (addNodeMode && selectedButton.id === id){
            cancelAddNodeMode()
            return;
        }
        
        // Only one mode can be activated at a time.
        cancelAction();
        selectedButton = document.getElementById(id);
        selectedButton?.classList.add("selected")
        setSelectedItemLabel(id)
        network.addNodeMode()
        setCanvasInfo("Click on the canvas to place the node.");
        setAddNodeMode(true);
    }
    
    
    return (
        <div className="editPanelContainer">
        <BlockList addNode={addNode} linkSeveralNodes={linkSeveralNodes} switchEdgeMode={switchEdgeMode}/>
        <div id={"canvasContainer"} className='canvasContainer flexC bordered'/>
        <ContextMenu pos={menuPosition} visible={menuVisible} setVisible={setMenuVisible}/>
        <FormDialog open={open} setOpen={setOpen} content={selectedItemLabel}/>
        {selectedData !== undefined ? <SelectedItemInfos selectedData={selectedData}/> :  <SpecInfos reloadInfos={reloadInfos} />  }
        </div>
        )
    }
    
    export function switchEdgeMode() {
        if (edgeMode){
            getNetwork().disableEditMode();
            setCanvasInfo("Ready to draw!");
            selectedButton?.classList.remove('selected');
            edgeMode = false;
            // if user clicked twice on the same button
            if (selectedButton.id === "EdgeNode"){
                return;
            }
        } 
        // Only one mode can be activated at a time.
        cancelAction();
        setSeveralMode("false")
        getNetwork().addEdgeMode();
        setCanvasInfo("Click a node and drag to another one to link");
        selectedButton = document.getElementById("EdgeNode")
        selectedButton?.classList.add('selected');
        edgeMode = true;
        
    };
    
    export function linkSeveralNodes(excludeItself, withLabel){
        doLinkSeveralNodes(excludeItself, withLabel)
    }
    
    /**
    * Cancel current edit action and toggle appropriated button. /!\ DON'T call it in function executed by switch buttons or endless recursion.
    * @returns 
    */
    export function cancelAction(){
        doCancelAction()
    }
    
    export function getNetwork(){
        if (!network){
            return null;
        }
        return network;
    };
    
    /**
    * Set info displayed in the header of the canvas
    * @param {String} content 
    */
    export function setCanvasInfo(content){
        canvasInfo.innerText = content;
    }
    
    
    
    export function setAddNodeMode(value){
        if (value && codeMode){
            // If adding a node while in code mode, need to switch in labelMode (or need to check which property to fill when adding node)
            switchButtons[1].click();
        }
        addNodeMode = value;
    }
    
    
    export function pushSwitchButtons(value){
        switchButtons.push(value);
    }
    
    export function editNodeType(value){
        let makeStart = value.includes("Start") // Will we need to remove from another node?
        let makeStartEdge = makeStart; // Copy of previous to apply to all edges
        let oldStartChangedId = "" // Id of the changed start node
        let nodes = [];
        let edges = [];
        network.body.data.nodes.map((node) => {
            let idNumber = nodeID.match(/\D*(\d+)/)[1]; // Retrieve number of node
            let pos = network.getPosition(node.id); // Retrieve actual position
            node.x = pos.x;
            node.y = pos.y;
            
            if (node.id === nodeID){ // Modify selected node only. ID and label are changed.
                if (node.id.includes("Normal")){
                    value = value.replace("Abstract","Normal")
                } else {
                    value = value.replace("Abstract","")
                }
                if (value === ""){
                    value = "Abstract";
                }
                node.group = value;
                value = value+idNumber;
                node.id = value;
            } else if (makeStart && node.id.includes("Start")){ // If the type to assign contains start, possibly need to remove start type of an other node
                node.id = node.id.replace("Start", "");
                if (/^\d+$/.test(node.id)){
                    node.id = "Abstract"+node.id
                }
                oldStartChangedId = node.id;
                node.group = node.group.replace("Start", "")
                if (node.group === ""){
                    node.group = "Abstract";
                }
                makeStart = false;
            }
            nodes.push(node);
        });
        // Apply changes to edges
        network.body.data.edges.map((edge) => {
            if (edge.from === nodeID){
                edge.from = value;
            } else if (makeStartEdge && edge.from.includes("Start")){
                edge.from = oldStartChangedId;           
            }
            if (edge.to === nodeID){
                edge.to = value;
            } else if (makeStartEdge && edge.to.includes("Start")){
                edge.to = oldStartChangedId;           
            }
            edges.push(edge);
        });
        network.setData({nodes:new DataSet(nodes), edges:new DataSet(edges)})
    }
    
    var counter = 0;
    var severalMode = "false"; // choose between false / plus / star
    
    function setSeveralMode(value){
        severalMode = value;
    }
    
    function hash(str) {
        var hash = 0, i, chr;
        if (str.length === 0) return hash;
        for (i = 0; i < str.length; i++) {
            chr = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + chr;
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    }
    
    // Node layout options
    const nodeFont = {
        size: 12,
        face: "arial",
        color: "black"
    }
    
    export function setNetworkCounter(number){
        counter = number;
    }
    export default EditPanel