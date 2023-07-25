import { Network } from "vis-network";
import { getSpecInfos } from "../../components/EditPanel/SpecInfos";

var output = "";
var emitOutput;

/**
* 
* @param {Network} network 
*/
export function compileGraph(network){
    let infos = getSpecInfos();

    // Start spec
    compileStart(infos);
    
    // States
    let nodeSet = network.body.data.nodes;
    let nodeIndices = network.body.nodeIndices;
    nodeIndices.forEach(indice => {
        compileNode(nodeSet.get(indice));
    });
    
    output += "\n";

    // Transitions
    let edgeSet = network.body.data.edges;
    let edgeIndices = network.body.edgeIndices
    edgeIndices.forEach(indice => {
        compileEdge(edgeSet.get(indice), nodeSet);
    })
    
    // Goal 
    compileGoal(infos.goal);
}

function compileStart(infos){
    output = "";
    if (infos.trace){
        output += "option-trace = true;\n"
        output +=  infos.traceExtension ? "option-output = " + infos.traceExtension +";\n" : "";
    }
    
    output +=  infos.debug ? "option-debug = true;\n" : "";
    
    output += `machine ${infos.title}{\n`;
    output += infos.variables + "\n\n";
}

function compileNode(node){
    let isStartNode = node.id.includes("Start");
    let isEndNode = node.id.includes("End");
    
    // States
    output +=`  ${isStartNode ? "start " : ""}normal ${isEndNode ? "final " : ""}state ${node.label} {
            ${node.code ? node.code : ""}
        }\n`;
}

function compileEdge(edge, nodeSet){
    // Edges
    let fromNode = nodeSet.get(edge.from).label;
    let toNode = nodeSet.get(edge.to).label;
    output +=`  trans { ${fromNode} -> ${toNode} ${edge.label ? `where ${edge.label};` : ""}}\n`;
}

function compileGoal(goalCondition){
    output +=
    `\n  goal{
        ${goalCondition}
    }
}`
}

/**
 * To be launched before
 * @param {*} setCompiledCode the function that set the text in resultPanel
 */
export function initCompile(setCompiledCode){
    emitOutput = setCompiledCode;
}

export function getResult(){
    emitOutput(output);
}