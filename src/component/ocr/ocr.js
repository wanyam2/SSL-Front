import React, { useEffect, useRef, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { IoClose, IoCameraOutline } from "react-icons/io5";
import { FiUpload } from "react-icons/fi";
import axios from "axios";
import "./ocr.css";
import { API_BASE } from "../../config/apiBase";
import { MdFlipCameraIos } from "react-icons/md";

const MEMBER_ID = 1;

const Ocr = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const videoRef = useRef(null);
    const streamRef = useRef(null);

    const [cameraReady, setCameraReady] = useState(false);
    const [devices, setDevices] = useState([]);
    const [selectedDeviceId, setSelectedDeviceId] = useState(null);
    const [facing, setFacing] = useState("environment"); // 'environment' | 'user'
    const isFront = facing === "user";

    const goHome = () => navigate("/");

    const stopCurrentStream = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((t) => t.stop());
            streamRef.current = null;
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
    };

    const startStream = async (opts = {}) => {
        stopCurrentStream();
        setCameraReady(false);

        const deviceId = Object.prototype.hasOwnProperty.call(opts, "deviceId")
            ? opts.deviceId
            : selectedDeviceId;
        const fm = opts.facing || facing;

        const videoConstraint = deviceId
            ? { deviceId: { exact: deviceId } }
            : { facingMode: { ideal: fm }, width: { ideal: 1280 }, height: { ideal: 720 } };

        const stream = await navigator.mediaDevices.getUserMedia({
            video: videoConstraint,
            audio: false,
        });

        streamRef.current = stream;
        if (videoRef.current) {
            videoRef.current.srcObject = stream;
            await videoRef.current.play();
        }
        setCameraReady(true);

        const all = await navigator.mediaDevices.enumerateDevices();
        const vids = all.filter((d) => d.kind === "videoinput");
        vids.forEach((v, i) => (v._idx = i + 1)); // 라벨 없는 경우 표시용 인덱스
        setDevices(vids);

        const track = stream.getVideoTracks()[0];
        const settings = track.getSettings();
        if (settings.deviceId) setSelectedDeviceId(settings.deviceId);

        const label = (track.label || "").toLowerCase();
        if (label.includes("front")) setFacing("user");
        else if (label.includes("back") || label.includes("rear") || label.includes("environment"))
            setFacing("environment");
    };

    const uploadAndRoute = async (file) => {
        setLoading(true);
        setError(null);
        try {
            const formData = new FormData();
            formData.append("file", file);

            const upRes = await axios.post(
                `${API_BASE}/api/contract/${MEMBER_ID}/upload`,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );
            const contractId = upRes.data?.contractId ?? upRes.data?.id;
            if (!contractId) throw new Error("contractId를 받지 못했습니다.");

            navigate(`/processing/${contractId}`, { state: { contractId } });
        } catch (err) {
            console.error(err);
            setError(
                err?.response
                    ? `업로드 실패 (${err.response.status}): ${JSON.stringify(err.response.data)}`
                    : `업로드 실패: ${err.message}`
            );
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return setError("파일을 선택해주세요.");
        await uploadAndRoute(file);
    };

    useEffect(() => {
        let canceled = false;
        (async () => {
            try {
                await startStream({ facing: "environment" });
            } catch (e) {
                console.error(e);
                if (!canceled) setError("카메라 권한을 허용해 주세요. (HTTPS 필요)");
            }
        })();
        return () => {
            canceled = true;
            stopCurrentStream();
        };
    }, []);

    const handleChangeDevice = async (e) => {
        const id = e.target.value || null;
        setSelectedDeviceId(id);
        try {
            await startStream({ deviceId: id });
        } catch (err) {
            console.error(err);
            setError(err.message || "카메라 전환 실패");
        }
    };

    const toggleFacing = async () => {
        setError(null);
        try {
            if (devices.length >= 2) {
                const curr = devices.find((d) => d.deviceId === selectedDeviceId);
                const currIsFront = (curr?.label || "").toLowerCase().includes("front");
                const target =
                    devices.find((d) =>
                        currIsFront
                            ? !(d.label || "").toLowerCase().includes("front")
                            : (d.label || "").toLowerCase().includes("front")
                    ) || devices.find((d) => d.deviceId !== selectedDeviceId);

                if (target) {
                    setSelectedDeviceId(target.deviceId);
                    setFacing((target.label || "").toLowerCase().includes("front") ? "user" : "environment");
                    await startStream({
                        deviceId: target.deviceId,
                        facing: (target.label || "").toLowerCase().includes("front") ? "user" : "environment",
                    });
                    return;
                }
            }
            const next = facing === "environment" ? "user" : "environment";
            setFacing(next);
            await startStream({ deviceId: null, facing: next });
        } catch (err) {
            console.error(err);
            setError(err.message || "카메라 전환 실패");
        }
    };

    const videoStyle = useMemo(
        () => ({
            transform: isFront ? "scaleX(-1)" : "none",
        }),
        [isFront]
    );

    const displayLabel = (d) => d.label || `Camera ${d._idx}`;

    const handleScan = async () => {
        if (!videoRef.current) return;
        try {
            setLoading(true);
            setError(null);

            const video = videoRef.current;
            const canvas = document.createElement("canvas");
            const guideW = Math.floor(video.videoWidth * 0.76);
            const guideH = Math.floor(video.videoHeight * 0.52);
            const guideX = Math.floor((video.videoWidth - guideW) / 2);
            const guideY = Math.floor((video.videoHeight - guideH) / 2);

            canvas.width = guideW;
            canvas.height = guideH;
            const ctx = canvas.getContext("2d");
            if (!ctx) throw new Error("캔버스 컨텍스트를 가져올 수 없습니다.");

            ctx.drawImage(video, guideX, guideY, guideW, guideH, 0, 0, guideW, guideH);
            const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.92));
            if (!blob) throw new Error("이미지 캡처 실패");

            await uploadAndRoute(new File([blob], "scan.jpg", { type: "image/jpeg" }));
        } catch (err) {
            console.error(err);
            setError(err.message || "스캔 실패");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="ocrPage">
            <div className="previewWrap">
                <video ref={videoRef} className="video" style={videoStyle} playsInline muted autoPlay />

                <div className="overlayHeader">
                    <IoClose className="backBtn" onClick={goHome} />
                    <p className="overlayTitle">계약서 스캔</p>

                    <div className="cameraControls">

                        <button className="switchBtn" onClick={toggleFacing} disabled={loading}>
                            <MdFlipCameraIos />
                        </button>
                    </div>
                </div>

                <div className="mask">
                    <div className="guideBox">
                        <span className="corner tl" />
                        <span className="corner tr" />
                        <span className="corner bl" />
                        <span className="corner br" />
                    </div>
                </div>

                {!cameraReady && <div className="loadingText">카메라를 여는 중…</div>}

                <div className="overlayNotice">
                    촬영된 문서는 개인정보 보호를 위해
                    <br />
                    자동으로 필터링 됩니다.
                    <br />
                    번역 및 법률 정보 제공 목적으로만 사용됩니다.
                </div>
            </div>

            <div className="main_btm">
                <label className="uploadBtn">
                    <span className="btnText">업로드</span>
                    <FiUpload className="icon" />
                    <input type="file" accept="image/*" onChange={handleUpload} style={{ display: "none" }} />
                </label>

                <button className="scanBtn" onClick={handleScan} disabled={loading || !cameraReady}>
                    <span className="btnText">스캔하기</span>
                    <IoCameraOutline className="icon" />
                </button>
            </div>

            {loading && <p className="progressText">업로드 중입니다...</p>}
            {error && <p className="errorText">{error}</p>}
        </main>
    );
};

export default Ocr;
