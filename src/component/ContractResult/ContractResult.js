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
const get = (obj, path, fallback = "") =>
    path.split(".").reduce((o, k) => (o && o[k] !== undefined ? o[k] : undefined), obj) ?? fallback;
const fmtDate = (d) => {
    if (!d) return "";
    const date = new Date(d);
    if (isNaN(date.getTime())) return String(d);
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const da = String(date.getDate()).padStart(2, "0");
    return `${y}.${m}.${da}`;
};

const getIconForTitle = (title = "") => {
    const t = title.toLowerCase();
    if (t.includes("수습")) return "🧪";
    if (t.includes("퇴직") || t.includes("퇴직금")) return "🏦";
    if (t.includes("유급") || t.includes("휴가")) return "🏖️";
    if (t.includes("근무시간") || t.includes("근로시간")) return "⏰";
    if (t.includes("임금") || t.includes("급여")) return "💰";
    if (t.includes("계약 기간") || t.includes("계약기간")) return "📅";
    return "📄";
};

export default function ContractResult() {
    const { state } = useLocation();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(!state?.analysis);
    const [error, setError] = useState(null);
    const [analysis, setAnalysis] = useState(state?.analysis || null);

    const [metaLoading, setMetaLoading] = useState(!state?.meta && !!state?.contractId);
    const [metaError, setMetaError] = useState(null);
    const [meta, setMeta] = useState(state?.meta || null);

    const [activeTab, setActiveTab] = useState("info"); // 'info' | 'core'
    const contractId = state?.contractId;

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
        return () => {
            canceled = true;
        };
    }, [contractId, state?.analysis]);

    useEffect(() => {
        let canceled = false;
        const fetchMeta = async () => {
            if (!contractId || state?.meta) return;
            try {
                setMetaLoading(true);
                setMetaError(null);
                const { data } = await axios.get(`${API_BASE}/api/contracts/${contractId}`);
                if (canceled) return;
                setMeta(data);
            } catch (e) {
                if (!canceled) {
                    setMetaError(
                        e?.response
                            ? `메타 조회 실패 (${e.response.status}): ${JSON.stringify(e.response.data)}`
                            : e?.message || "메타 조회 실패"
                    );
                }
            } finally {
                if (!canceled) setMetaLoading(false);
            }
        };
        fetchMeta();
        return () => {
            canceled = true;
        };
    }, [contractId, state?.meta]);

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
                    content: law.referenceNumber ? `법령 번호: ${law.referenceNumber}` : law.sourceLink || "",
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

    const companyName = get(meta, "company.name", get(analysis, "company.name", "회사명 인식 정보는 추후 연동"));
    const companyAddr = get(meta, "company.address", get(analysis, "company.address", ""));
    const employeeName = get(meta, "employee.name", get(analysis, "employee.name", ""));
    const contractDate = fmtDate(get(meta, "contract.date", get(analysis, "contract.date", "")));
    const workStartDate = fmtDate(get(meta, "employment.startDate", get(analysis, "employment.startDate", "")));
    const workType = get(meta, "employment.type", get(analysis, "employment.type", ""));
    const jobDesc = get(meta, "employment.jobDescription", get(analysis, "employment.jobDescription", ""));
    const periodStart = fmtDate(get(meta, "employment.period.start", get(analysis, "employment.period.start", "")));
    const periodEnd = fmtDate(get(meta, "employment.period.end", get(analysis, "employment.period.end", "")));
    const userSigned = !!get(meta, "signatures.employee", get(analysis, "signatures.employee", false));
    const bizSigned = !!get(meta, "signatures.employer", get(analysis, "signatures.employer", false));

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.header}>
                    <button className={styles.backBtn} onClick={() => navigate("/")}>←</button>

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
                    <button className={styles.backBtn} onClick={() => navigate("/")}>←</button>

                    <h2>계약서 결과</h2>
                </div>
                <p className={styles.errorText}>{error || "데이터가 없습니다."}</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <button className={styles.backBtn} onClick={() => navigate("/")}>←</button>
                <h2>계약서 결과</h2>
            </div>


            <div className={`${styles.contractBox} ${overall === "safe" ? styles.safeCard : styles.warningCard}`}>
                <div className={styles.contractMeta}>
                    <span className={styles.contractType}>근로계약서</span>
                    <span className={styles.contractDate}>{contractId ? `계약 ID: ${contractId}` : ""}</span>
                    <h3 className={styles.company}>{companyName}</h3>
                </div>
                <div className={`${styles.alertBadge} ${overall === "safe" ? "safe" : "warning"}`}>
                    {overall === "safe" ? "✅ 안심" : "⚠️ 주의"}
                </div>
            </div>

            <div className={styles.tabMenu}>
                <button className={activeTab === "info" ? styles.active : ""} onClick={() => setActiveTab("info")}>
                    기본 정보
                </button>
                <button className={activeTab === "core" ? styles.active : ""} onClick={() => setActiveTab("core")}>
                    핵심 조항
                </button>
            </div>

            {activeTab === "info" && (
                <div className={styles.infoCard}>
                    {metaLoading && <p className={styles.dimText}>회사 정보 불러오는 중…</p>}
                    {metaError && <p className={styles.errorText}>{metaError}</p>}

                    <div className={styles.infoItem}>
                        <div className={styles.infoLabel}>회사명</div>
                        <div className={styles.infoValue}>
              <span className={styles.companyRow}>
                <span className={styles.companyIcon} aria-hidden>🏢</span>
                  {companyName}
              </span>
                            {companyAddr && <div className={styles.addrRow}>{companyAddr}</div>}
                        </div>
                    </div>

                    <div className={styles.infoItem}>
                        <div className={styles.infoLabel}>사용자 이름</div>
                        <div className={styles.infoValue}>
              <span className={styles.personRow}>
                <span className={styles.personIcon} aria-hidden>👤</span>
                  {employeeName || "-"}
              </span>
                        </div>
                    </div>

                    <div className={styles.gridTwo}>
                        <div className={styles.infoItem}>
                            <div className={styles.infoLabel}>계약 체결일</div>
                            <div className={styles.infoValue}>{contractDate || "-"}</div>
                        </div>
                        <div className={styles.infoItem}>
                            <div className={styles.infoLabel}>근로 시작일</div>
                            <div className={styles.infoValue}>{workStartDate || "-"}</div>
                        </div>
                    </div>

                    <div className={styles.infoItem}>
                        <div className={styles.infoLabel}>업무 내용</div>
                        <div className={styles.infoValue}>{jobDesc || "-"}</div>
                    </div>

                    <div className={styles.gridTwo}>
                        <div className={styles.infoItem}>
                            <div className={styles.infoLabel}>근로 형태</div>
                            <div className={styles.infoValue}>{workType || "-"}</div>
                        </div>
                        <div className={styles.infoItem}>
                            <div className={styles.infoLabel}>계약 기간</div>
                            <div className={styles.infoValue}>
                                {periodStart || periodEnd ? `${periodStart || "?"} ~ ${periodEnd || "?"}` : "-"}
                            </div>
                        </div>
                    </div>

                    <div className={styles.infoItem}>
                        <div className={styles.infoLabel}>서명 확인</div>
                        <div className={styles.infoValue}></div>
                    </div>

                    <div className={styles.gridTwo}>
                        <div className={styles.infoItem}>
                            <div className={styles.infoLabel}>사용자 서명</div>
                            <div className={styles.infoValue}>
                                <span className={userSigned ? styles.checkOk : styles.checkNo}>{userSigned ? "✔" : "•"}</span>
                            </div>
                        </div>
                        <div className={styles.infoItem}>
                            <div className={styles.infoLabel}>사업주 서명</div>
                            <div className={styles.infoValue}>
                                <span className={bizSigned ? styles.checkOk : styles.checkNo}>{bizSigned ? "✔" : "•"}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === "core" && (
                <div className={styles.coreList}>
                    {checklist.map((item, idx) => {
                        const st = normalizeStatus(item.status);
                        return (
                            <div key={idx} className={`${styles.coreItem} ${styles[st]}`}>
                                <div className={styles.coreHead}>
                                    <div className={styles.coreIcon} aria-hidden>
                                        {getIconForTitle(item.title)}
                                    </div>
                                    <div className={styles.coreTitleWrap}>
                                        <div className={styles.coreTitle}>{item.title}</div>
                                        <div className={styles.coreDesc}>{item.content}</div>
                                    </div>
                                    <div
                                        className={`${styles.coreBadge} ${
                                            st === "safe" ? styles.badgeOk : st === "info" ? styles.badgeInfo : styles.badgeNo
                                        }`}
                                        aria-label={st}
                                    >
                                        {st === "safe" ? "✓" : st === "info" ? "•" : "×"}
                                    </div>
                                </div>

                                {item.note && (
                                    <div
                                        className={`${styles.coreNote} ${
                                            st === "safe" ? styles.noteOk : st === "info" ? styles.noteInfo : styles.noteNo
                                        }`}
                                    >
                                        “{item.note}”
                                        {item.note?.startsWith("http") && (
                                            <a className={styles.noteLink} href={item.note} target="_blank" rel="noreferrer">
                                                바로가기
                                            </a>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                    {checklist.length === 0 && <p>표시할 항목이 없습니다.</p>}
                </div>
            )}
        </div>
    );
}