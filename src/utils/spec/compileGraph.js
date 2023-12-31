import { Network } from "vis-network/standalone";
import { getSpecInfos } from "../../components/EditPanel/SidersAndForm/SpecInfos";
import { trimAndAddTabs } from "./parseUtils";

var output = "";

/**
* Compile the network displayed in Cyclone language
* @param {Network} network network displayed on canvas
*/
export function compileGraph(network){
    output = "";
    if (network.body.data.nodes.length === 0){
        return;
    }

    // Start spec
    let infos = getSpecInfos();
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

    compileInvariants(infos.invariants)
    
    // Goal 
    compileGoal(infos.goal);
}

/**
 * Handle output options, title and vars section of the spec
 * @param {*} infos object containing string infos about the spec
 */
function compileStart(infos){
    if (infos.extensionForm !== undefined && infos.extensionForm !== ""){
        output += "option-trace = true;\n"
        output +=  infos.extensionForm ? 'option-output = "' + infos.extensionForm +'";\n' : ''; 
    }
    
    output +=  infos.debug ? "option-debug = true;\n" : "";
    
    output += `machine ${infos.title}{\n`;
    output += trimAndAddTabs(infos.variables, 1) + "\n\n";
}

/**
 * Compile a drawn node info into cyclone code
 * @param {*} node  the noded object to compile
 */
function compileNode(node){
    let isStartNode = node.id.includes("Start");
    let isFinalNode = node.id.includes("Final");
    let isNormalNode = node.id.includes("Normal");

    let codeLines = trimAndAddTabs(node.code, 2);

    output +=`\t${isNormalNode ? "" : "abstract "}${isStartNode ? "start " : ""}${isNormalNode ? "normal " : ""}${isFinalNode ? "final " : ""}state ${node.label} {\n${node.code ? codeLines : ""}\n\t}\n\n`;
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
 * @param {Array<{name, condition, in}>} invariants invariant list to add
 */
function compileInvariants(invariants){
    invariants.forEach(invariant => {
        output +=
    `\n\tinvariant ${invariant.name} {${invariant.condition.trim().slice(-1) === ";" ? invariant.condition : invariant.condition + ";"}} ${invariant.in.length !== 0 ? `in (${invariant.in.join(",")})` :"" } \n`
    });
    
}

/**
 * Compile goal into spec code
 * @param {String} goalCondition conditions wrote under goal section
 */
function compileGoal(goalCondition){
    output +=
    `\n\tgoal{\n${trimAndAddTabs(goalCondition, 2)}\n\t}\n}`
}

/**
 * To be launched to display compiled code
 *  the function that set the text in resultPanel
 */
export function getCompiledCode(){
    return output;
}