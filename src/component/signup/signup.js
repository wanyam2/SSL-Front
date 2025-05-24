import React, { useState } from "react";
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { GoArrowLeft } from "react-icons/go";
import logoImg from "../../img/logoimg.jpg";
import logoText from "../../img/logotext.png";
import axios from "axios";
import "./signup.css";

const Signup = () => {
    const location = useLocation();
    const prevData = location.state || {}; // 전달된 정보
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        password: "",
        pwCheck: "",
        workLocation: "",
        experienceYears: 0,
        ...prevData, // nationality, language, name, phoneNum 등 포함됨
        role: "USER",
    });

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const url = "https://port-0-mobicom-sw-contest-2025-umnqdut2blqqevwyb.sel4.cloudtype.app";

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === "experienceYears" ? parseInt(value || 0, 10) : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.pwCheck) {
            setMessage("비밀번호가 일치하지 않습니다.");
            return;
        }

        setLoading(true);
        setMessage("");

        try {
            const response = await axios.post(`${url}/api/users/register`, formData, {
                headers: { 'Content-Type': 'application/json' }
            });

            const { accessToken, refreshToken } = response.data;
            localStorage.setItem("token", accessToken);
            localStorage.setItem("refreshToken", refreshToken);

            setMessage("회원가입 성공!");
            navigate("/login");
        } catch (error) {
            if (error.response) {
                setMessage(`회원가입 실패: ${error.response.status} - ${error.response.data?.message || "오류 발생"}`);
            } else if (error.request) {
                setMessage("회원가입 실패: 서버 응답 없음");
            } else {
                setMessage(`회원가입 실패: ${error.message}`);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <header>
                <GoArrowLeft className="backBtn" onClick={() => navigate("/setmyinform")} />
            </header>

            <main className="signPage">
                <div className="main_top">
                    <div className="logo">
                        <img src={logoImg} className="logoImg" alt="logo" />
                        <img src={logoText} className="logoText" alt="text" />
                    </div>
                    <h1>회원가입</h1>
                    <p>계정을 만들어 서비스를 이용하세요</p>
                </div>

                <form className="main_main" onSubmit={handleSubmit}>
                    <div className="form_row">
                        <label>아이디</label>
                        <input className="inputBox" name="username" placeholder="아이디를 입력하세요" value={formData.username} onChange={handleChange} required />

                        <label>비밀번호</label>
                        <input className="inputBox" name="password" type="password" placeholder="비밀번호를 입력하세요" value={formData.password} onChange={handleChange} required />

                        <label>비밀번호 확인</label>
                        <input className="inputBox" name="pwCheck" type="password" placeholder="비밀번호를 다시 입력하세요" value={formData.pwCheck} onChange={handleChange} required />

                        <label>작업 위치</label>
                        <input className="inputBox" name="workLocation" placeholder="작업 위치" value={formData.workLocation} onChange={handleChange} />

                        <label>경력 (년)</label>
                        <input className="inputBox" name="experienceYears" type="number" placeholder="예: 3" value={formData.experienceYears} onChange={handleChange} />
                    </div>

                    <div className="main_bottom">
                        <button type="submit" className="BlueBtn" disabled={loading}>
                            {loading ? "가입 중..." : "가입하기"}
                        </button>
                        {message && <p style={{ color: message.includes("성공") ? "green" : "red", marginTop: "0.5rem" }}>{message}</p>}
                        <div className="main_main_signUp">
                            <span>이미 계정이 있으신가요?</span>
                            <Link to="/login">로그인</Link>
                        </div>
                    </div>
                </form>
            </main>
        </>
    );
};

export default Signup;
