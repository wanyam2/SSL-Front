import React from "react"
import { useNavigate } from 'react-router-dom';
import { GoArrowLeft } from "react-icons/go";
import {IoDocumentTextOutline, IoBookOutline } from "react-icons/io5";
import { HiArrowTopRightOnSquare } from "react-icons/hi2";
import BottomNav from "../../lib/nav/BottomNav";
import "./information.css";


const Information = () => {
    const navigate = useNavigate();
    const goHome = () => {
        navigate("/home");
        };


    return (
        <>
            <header>
                <GoArrowLeft className="backBtn" onClick={goHome}/>
                <p>법률 정보</p>
            </header>

            <main className="informPage">
                <p className="main_title">외국인 근로자 관련 주요 법률정보를 확인하세요</p>
                <div className="row_inform_box">
                    <button className="row_inform">
                        <IoDocumentTextOutline className="fileicon"/>
                        <div className="row_inform_text">
                            <p>근로계약 관련 법률</p>
                            <span>근로계약 체결, 해지, 갱신에 관한 법률 정보</span>
                        </div>
                    </button>                
                    <button className="row_inform">
                        <IoDocumentTextOutline className="fileicon"/>
                        <div className="row_inform_text">
                            <p>근로계약 관련 법률</p>
                            <span>근로계약 체결, 해지, 갱신에 관한 법률 정보</span>
                        </div>
                    </button>                
                    <button className="row_inform">
                        <IoDocumentTextOutline className="fileicon"/>
                        <div className="row_inform_text">
                            <p>근로계약 관련 법률</p>
                            <span>근로계약 체결, 해지, 갱신에 관한 법률 정보</span>
                        </div>
                    </button>                
                    <button className="row_inform">
                        <IoDocumentTextOutline className="fileicon"/>
                        <div className="row_inform_text">
                            <p>근로계약 관련 법률</p>
                            <span>근로계약 체결, 해지, 갱신에 관한 법률 정보</span>
                        </div>
                    </button>                
                </div>
                <div className="row_site_box">
                    <div className="row_site_tilte">
                        <IoBookOutline className="icon"/>
                        <p>외부 법률 정보 자료</p>
                    </div>
                    <button className="row_site_link">
                        <p>고용노동부 외국인 근로자 안내</p>
                        <HiArrowTopRightOnSquare/>
                    </button>
                    <button className="row_site_link">
                        <p>고용노동부 외국인 근로자 안내</p>
                        <HiArrowTopRightOnSquare/>
                    </button>
                </div>
            </main>
            <BottomNav />
        </>
    )
}
export default Information