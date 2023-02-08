import { useEditorContext } from "../../../../Context";

export function Img(props: any) {
  const { setPacket } = useEditorContext()!;

  const { imageBase64 } = props.node


  return (
    <img src={imageBase64} />
  )
}