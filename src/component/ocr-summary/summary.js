import React from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { GoArrowLeft, GoInfo } from "react-icons/go";
import { AiOutlineWarning } from "react-icons/ai";
import { HiArrowTopRightOnSquare } from "react-icons/hi2";
import "./summary.css";

const Summary = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // POST 응답값에서 직접 꺼냄
    const analysis = location.state?.analysis;
    const result = location.state?.result;

    const issues = analysis?.issues || [];
    const laws = analysis?.laws || [];

    const goResult = () => navigate("/ocr-result", { state: { result } });

    return (
        <>
            <header>
                <GoArrowLeft className="backBtn" onClick={goResult} />
                <p>법률 분석 결과</p>
            </header>

            <main className="sumaryPage">
                <div className="main_top">
                    <span>계약서 내용 중 한국 노동법 기준으로 주의가 필요한 부분을 안내 해 드립니다.</span>
                </div>

                <div className="main_main">
                    {issues.length === 0 && laws.length === 0 && (
                        <p style={{ textAlign: "center", margin: "30px 0" }}>분석된 정보가 없습니다.</p>
                    )}

                    {/* 검토사항 */}
                    {issues.map((issue, idx) => (
                        <div className="main_box" key={`issue-${idx}`}>
                            <div className="main_box_title">
                                <GoInfo className="icon" />
                                <p>검토사항</p>
                            </div>
                            <p className="row_title"><strong>검토 유형: {issue.type}</strong></p>
                            <div className="content">
                                <p>
                                    <strong>사유:</strong><br />
                                    <span>{issue.reason}</span>
                                </p>
                                <p>
                                    <strong>근거:</strong><br />
                                    <span>{issue.evidence}</span>
                                </p>
                            </div>
                            {/* 필요 시 자세히 보기 버튼 구현 가능 */}
                        </div>
                    ))}

                    {/* 관련법률 정보 */}
                    {laws.map((law, idx) => (
                        <div className="main_box" key={`law-${idx}`}>
                            <div className="main_box_title">
                                <GoInfo className="icon" />
                                <p>관련법률 정보</p>
                            </div>
                            <p className="row_title"><strong>법률명: {law.lawName}</strong></p>
                            <div className="content">
                                {law.translatedSummary && 
                                    <p>
                                        <strong>요약:</strong><br />
                                        <span>{law.translatedSummary}</span>
                                    </p>
                                }

                                {law.referenceNumber && (
                                    <p className="content_ex">
                                        <strong>참조 번호:</strong> <span>{law.referenceNumber}</span>
                                    </p>
                                )}
                                
                            </div>
                            <button
                                className="detail_btn"
                                onClick={() =>
                                    navigate("/eachsummary", {
                                        state: {
                                            lawInfoId: law.lawInfoId,
                                            analysis,
                                            result
                                        }
                                    })
                                }
                            >
                                <p>자세히 보기</p>
                                <HiArrowTopRightOnSquare />
                            </button>
                        </div>
                    ))}

                    {/* 주의 박스 */}
                    {issues.length > 0 && (
                        <div className="warning_box">
                            <div className="warning_title">
                                <AiOutlineWarning className="icon" />
                                <p>주의가 필요한 내용</p>
                            </div>
                            <span>{issues[0].reason}</span>
                        </div>
                    )}
                </div>

                <div className="add_text">
                    <p>본 분석은 법률 정보 제공 목적으로만 사용되며, 법적 조언이 아닙니다.</p>
                    <p>정확한 법률 상담은 변호사와 상담하시기 바랍니다.</p>
                </div>
            </main>
        </>
    );
};

export default Summary;
