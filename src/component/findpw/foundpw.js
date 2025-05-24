import React, { useState } from "react";     
import { useNavigate, Link} from 'react-router-dom';
import { GoArrowLeft } from "react-icons/go";
import logoImg from "../../img/logoimg.jpg";
import logoText from "../../img/logotext.png";
import "./findpw.css";



const Foundpw = () => {
    const navigate = useNavigate();
    const goToLogin = () => {
        navigate("/login");
    };
    const goTofindpw = () => {
        navigate("/findpw");
    };


    return (       
        <>
            <header>
                <div>
                    <GoArrowLeft className="backBtn" onClick={goTofindpw}/>
                </div>
            </header>

            <main className="findpwPage">
                <div className="main_top">
                    <div className="logo">
                        <img src={logoImg} className="logoImg"/>
                        <img src={logoText} className="logoText"/>
                    </div>
                    <h1>비밀번호 찾기</h1>
                    <span>회원정보에 등록하신 전화번호로 비밀번호를 발송해 드립니다.</span>
                    <span>아래 입력하신 정보는 회원정보에 등록된 정보와 일치해야합니다.</span>
                </div>

                <div className="main_main">
                    <h1>비밀번호가 연락처로 발송되었습니다.</h1>
                    <span>입력해주신 연락처로 비밀번호가 발송되었습니다.</span>
                    <span>휴대전화를 확인해주세요</span>
                    <button onClick={goToLogin} className="BlueBtn">확인</button>
                </div>
            </main>
        </>
    );
};
export default Foundpw