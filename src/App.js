import logo from './logo.svg';
import './App.css';
import interact from 'interactjs'
import BlockListPanel from './components/BlockListPanel/BlockListPanel';
import EditPanel from './components/EditPanel/EditPanel';
import ResultPanel from './components/ResultPanel/ResultPanel';

const position = { x: 0, y: 0 }
var idCounter = 0;

const interactDraggable = interact('.draggable');
interactDraggable.draggable({
  listeners: {
    move: e => {
      let { x, y } = e.target.dataset;
      
      x = (+x || 0) + e.dx;
      y = (+y || 0) + e.dy;
      
      e.target.style.transform = `translate(${x}px, ${y}px)`;
      
      Object.assign(e.target.dataset, { x, y });
      
    },
  },
  modifiers: [
    interact.modifiers.restrict({
      restriction: 'parent',
      endOnly: true
    })
  ]
});

// interactDraggable.on('dragstart', showEventInfo)



// Create a copy of the dragged element (Code from interactjs API)

interact(".copyDraggable")
  .draggable({
    // By setting manualStart to true - we control the manualStart.
    // We need to do this so that we can clone the object before we begin dragging it.
    manualStart: true,
    listeners: {
      move(event) {
        position.x += event.dx;
        position.y += event.dy;
        event.target.style.transform = `translate(${position.x}px, ${position.y}px)`;

        let x = position.x;
        let y = position.y;
        Object.assign(event.target.dataset, { x, y });
      }
    },
    modifiers: [
      interact.modifiers.restrict({
        restriction: 'parent',
        endOnly: true
      })
    ]
  })
  // This only gets called when we trigger it below using interact.start(...)
  .on("move", function(event) {
    const { currentTarget, interaction } = event;
    let element = currentTarget;

    // If we are dragging an item from the sidebar, its transform value will be ''
    // We need to clone it, and then start moving the clone
    if (
      interaction.pointerIsDown &&
      !interaction.interacting() &&
      currentTarget.style.transform === ""
    ) {
      element = currentTarget.cloneNode(true);

      // Add absolute positioning so that cloned object lives
      // right on top of the original object
      element.style.position = "absolute";
      element.style.left = 0;
      element.style.top = 0;

      // Add the cloned object to the document
      const container = document.querySelector(".canvas");
      container && container.appendChild(element);

      const { offsetTop, offsetLeft } = currentTarget;
      position.x = offsetLeft;
      position.y = offsetTop;

      element.classList.remove('copyDraggable');
      element.classList.add('draggable');

      
    }

    // Start the drag event
    interaction.start({ name: "drag" }, event.interactable, element);
  });


// interact('.copyDraggable').draggable({ manualStart: true })
// .on('doubletap', function (event) {
//   var interaction = event.interaction
  
//   // if the pointer was moved while being held down
//   // and an interaction hasn't started yet
  
//   var clone = event.currentTarget.cloneNode(true)
  
//   // Change the class to draggable so the node can be moved without creating another
//   clone.classList.remove('copyDraggable');
//   clone.classList.add('draggable');
//   clone.classList.add('editable');
//   // Change the copy id so that it's not mixed up with other copies
//   clone.setAttribute("id", idCounter++)
  
  
  
//   // insert the clone to the page
//   // TODO: position the clone appropriately
//   document.getElementsByClassName("canvas")[0].appendChild(clone)
  
  
//   // start a drag interaction targeting the clone
//   interaction.start({ name: 'drag' }, event.interactable, clone)
  
// })



function App() {
  return (
    <>
    <div className='App-header'> HEADER </div>
    <div className='appContainer'>
      <BlockListPanel/>
      <EditPanel/>
      <ResultPanel/>
    
    </div>
    </>
    );
  }
  
  export default App;
