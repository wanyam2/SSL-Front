import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { GoArrowLeft } from "react-icons/go";
import { FaRegSave } from "react-icons/fa";
import BottomNav from "../../lib/nav/BottomNav";
import "./mypagepw.css";

const Mypagepw = () => {
    const navigate = useNavigate();

    const goMypage = () => {
        navigate("/mypage");
    };

    const [userPw, setUserPw] = useState({
        savedpassword: "",
        password: "",
        newPw: "",
        pwCheck: ""
    });

    const [message, setMessage] = useState("");

    useEffect(() => {
        const savedUser = JSON.parse(localStorage.getItem("user")) || {};
        setUserPw(prev => ({
            ...prev,
            savedpassword: savedUser.password || "" // 실제 저장된 현재 비밀번호
        }));
    }, []);

    const handleChange = (e) => {
        // 네임과 벨류 속성만 뽑아오기 > 구조분해할당
        const { name, value } = e.target;
        setUserPw(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();  // 기본 폼 제출 막기

        if (userPw.password !== userPw.savedpassword) {
            setMessage("현재 비밀번호가 일치하지 않습니다.");
            return;
        }

        if (userPw.newPw !== userPw.pwCheck) {
            setMessage("새 비밀번호가 일치하지 않습니다.");
            return;
        }

        // 저장된 user 정보 업데이트
        const updatedUser = JSON.parse(localStorage.getItem("user")) || {};
        updatedUser.password = userPw.newPw;
        localStorage.setItem("user", JSON.stringify(updatedUser));

        setMessage("비밀번호가 성공적으로 변경되었습니다.");
        setTimeout(() => navigate("/mypage"), 1000);
    };

    return (
        <>
            <header>
                <GoArrowLeft className="backBtn" onClick={goMypage} />
                <p>내 정보 관리</p>
            </header>

            <main>
                <form className="mypwPage" onSubmit={handleSubmit}>
                    <h1>비밀번호 재설정</h1>
                    <div className="main_main">
                        <label htmlFor="pw">현재 비밀번호</label>
                        <input
                            id="pw"
                            name="password"
                            type="password"
                            placeholder="현재 비밀번호를 입력하세요"
                            className="inputBox"
                            value={userPw.password}
                            onChange={handleChange}
                        />

                        <label htmlFor="newpw">새 비밀번호</label>
                        <input
                            id="newpw"
                            name="newPw"
                            type="password"
                            placeholder="새 비밀번호를 입력하세요"
                            className="inputBox"
                            value={userPw.newPw}
                            onChange={handleChange}
                        />

                        <label htmlFor="newpwCheck">새 비밀번호 확인</label>
                        <input
                            id="newpwCheck"
                            name="pwCheck"
                            type="password"
                            placeholder="비밀번호를 다시 입력하세요"
                            className="inputBox"
                            value={userPw.pwCheck}
                            onChange={handleChange}
                        />
                    </div>

                    {message && (
                        <p className={`message ${message.includes("성공") ? "success" : "error"}`}>
                            {message}
                        </p>
                    )}

                    <div className="main_bottom">
                        <button type="submit" className="save_btn">
                            <FaRegSave className="icon" /> 저장하기
                        </button>
                    </div>
                </form>
            </main>
            <BottomNav />
        </>
    );
};

export default Mypagepw;
