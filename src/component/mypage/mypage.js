import React, { useState, useEffect } from "react";
import { useNavigate, Link } from 'react-router-dom';
import axios from "axios";
import { GoArrowLeft } from "react-icons/go";
import { FaRegSave } from "react-icons/fa";
import { IoIosLogOut } from "react-icons/io";
import SelectLanguage from "../../lib/selectbox/SelectLanguage";
import SelectNation from "../../lib/selectbox/SelectNation";
import BottomNav from "../../lib/nav/BottomNav";
import "./mypage.css";

const Mypage = () => {
    const navigate = useNavigate();

    const [lang, setLang] = useState("");
    const [nat, setNat] = useState("");
    const [username, setUsername] = useState("");
    const [nickname, setNickname] = useState("");
    const [phone, setPhone] = useState("");
    const [workLocation, setWorkLocation] = useState("");
    const [experienceYears, setExperienceYears] = useState(0);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const memberId = user.memberId;
        const token = localStorage.getItem("token");

        if (!memberId || !token) {
            alert("로그인 정보가 없습니다.");
            navigate("/login");
            return;
        }

        axios.get(`https://port-0-mobicom-sw-contest-2025-umnqdut2blqqevwyb.sel4.cloudtype.app/api/users/${memberId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(res => {
            const data = res.data;
            setUsername(data.username || "");
            setNickname(data.nickname || "");
            setPhone(data.phone || "");
            setLang(data.language || "");
            setNat(data.nationality || "");
            setWorkLocation(data.workLocation || "");
            setExperienceYears(data.experienceYears || 0);
        }).catch(err => {
            console.error("회원 정보 조회 실패:", err);
            alert("회원 정보를 불러오지 못했습니다.");
        });
    }, [navigate]);

    const goHome = () => navigate("/home");

    const goLogin = () => {
        localStorage.clear();
        navigate("/login");
    };

    return (
        <>
            <header>
                <GoArrowLeft className="backBtn" onClick={goHome} />
                <p>내 정보 관리</p>
            </header>

            <main className="myPage">
                <h1>개인 정보</h1>
                <div className="main_main">
                    <label>아이디</label>
                    <input className="inputBox" value={username} disabled />

                    <label>이름</label>
                    <input className="inputBox" value={nickname} disabled />

                    <label>연락처</label>
                    <input className="inputBox" value={phone} disabled />

                    <label>국적</label>
                    <SelectNation value={nat} onChange={e => setNat(e.target.value)} />

                    <label>사용언어</label>
                    <SelectLanguage value={lang} onChange={e => setLang(e.target.value)} />

                    <label>작업 위치</label>
                    <input className="inputBox" value={workLocation} onChange={e => setWorkLocation(e.target.value)} />

                    <label>경력 (년)</label>
                    <input className="inputBox" type="number" value={experienceYears} onChange={e => setExperienceYears(e.target.value)} />
                </div>

                <Link to="/mypagepw" className="pw_link">비밀번호 재설정</Link>

                <div className="main_bottom">
                    <button className="save_btn" onClick={() => alert("저장 기능 미구현 (PUT 필요)")}>
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
