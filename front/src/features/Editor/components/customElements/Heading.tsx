import { useRef, useEffect } from "react";
import { useEditorContext } from "../../../../Context";

export function Heading(props: any) {
  const { setPacket } = useEditorContext()!;

  const { position } = props;
  const { type, content, focus } = props.node;
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (focus && headingRef.current) {
      headingRef.current.focus();

      setPacket(prev => (prev.map(node => node.focus ? { ...node, focus:false} : node)))
    }
  }, [headingRef.current])

  return (
    <h2 ref={headingRef} contentEditable 
      onBlur={e => {
        setPacket(prev => (prev.map((node, index) => index === position ? { ...node, content:e.target.textContent} : node)))
      }}
    >
      { content }
    </h2>
  )
}