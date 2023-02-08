import { EditorContextProvider } from "../../Context";
import { Content } from "./components/Content";
import { Controlls } from "./components/Controlls";

export function Editor() {
  return (
    <div className="">
      <EditorContextProvider>
        <Controlls />
        <Content />
      </EditorContextProvider>
    </div>
  )
}

