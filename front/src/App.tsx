import { Editor } from './features/Editor';
import folderIcon from './assets/folder.svg';

function App() {
  return (
    <div className="App">
      <div className="top-bar">
        <img src={folderIcon} />
        <span className='top-bar-span'>Site</span>
        <span className='top-bar-divisor'>/</span>
        <span className='top-bar-span'>Categoria</span>
      </div>
      <div className="App-container">
        <Editor />
      </div>
    </div>
  )
}

export default App
