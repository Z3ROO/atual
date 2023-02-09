import { useEffect, useRef, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { useEditorContext } from '../../../Context';
import imageIcon from '../../../assets/image.svg';
import divisorIcon from '../../../assets/text.svg';
import textIcon from '../../../assets/text.svg';
import folderIcon from '../../../assets/text.svg';

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

export function ControlPanel() {
  const [isControlsOpen, setIsControlsOpen] = useState(false);
  
  return (
    <div className='controlls'  onClick={e => e.stopPropagation()}>
      {
        !isControlsOpen ? 
        (<div onClick={e => setIsControlsOpen(true)}> + </div>) : 
        ( <Controls {...{setIsControlsOpen}} /> )
      }
    </div>
  )
}

function Controls(props:any) {
  const {setIsControllsOpen} = props;

  useEffect(() => {
    window.onclick = () => { setIsControllsOpen(false) }
    return () => {window.onclick = null};
  }, []);

  return (
    <>
      <Text />
      <Basic />
    </>
  )
}

function Text() {
  const { packet, setPacket } = useEditorContext()!;
  return (
    <div className="controlls-group">
      <p>Text</p>
      <Button
        name="Heading"
        description="Insira um titulo"
        icon={textIcon}
        onClick={() => {
          setPacket(prev => prev.concat(newNode(HEADING)))
        }}
      />
      <Button
        name="Paragrafo"
        description="Insira um paragrafo"
        icon={textIcon}
        onClick={() => {
          setPacket(prev => prev.concat(newNode(PARAGRAPH)))
        }}
      />
    </div>
  )
}

function Basic() {
  const { packet, setPacket } = useEditorContext()!;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [imageBase64, setImageBase64] = useState<string | ArrayBuffer | null>(null);

  function parseImage(image: File) {
    const reader = new FileReader();

    reader.addEventListener('load', () => {
      setImageBase64(reader.result);
    });

    reader.readAsDataURL(image);
  }

  return (
    <div className="controlls-group">
      <p>Basic</p>
      <input 
        ref={fileInputRef} hidden
        type="file" accept='.jpg, .png, .jpeg, .gif' 
        onChange={e => e.target.files && parseImage(e.target.files[0])} 
      />
      <Button
        name='Image'
        description='Envie uma imagem'
        icon={imageIcon}
        onClick={() => {
          if (imageBase64 == null) {
            fileInputRef.current?.click();
            return;
          }
          setPacket(prev => prev.concat(newNode(IMAGE, {imageBase64})));
        }}
      />
      <Button 
        name="Divisor"
        description="Insira um divisor"
        icon={textIcon}
        onClick={() => {
          setPacket(prev => prev.concat(newNode(DIVISION)))
        }}
      />
    </div>
  )
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>{
  name: string
  description: string
  icon: string
}

function Button(props: ButtonProps) {
  const { name, description, icon } = props;

  return (
    <button {...props} className="controlls-button">
      <div className="controlls-button-icon">
        <img src={icon} />
      </div>
      <div className="controlls-button-info">
        <span><strong>{name}</strong></span>
        <span>{description}</span>
      </div>
    </button>
  )
}
