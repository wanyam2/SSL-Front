import React from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { GoArrowLeft } from "react-icons/go";
import { HiArrowTopRightOnSquare } from "react-icons/hi2";
import "./eachsummary.css";

const Eachsummary = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const lawDetail = location.state?.lawDetail;

    const goSummary = () => navigate("/ocr-summary");

    if (!lawDetail) {
        return (
            <main className="eachsummary">
                <p style={{ padding: "20px" }}>법률 정보가 없습니다.</p>
                <button onClick={goSummary}>돌아가기</button>
            </main>
        );
    }

    return (
        <>
            <header>
                <GoArrowLeft className="backBtn" onClick={goSummary} />
                <p>{lawDetail.lawName || "법률 상세 정보"}</p>
            </header>

            <main className="eachsummary">
                <div className="main_top">
                    <span>법률 조항에 대한 상세 정보와 쉬운 설명을 제공합니다.</span>
                </div>

                <div className="main_main">
                    <div className="main_box">
                        <div className="main_box_title">
                            <p>법률 목적</p>
                        </div>
                        <div className="content">
                            <span>{lawDetail.purpose || "정보 없음"}</span>
                        </div>
                    </div>

                    <div className="main_box">
                        <div className="main_box_title">
                            <p>주요 조항</p>
                        </div>
                        <div className="content">
                            <span>{lawDetail.mainClause || "정보 없음"}</span>
                        </div>
                    </div>

                    <div className="main_box">
                        <div className="main_box_title">
                            <p>요약 설명</p>
                        </div>
                        <div className="content">
                            <span>{lawDetail.translatedSummary || "정보 없음"}</span>
                        </div>
                    </div>

                    <div className="main_box">
                        <div className="main_box_title">
                            <p>참조 번호</p>
                        </div>
                        <div className="content">
                            <span>{lawDetail.referenceNumber || "정보 없음"}</span>
                        </div>
                    </div>
                </div>

                {lawDetail.sourceLink && (
                    <a href={lawDetail.sourceLink} target="_blank" rel="noopener noreferrer">
                        <button className="BlueBtn">
                            국가법령정보센터에서 보기
                            <HiArrowTopRightOnSquare className="icon" />
                        </button>
                    </a>
                )}

                <div className="add_text">
                    <p>본 분석은 법률 정보 제공 목적으로만 사용되며, 법적 조언이 아닙니다.</p>
                    <p>정확한 법률 상담은 변호사와 상담하시기 바랍니다.</p>
                </div>
            </main>
        </>
    );
};

export default Eachsummary;
