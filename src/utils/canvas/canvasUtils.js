import { DataSet } from "vis-data/standalone"
import { getNetwork, pushSwitchButtons, setNodeContent } from "./canvasInit";


/**
* Switch the properties 'label' and 'code' of every node 
*/
export function switchNodeContent(){
    let network = getNetwork();
    let nodeSet = network.body.data.nodes;
    let nodeIndices = network.body.nodeIndices;
    let node;
    let nodeList = [];
    
    nodeIndices.forEach(nodeIndice => {
        // Get node
        node = nodeSet.get(nodeIndice);
        // Switch label and code
        [node.label, node.code] = [node.code, node.label];
        
        // Select node to edit, setContent to update and edit
        network.selectNodes([node.id]);
        setNodeContent(node.label);
        network.editNode();

        // Save position for when we change the network data
        let position = network.getPosition(nodeIndice)
        node.x = position.x;
        node.y = position.y;
        nodeList.push(node);
    });
    
    let nodes = new DataSet(nodeList)
    let edges = network.body.data.edges
    let data = {
        nodes: nodes,
        edges: edges,
    };
    network.setData(data)
}

/**
* 
* @param {String} id Used for button label and for css class
* @param {any} callFunc the function to be called when button is switched
* @returns 
*/
export function createSwitchButton(id,callFunc) {
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

    pushSwitchButtons(edgeButtonLabel);
    
    // Assemble elements 
    edgeButtonContainer.appendChild(edgeButtonName);  
    edgeButtonContainer.appendChild(edgeButtonInput);  
    edgeButtonContainer.appendChild(edgeButtonLabel);
    
    return edgeButtonContainer;
}