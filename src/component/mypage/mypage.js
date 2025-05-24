import React, { useState, useEffect } from "react";     
import { useNavigate, Link } from 'react-router-dom';
import { GoArrowLeft } from "react-icons/go";
import { FaRegSave } from "react-icons/fa";
import { IoIosLogOut } from "react-icons/io";
import SelectLanguage from "../../lib/selectbox/SelectLanguage";
import SelectNation from "../../lib/selectbox/SelectNation";
import BottomNav from "../../lib/nav/BottomNav";
import "./mypage.css";

const Mypage = () => {
    const navigate = useNavigate();

    // 초기 상태 설정
    const [lang, setLang] = useState("");
    const [nat, setNat] = useState("");
    const [username, setUsername] = useState("");
    const [phone, setPhone] = useState("");
    const [userId, setUserId] = useState("");

    // 저장된 유저 정보 불러오기
    useEffect(() => {
        const savedUser = JSON.parse(localStorage.getItem("user")) || {};
        setLang(savedUser.language || "");
        setNat(savedUser.nationality || "");
        setUsername(savedUser.name || "");
        setPhone(savedUser.phoneNum || "");
        setUserId(savedUser.username || "");
    }, []);

    // 정보 저장 함수
    const handleSave = () => {
        const updatedUser = {
            name: username,
            phoneNum: phone,
            username: userId,
            nationality: nat,
            language: lang
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        alert("정보가 저장되었습니다.");
    };

    const goHome = () => navigate("/home");
    const goLogin = () => navigate("/login");

    return (
        <>
            <header>
                <GoArrowLeft className="backBtn" onClick={goHome} />
                <p>내 정보 관리</p>
            </header>

            <main className="myPage">
                <h1>개인 정보</h1>
                <div className="main_main">
                    <label htmlFor="nation">국적</label>
                    <SelectNation value={nat} onChange={e => setNat(e.target.value)} />

                    <label htmlFor="lang">사용언어</label>
                    <SelectLanguage value={lang} onChange={e => setLang(e.target.value)} />

                    <label htmlFor="username">이름</label>
                    <input id="username" className="inputBox" value={username} onChange={e => setUsername(e.target.value)} />

                    <label htmlFor="phoneNum">연락처</label>
                    <input id="phoneNum" className="inputBox" value={phone} onChange={e => setPhone(e.target.value)} />

                    <label htmlFor="id">아이디</label>
                    <input id="id" className="inputBox" value={userId} onChange={e => setUserId(e.target.value)} />
                </div>

                <Link to="/mypagepw" className="pw_link">비밀번호 재설정</Link>

                <div className="main_bottom">
                    <button className="save_btn" onClick={handleSave}>
                        <FaRegSave className="icon" /> 저장하기
                    </button>
                    <button className="logout_btn" onClick={goLogin}>
                        <IoIosLogOut className="icon" /> 로그아웃
                    </button>
                </div>
            </main>
            <BottomNav />
        </>
    );
};

export default Mypage;
