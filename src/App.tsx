import type { JSX } from "react";
import { ClickerGame } from "./pages/ClickerGame";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LogIn } from "./pages/LogIn";
import { Register } from "./pages/Register";
import { SettingPage } from "./pages/SettingPage";
import { LogInRequire } from "./routes/LogInRequire";
import { StatsPage } from "./pages/StatsPage";
import "./css/App.css";
import { WithButtonsAndMenu } from "./routes/WithButtonsAndMenu";
import { UserPage } from "./pages/UserPage";
import { HamburgerButton } from "./components/HamburgerButton";
import { ShopButton } from "./components/ShopButton";
import { Game } from "./core/Game";

// 메인 앱.
// React는 그 특성에 따라 단일 웹 앱으로 사용되나, 페이지를 나눠 구성하기 위해 "react-router-dom" 모듈을 사용하였습니다.
// 각 커스텀 요소에 대한 주석은 그 안에 쓰여져 있으니 참고 바랍니다.
export function App(): JSX.Element {
    return (
        <Game>
            {/* BrowserRouter: 브라우저 History API를 사용한 라우터로, Route의 path와 element를 연결하여 라우팅합니다. */}
            <BrowserRouter>
                {/* Routes: Route를 묶는 그룹 */}
                <Routes>
                    {/* WithButtonsAndMenu(buttons: [HamburgerButton, ShopButton])를 사용하는 공통 Route */}
                    {/* 아래 Route의 결과를 button과 button container가 담긴 JSX.Element로 변환합니다. */}
                    <Route element={<WithButtonsAndMenu buttons={[HamburgerButton, ShopButton]} />}>
                        <Route index element={<ClickerGame />} />
                    </Route>
                    {/* WithButtonsAndMenu(buttons: [HamburgerButton])를 사용하는 공통 Route */}
                    {/* 이하 생략. */}
                    <Route element={<WithButtonsAndMenu buttons={[HamburgerButton]} />}>
                        <Route path="/auth">
                            <Route path="login" element={<LogIn />} />
                            <Route path="register" element={<Register />} />
                        </Route>
                        {/* 로그인 필요 Route 묶음. */}
                        {/* 아래 주소에 접근하려 하면 로그인이 되어 있는지 확인 후 통과 혹은 거절(-> /auth/login 페이지 이동)합니다. */}
                        <Route path="/user" element={<LogInRequire />}>
                            <Route index element={<UserPage />} />
                            <Route path="stats" element={<StatsPage />} />
                            <Route path="settings" element={<SettingPage />} />
                        </Route>
                    </Route>
                </Routes>
            </BrowserRouter>
        </Game>
    );
}