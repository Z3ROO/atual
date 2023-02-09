import { useEditorContext } from "../../../Context";
import { Heading } from "./customElements/Heading";
import { Hr } from "./customElements/Hr";
import { Img } from "./customElements/Image";
import { Paragraph } from "./customElements/Paragraph";
import { DraggableDiv } from "./DraggableDiv";

export function Content() {
  const { packet, setPacket } = useEditorContext()!;

  return (
    <div>
      {
        packet.map((node, index) => {
          return parsePacketNode(node, index)
        })
      }
    </div>
  )
}

function parsePacketNode(node: any, position: number) {
  const { type, content, focus } = node;    
  
  let component: JSX.Element|null = null;

  if (type === 'heading') {
    component = <Heading node={node} position={position} />;
  }

  if (type === 'paragraph') {
    component = <Paragraph node={node} position={position} />;
  }

  if (type === 'hr') {
    component = <Hr />;
  }

  if (type === 'image') {
    component = <Img node={node} />;
  }

  if (component)
    return <DraggableDiv position={position}>{component}</DraggableDiv>

  return null;
}