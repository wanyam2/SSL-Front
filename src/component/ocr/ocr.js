import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { GoArrowLeft } from "react-icons/go";
import { IoCameraOutline } from "react-icons/io5";
import { FiUpload } from "react-icons/fi";
import BottomNav from "../../lib/nav/BottomNav";
import axios from "axios";
import "./ocr.css";

const Ocr = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const goHome = () => navigate("/home");
    const goResult = () => navigate("/ocr-result");

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) {
            setError("파일을 선택해주세요.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        setLoading(true);
        setError(null);

        try {
            const response = await axios.post(
                "https://port-0-mobicom-sw-contest-2025-umnqdut2blqqevwyb.sel4.cloudtype.app/api/contract/1/upload-and-translate",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            );
            // 성공 시 결과 페이지로 이동하면서 데이터 전달
            navigate("/ocr-result", { state: { result: response.data } });
        } catch (err) {
            console.error("업로드 실패:", err);
            if (err.response) {
                setError(`업로드 실패 (${err.response.status}): ${JSON.stringify(err.response.data)}`);
            } else {
                setError(`업로드 실패: ${err.message}`);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <header>
                <GoArrowLeft className="backBtn" onClick={goHome} />
                <p>근로계약서 스캔</p>
            </header>

            <main className="ocrPage">
                <div className="main_main">
                    <div className="main_main_text">
                        <p>근로 계약서를 촬영하거나 파일을 업로드하세요</p>
                        <span>개인정보는 자동으로 필터링됩니다.</span>
                    </div>
                    <div className="main_btm">
                        <button onClick={goResult} className="cameraBtn">
                            <IoCameraOutline className="icon" />
                            <p>카메라</p>
                        </button>

                        {/* 파일 업로드 버튼 */}
                        <label className="uploadBtn">
                            <FiUpload className="icon" />
                            <p>업로드</p>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleUpload}
                                style={{ display: "none" }}
                            />
                        </label>
                    </div>

                    {loading && <p>업로드 중입니다...</p>}
                    {error && <p style={{ color: "red" }}>{error}</p>}
                </div>

                <div className="main_bottom">
                    <p>촬영된 문서는 개인정보 보호를 위해 자동으로 필터링 됩니다.</p>
                    <p>번역 및 법률 정보 제공 목적으로만 사용됩니다.</p>
                </div>
            </main>

            <footer>
                <BottomNav />
            </footer>
        </>
    );
};

export default Ocr;
