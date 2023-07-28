import { Network } from "vis-network";
import { getSpecInfos } from "../../components/EditPanel/SpecInfos";

var output = "";

/**
* Compile the network displayed in Cyclone language
* @param {Network} network network displayed on canvas
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

/**
 * Handle output options, title and vars section of the spec
 * @param {*} infos object containing string infos about the spec
 */
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

/**
 * Compile a drawn node info into cyclone code
 * @param {*} node  the noded object to compile
 */
function compileNode(node){
    let isStartNode = node.id.includes("Start");
    let isFinalNode = node.id.includes("Final");
    let isNormalNode = node.id.includes("Normal");

    // Build state.
    let codeLines = node.code.split("\n");
    for (let i = 0; i < codeLines.length ; i++) {
        // If user forgot to add ';' at end of line, add it for him
        if (!/^\s*$/.test(codeLines[i]) && codeLines[i].slice(-1) !== ";"){
            codeLines[i] = codeLines[i].trim()+";"
        }
    }; 
    codeLines = codeLines.join(`\n\t\t`)

    output +=`\t${isStartNode ? "start " : ""}${isNormalNode ? "normal " : "abstract "}${isFinalNode ? "final " : ""}state ${node.label} {\n\t\t${node.code ? codeLines : ""}\n\t}\n\n`;
}

/**
 * Compile a drawn edge info into cyclone code
 * @param {*} edge the edge object to compile
 * @param {*} nodeSet the set of node, used to retrieve IDs
 */
function compileEdge(edge, nodeSet){
    // Edges
    let fromNode = nodeSet.get(edge.from).label;
    let toNode = nodeSet.get(edge.to).label;
    output +=`\ttrans { ${fromNode} -> ${toNode} ${edge.label ? `where ${edge.label.includes(";")? edge.label : edge.label+";"}` : ""}}\n`;
}

/**
 * Compile goal into spec code
 * @param {String} goalCondition conditions wrote under goal section
 */
function compileGoal(goalCondition){
    output +=
    `\n\tgoal{\t\t${goalCondition}\n\t}\n}`
}

/**
 * To be launched to display compiled code
 * @param {*} setCompiledCode the function that set the text in resultPanel
 */
export function initCompile(setCompiledCode){
    setCompiledCode(output);
}