import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { Toaster } from 'react-hot-toast';
import { WalletProvider } from './contexts/WalletContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <WalletProvider>
        <Toaster 
          position="bottom-center"
          toastOptions={{
            style: {
              background: '#333',
              color: '#fff',
            }
          }}
        />
        <App />
      </WalletProvider>
    </BrowserRouter>
  </React.StrictMode>
);
