// Vite는 import.meta에서 환경 변수를 가져올 수 있습니다.
// 그 안에 특정 파일이 있을 수 있음을 명시하는 Define 파일입니다.

interface ImportMeta {
    readonly env:ImportMetaEnv;
}

interface ImportMetaEnv {
    readonly VITE_API_URL:string;
}