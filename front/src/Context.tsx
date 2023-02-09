import { createContext, useContext, useEffect, useRef, useState } from "react";
import { v4 as uuid } from 'uuid';

export const PARAGRAPH = {
  type: 'paragraph',
  focus: false,
  content: ''
}

export const HEADING = {
  type: 'heading',
  focus: false,
  content: ''
}

export const DIVISIOR = {
  type: 'hr',
  focus: false,
  content: ''
}

export const IMAGE = {
  type: 'image',
  focus: false,
  content: ''
}


const MODE = import.meta.env.PROD;
const URL = MODE ? '' : 'http://localhost:3000'

const EditorContext = createContext<IEditorContext|null>(null);
export const useEditorContext = () => useContext(EditorContext);

export function EditorContextProvider(props: any) {
  const [packet, setPacket] = useState<{[key: string]: any}[]>([]);
  const [saved, setSaved] = useState(false);
  const savedTimeout = useRef<number>();
  const [dumpster, setDumpster] = useState(false);
  const toggleDumpster = (val:boolean) => setDumpster(val);

  function newNode(node:any, extra?:any){
    setPacket(prev => prev.concat({
      id: uuid(),
      ...node,
      ...extra,
      focus: true 
    }))
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

  function updateNodeContent(position: number, content: string) {
    setPacket(prev => {
      return (
        prev.map((node, index) => index === position ? { ...node, content} : node)
      )
    });
    setSaved(false);
  }

  function removeNode(position: number) {
    setPacket(prev => {
      return prev.filter((node, index) => index !== position)
    })
  }

  function unfocusAllNodes(){
    setPacket(prev => (prev.map(node => node.focus ? { ...node, focus:false} : node)))
  }

  async function save() {
    const request = await fetch(URL+'/save', {
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
    const request = await fetch(URL+'/api/getArticle?id=1');
    const response = await request.json();

    if (response.data) {
      setPacket(response.data)
      setSaved(true);
    }
  }

  const value = {
    packet, setPacket, reorderNodes, dumpster, 
    toggleDumpster, save, saved, newNode,
    updateNodeContent, removeNode, unfocusAllNodes
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
  newNode(node: any, extra?: any): void
  updateNodeContent(position: number, content: string): void
  removeNode(position: number): void
  unfocusAllNodes(): void
}
