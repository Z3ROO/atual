import { useEffect, useRef, useState } from 'react';
import { BiPlus } from 'react-icons/bi';
import { RiSaveLine } from 'react-icons/ri';
import { DIVISIOR, HEADING, IMAGE, PARAGRAPH, useEditorContext } from '../../../Context';
import imageIcon from '../../../assets/image.svg';
import divisorIcon from '../../../assets/dash.svg';
import textIcon from '../../../assets/text.svg';
import headingIcon from '../../../assets/heading.svg';


export function ControlPanel() {
  const [isControlsOpen, setIsControlsOpen] = useState(false);
  const { save, saved } = useEditorContext()!;
  
  return (
    <div className='controls-container'>
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
      <div className='controls controls-save' onClick={save}>
        <RiSaveLine style={{
          width:'1.25rem',
          height: '1.25rem',
          color: '#10b981',
          margin: '.5rem'
        }} />
        {saved && <span style={{position: 'absolute', top: '-0.125', right: '0.125rem', color: '#0c8f63', fontSize: '1.25rem'}}>*</span>}
      </div>
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
      <Text {...{setIsControlsOpen}} />
      <Basic {...{setIsControlsOpen}} />
    </>
  )
}

function Text(props: any) {  
  const {setIsControlsOpen} = props;
  const { packet, setPacket, newNode } = useEditorContext()!;
  return (
    <div className="controls-group">
      <p>Text</p>
      <Button
        name="Heading"
        description="Insira um titulo ao artigo"
        icon={headingIcon}
        onClick={() => {
          newNode(HEADING)
          setIsControlsOpen(false)
        }}
      />
      <Button
        name="Paragrafo"
        description="Insira um paragrafo ao artigo"
        icon={textIcon}
        onClick={() => {
          newNode(PARAGRAPH)
          setIsControlsOpen(false)
        }}
      />
    </div>
  )
}

function Basic(props: any) {  
  const {setIsControlsOpen} = props;
  const { packet, setPacket, newNode } = useEditorContext()!;
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
        description='Insira uma imagem ao artigo'
        icon={imageIcon}
        onClick={() => {
          if (imageBase64 == null) {
            fileInputRef.current?.click();
            return;
          }
          newNode(IMAGE, {imageBase64})
          setIsControlsOpen(false);
        }}
      />
      <Button 
        name="Separador"
        description="Insira um separador ao artigo"
        icon={divisorIcon}
        onClick={() => {
          newNode(DIVISIOR)
          setIsControlsOpen(false);
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
