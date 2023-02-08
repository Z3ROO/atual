import React, { useEffect, useRef } from 'react';
import { ReactPropTypes, useState } from 'react'
import mountain from './assets/mountain.jpg';
import { v4 as uuid } from 'uuid';
import { EditorContextProvider, useEditorContext } from './Context';
import { DraggableDiv } from './components/DraggableDiv';

function dragOver(event:React.DragEvent<HTMLDivElement>) {
  event.preventDefault();
}

function startDrag(event: React.DragEvent<HTMLImageElement>) {
  
  event.dataTransfer.setData('text', (event.target as Element).id);
}

function drop(event: React.DragEvent<HTMLDivElement>) {
  event.preventDefault();
  const identifier = event.dataTransfer.getData('text');
  const target = event.target as Element;
  console.log(target)
  
  target.appendChild(document.getElementById(identifier)!)
}

function DragNDrop() {

  return (
    <>
      <div className='div1' onDragOver={dragOver} onDrop={drop}>
        <img id="image_id" src={mountain} draggable={true} onDragStart={startDrag} />
      </div>
      <div className='div1' onDragOver={dragOver} onDrop={drop}>

      </div>
      <div className='div1' onDragOver={dragOver} onDrop={drop}>

      </div>
    </>
  )
}

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


function App() {
  return (
    <div className="">
      <EditorContextProvider>
        <EditorControlls />
        <Editor />
      </EditorContextProvider>
    </div>
  )
}

function EditorControlls() {
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

function Editor() {
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
    component = <Heading node={node} />;
  }

  if (type === 'paragraph') {
    component = <Paragraph node={node} />;
  }

  if (type === 'hr') {
    component = <Hr/>;
  }

  if (type === 'image') {
    component = <Image node={node} />;
  }

  if (component)
    return <DraggableDiv position={position}>{component}</DraggableDiv>

  return null;
}


function Hr(props: any) {
  return <hr />
}

function Paragraph(props: any) {
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
    <p ref={paragraphRef} contentEditable>
      { content }
    </p>
  )
}

function Heading(props: any) {
  const { setPacket } = useEditorContext()!;

  const { type, content, focus } = props.node;
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (focus && headingRef.current) {
      headingRef.current.focus();

      setPacket(prev => (prev.map(node => node.focus ? { ...node, focus:false} : node)))
    }
  }, [headingRef.current])

  return (
    <h2 ref={headingRef} contentEditable>
      {
        content
      }
    </h2>
  )
}

function Image(props: any) {
  const { setPacket } = useEditorContext()!;

  const { imageBase64 } = props.node


  return (
    <img src={imageBase64} />
  )
}



interface PacketJSON {
  paragraph: string
  heading: string
  img: string
}

export default App
