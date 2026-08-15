import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import './index.css';
import App from './App.jsx';
import store from './redux/store';
import AuthBootstrap from './components/AuthBootstrap';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <AuthBootstrap>
          <App />
        </AuthBootstrap>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: { fontSize: '14px', borderRadius: '10px' },
          }}
        />
      </BrowserRouter>
    </Provider>
  </StrictMode>,
);
