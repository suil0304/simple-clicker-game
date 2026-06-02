import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App.tsx';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        {
            /** App을 통해 모든 것이 시작된다.
             * 클리커 게임이든, 무엇이든.
            */
        }
        <App />
    </StrictMode>,
);
