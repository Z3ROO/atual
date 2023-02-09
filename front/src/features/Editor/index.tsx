import { EditorContextProvider, useEditorContext } from "../../Context";
import { Content } from "./components/Content";
import { ControlPanel } from "./components/Controlls";
import { Dumpster } from "./components/Dumpster";

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

