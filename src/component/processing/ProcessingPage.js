import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { API_BASE } from "../../config/apiBase";
import styles from "./ProcessingPage.module.css";

export default function ProcessingPage() {
    const { contractId } = useParams();
    const navigate = useNavigate();

    const [stage, setStage] = useState(0);
    const [error, setError] = useState(null);
    const canceledRef = useRef(false);

    useEffect(() => {
        if (!contractId) {
            setError("contractId가 없습니다.");
            return;
        }
        const analyzeOnce = () => axios.post(`${API_BASE}/api/contracts/${contractId}/analyze`);
        const run = async () => {
            try {
                setStage(1);
                // 첫 시도
                const { data } = await analyzeOnce();
                setStage(2);
                await new Promise(r => setTimeout(r, 300));
                setStage(3);
                navigate("/ContractResultPage", { state: { contractId, analysis: data } });
            } catch (e) {
                // 재시도
                await new Promise(r => setTimeout(r, 1200));
                try {
                    const { data } = await analyzeOnce();
                    setStage(3);
                    navigate("/ContractResultPage", { state: { contractId, analysis: data } });
                } catch (e2) {
                    setError(e2?.response?.data?.message || e2.message || "분석 중 오류가 발생했습니다.");
                }
            }
        };

        run();

        return () => { canceledRef.current = true; };
    }, [contractId, navigate]);

    const onBack = () => navigate(-1);
    const onRetry = () => {
        setError(null);
        setStage(0);
        canceledRef.current = false;
        (async () => {
            try {
                setStage(1);
                const { data } = await axios.post(`${API_BASE}/api/contracts/${contractId}/analyze`);
                if (canceledRef.current) return;
                setStage(2);
                await new Promise(r => setTimeout(r, 300));
                setStage(3);
                navigate("/ContractResultPage", { state: { contractId, analysis: data } });
            } catch (e) {
                if (!canceledRef.current) setError(e?.message || "분석 실패");
            }
        })();
    };

    return (
        <div className={styles.wrap}>
            <div className={styles.card}>
                <div className={styles.spinner} />
                <h2 className={styles.title}>분석을 준비하고 있어요</h2>
                <p className={styles.subtitle}>업로드된 계약서를 바탕으로 핵심 조항을 추출 중입니다.</p>

                <ul className={styles.steps}>
                    <li className={`${styles.step} ${stage >= 1 ? styles.active : ""}`}>
                        <span className={styles.bullet}>{stage > 1 ? "✓" : "1"}</span>
                        위험 요소 분석
                    </li>
                    <li className={`${styles.step} ${stage >= 2 ? styles.active : ""}`}>
                        <span className={styles.bullet}>{stage > 2 ? "✓" : "2"}</span>
                        관련 법률 매칭
                    </li>
                    <li className={`${styles.step} ${stage >= 3 ? styles.active : ""}`}>
                        <span className={styles.bullet}>{stage === 3 ? "✓" : "3"}</span>
                        결과 정리
                    </li>
                </ul>

                {error ? (
                    <div className={styles.errBox}>
                        <p className={styles.errMsg}>{error}</p>
                        <div className={styles.actions}>
                            <button className={styles.secondary} onClick={onBack}>뒤로가기</button>
                            <button className={styles.primary} onClick={onRetry}>다시 시도</button>
                        </div>
                    </div>
                ) : (
                    <p className={styles.note}>분석에는 최대 5분까지 소요될 수 있습니다. 잠시만 기다려주세요 ...</p>
                )}
            </div>
        </div>
    );
}