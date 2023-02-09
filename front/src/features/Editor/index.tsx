import { EditorContextProvider, useEditorContext } from "../../Context";
import { Content } from "./components/Content";
import { ControlPanel } from "./components/Controlls";
import { CgTrashEmpty } from 'react-icons/cg';

export function Editor() {
  return (
    <div className="Editor custom-scrollbar">
      <EditorContextProvider>
        <Dumpster />
        <Content />
        <ControlPanel />
      </EditorContextProvider>
    </div>
  )
}

function Dumpster() {
  const { dumpster, toggleDumpster, setPacket } = useEditorContext()!;

  if (!dumpster)
    return null

  return (
    <div className="dumpster" draggable
      onDragEnd={e => toggleDumpster(false)}
      onDrop={(e)=> { 
        const data = e.dataTransfer.getData('position');

        if (data === '')
          return;

        setPacket(prev => {
          return prev.filter((node, index) => index !== Number(data))
        })
        toggleDumpster(false);
      }}
      onDragOver={e => {e.preventDefault()}}
    >
      <CgTrashEmpty />
    </div>
  )
}

