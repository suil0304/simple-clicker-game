// index.html과 직접적으로 연결되어 있는 TypeScript JSX 파일.
// root id를 가진 요소를 가져와 다음과 같이 렌더링합니다.
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';

// StrictMode는 개발 등에서 작동하는 모드로, JSX를 두 번 실행해 버그를 찾습니다.
createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App />
    </StrictMode>,
);
