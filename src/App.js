import { RouterProvider } from 'react-router-dom';
import './App.css';
import router from './module/routes/route';
import "./styles/global.scss";

function App() {

  return (
    <RouterProvider router={router} />
  );
}

export default App;