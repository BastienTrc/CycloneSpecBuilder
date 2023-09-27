# CycloneSpecBuilder

This project is a prototype of node-based visual programming language in the style of [Scratch](https://scratch.mit.edu/).
This project aims to help the user create cyclone specifications by graphically building a graph. [Cyclone](https://github.com/classicwuhao/Cyclone) is a new specification language for verifying/testing graph-based structures. To learn more about cyclone language and specifications, click [here](https://classicwuhao.github.io/cyclone_tutorial/tutorial-content.html)

## Installation
### Graphviz
Before launching the website, make sure to have Graphviz installed in order to be able to generate png traces. You can download it [here](https://graphviz.org/download/).

### Dependencies
To download all required dependencies, open a terminal, go into source file (`CycloneSpecBuilder/`) and type `npm install`.

#### Creating a virtual environment
First install virtualenv if you don't have it yet: `pip install virtualenv`.
Then go to `/api` and create a virtual environment by typing `python3 -m virtualenv venv`.
Enter virtual env by typing :
- Linux/MacOS: `source venv/bin/activate` (You may change for activate.fish if you're using fish shell)
- Windows: `venv\Scripts\Activate.ps1` on powerhsell or `venv\Scripts\Activate.bat` on cmd.exe
Then type `pip install -r requirements.txt` and go back to source file (`cd ..`).

### Running the server

Once all dependencies are installed, type `npm run start-api` in the virtual environment terminal. 
Open another terminal (still at source file location) and type `npm start`. This will run the app in the development mode.  
Once the server started, open [http://localhost:3000](http://localhost:3000) to view it in your browser. 

### Shutting down

To shut down the server, press CTRL+C in the previous terminal.

### Drag API
This project uses the `vis-network` library to manage draggable items. You can learn more about this library by clicking [this link](https://visjs.org/) or check their [GitHub repository](https://github.com/visjs/vis-network).