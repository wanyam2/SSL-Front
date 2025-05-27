import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { GoArrowLeft } from "react-icons/go";
import { FiUpload } from "react-icons/fi";
import { FaRegSave } from "react-icons/fa";
import BottomNav from "../../lib/nav/BottomNav";
import axios from "axios";
import "./result.css";

const Result = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const resultData = location.state?.result || {};
    console.log(resultData)

    const [contractId, setContractId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);


    useEffect(() => {
        const fetchContracts = async () => {
            try {
                const user = JSON.parse(localStorage.getItem("user") || "{}");
                const memberId = user.memberId;
                console.log(memberId)
                if (!memberId) {
                    throw new Error("memberId가 없습니다.");
                }

                const response = await axios.get(
                    "https://port-0-mobicom-sw-contest-2025-umnqdut2blqqevwyb.sel4.cloudtype.app/api/contract",
                    { params: { memberId } }
                );

                // 3) 배열로 반환된 계약서 중 첫 번째 항목에서 contractId 추출
                const contracts = response.data;
                if (Array.isArray(contracts) && contracts.length > 0) {
                    setContractId(contracts[0].contractId);
                    console.log("불러온 Contract ID:", contracts[0].contractId);
                } else {
                    throw new Error("조회된 계약서가 없습니다.");
                }
            } catch (err) {
                console.error("계약서 조회 실패:", err);
                setError(err.message);
            }
        };

        fetchContracts();
    }, []);

    const goOcr = () => navigate("/ocr");
    const goRender = () => navigate("/render", { state: { result: resultData } });

    const handleSave = () => {
        const saved = JSON.parse(localStorage.getItem("savedDocs") || "[]");
        const newDoc = {
            id: Date.now(),
            title: resultData.title || "OCR 결과",
            date: new Date().toLocaleDateString(),
            originalImage: resultData.originalImage,
            translatedImage: resultData.translatedImage,
            contractId: contractId
        };
        saved.push(newDoc);
        localStorage.setItem("savedDocs", JSON.stringify(saved));
        navigate("/mydocument");
    };

    const analyzeLegalInfo = async () => {
        if (!contractId) return;

        setLoading(true);
        setError(null);

        try {
            const response = await axios.post(
                `https://port-0-mobicom-sw-contest-2025-umnqdut2blqqevwyb.sel4.cloudtype.app/api/contracts/${contractId}/analyze`
            );

            const newLaws = response.data.laws || [];
            const prevLaws = JSON.parse(localStorage.getItem("allLaws") || "[]");

            // referenceNumber 기준 중복 제거
            const map = new Map();
            [...prevLaws, ...newLaws].forEach(law => {
                map.set(law.referenceNumber, law);
            });

            localStorage.setItem("allLaws", JSON.stringify([...map.values()]));

            console.log(contractId)
            navigate("/ocr-summary", { state: { analysis: response.data, result: resultData, contractId} });
        } catch (err) {
            console.error("법률 분석 실패:", err);
            setError(`법률 분석 실패: ${err.message} (${err.response?.status || "알 수 없는 오류"})`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <header>
                <GoArrowLeft className="backBtn" onClick={goOcr} />
                <p>번역 결과</p>
            </header>

            <main className="resltPage">
                <div className="resultBtn">
                    <button className="nowPageBtn">원본</button>
                    <button onClick={goRender}>번역 결과</button>
                </div>

                <div className="result_main">
                    <p>원본</p>
                    <img
                        src={resultData.originalImage || resultData.image}
                        alt="원본 이미지"
                        className="resltImg"
                    />
                </div>

                <div className="saveAndShareBtn">
                    <button onClick={handleSave} disabled={!contractId}>
                        <FaRegSave className="icon" /> 저장하기
                    </button>
                    <button><FiUpload className="icon" />공유하기</button>
                </div>

                <button className="BlueBtn" onClick={analyzeLegalInfo} disabled={!contractId || loading}>
                    {loading ? "분석 중..." : "법률 분석 보기"}
                </button>

                {error && <p style={{ color: "red" }}>{error}</p>}
            </main>

            <BottomNav />
        </>
    );
};

export default Result;
