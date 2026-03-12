import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import './index.css';
import App from './containers/App';
import createStore from './store';
import storage from './services/storage';

async function bootstrap() {
  // Загружаем данные из хранилища до рендера
  const token = await storage.getItem('token');
  const user = await storage.getItem('user'); // может быть строкой, нужно распарсить

  const preloadedState = {
    auth: {
      user: user ? (typeof user === 'string' ? JSON.parse(user) : user) : null,
      token: token || null,
      isAuthenticated: !!token,
      loading: false,
      error: null,
    }
  };

  const store = createStore(preloadedState);

  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </StrictMode>
  );
}

bootstrap();