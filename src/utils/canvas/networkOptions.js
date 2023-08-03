import { getNetwork, getNodeContent } from "./canvasInit";

var counter = 0;

// Node layout options
export const nodeFont = {
    size: 12,
    face: "arial",
    color: "black"
}

// Options of the canvas
export const networkOptions = {
    manipulation: {
        enabled: false,
        addNode: function(nodeData,callback) {
            let content = getNodeContent();
            nodeData.id = content+(++counter);
            nodeData.label = content+counter;
            nodeData.group = content;
            nodeData.code = "";
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

export function setNetworkCounter(number){
    counter = number;
}