import { getNetwork, getNodeContent } from "./canvasInit";

var counter = 1;

// Node layout options
export const nodeFont = {
    size: 10,
    face: "arial",
    color: "black"
}

// Options of the canvas
export const networkOptions = {
    manipulation: {
        enabled: false,
        addNode: function(nodeData,callback) {
            nodeData.label = getNodeContent();
            nodeData.id = getNodeContent()+counter++
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
            nodeData.label = getNodeContent();
            callback(nodeData);
        },
        editEdge: {
            editWithoutDrag: function(edgeData,callback) {
                edgeData.label = getNodeContent();
                callback(edgeData);
        },
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
    },
    //TODO Remove seed, just for example
    layout:{
        randomSeed: "0.689730575122681:1689865843039"
    }
};