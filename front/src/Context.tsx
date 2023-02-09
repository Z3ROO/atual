import { createContext, useContext, useEffect, useState } from "react";

const EditorContext = createContext<IEditorContext|null>(null);
export const useEditorContext = () => useContext(EditorContext);

export function EditorContextProvider(props: any) {
  const [packet, setPacket] = useState<{[key: string]: any}[]>([]);
  const [dumpster, setDumpster] = useState(false);
  const toggleDumpster = (val:boolean) => setDumpster(val);

  function reorderNodes(oldPosition: number, newPosition: number) {
    setPacket(prev => {
      if (oldPosition < newPosition)
        newPosition -= 1;

      const filteredPacket = prev.filter((node, index) => index !== oldPosition);
      filteredPacket.splice(newPosition, 0, prev[oldPosition]);

      return filteredPacket;
    })

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

  }

  async function getArticle() {
    const request = await fetch('http://localhost:3000/api/getArticle?id=1');
    const response = await request.json();

    if (response.data) {
      setPacket(response.data)
    }
  }

  const value = {
    packet, setPacket, reorderNodes, dumpster, toggleDumpster, save
  }

  useEffect(() => {
    getArticle();
  }, [])

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