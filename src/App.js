import { RouterProvider } from 'react-router-dom';
import './App.css';
import router from './module/routes/route';
import "./styles/global.scss";
import { GoogleOAuthProvider } from '@react-oauth/google';

function App() {

  return (
    <GoogleOAuthProvider clientId="888186814130-doeqguqj4t6lci7503jh9rscmsdtcjtl.apps.googleusercontent.com">
      <RouterProvider router={router} />
    </GoogleOAuthProvider>
  );
}

export default App;