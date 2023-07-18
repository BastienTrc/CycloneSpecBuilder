let prev = nodes.get(1);
        console.log(prev?.font.size);
        nodes.update(
          {id:1, 
          font:
            {
              size: prev.font.size*2,
            }
          })