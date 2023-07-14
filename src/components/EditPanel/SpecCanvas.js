import React, { useEffect } from "react";
import './EditPanel.css'
import { Network } from "vis-network/standalone";
import { DataSet } from "vis-data/standalone"
import { getAddedNodeContent } from "../BlockListPanel/BlockList";

var network;
var canvasInfo;
var inEditMode = false;

export function setEditMode(value){
  inEditMode = value;
}

const nodeFont = {
  size: 10,
  face: "arial",
  color: "black"
}

function SpecCanvas({panel}){
  
  
  useEffect( () => {
    // create an array with nodes
    var nodes = new DataSet([
      { id: 1, label: "Node 1", title: "I have a popup!", font:nodeFont },
      { id: 3, label: "Node 3", title: "I have a popup!", font:nodeFont },
      { id: 2, label: "Node 2", title: "I have a popup!", font:nodeFont },
      { id: 4, label: "Node 4", title: "I have a popup!", font:nodeFont },
      { id: 5, label: "Node 5", title: "I have a popup!", font:nodeFont },
    ]);
    
    // create an array with edges
    var edges = new DataSet([
      { from: 1, to: 3 },
      { from: 1, to: 2 },
      { from: 2, to: 4 },
      { from: 2, to: 5 },
    ]);
    
    // create a network
    var container = document.getElementById("canvasContainer");
    var data = {
      nodes: nodes,
      edges: edges,
    };
    
    const options = {
      manipulation: {
        enabled: false,
        addNode: function(nodeData,callback) {
         
          nodeData.label = getAddedNodeContent();
          canvasInfo.innerHTML = "Time to draw!"
          setEditMode(false);
          callback(nodeData);
        },
        addEdge: function(edgeData,callback) {

          if (edgeData.from === edgeData.to) {
            var r = window.confirm("Do you want to connect the node to itself?");
            if (r === true) {
              canvasInfo.innerHTML = "Edge created!"
              callback(edgeData);
            }
          }
          else {
            canvasInfo.innerHTML = "Edge created!"
            callback(edgeData);
          }
        },
      },
      height: "90%",
      edges: {
        arrows:'to',
        smooth:false,
      },
      physics: {
        enabled : false,
      },
    };
    
    network = new Network(container, data, options);
    
    network.on("click", function (params) {
      
    });
    network.on("doubleClick", function (params) {
      
    });
    network.on("oncontext", function (params) {
      
    });
    network.on("dragStart", function (params) {
      
    });
    network.on("dragging", function (params) {
      
    });
    network.on("dragEnd", function (params) {
      
    });
    network.on("controlNodeDragging", function (params) {
      
    });
    network.on("controlNodeDragEnd", function (params) {
      
    });
    
    // Add info header to canvas
    let canvasContainer = document.getElementById("canvasContainer");

    let canvasHeader = document.createElement("div");
    canvasHeader.id = 'canvasHeader'
   
    canvasInfo = document.createElement("div");
    canvasInfo.innerHTML = "Time to draw";
    canvasInfo.id = "canvasInfo";
    canvasHeader.appendChild(canvasInfo);
    canvasContainer?.prepend(canvasHeader);

    // Add listener to cancel addNode action
    document.addEventListener('keydown', (event => {
      if (event.key === "Escape" && inEditMode){
        network.disableEditMode();
        canvasInfo.innerHTML = "Cancel add node";
      }
    }))
    
    
  },[]);
  
  return (
    <>
    <div id={"canvasContainer"} className='canvasContainer'/>
    </>
    )
  }
  
  export function getNetwork(){
    if (!network){
      return null;
    }
    return network;
  };
  
  export default SpecCanvas