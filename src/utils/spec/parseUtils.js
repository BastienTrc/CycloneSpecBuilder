/**
 * Add a breakline after every semicolon character except the for the last one
 * @param {String} value the content to parse
 * @returns value string but parsed
 */
function addBreaklines(value){
    
    // Remove last breakline
    if (value.trim() === ""){
        return "";
    }
    
    let lines = value.split(";")
    for (let i = 0; i < lines.length; i++) {
        lines[i] = lines[i].trim();
        if (!/^\s*$/.test(lines[i]) && lines[i].slice(-1) !== "\n" ){
            lines[i] +=";\n";
        }
    };
    return lines.join("");
}

/**
 * Add a semicolon at each end of line
 * @param {*} content the content to parse
 * @returns 
 */
function addSemicolons(content){
    let lines = content.split("\n");
    // If user forgot to add ';' at end of line, add it for him
    for (let i = 0; i < lines.length; i++) {
        lines[i] = lines[i].trim();
        // Check that line isn't empty, already ending with semicolon or a comment
        if (!/^\s*$/.test(lines[i]) && lines[i].slice(-1) !== ";"){
            lines[i] +=";"
        }
    };
    
    return lines.join("\n").slice(0, -1);
}

/**
 * 
 * @param {String} content the string to indent
 * @param {Number} tabNumber number of indent
 * @returns {String}
 */
function addTab(content, tabNumber){
    let lines = content.split("\n");
    for (let i = 0; i < lines.length; i++){
        lines[i] = "\t".repeat(tabNumber) + lines[i];
    }
    return lines.join("\n");
}

/**
 * 
 * @param {String} content the content to format
 * @returns The content with tabs and trimmed
 */
export function trimAndAddTabs(content, tabNumber){
    let lines = content.split("\n");
    for (let i = 0; i < lines.length; i++) {
        lines[i] = lines[i].trim();
    };
    
    content = lines.join("\n")

    // Need to add the first repeat because of the end trim
    return "\t".repeat(tabNumber) + addTab(content,tabNumber)?.trim();
    // return addTab(addBreaklines(addSemicolons(content)),tabNumber); Not yet found a nice helper
}