import { setSpecInfos } from "../../components/EditPanel/SidersAndForm/SpecInfos";
import { trimAndAddTabs } from "./parseUtils";
import { setNetworkCounter } from "../../components/EditPanel/EditPanel";

// Captures the name and code inside a node
     // Using greedy operator e.g. '*?'
const nodeRegex = /(?:abstract )?(start )?(normal )?(final )?(?:state|node) (.*?) ?{\s*((?:.*?\s*)*?)}/g
const transRegex = /(?:trans|edge) {\s*(.*?) ?(?:where (.*? ?;?))?\s*}/g // Added '?' next to ; if user forgot semicolon (Should be stable)
const invariantsRegex = /(?:invariant)\s+(.*?)\s+{\s*(.*?);?\s*}(?:\s+in\s+\((.*)\))?/g // Added '?' next to ; if user forgot semicolon (Should be stable)
const goalRegex = /goal\s*{\s*((?:.*\s?)*)}\s*}/
const machineRegex = /(?:machine|graph) (.*?) *{/
const variablesTempRegex = /((?:abstract )?(?:start )?(?:normal )?(?:final )?(?:state|node) .* ?)/ // Match beginning of state/node declaration
const variablesRegex = /(?:machine|graph) .*? ?{\s*((?:.+\s*)*)/ // Match everything between the title and the first state declaration

var nodes;
var labelToIdDict;
var edges;
var counter = 0;
var infos = {title:"", variables:"", goal:"", extensionForm: "", debug:false, invariants:[]}

/**
 * Compile the code into data for VisNetwork
 * @param {String} input The spec code
 * @returns The data object (contains nodes and edges property)
 */
export function compileCode(input, pngWanted){
    nodes = [];
    labelToIdDict = {};
    edges = [];
    counter = 0;
    // Remove everything between /* and */
    input = input.replace(/\/\*(?:.|\s)*?\*\//g, '');
    // Remove everything after //
    input = input.replace(/\/\/.*\s/g, '\n');
    
    let nodeIterator = input.matchAll(nodeRegex);
    createNodes(nodeIterator)
    let edgesIterator = input.matchAll(transRegex);
    createEdges(edgesIterator)

    let goal = input.match(goalRegex);
    if (!goal?.length || goal?.length < 2 || goal?.[1] === undefined){
        return;
    }
    createGoal(goal?.[1])

    let machineTitle = input.match(machineRegex);
    createTitle(machineTitle?.[1])
    if (!machineTitle?.length || machineTitle?.length < 2 || machineTitle?.[1] === undefined){
        return;
    }

    let varTemp = input.match(variablesTempRegex);
    if (!varTemp){
        return
    }
    let varPart = input.split(varTemp[0])[0]
    let variables = varPart.match(variablesRegex);
    createVariables(variables?.[1]);

    let invariantsIterator = input.matchAll(invariantsRegex);
    createInvariants(invariantsIterator);


    if (pngWanted){
        infos.extensionForm = "png";
    } else if (/option-trace ?= ?true/.test(input)){
        infos.extensionForm = "trace";
        infos.extensionForm = input.match(/option-output ?= ?(.*);/)?.[1].replaceAll('"',"");
    } else {
        infos.extensionForm = "";
    }
    infos.debug = /option-debug ?= ?true/.test(input);

    setSpecInfos(infos);
    setNetworkCounter(counter);
    return {
        nodes: nodes,
        edges: edges
    };
}

/**
 * Create every node/state from the parsed code
 * @param {*} nodesIterator the parsed nodes/states from the code
 * @returns 
 */
function createNodes(nodesIterator){
    let currentNode = nodesIterator.next();
   
    while (!currentNode.done){
        // Get matched string
        let match = currentNode.value;
        // Construct node based on regexp infos
        let createdNode = {id:"Node", label:"", code:""};
        // Group is the association of every Modifier
        let group = "";
        for (let i = 1; i <= 3; i++){
           if (match[i] !== undefined) {
            group += (match[i].charAt(0).toUpperCase() + match[i].slice(1)).replace(/\s+/, '')
           }  
        }
        // If no modifier, then just a single abstract state
        if (group === ""){
            group = "Abstract";
        }
        createdNode.group = group;
        // Id is group appended with unique number
        counter++;
        createdNode.id = group+counter;
        // Link id to label in dict
        labelToIdDict[match[4]] = createdNode.id;
        createdNode.label = match[4];
        // Add breakline at each instruction and remove \n at the end
        createdNode.code = trimAndAddTabs(match[5], 0);
        
        nodes.push(createdNode)
        currentNode = nodesIterator.next();
    }
}

/**
 * Create every edge/transition from the parsed code
 * @param {*} edgesIterator the parsed edges/transitions from the code
 * @returns 
 */
function createEdges(edgesIterator){
    let currentEdge = edgesIterator.next();
    while (!currentEdge.done){
        if (currentEdge.value.length !== 3){
            alert("Couldn't parse transitions")
            edges = 0;
            return; // Matching error
        }
        let createdEdge = {from:"", to:"", label:""};
        let fromTo = currentEdge.value[1].replaceAll(' ', '').split('->');
        if (fromTo.length !== 2){
            alert("Couldn't parse transitions (from -> to)")
            edges = 0;
            return; // There's no transition in the spec
        }
        createdEdge.from = labelToIdDict[fromTo[0]];
        let whereCondition = currentEdge.value[2];
        if (whereCondition !== undefined){
            // If user forgot ';', add it at the end
            createdEdge.label = whereCondition.trim().slice(-1) === ";" ? whereCondition : whereCondition + ";"; 
        }
        if (fromTo[1].includes("+")){
            // Exceptions is a string of form +[A,B,C]. Following line is needed to parse the IDs
            let exceptionList = fromTo[1].replaceAll(/[+\[\]]/g,"").split(",")
            toPlusNodes(createdEdge, exceptionList, fromTo[0]);
            currentEdge = edgesIterator.next()
            continue;
        } else if (fromTo[1].includes("*")){
            // Exceptions is  a string of form *[A,B,C]. Following line is needed to parse the IDs
            let exceptionList = fromTo[1].replaceAll(/[+\[\]]/g,"").split(",")
            toStarNodes(createdEdge, exceptionList);
            currentEdge = edgesIterator.next()
            continue;
        } else {
            createdEdge.to = labelToIdDict[fromTo[1]]
        }
        
        edges.push(createdEdge);
        currentEdge = edgesIterator.next()
    }
}
/**
 * 
 * @param {String} goal 
 */
function createGoal(goal){
    infos.goal = trimAndAddTabs(goal, 0);
}
/**
 * 
 * @param {String} title 
 */
function createTitle(title){
    infos.title = title?.trim();
}
/**
 * 
 * @param {String} variables 
 */
function createVariables(variables){
    infos.variables = trimAndAddTabs(variables, 0);
}

/**
 * 
 * @param {IterableIterator<RegExpMatchArray>} invariantsIterator 
 */
function createInvariants(invariantsIterator){
    let currentInvar = invariantsIterator.next();
    infos.invariants = [];
   
    while (!currentInvar.done){
        // Get matched string
        let match = currentInvar.value;
        // Construct node based on regexp infos
        let condition = match[2].trim().slice(-1) === ";" ? match[2] : match[2] + ";"
        let inList = match[3]? match[3].split(",") : [] 
        let createdInvar = {name:match[1], condition:condition, in:inList};
        infos.invariants.push(createdInvar)
        currentInvar = invariantsIterator.next();
    }
}

/**
 * Link createdEdge.from to every other node except those in exceptions
 * @param {*} createdEdge The 'mould' of the edge containing 'from' and 'label' props
 * @param {String[]} exceptions Array of nodes that we musn't link to
 */
function toStarNodes(createdEdge, exceptions){
    nodes.forEach(node => {
        // Create newEdge or else will just share the variables
        let newEdge = {from:createdEdge.from, to:"", label:createdEdge.label};
        // No transition to itself or excluded node
        if (exceptions.includes(node.label)){
            return;
        }
        newEdge.to = node.id;
        edges.push(newEdge);
    });
}

/**
 * Link createdEdge.from to every other node except those in exceptions and itself
 * @param {*} createdEdge The 'mould' of the edge containing 'from' and 'label' props
 * @param {String[]} exceptions Array of nodes that we musn't link to
 * @param {String} fromLabel The label of the 'from' node (which will be excluded)
 */
function toPlusNodes(createdEdge, exceptions, fromLabel){
    exceptions.push(fromLabel);
    toStarNodes(createdEdge, exceptions);
}