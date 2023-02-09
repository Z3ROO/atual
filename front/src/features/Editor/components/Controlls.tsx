import { useEffect, useRef, useState } from 'react';
import { BiPlus } from 'react-icons/bi';
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
    <div className='controls'  onClick={e => e.stopPropagation()}>
      {
        !isControlsOpen ? 
        (
        <div onClick={e => setIsControlsOpen(true)} className="controls-open">
          <BiPlus style={{
            width:'1.25rem',
            height: '1.25rem',
            color: '#10b981',
            margin: '.5rem'
          }} />
          <span>Adicionar um novo elemento</span>
        </div>
        ) : 
        ( <Controls {...{setIsControlsOpen}} /> )
      }
    </div>
  )
}

function Controls(props:any) {
  const {setIsControlsOpen} = props;

  useEffect(() => {
    window.onclick = () => { setIsControlsOpen(false) }
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
    <div className="controls-group">
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
    <div className="controls-group">
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
    <button {...props} className="controls-button">
      <div className="controls-button-icon">
        <img src={icon} />
      </div>
      <div className="controls-button-info">
        <span><strong>{name}</strong></span>
        <span>{description}</span>
      </div>
    </button>
  )
}
