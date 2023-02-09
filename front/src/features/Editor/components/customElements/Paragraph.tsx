import { useRef, useEffect } from "react";
import { useEditorContext } from "../../../../Context";

export function Paragraph(props: any) {
  const { setPacket } = useEditorContext()!;

  const { identifier } = props;
  const { type, content, focus } = props.node;
  const paragraphRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (focus && paragraphRef.current) {
      paragraphRef.current.focus();

      setPacket(prev => (prev.map(node => node.focus ? { ...node, focus:false} : node)))
    }
  }, [paragraphRef.current])

  return (
    <p className="custom-p" ref={paragraphRef} contentEditable>
      { content }
    </p>
  )
}