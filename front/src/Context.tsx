import { createContext, useContext, useState } from "react";

const EditorContext = createContext<IEditorContext|null>(null);
export const useEditorContext = () => useContext(EditorContext);

export function EditorContextProvider(props: any) {
  const [packet, setPacket] = useState<{[key: string]: any}[]>(mockPacket);

  function reorderNodes(oldPosition: number, newPosition: number) {
    setPacket(prev => {
      if (oldPosition < newPosition)
        newPosition -= 1;

      const filteredPacket = prev.filter((node, index) => index !== oldPosition);
      filteredPacket.splice(newPosition, 0, prev[oldPosition]);

      return filteredPacket;
    })

  }

  const value = {
    packet, setPacket, reorderNodes
  }

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