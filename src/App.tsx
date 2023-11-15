import './App.css';
import { Create } from './views/Create/Create';
import { Home } from './views/Home/Home';
import { Routes, Route } from 'react-router-dom';
import { Update } from './views/Update/Update';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/create' element={<Create />} />
      <Route path='/edit/:id' element={<Update />} />
    </Routes>
  );
}

export default App;
