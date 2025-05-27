import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import logoImg from "../../img/logoimg.jpg";
import logoText from "../../img/logotext.png";
import { IoPersonOutline, IoDocumentTextOutline, IoCameraOutline, IoBookOutline } from "react-icons/io5";
import BottomNav from "../../lib/nav/BottomNav";
import "./home.css";

const Home = () => {
    const navigate = useNavigate();
    const [nickname, setNickname] = useState("사용자");

    const goMypage = () => navigate("/mypage");
    const goMydocument = () => navigate("/mydocument");
    const goOcr = () => navigate("/ocr");
    const goInformation = () => navigate("/information");

    useEffect(() => {
        const rawUser = localStorage.getItem("user");
        const token = localStorage.getItem("token");
        
        if (!rawUser || !token) {
            console.error("로그인 정보 없음");
            return;
        }

        try {
            const user = JSON.parse(rawUser);
            const memberId = user.memberId;



            axios.get(`https://port-0-mobicom-sw-contest-2025-umnqdut2blqqevwyb.sel4.cloudtype.app/api/users/${memberId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then(res => {
                    console.log(res.data);
                setNickname(res.data.nickname || "사용자");
            }).catch(err => {
                console.error("사용자 정보 불러오기 실패:", err);
            });
        } catch (e) {
            console.error("유저 파싱 실패:", e);
        }
    }, []);

    return (
        <>
            <header>
                <div className="home_logo">
                    <img src={logoImg} className="logoImg" alt="logo" />
                    <img src={logoText} className="logoText" alt="text" />
                    <IoPersonOutline className="profileBtn" onClick={goMypage} />
                </div>
            </header>

            <main className="homePage">
                <h1>안녕하세요, {nickname}님!</h1>
                <div className="pageBtn">
                    <button className="main_myFile" onClick={goMydocument}>
                        <IoDocumentTextOutline className="btn_icon" />
                        <div className="pageBtnText">
                            <p>내 기록 보기</p>
                            <span>저장된 문서와 번역 기록을 확인하세요</span>
                        </div>
                    </button>
                    <button className="main_OCRPicture" onClick={goOcr}>
                        <IoCameraOutline className="btn_icon" />
                        <div className="pageBtnText">
                            <p>OCR찍기</p>
                            <span>근로계약서를 촬영하여 번역 및 분석하세요</span>
                        </div>
                    </button>
                    <button className="main_law" onClick={goInformation}>
                        <IoBookOutline className="btn_icon" />
                        <div className="pageBtnText">
                            <p>법률 정보 보기</p>
                            <span>외국인 근로자 관련 법률 정보를 확인하세요</span>
                        </div>
                    </button>
                </div>
            </main>

            <BottomNav className="bottom-nav" />
        </>
    );
};

export default Home;
