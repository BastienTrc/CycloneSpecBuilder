import interact from "interactjs";

const position = { x: 0, y: 0 }
const startPosition = {x: 0, y: 0}

const canvasZone = '.canvas';
const blockListZone = '.blockListContainer';;

const interactDraggable = interact('.draggable');

export function init() {
    
    // Move the draggable object
    interactDraggable.draggable({
        listeners: {
            move: e => {
                let { x, y } = e.target.dataset;
                
                x = (+x || 0) + e.dx;
                y = (+y || 0) + e.dy;
                
                e.target.style.transform = `translate(${x}px, ${y}px)`;
                
                Object.assign(e.target.dataset, { x, y });
                
            },
        }
    });
    
    // Memorize the initial position of the element before it has been dragged
    interactDraggable.on('dragstart', (e) =>{
        let { x, y } = e.target.dataset;
        console.log(`Start : ${x}-${y})`);
        startPosition.x = x;
        startPosition.y = y;
    } )
    
    // Delete the element if it was dropped to the blockListContainer
    interact(blockListZone)
    .dropzone({
        overlap: 0.01,
        ondrop: function (event) {
            event.relatedTarget.remove();
        }
    })
    
    // Replace the element to its initial position if dropped into another place than blockListContainer or canvas
    interact(".notDropZone")
    .dropzone({
        ondrop: function (event) {
            if (startPosition.x === 0 && startPosition.y === 0){
                event.relatedTarget.remove();
                return;
            }
            let x = startPosition.x;
            let y = startPosition.y;
            event.relatedTarget.style.transform = `translate(${x}px, ${y}px)`;
            Object.assign(event.relatedTarget.dataset, {x, y });
        }
    })
    
    
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
                
                // Add the cloned object to the document of class .canvas
                const container = document.querySelector(canvasZone);
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
        
    }
    
