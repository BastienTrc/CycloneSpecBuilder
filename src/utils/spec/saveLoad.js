import {saveAs} from 'file-saver';
import { DataSet } from "vis-data/standalone"
import { getSpecInfos, setSpecInfos } from '../../components/EditPanel/SpecInfos';
import { setNetworkCounter } from '../canvas/networkOptions';

var input = document.createElement('input');
var network;

export async function loadSpec(currNetwork, setRefresh) {
  input.type = 'file';
  
  input.onchange = async e => { 
    let jsonData = await (e.target.files[0].text()); 
    importNetwork(jsonData, currNetwork); 
    setRefresh(Math.random());
  }

  input.onclick = event => {
    input.value = "";
  }
  
  input.click();
}

export function saveSpec(networkToSave) {
  network  = networkToSave
  let content = exportNetwork();
  
  var blob = new Blob([content], {
    type: "text/plain;charset=utf-8",
  });
  let title = getSpecInfos().title;
  saveAs(blob, (title ? title : "spec") +".json");
}

function getEdges() {
  return network.body.edgeIndices.map( (id) => {
    return network.body.data.edges.get(id);
  });
}

function exportNetwork() {
  var infos = getSpecInfos()

  network.storePositions()
  var nodes = getNodes();
  var edges = getEdges();
  // pretty print node data
  return `{
    "infos":${JSON.stringify(infos, undefined, 2)},
  "nodes":${JSON.stringify(nodes, undefined, 2)},
  "edges":${JSON.stringify(edges, undefined, 2)}
}`;
  
}

function importNetwork(inputValue, currNetwork) {
  var inputData = JSON.parse(inputValue);
  setSpecInfos(inputData.infos);
  var data = {
    nodes: getNodeData(inputData.nodes),
    edges: getEdgeData(inputData.edges),
  };
  currNetwork.setData(data);
}

function getNodeData(data) {
  var networkNodes = [];
  
  data.forEach(function (elem, index, array) {
    networkNodes.push({
      id: elem.id,
      label: elem.label,
      code: elem.code,
      group: elem.group,
      x: elem.x,
      y: elem.y,
    });
  });
  setNetworkCounter(networkNodes.length)
  return new DataSet(networkNodes);
}


function getEdgeData(data) {
  var networkEdges = [];
  
  data.forEach(function (edge) {
    // add the connection
    networkEdges.push({
      from: edge.from,
      to: edge.to,
      label: edge.label
    })
  });
  
  return new DataSet(networkEdges);
}

function getNodes() {
  return network.body.nodeIndices.map( (id) => {
    return network.body.data.nodes.get(id);
  });
}