import React, { useState } from "react";
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
    const resultData = location.state?.result || "결과 데이터가 없습니다.";

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const goOcr = () => navigate("/ocr");
    const goRender = () => navigate("/render", { state: { result: resultData } });

    const handleSave = () => {
        const saved = JSON.parse(localStorage.getItem("savedDocs") || "[]");

        const newDoc = {
            id: Date.now(),
            title: resultData.title || "OCR 결과",
            date: new Date().toLocaleDateString(),
            image: resultData.originalImage,
            translatedImage: resultData.translatedImage,
        };

        saved.push(newDoc);
        localStorage.setItem("savedDocs", JSON.stringify(saved));

        navigate("/mydocument");
    };

    const analyzeLegalInfo = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post(
                `https://port-0-mobicom-sw-contest-2025-umnqdut2blqqevwyb.sel4.cloudtype.app/api/contracts/${resultData.contractId}/analyze`
            );

            // 성공 시 분석 결과와 함께 페이지 이동
            navigate("/ocr-summary", { state: { analysis: response.data } });
        } catch (err) {
            console.error("법률 정보 분석 실패:", err);
            setError(`법률 정보 분석 실패: ${err.message} (${err.response?.status || "알 수 없는 오류"})`);
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
                        src={resultData.originalImage}
                        alt="원본 이미지"
                        className="resltImg"
                    />
                </div>

                <div className="saveAndShareBtn">
                    <button onClick={handleSave}>
                        <FaRegSave className="icon" /> 저장하기
                    </button>
                    <button><FiUpload className="icon" />공유하기</button>
                </div>

                <button className="BlueBtn" onClick={analyzeLegalInfo}>
                    {loading ? "분석 중..." : "법률 분석 보기"}
                </button>

                {error && <p style={{ color: "red" }}>{error}</p>}
            </main>

            <BottomNav />
        </>
    );
};

export default Result;
