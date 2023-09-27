import subprocess, os, base64, platform
from flask import Flask, request

app = Flask(__name__)

@app.route('/compileCode', methods = ['POST'])
def compileCode():
    if request.method == 'POST':
        data = request.json
        extension = data['extension']
        pngWanted = False
        if extension == "png":
            extension = "dot"
            pngWanted = True
        # Write spec in file
        with open(os.path.join("Cyclone","tmp","spec.cyclone"),'w') as spec:
            spec.write(data['specCode'])
            spec.close()
       
        traceFolder = os.path.join("Cyclone","trace")
       
        # Prepare Compile
        if (platform.system() == "Darwin"):
            p = subprocess.Popen("cd Cyclone && export DYLD_LIBRARY_PATH=. && java -jar cyclone.jar --nocolor "+os.path.join("tmp","spec.cyclone"), stdout=subprocess.PIPE, stderr=subprocess.PIPE, shell=True)
        elif (platform.system() == "Linux"):
            p = subprocess.Popen("cd Cyclone && export LD_LIBRARY_PATH=. && java -jar cyclone.jar --nocolor "+os.path.join("tmp","spec.cyclone"), stdout=subprocess.PIPE, stderr=subprocess.PIPE, shell=True)
        else : 
            p = subprocess.Popen("cd Cyclone && java -jar cyclone.jar --nocolor " +os.path.join("tmp","spec.cyclone"), stdout=subprocess.PIPE, stderr=subprocess.PIPE, shell=True)
            

        # Reset trace
        if os.path.exists(os.path.join(traceFolder,"spec."+extension)):
            os.remove(os.path.join(traceFolder,"spec."+extension))

        p.wait()
        stdout = p.stdout.read().decode()
        stderr = p.stderr.read().decode()

        if stderr != "":
             return str(stderr.split("Trace Generated:")[0]), 404
        if not os.path.exists(os.path.join(traceFolder,"spec."+extension)):
            return {"terminal":stdout.split("Trace Generated:")[0]}
        with open(os.path.join(traceFolder,"spec."+extension),'r') as trace:
            content = trace.read()

        if pngWanted:
            p = subprocess.Popen("dot -Tpng "+os.path.join(traceFolder, "spec.dot")+" -o "+os.path.join(traceFolder, "spec.png"), stdout=subprocess.PIPE, stderr=subprocess.PIPE, shell=True)
            p.wait()
            with open(os.path.join(traceFolder,"spec.png"),"rb") as f:
                image=base64.b64encode(f.read()).decode()
                return {"terminal" : stdout.split("Trace Generated:")[0] +"\n", "image": image}
        # Stdout is cut to remove absolute path
        return {"terminal" : stdout.split("Trace Generated:")[0] +"\n"+ content}
    