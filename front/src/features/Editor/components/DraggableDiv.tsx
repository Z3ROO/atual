import { useState } from "react";
import { useEditorContext } from "../../../Context";

export interface DraggableDivProps extends React.HTMLAttributes<HTMLDivElement> {
  position: number
}

export function DraggableDiv(props: DraggableDivProps) {
  const { reorderNodes, toggleDumpster } = useEditorContext()!;
  const { position } = props;
  const [style, setStyle] = useState<string|null>(null);

  const shadow:{[key:string]: string} = {
    top: 'inset 0 3em 2.5em -40px gold',
    bottom: 'inset 0 -3em 2.5em -40px gold'
  }

  function dragOver(e:React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const { pageX, pageY } = e;

    const target = e.target as Element;
    const {x, y, height, width} = target.getBoundingClientRect();

    if (pageX > x && pageX < width+x) {
      if (pageY > y && pageY < height+y) {
        if (pageY > y+(height/2)) 
          setStyle('bottom');
        else
          setStyle('top');
      }
    }
    else
      setStyle(null)
  }

  function dragOut(e:React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setStyle(null)
  }

  function dragStart(e: React.DragEvent<HTMLDivElement>) {
    e.dataTransfer.setData('position', position.toString());
    console.log(e.dataTransfer.getData('position'))
    toggleDumpster(true);
  }

  function dragDrop(e: React.DragEvent<HTMLDivElement>) {
    const draggingNode = Number(e.dataTransfer.getData('position'));
    let newPosition = style === 'top' ? position : position+1;
    reorderNodes(draggingNode, newPosition);
    setStyle(null)
    toggleDumpster(false);
  }


  return (
    <div {...props} 
      style={{boxShadow: style ? shadow[style] : ''}} 
      className="draggable-div" draggable 
      onDragStart={dragStart}
      onDragOver={dragOver}
      onDragLeave={dragOut}
      onDrop={dragDrop}
      >
      {props.children}
    </div>
  );
}