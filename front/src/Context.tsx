import { createContext, useContext, useEffect, useRef, useState } from "react";

const EditorContext = createContext<IEditorContext|null>(null);
export const useEditorContext = () => useContext(EditorContext);

export function EditorContextProvider(props: any) {
  const [packet, setPacket] = useState<{[key: string]: any}[]>([]);
  const [saved, setSaved] = useState(false);
  const savedTimeout = useRef<number>();
  const [dumpster, setDumpster] = useState(false);
  const toggleDumpster = (val:boolean) => setDumpster(val);

  function newNode(){
    setSaved(false);
  }

  function reorderNodes(oldPosition: number, newPosition: number) {
    setPacket(prev => {
      if (oldPosition < newPosition)
        newPosition -= 1;

      const filteredPacket = prev.filter((node, index) => index !== oldPosition);
      filteredPacket.splice(newPosition, 0, prev[oldPosition]);

      return filteredPacket;
    })
    setSaved(false);
  }

  async function save() {
    const request = await fetch('http://localhost:3000/save', {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({data: packet}),
    });

    const response = await request.json();
    setSaved(true);
  }

  async function getArticle() {
    const request = await fetch('http://localhost:3000/api/getArticle?id=1');
    const response = await request.json();

    if (response.data) {
      setPacket(response.data)
      setSaved(true);
    }
  }

  const value = {
    packet, setPacket, reorderNodes, dumpster, toggleDumpster, save, saved
  }

  useEffect(() => {
    getArticle();
  }, []);

  useEffect(() => {
    if (!saved) {
      clearTimeout(savedTimeout.current);
      savedTimeout.current = setTimeout(() => {
        console.log('saved')
        save()
      }, 5000);
    }
    else
      clearTimeout(savedTimeout.current)

  },[saved]);

  return (
    <EditorContext.Provider {...{value}}>
      {props.children}
    </EditorContext.Provider>
    )
}

interface IEditorContext {
  packet: {
      [key: string]: any;
  }[]
  setPacket: React.Dispatch<React.SetStateAction<{
      [key: string]: any;
  }[]>>
  reorderNodes(oldPosition: number, newPosition: number): void
  dumpster: boolean
  toggleDumpster: (val: boolean) => void
  save: () => Promise<void>
  saved: boolean
}





const mockPacket: {[key: string]: any}[] = [
  {
    type: 'heading',
    content: 'Titulo'
  },
  // {
  //   type: 'image/stored' || 'image/base64' || 'image/url',
  //   content: ''
  // },
  {
    type: 'paragraph',
    content: 'Texto para entrar no paragrafo'
  },
  {
    type: 'hr'
  }
]