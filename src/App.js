import { RouterProvider } from 'react-router-dom';
import './App.css';
import router from './module/routes/route';
import "./styles/global.scss";
import { GoogleOAuthProvider } from '@react-oauth/google';

function App() {

  return (
    <GoogleOAuthProvider clientId="888186814130-dc8h7bt7kvvgu6oou9gjm2vh7b4qr921.apps.googleusercontent.com">
      <RouterProvider router={router} />
    </GoogleOAuthProvider>
  );
}

export default App;