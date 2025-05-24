import React from "react"
import { useNavigate } from 'react-router-dom';
import logoImg from "../../img/logoimg.jpg";
import logoText from "../../img/logotext.png";
import { IoMenu, IoPersonOutline, IoDocumentTextOutline, IoCameraOutline, IoBookOutline } from "react-icons/io5";
import BottomNav from "../../lib/nav/BottomNav";
import "./home.css";

const Home = () => {
    const navigate = useNavigate();
    const goMypage = () => {
        navigate("/mypage");
        };
    const goMydocument = () => {
        navigate("/mydocument");
        };
    const goOcr = () => {
        navigate("/ocr");
        };
    const goInformation = () => {
        navigate("/information");
        };
    
    
    return (
        <>
            <header>
                <div className="home_logo">
                    <img src={logoImg} className="logoImg"/>
                    <img src={logoText} className="logoText"/>
                    <IoPersonOutline className="profileBtn" onClick={goMypage}/>
                </div>
            </header>

            <main className="homePage">
                <h1>안녕하세요, 홍길동님</h1>
                <div className="pageBtn">
                    <button className="main_myFile" onClick={goMydocument}>
                        <IoDocumentTextOutline className="btn_icon"/>
                        <div className="pageBtnText">
                            <p>내 기록 보기</p>
                            <span>저장된 문서와 번역 기록을 확인하세요</span>
                        </div>
                    </button>
                    <button className="main_OCRPicture" onClick={goOcr}>
                        <IoCameraOutline className="btn_icon"/>
                        <div className="pageBtnText">
                            <p>OCR찍기</p>
                            <span>근로계약서를 촬영하여 번역 및 분석하세요</span>
                        </div>
                    </button>
                    <button className="main_law" onClick={goInformation}>
                        <IoBookOutline className="btn_icon"/>
                        <div className="pageBtnText">
                            <p>법률 정보 보기</p>
                            <span>외국인 근로자 관련 법률 정보를 확인하세요</span>
                        </div>
                    </button>
                </div>
            </main>
            <BottomNav class="bottom-nav"/>
        </>
    );
};
export default Home