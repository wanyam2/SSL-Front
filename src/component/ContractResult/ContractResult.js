import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./ContractResult.module.css";

import { API_BASE } from "../../config/apiBase";

const normalizeStatus = (s) => {
    const v = String(s || "").toLowerCase();
    if (["safe"].includes(v)) return "safe";
    if (["warning", "danger"].includes(v)) return "warning";
    if (["info"].includes(v)) return "info";
    return "info";
};

const computeOverall = (issuesCount) => (issuesCount > 0 ? "warning" : "safe");

export default function ContractResult() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading]   = useState(!state?.analysis);
    const [error, setError]       = useState(null);
    const [analysis, setAnalysis] = useState(state?.analysis || null);
    const contractId              = state?.contractId;

    useEffect(() => {
        let canceled = false;

        const fetchAnalysis = async () => {
            if (!contractId || state?.analysis) return;
            setLoading(true);
            setError(null);
            try {
                const { data } = await axios.post(`${API_BASE}/api/contracts/${contractId}/analyze`);
                if (canceled) return;
                setAnalysis(data);
            } catch (e) {
                if (!canceled) {
                    setError(
                        e?.response
                            ? `분석 실패 (${e.response.status}): ${JSON.stringify(e.response.data)}`
                            : e?.message || "분석 실패"
                    );
                }
            } finally {
                if (!canceled) setLoading(false);
            }
        };

        fetchAnalysis();
        return () => { canceled = true; };
    }, [contractId, state?.analysis]);

    const checklist = useMemo(() => {
        if (!analysis) return [];
        const list = [];

        if (Array.isArray(analysis.issues)) {
            analysis.issues.forEach((it, idx) => {
                list.push({
                    title: it.type || `이슈 ${idx + 1}`,
                    content: it.reason || "사유 미기재",
                    note: it.evidence || "",
                    status: "warning",
                });
            });
        }

        if (Array.isArray(analysis.laws)) {
            analysis.laws.forEach((law, idx) => {
                list.push({
                    title: law.lawName || `관련 법률 ${idx + 1}`,
                    content: law.referenceNumber ? `법령 번호: ${law.referenceNumber}` : (law.sourceLink || ""),
                    note: law.sourceLink || "",
                    status: "info",
                });
            });
        }

        if ((analysis.issues?.length || 0) === 0) {
            list.unshift({
                title: "특이사항 없음",
                content: "검출된 위험 항목이 없습니다.",
                note: "계약서 주요 리스크가 발견되지 않았습니다.",
                status: "safe",
            });
        }

        return list;
    }, [analysis]);

    const overall = computeOverall(analysis?.issues?.length || 0);

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.header}>
                    <button className={styles.backBtn} onClick={() => navigate(-1)}>←</button>
                    <h2>계약서 결과</h2>
                </div>
                <p>불러오는 중…</p>
            </div>
        );
    }

    if (error || !analysis) {
        return (
            <div className={styles.container}>
                <div className={styles.header}>
                    <button className={styles.backBtn} onClick={() => navigate(-1)}>←</button>
                    <h2>계약서 결과</h2>
                </div>
                <p className={styles.errorText}>{error || "데이터가 없습니다."}</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <button className={styles.backBtn} onClick={() => navigate(-1)}>←</button>
                <h2>계약서 결과</h2>
            </div>

            <div className={`${styles.contractBox} ${overall === "safe" ? styles.safeCard : styles.warningCard}`}>
                <div className={styles.contractMeta}>
                    <span className={styles.contractType}>근로계약서</span>
                    <span className={styles.contractDate}>계약 ID: {analysis.contractId}</span>
                    <h3 className={styles.company}>회사명 인식 정보는 추후 연동</h3>
                </div>
                <div className={`${styles.alertBadge} ${overall === "safe" ? "safe" : "warning"}`}>
                    {overall === "safe" ? "✅ 안심" : "⚠️ 주의"}
                </div>
            </div>

            <div className={styles.tabMenu}>
                <button className={styles.active}>핵심 조항</button>
            </div>

            <div className={styles.checklist}>
                {checklist.map((item, idx) => (
                    <div key={idx} className={`${styles.item} ${styles[normalizeStatus(item.status)]}`}>
                        <div className={styles.itemHeader}>
                            <strong>{item.title}</strong>
                            <span className={styles.statusMark}>
                {normalizeStatus(item.status) === "safe" && "✔"}
                                {normalizeStatus(item.status) === "info" && "•"}
                                {normalizeStatus(item.status) === "warning" && "!"}
              </span>
                        </div>
                        <p className={styles.itemContent}>{item.content}</p>
                        <p className={styles.itemNote}>
                            {item.note}
                            {item.note?.startsWith("http") && (
                                <a href={item.note} target="_blank" rel="noreferrer"> 바로가기</a>
                            )}
                        </p>
                    </div>
                ))}
                {checklist.length === 0 && <p>표시할 항목이 없습니다.</p>}
            </div>
        </div>
    );
}
