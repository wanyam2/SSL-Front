import React from "react"
import { useNavigate } from 'react-router-dom';
import { GoArrowLeft, GoPencil } from "react-icons/go";
import { IoDocumentTextOutline } from "react-icons/io5";
import { HiArrowTopRightOnSquare } from "react-icons/hi2";
import BottomNav from "../../lib/nav/BottomNav";
import "./document.css";

const Employment = () => {
    const navigate = useNavigate();
    const goHome = () => {
        navigate("/home");
        };
    const goDoc = () => {
        navigate("/mydocument");
        };
    const goOthers = () => {
        navigate("/others");
        };

    return (
        <>
            <header>
                <GoArrowLeft className="backBtn" onClick={goHome}/>
                <p>내 문서 기록</p>
            </header>
            <main className="docPage">
                <div className="main_top">
                    <button onClick={goDoc}>전체</button>
                    <button className="nowPageBtn">근로계약서</button>
                    <button onClick={goOthers}>기타</button>
                </div>
                <div className="main_main">
                    <button className="fileBtn">
                        <IoDocumentTextOutline className="fileicon"/>
                        <div className="file_title">
                            <div>
                                <p>근로계약서</p>
                                <GoPencil/>
                            </div>
                            <span>0000-00-00</span>
                        </div>
                        <HiArrowTopRightOnSquare className="shareicon"/>
                    </button>
                    <button className="fileBtn">
                        <IoDocumentTextOutline className="fileicon"/>
                        <div className="file_title">
                            <div>
                                <p>임대차계약서</p>
                                <GoPencil/>
                            </div>
                            <span>0000-00-00</span>
                        </div>
                        <HiArrowTopRightOnSquare className="shareicon"/>
                    </button>
                    <button className="fileBtn">
                        <IoDocumentTextOutline className="fileicon"/>
                        <div className="file_title">
                            <div>
                                <p>보험계약서</p>
                                <GoPencil/>
                            </div>
                            <span>0000-00-00</span>
                        </div>
                        <HiArrowTopRightOnSquare className="shareicon"/>
                    </button>
                    <button className="fileBtn">
                        <IoDocumentTextOutline className="fileicon"/>
                        <div className="file_title">
                            <div>
                                <p>기타계약서</p>
                                <GoPencil/>
                            </div>
                            <span>0000-00-00</span>
                        </div>
                        <HiArrowTopRightOnSquare className="shareicon"/>
                    </button>
                </div>
            </main>
            <BottomNav />

        </>

    )
}
export default Employment