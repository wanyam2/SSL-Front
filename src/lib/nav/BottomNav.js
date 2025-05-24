import React from "react";
import { useNavigate } from "react-router-dom";
import { IoHomeOutline, IoDocumentTextOutline, IoCameraOutline, IoBookOutline, IoPersonOutline } from "react-icons/io5";
import "./BottomNav.css";

export default function BottomNav() {
    const navigate = useNavigate();
    return (
        <nav className="bottom-nav">
            <button onClick={() => navigate("/home")} className="bottom-nav-btn">
                <IoHomeOutline className="homr_icon"/>
                <span>홈</span>
            </button>
            <button onClick={() => navigate("/mydocument")} className="bottom-nav-btn">
                <IoDocumentTextOutline className="homr_icon"/>
                <span>내 문서</span>
            </button>
            <button onClick={() => navigate("/ocr")} className="bottom-nav-btn">
                <IoCameraOutline className="homr_icon"/>
                <span>스캔</span>
            </button>
            <button onClick={() => navigate("/information")} className="bottom-nav-btn">
                <IoBookOutline className="homr_icon"/>
                <span>법률 정보</span>
            </button>
            <button onClick={() => navigate("/mypage")} className="bottom-nav-btn">
                <IoPersonOutline className="homr_icon"/>
                <span>내 정보</span>
            </button>
        </nav>
    );
}
