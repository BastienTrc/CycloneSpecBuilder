import {saveAs} from 'file-saver';

var input = document.createElement('input');
export async function loadSpec(setSpecCode) {
    
    input.type = 'file';
    
    input.onchange = async e => { 
        let code = await (e.target.files[0].text()); 
        setSpecCode(code); 
    }
    
    input.click();
}

export function saveSpec(content, title) {
    var blob = new Blob([content], {
        type: "text/plain;charset=utf-8",
    });
    saveAs(blob, title+".cyclone");
}