import { Editor } from './features/Editor';

function App() {
  return (
    <div className="App">
      <div className="top-bar">
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
