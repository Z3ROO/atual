import { useRef, useEffect } from "react";
import { useEditorContext } from "../../../../Context";

export function Paragraph(props: any) {
  const { unfocusAllNodes, updateNodeContent, removeNode } = useEditorContext()!;

  const { position } = props;
  const { type, content, focus } = props.node;
  const paragraphRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (focus && paragraphRef.current) {
      paragraphRef.current.focus();
      unfocusAllNodes();
    }
  }, [paragraphRef.current])

  return (
    <p className="custom-p" ref={paragraphRef} contentEditable 
      onBlur={e => {
        if (e.target.textContent)
          updateNodeContent(position, e.target.textContent);
        else if (e.target.textContent?.trim() === '')
          removeNode(position);
      }}
    >
      { content }
    </p>
  )
}