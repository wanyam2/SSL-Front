import React, { useEffect, useRef, useState } from "react";
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

    const videoRef = useRef(null);
    const streamRef = useRef(null);
    const [cameraReady, setCameraReady] = useState(false);

    const goHome = () => navigate("/");

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
                { headers: { "Content-Type": "multipart/form-data" } }
            );
            console.log(response.data);
            navigate("/ContractResultPage", { state: { result: response.data } });
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

    useEffect(() => {
        let canceled = false;
        (async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 }, height: { ideal: 720 } },
                    audio: false,
                });
                if (canceled) return;
                streamRef.current = stream;
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    await videoRef.current.play();
                    setCameraReady(true);
                }
            } catch (e) {
                console.error(e);
                setError("카메라 권한을 허용해 주세요. (HTTPS 필요)");
            }
        })();

        return () => {
            canceled = true;
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(t => t.stop());
                streamRef.current = null;
            }
        };
    }, []);

    const handleScan = async () => {
        if (!videoRef.current) return;
        try {
            setLoading(true);
            setError(null);

            const video = videoRef.current;
            const canvas = document.createElement("canvas");

            // 중앙 가이드 박스 비율(이미지와 비슷하게)
            const guideW = Math.floor(video.videoWidth * 0.76);
            const guideH = Math.floor(video.videoHeight * 0.52);
            const guideX = Math.floor((video.videoWidth - guideW) / 2);
            const guideY = Math.floor((video.videoHeight - guideH) / 2);

            canvas.width = guideW;
            canvas.height = guideH;
            const ctx = canvas.getContext("2d");
            if (!ctx) throw new Error("캔버스 컨텍스트를 가져올 수 없습니다.");

            ctx.drawImage(video, guideX, guideY, guideW, guideH, 0, 0, guideW, guideH);

            const blob = await new Promise(resolve => canvas.toBlob(resolve, "image/jpeg", 0.92));
            if (!blob) throw new Error("이미지 캡처 실패");

            const formData = new FormData();
            formData.append("file", new File([blob], "scan.jpg", { type: "image/jpeg" }));

            const response = await axios.post(
                "https://port-0-mobicom-sw-contest-2025-umnqdut2blqqevwyb.sel4.cloudtype.app/api/contract/1/upload-and-translate",
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );
            console.log(response.data);
            navigate("/ocr-result", { state: { result: response.data } });
        } catch (err) {
            console.error(err);
            setError(err.message || "스캔 실패");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <header className="ocrHeader">
                <GoArrowLeft className="backBtn" onClick={goHome} />
                <p>근로계약서 스캔</p>
                <span />
            </header>

            <main className="ocrPage">
                <div className="previewWrap">
                    <video ref={videoRef} className="video" playsInline muted autoPlay />
                    <div className="mask">
                        <div className="guideBox">
                            <span className="corner tl" />
                            <span className="corner tr" />
                            <span className="corner bl" />
                            <span className="corner br" />
                        </div>
                    </div>
                    {!cameraReady && <div className="loadingText">카메라를 여는 중…</div>}
                </div>

                <div className="notice">
                    촬영된 문서는 개인정보 보호를 위해 자동으로 필터링 됩니다.<br />
                    번역 및 법률 정보 제공 목적으로만 사용됩니다.
                </div>

                <div className="main_btm">
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

                    <button className="scanBtn" onClick={handleScan} disabled={loading || !cameraReady}>
                        <IoCameraOutline className="icon" />
                        <p>스캔하기</p>
                    </button>
                </div>

                {loading && <p className="progressText">업로드 중입니다...</p>}
                {error && <p className="errorText">{error}</p>}
            </main>

            <footer>
                <BottomNav />
            </footer>
        </>
    );
};

export default Ocr;
