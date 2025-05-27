import React, { useState } from "react";
import { useNavigate, Link } from 'react-router-dom';
import axios from "axios";
import "./login.css";
import { GoArrowLeft } from "react-icons/go";
import logoImg from "../../img/logoimg.jpg";
import logoText from "../../img/logotext.png";

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                "https://port-0-mobicom-sw-contest-2025-umnqdut2blqqevwyb.sel4.cloudtype.app/api/users/login",
                {
                    username: formData.username,
                    password: formData.password
                },
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );

            // 정확하게 꺼냄
            const memberId = response.data?.memberId;
            const accessToken = response.data?.jwtToken?.accessToken;
            const refreshToken = response.data?.jwtToken?.refreshToken;

            if (!memberId || !accessToken) {
                throw new Error("응답 구조가 예상과 다릅니다.");
            }

            // 사용자 정보 저장
            localStorage.setItem("user", JSON.stringify({
                username: formData.username,
                memberId,
            }));
            console.log(localStorage)

            localStorage.setItem("token", accessToken);
            localStorage.setItem("refreshToken", refreshToken);


            navigate("/home");
        } catch (error) {
            console.error("로그인 실패:", error);
            if (error.response) {
                setError(`서버 응답 오류: ${error.response.status}`);
            } else {
                setError("로그인 실패. 네트워크 또는 서버 오류입니다.");
            }
        }
    };

    const goToTitle = () => navigate("/");

    return (
        <>
            <header>
                <div>
                    <GoArrowLeft className="backBtn" onClick={goToTitle} />
                </div>
            </header>

            <main className="loginPage">
                <div className="main_top">
                    <div className="logo">
                        <img src={logoImg} className="logoImg" alt="logo" />
                        <img src={logoText} className="logoText" alt="logo text" />
                    </div>
                    <h1>로그인</h1>
                    <p>계정에 로그인하여 서비스를 이용하세요</p>
                </div>

                <form className="main_main" onSubmit={handleSubmit}>
                    <label htmlFor="id">아이디</label>
                    <input
                        className="inputBox"
                        id="id"
                        name="username"
                        placeholder="아이디를 입력하세요"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />

                    <div className="main_main_pw">
                        <label htmlFor="pw">비밀번호</label>
                        <Link to="/findpw">비밀번호 찾기</Link>
                    </div>
                    <input
                        className="inputBox"
                        id="pw"
                        name="password"
                        type="password"
                        placeholder="비밀번호를 입력하세요"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />

                    <div className="main_main_signUp">
                        <span>계정이 없으신가요?</span>
                        <Link to="/setmyinform">회원가입</Link>
                    </div>

                    <button type="submit" className="BlueBtn">로그인</button>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                </form>
            </main>
        </>
    );
};

export default Login;
