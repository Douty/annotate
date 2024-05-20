// App.js or wherever your routes are defined
import { BrowserRouter, Router, Routes, Route } from 'react-router-dom';
import Download from './page/Download';
import Annotating from './page/Annotating';
import Home from './page/Home';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path="/Annotating" element={<Annotating />} />
        <Route path="/Download" element={<Download />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
