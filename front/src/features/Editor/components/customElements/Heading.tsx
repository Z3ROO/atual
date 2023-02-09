import { useRef, useEffect } from "react";
import { useEditorContext } from "../../../../Context";

export function Heading(props: any) {
  const { unfocusAllNodes, updateNodeContent, removeNode } = useEditorContext()!;

  const { position } = props;
  const { type, content, focus } = props.node;
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (focus && headingRef.current) {
      headingRef.current.focus();
      unfocusAllNodes()
    }
  }, [headingRef.current])

  return (
    <h2 ref={headingRef} contentEditable 
      onBlur={e => {
        if (e.target.textContent)
          updateNodeContent(position, e.target.textContent);
        else if (e.target.textContent?.trim() === '')
          removeNode(position);
      }}
    >
      { content }
    </h2>
  )
}