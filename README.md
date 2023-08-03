# CycloneSpecBuilder

This project is a prototype of node-based visual programming language in the style of [Scratch](https://scratch.mit.edu/).
This project aims to help the user create cyclone specifications by graphically building a graph. [Cyclone](https://github.com/classicwuhao/Cyclone) is a new specification language for verifying/testing graph-based structures. To learn more about cyclone language and specifications, click [here](https://classicwuhao.github.io/cyclone_tutorial/tutorial-content.html)

## Installation
### Dependencies
To download all required dependencies, open a terminal, go into source file (`CycloneSpecBuilder/`) and type `npm install`.

Then go to `/api` and type `pip install -r requirements.txt` and `cd ..` to go back to source file.

### Running the server

Once all dependencies are installed, type `npm start` in your terminal at source file. This will run the app in the development mode.  
Open another terminal (still at source file location) and type `npm run start-api`.  
Once the server started, open [http://localhost:3000](http://localhost:3000) to view it in your browser. 

### Shutting down

To shut down the server, press CTRL+C in the previous terminal.

### Drag API
This project uses the `vis-network` library to manage draggable items. You can learn more about this library by clicking [this link](https://visjs.org/) or check their [GitHub repository](https://github.com/visjs/vis-network).