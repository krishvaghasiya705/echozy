import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import playerReducer from './store/playerSlice';
import router from './module/routes/route';
import "./styles/global.scss";

const store = configureStore({
  reducer: {
    player: playerReducer,
  },
});

function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
}

export default App;