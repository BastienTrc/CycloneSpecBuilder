import { Network } from "vis-network/standalone";
import { DataSet } from "vis-data/standalone"
import { switchNodeContent, createSwitchButton } from "./canvasUtils";
import { compileGraph } from "../compile/compileGraph";
import { getData } from "../../components/ResultPanel/ResultPanel";
const deleteIcon = require('@mui/icons-material/Delete');
const {networkOptions, nodeFont, resetCounter} =  require("./networkOptions");
const compileImg = require('../../resources/compile.png');
const clearImg = require('../../resources/clear.png');

var network;

// Text displayed in the header of the canvas
var canvasInfo;

var addNodeMode = false;
var edgeMode = false;
var deleteMode = false;
var codeMode = false;
const linkKey = 'l'
const deleteKey = 'd'
const codeKey = 'c'

// Used to edit the node
var nodeContent = "";
var setEditContent;

// Function that will open the dialog for editing node
var setOpenDialog;
var isDialogOpen = false;

var switchButtons = [];

// For unknown reason, initCanvas is run twice, causing problem with eventListeners
var hasBeenInit;

// Show result of compile
var showResult;

/**
* Draw canvas with sample data and init every needed function
* @param {*} setOpen 
* @param {*} setContent 
* @returns 
*/
export function initCanvas(setOpen, setContent, setShowResult){
    if (hasBeenInit){
        return;
    }
    hasBeenInit = true;
    setOpenDialog = setOpen;
    setEditContent = setContent;
    showResult = (value) => {
        hasBeenInit = false; // Once we show result, canvas will disappear and won't be loaded.
        setShowResult(value)
    }
    
    // create a container for the network
    var container = document.getElementById("canvasContainer");
    if (!container){
        return; //TODO Better handling
    }
    
    var data = getData();
    // debugger
    if (data === undefined || data.nodes === undefined){
        data = generateData()
    }
    data.nodes = new DataSet(data.nodes);
    data.edges = new DataSet(data.edges);
    
    // @ts-ignore Error checking problem with vis-network
    network = new Network(container, data, networkOptions);
    
    initNetworkEvents(network);
    initKeyEvents();
    initCanvasHeader();
}

function generateData(){
    // create an array with nodes
    var nodes = [
        { id: "StartNormal1", label: "Start", font:nodeFont, code:"int a = 5;", group:"StartNormal"},
        { id: "Normal2", label: "firstStep", font:nodeFont, code:"", group:"Normal"},
        { id: "NormalFinal3", label: "firstStop", font:nodeFont, code:"int c = b + 3;", group:"NormalFinal"},
        { id: "NormalFinal4", label: "secondStop", font:nodeFont, code:"", group:"NormalFinal"},
        { id: "Normal5", label: "secondStep", font:nodeFont, code:"int res; a < b => (res == 0);", group:"Normal"},
    ];
    
    // create an array with edges
    // @ts-ignore Error checking problem with vis-network
    var edges = [
        { from: "StartNormal1", to: "NormalFinal3"},
        { from: "StartNormal1", to: "Normal2" },
        { from: "Normal2", to: "NormalFinal4", label: "x > 0 && a < b" },
        { from: "Normal2", to: "Normal5", label: "x >= 0 || a == b"},
        { from: "Normal5", to: "NormalFinal4", label: "canEnd == true"},
    ];
    return {
        nodes: nodes,
        edges: edges,
    };
}

function initNetworkEvents(network){
    network.on("doubleClick", function (params) {
        showDialog();
    });
    
    // Add listener in delete mode, click an element to delete it
    network.on("click", function (params) {
        if (deleteMode){
            if (network.getSelectedNodes().length === 0 && network.getSelectedEdges().length === 0){
                return;
            }
            network.deleteSelected();
            network.unselectAll(); // Needed to avoid a bug when deleting several nodes successively. 
            return
        }
        
    });
}

function initKeyEvents(){
    let canvasContainer = document.getElementById("canvasContainer")
    // Add listeners on Keydown
    canvasContainer?.addEventListener('keydown', (event => {
        // Disable shortcuts when editing a node
        if (event.repeat || isDialogOpen){
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
    
    // Add listener on keyup
    canvasContainer?.addEventListener('keyup', (event => {
        // Disable shortcuts when editing a node
        if (isDialogOpen){
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
    
    
    
    // Append the 3 created element to the header
    canvasHeader.appendChild(deleteButton);
    canvasHeader.appendChild(codeButton);
    canvasHeader.appendChild(canvasInfo); 
    canvasHeader.appendChild(clearButton); 
    canvasHeader.appendChild(compileButton); 
    
    // Add header on top of canvas
    canvasContainer?.prepend(canvasHeader);
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
    switchNodeContent(nodeContent);
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

export function switchEdgeMode() {
    if (edgeMode){
        getNetwork().disableEditMode();
        setCanvasInfo("Ready to draw!");
        document.getElementById("EdgeNode")?.classList.remove('selected');
        edgeMode = false;
        return;
    } 
    // Only one mode can be activated at a time.
    cancelAction();
    nodeContent = "EdgeNode";
    getNetwork().addEdgeMode();
    setCanvasInfo("Click a node and drag to another one to link");
    document.getElementById("EdgeNode")?.classList.add('selected');
    edgeMode = true;
    
};

/**
* Cancel current edit action and toggle appropriated button. /!\ DON'T call it in function executed by switch buttons or endless recursion.
* @returns 
*/
export function cancelAction() {
    network.unselectAll();
    cancelAddNodeMode();
    
    // Cancel by clicking the right switch button
    let id = "";
    if (edgeMode){
        switchEdgeMode()
    } else if (deleteMode){
        id = 'switchDeleteMode'
    }
    
    switchButtons.forEach((switchButton => {
        if (switchButton.htmlFor === id){
            switchButton.click();
        }
    }));
}

function cancelAddNodeMode(){
    if (addNodeMode){
        network.disableEditMode();
        addNodeMode = false;
        document.getElementById(nodeContent)?.classList.remove("selected");
        setCanvasInfo("Ready to draw!");
    }
}

function compileCanvas(){
    showResult(true);
    // Switch into the right mode. (Could have been handled in compile(network) but need to toggle button)
    if (codeMode){
        switchCodeMode();
    }
    compileGraph(network);
}

function clearCanvas(){
    cancelAction();
    network.setData({});
    resetCounter();
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

/**
* Set content for the node to be modified
* @param {String} content 
*/
export function setNodeContent(content){
    nodeContent = content;
}

export function getNodeContent(){
    return nodeContent;
}

export function setAddNodeMode(value){
    if (value && codeMode){
        // If adding a node while in code mode, need to switch in labelMode (or need to check which property to fill when adding node)
        switchButtons[1].click();
    }
    addNodeMode = value;
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
        nodeContent = network.body.data.nodes.get(selectedNodes[0]).label
    } else if (selectedEdges.length === 1 ){
        // Default value of form is current content of the selected edge
        nodeContent = network.body.data.edges.get(selectedEdges[0]).label
    } else {
        // No node was selected
        return;
    }
    
    setEditContent(nodeContent);
    setOpenDialog(true);
    setIsDialogOpen(true);
}

export function setIsDialogOpen(value){
    isDialogOpen = value;
}

export function pushSwitchButtons(value){
    switchButtons.push(value);
}

//Debug function
export function blabla(){
    console.log(`${addNodeMode}///${deleteMode}///${edgeMode}`)
}