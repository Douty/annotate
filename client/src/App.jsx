// App.js or wherever your routes are defined
import { BrowserRouter, Router, Routes, Route } from 'react-router-dom';
import Download from './page/Download';
import CreateAnnotation from './page/CreateAnnotation';
import ImportAnnotation from './page/ImportAnnotation';
import AnnotatingPage from './page/AnnotatingPage';
import Home from './page/Home';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path="/CreateAnnotation" element={<CreateAnnotation />} />
        <Route path="/ImportAnnotation" element={<ImportAnnotation />} />
        <Route path="/AnnotatingPage/:title" element={<AnnotatingPage />} />
        <Route path="/Download" element={<Download />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
