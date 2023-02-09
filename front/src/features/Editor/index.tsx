import { EditorContextProvider } from "../../Context";
import { Content } from "./components/Content";
import { ControlPanel } from "./components/Controlls";

export function Editor() {
  return (
    <div className="Editor">
      <EditorContextProvider>
        <Content />
        <ControlPanel />
      </EditorContextProvider>
    </div>
  )
}

