import { useRef, useState } from 'react';
import './App.css'
import Home from './components/Home'
import AssetDrawer from './components/AssetDrawer';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [currFile,setCurrFile]=useState(null);
  return (
    <>
      <Home setCurrFile="setCurrFile"/>
      <AssetDrawer currFile="currFile"/>
    </>
  )
}

export default App
