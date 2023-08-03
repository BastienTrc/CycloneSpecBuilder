import subprocess, os
from flask import Flask, request

app = Flask(__name__)

@app.route('/compileCode', methods = ['POST'])
def compileCode():
    if request.method == 'POST':
        data = request.json
        # Write spec in file
        with open("Cyclone/temp/spec.cyclone",'w') as spec:
            spec.write(data['specCode'])
            spec.close()
        # Reset trace
        if os.path.exists("Cyclone/trace/spec.trace"):
            os.remove("Cyclone/trace/spec.trace")
        # Compile
        p = subprocess.Popen("cd Cyclone && export DYLD_LIBRARY_PATH=. && java -jar cyclone.jar temp/spec.cyclone", stdout=subprocess.PIPE, shell=True)
        (stdout,stderr) = p.communicate()
        p.wait()
        print("out")
        print(stdout)
        print("err")
        print(stderr)
        if stderr != None:
             return "Error: "+str(stderr), 404
        if not os.path.exists("Cyclone/trace/spec.trace"):
            return {"terminal":"Spec didn't generate trace file."}
        with open("Cyclone/trace/spec.trace",'r') as trace:
            content = trace.read()
        return {"terminal" : content}
    

    