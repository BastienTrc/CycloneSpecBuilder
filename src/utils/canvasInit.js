import { Network } from "vis-network/standalone";
import { DataSet } from "vis-data/standalone"

var network;
// Text displayed in the header of the canvas
var canvasInfo;

var addNodeMode = false;
var edgeMode = false;
var deleteMode = false;

// Used to edit the node
var nodeContent = "";

var openDialog;
var setContent;

// Make them global so we can toggle switch if escape key is pressed
var switchButtons = [];

// Some node layout
const nodeFont = {
    size: 10,
    face: "arial",
    color: "black"
}

// Options of the canvas
const canvasOptions = {
    manipulation: {
        enabled: false,
        addNode: function(nodeData,callback) {
            nodeData.label = nodeContent;
            callback(nodeData);
            getNetwork().addNodeMode(); // Allow several add of nodes
        },
        addEdge: function(edgeData,callback) {
            if (edgeData.from === edgeData.to) {
                var r = window.confirm("Do you want to connect the node to itself?");
                if (r === true) {
                    callback(edgeData);
                    getNetwork().addEdgeMode(); // Allow several add of edges
                }
            }
            else {
                callback(edgeData);
                getNetwork().addEdgeMode(); // Allow several add of edges
            }
        },
        editNode: function(nodeData,callback) {
            nodeData.label = nodeContent;
            callback(nodeData);
        },
        
    },
    height: "90%",
    edges: {
        arrows:'to',
        smooth:false, // Straight line or not
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
    }
};

/**
 * Draw canvas with sample data and init every needed function
 * @param {*} setOpen 
 * @param {*} setContent 
 * @returns 
 */
export function initCanvas(setOpen, setContent){
    // create an array with nodes
    var nodes = new DataSet([
        { id: 1, label: "Node 1", font:nodeFont },
        { id: 2, label: "Node 2", font:nodeFont },
        { id: 3, label: "Node 3", font:nodeFont },
        { id: 4, label: "Node 4", font:nodeFont },
        { id: 5, label: "Node 5", font:nodeFont },
    ]);
    
    // create an array with edges
    // @ts-ignore Error checking problem with vis-network
    var edges = new DataSet([
        { from: 1, to: 3 },
        { from: 1, to: 2 },
        { from: 2, to: 4 },
        { from: 2, to: 5 },
    ]);
    
    // create a container for the network
    var container = document.getElementById("canvasContainer");
    if (!container){
        return; //TODO Better handling
    }
    
    var data = {
        nodes: nodes,
        edges: edges,
    };
    
    // @ts-ignore Error checking problem with vis-network
    network = new Network(container, data, canvasOptions);
    
    // Add listener for node edition
    network.on("doubleClick", function (params) {
        // Check that a node was selected
        if (params.nodes.length === 1){
            // Show dialog
            nodeContent = nodes.get(params.nodes[0]).label
            setContent(nodeContent);
            setOpen(true)
        }
    });
    
    // Add listener in delete mode, click an element to delete it
    network.on("click", function (params) {
        if (!deleteMode){
            return
        }
        network.deleteSelected();
    });
    
    // Add listener to cancel addNode action by pressing 'Escape'
    document.addEventListener('keydown', (event => {
        if (event.key === "Escape"){
            cancelAction()
        }
    }))

    initCanvasHeader();
}

/**
* Add header to canvas featuring infos and editing buttons
*/
function initCanvasHeader() {
    // Get canvas
    let canvasContainer = document.getElementById("canvasContainer");
    
    // Create header
    let canvasHeader = document.createElement("div");
    canvasHeader.id = 'canvasHeader'
    
    // Create Edge Button
    let edgeButton = createSwitchButton("Edge", () => {
        if (edgeMode){
            getNetwork().disableEditMode();
            setCanvasInfo("Ready to draw!");
            edgeMode = false;
        } else {
            // Only one mode can be activated at a time.
            cancelAction();
            getNetwork().addEdgeMode();
            setCanvasInfo("Click a node and drag to another one to link");
            edgeMode = true;
        }
    });
    edgeButton.className = "switchButton"
    
    // Create header info div
    canvasInfo = document.createElement("div");
    canvasInfo.id = "canvasInfo";
    setCanvasInfo("Ready to draw!")
    
    // Create delete button
    let deleteButton = createSwitchButton("Delete", () => {
        if (deleteMode){
            deleteMode = false;
            setCanvasInfo ("Ready to draw!");
            return;
        }
        // Only one mode can be activated at a time.
        cancelAction();
        deleteMode = true;
        setCanvasInfo ("Double click to delete a node/edge.");
    });
    deleteButton.className = "switchButton";
    
    // Append the 3 created element to the header
    canvasHeader.appendChild(edgeButton); 
    canvasHeader.appendChild(canvasInfo); 
    canvasHeader.appendChild(deleteButton);
    
    // Add header on top of canvas
    canvasContainer?.prepend(canvasHeader);
}

/**
* 
* @param {String} id Used for button label and for css class
* @param {any} callFunc the function to be called when button is switched
* @returns 
*/
function createSwitchButton(id,callFunc) {
    // Create container
    let edgeButtonContainer = document.createElement("div");
    
    // Text displayed on the button
    let edgeButtonName = document.createElement("div");
    edgeButtonName.textContent = id+" mode";
    
    // CheckBox
    let edgeButtonInput = document.createElement("input");
    edgeButtonInput.id = `switch${id}Mode`;
    edgeButtonInput.setAttribute("type", "checkbox")
    
    // Label
    let edgeButtonLabel = document.createElement("label");
    edgeButtonLabel.htmlFor = `switch${id}Mode`;
    edgeButtonLabel.className = 'switchButtonLabel'
    edgeButtonLabel.addEventListener("click", callFunc);
    switchButtons.push(edgeButtonLabel);
    
    // Assemble elements 
    edgeButtonContainer.appendChild(edgeButtonName);  
    edgeButtonContainer.appendChild(edgeButtonInput);  
    edgeButtonContainer.appendChild(edgeButtonLabel);
    
    return edgeButtonContainer;
}

/**
* Cancel current edit action and toggle appropriated button. /!\ DON'T call it in function executed by switch buttons or endless recursion.
* @returns 
*/
export function cancelAction() {
    network.unselectAll();
    
    if (addNodeMode){
        network.disableEditMode();
        addNodeMode = false;
        document.getElementById(nodeContent)?.classList.remove("selected");
        setCanvasInfo("Ready to draw!");
    }
    
    // Cancel by clicking the right switch button
    let id = "";
    if (edgeMode){
        id = 'switchEdgeMode';
        edgeMode = false;
    } else if (deleteMode){
        id = 'switchDeleteMode'
        deleteMode = false;
    }
    
    switchButtons.forEach((switchButton => {
        if (switchButton.htmlFor === id){
            switchButton.click();
        }
    }));
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

export function setAddNodeMode(value){
    addNodeMode = value;
}

/**
 * Debug fonction
 */
export function blabla(){
    console.log(`${addNodeMode}///${edgeMode}///${deleteMode}`)
}