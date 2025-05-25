import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { GoArrowLeft, GoInfo } from "react-icons/go";
import { AiOutlineWarning } from "react-icons/ai";
import { HiArrowTopRightOnSquare } from "react-icons/hi2";
import axios from "axios";
import "./summary.css";

const Summary = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const contractId = location.state?.result?.contractId || location.state?.analysis?.contractId;

    const [issues, setIssues] = useState([]);
    const [laws, setLaws] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const goResult = () => navigate("/ocr-result", { state: location.state });

    const goEachsummary = () => navigate("/eachsummary");

    const fetchContractDetail = async () => {
        if (!contractId) {
            setError("contractId가 전달되지 않았습니다.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await axios.get(
                `https://port-0-mobicom-sw-contest-2025-umnqdut2blqqevwyb.sel4.cloudtype.app/api/contract/${contractId}`
            );

                console.log(response.data)

            setIssues(response.data.issues || []);
            setLaws(response.data.laws || []);
        } catch (err) {
            console.error("상세 정보 로드 실패:", err);
            setError(`상세 정보 로드 실패: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContractDetail();
    }, []);

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
                    {loading && <p>불러오는 중입니다...</p>}
                    {error && <p style={{ color: "red" }}>{error}</p>}

                    {/* 검토사항 */}
                    {issues.map((issue, idx) => (
                        <div className="main_box" key={`issue-${idx}`}>
                            <div className="main_box_title">
                                <GoInfo className="icon" />
                                <p>검토사항</p>
                            </div>
                            <p className="row_title">검토 유형: {issue.type}</p>
                            <div className="content">
                                <p><strong>사유:</strong> {issue.reason}</p>
                                <p className="content_ex"><strong>근거:</strong> {issue.evidence}</p>
                            </div>
                            <button className="detail_btn" onClick={goEachsummary}>
                                <p>자세히 보기</p>
                                <HiArrowTopRightOnSquare />
                            </button>
                        </div>
                    ))}

                    {/* 관련법률 정보 */}
                    {laws.map((law, idx) => (
                        <div className="main_box" key={`law-${idx}`}>
                            <div className="main_box_title">
                                <GoInfo className="icon" />
                                <p>관련법률 정보</p>
                            </div>
                            <p className="row_title">법률명: {law.lawName}</p>
                            <div className="content">
                                {law.translatedSummary && <p><strong>요약:</strong> {law.translatedSummary}</p>}
                                {law.referenceNumber && <p className="content_ex"><strong>참조 번호:</strong> {law.referenceNumber}</p>}
                                {law.sourceLink && (
                                    <p><strong>출처:</strong> <a href={law.sourceLink} target="_blank" rel="noopener noreferrer">{law.sourceLink}</a></p>
                                )}
                            </div>
                            <button className="detail_btn" onClick={goEachsummary}>
                                <p>자세히 보기</p>
                                <HiArrowTopRightOnSquare />
                            </button>
                        </div>
                    ))}

                    {/* 주의 박스: 가장 첫 번째 issue를 기반으로 보여줌 */}
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
