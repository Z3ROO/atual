import { useState } from 'react';
import { v4 as uuid } from 'uuid';
import { useEditorContext } from '../../../Context';

const PARAGRAPH = {
  type: 'paragraph',
  focus: false,
  content: ''
}

const HEADING = {
  type: 'heading',
  focus: false,
  content: ''
}

const DIVISION = {
  type: 'hr',
  focus: false,
  content: ''
}

const IMAGE = {
  type: 'image',
  focus: false,
  content: ''
}

function newNode(node:any, extra?:any) {
  const { type } = node;
  return {
    id: uuid(),
    ...node,
    ...extra,
    focus: true 
  }
}

export function Controlls() {
  const { packet, setPacket } = useEditorContext()!;
  const [imageBase64, setImageBase64] = useState<string | ArrayBuffer | null>(null);

  function parseImage(image: File) {
    const reader = new FileReader();

    reader.addEventListener('load', () => {
      setImageBase64(reader.result);
    });

    reader.readAsDataURL(image);
  }

  return (
    <div>
      <button
        onClick={() => {
          setPacket(prev => prev.concat(newNode(HEADING)))
        }}
      >Heading</button>
      <button
        onClick={() => {
          setPacket(prev => prev.concat(newNode(PARAGRAPH)))
        }}
      >Paragrafo</button>
      <button 
        onClick={() => {
          setPacket(prev => prev.concat(newNode(DIVISION)))
        }}
      >Divisão</button>
      <input type="file" accept='.jpg, .png, .jpeg, .gif' onChange={e => e.target.files && parseImage(e.target.files[0])} />
      <button 
        onClick={() => {
          if (imageBase64 == null)
            return

          setPacket(prev => prev.concat(newNode(IMAGE, {imageBase64})))
        }}
      >Divisão</button>
    </div>
  )
}
