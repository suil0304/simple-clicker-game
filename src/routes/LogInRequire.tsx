import type { JSX } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { isLogin } from "../core/providers/User";

// 로그인 필수 Route를 위한 Element.
export function LogInRequire(): JSX.Element {
    const { isLogIn } = useLogInRequire();

    if (!isLogIn) {
        return (
            // 로그인이 되어 있지 않을 시 /auth/login 위치로 이동.
            // 이전 주소 버튼을 눌렀을 때 다시 돌아가지는 것을 방지하기 위해 replace 명시.
            <Navigate to="/auth/login" replace />
        );
    }

    // Outlet으로 자식 Route 결과 가져오기.
    return (
        <Outlet />
    );
}

function useLogInRequire() {
    return {
        isLogIn: isLogin()
    };
}