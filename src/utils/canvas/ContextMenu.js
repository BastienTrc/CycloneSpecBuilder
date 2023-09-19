import { List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import React from "react"
import { editNodeType } from "../../components/EditPanel/EditPanel";


export function ContextMenu({pos, visible, setVisible}){

  const [menuStyle, setMenuStyle] = React.useState({});
  
  
  /**
   * Close dialog and send value to modify node type
   * @param {String} value the type clicked by the user
   */
  function selectItem(value){
    setVisible(false);
    editNodeType(value)
  }

  React.useEffect(() => {
    let menu = document.getElementById('contextMenu');
    if (!menu){
      return;
    }
    menu.style.left = pos.x+200+"px"
    menu.style.top = pos.y+100+"px"
},[pos])
  
  const items = 
  [<ListItem disablePadding sx={{ borderBottom: 1, padding: 0, borderColor:"warning.main"}}  >
    <ListItemButton onClick={() => selectItem("StartAbstract")}>
    <ListItemText primary="Start" />
    </ListItemButton>
    </ListItem>, 
    <ListItem disablePadding sx={{ borderBottom: 1, padding: 0, borderColor:"warning.main"}}>
    <ListItemButton onClick={() => selectItem("AbstractFinal")}>
    <ListItemText primary="Final" />
    </ListItemButton>
    </ListItem>,
    <ListItem disablePadding sx={{ borderBottom: 1, padding: 0, borderColor:"warning.main"}}>
    <ListItemButton onClick={() => selectItem("StartAbstractFinal")}>
    <ListItemText primary="StartFinal" />
    </ListItemButton>
    </ListItem>,
    <ListItem disablePadding >
    <ListItemButton onClick={() => selectItem("Abstract")}>
    <ListItemText primary="Default" />
    </ListItemButton>
    </ListItem>]
    
    return (
      <List 
      id='contextMenu' 
      style={{position:"absolute", visibility:visible ? "visible" : "hidden", backgroundColor:"white"}}
      dense={true}
      sx={{ border: 1,borderRadius: "5%", borderColor:"warning.main", padding: 0 }}>
        {items}
      </List>
      )
    }
    
    export default ContextMenu

    