// ContractResult.jsx
import React, { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./ContractResult.module.css";

const MOCK_RESULT = {
    contractType: "근로계약서",
    contractDate: "2025.07.30",
    company: "주식회사 로우커피",
    checklist: [
        { title: "수습기간", content: "수습기간 3개월 / 수습 중 해고 가능", note: "수습기간 중에는 사용자가 쉽게 해고할 수 있으며, 임금이 삭감될 수 있는 위험이 있어 주의가 필요합니다.", status: "warning" },
        { title: "퇴직금 조항", content: "퇴직금 관련 조항이 명시되어 있지 않음", note: "계약서에 명시되어 있지 않아 추후 분쟁 가능성이 있습니다.", status: "danger" },
        { title: "유급휴가", content: "연차휴가 명시 O / 휴가 일수 기준 불명확", note: "실제 사용 가능한 일수 조건이 명확하지 않아 확인이 필요합니다.", status: "info" },
        { title: "근무시간", content: "주 44시간 / 야근 여부 언급 없음", note: "법정근로시간(주 40시간)을 초과함. 초과근무 수당이 명시되지 않았습니다.", status: "warning" },
        { title: "임금 조건", content: "월 200만 원 / 수당 별도 언급 없음", note: "초과·연장·야간 수당이 구체적으로 언급되지 않았습니다.", status: "info" },
        { title: "계약 기간", content: "6개월 계약 / 자동 연장 여부 없음", note: "계약 기간이 종료되면 근로계약이 자동 종료될 수 있어 주의가 필요합니다.", status: "info" },
        { title: "산재보험", content: "산재보험 가입 명시", note: "안전하게 근무할 수 있는 환경이 보장됩니다.", status: "safe" },
        { title: "복리후생", content: "식대 제공 / 교통비 지원", note: "추가 복리후생 제공으로 근로자 만족도가 높을 수 있습니다.", status: "safe" }
    ]
};

const normalizeStatus = (s) => (s === "danger" ? "warning" : s);

const getOverall = (list) => {
    const counts = list.reduce((acc, it) => {
        const st = normalizeStatus(it.status);
        acc[st] = (acc[st] || 0) + 1;
        return acc;
    }, {});
    const safe = counts.safe || 0;
    const notSafe = (counts.info || 0) + (counts.warning || 0);
    return safe > notSafe ? "safe" : "warning";
};

export default function ContractResult() {
    const { state } = useLocation();
    const navigate = useNavigate();

    const data = state?.result || MOCK_RESULT;
    const checklist = (data.checklist || []).map((it) => ({ ...it, status: normalizeStatus(it.status) }));
    const overall = data.overall || getOverall(checklist);

    const meta = useMemo(() => ({
        type: data.contractType || "근로계약서",
        date: data.contractDate || "YYYY.MM.DD",
        company: data.company || "회사명 인식 중"
    }), [data]);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <button className={styles.backBtn} onClick={() => navigate(-1)}>←</button>
                <h2>계약서 결과</h2>
            </div>

            <div className={`${styles.contractBox} ${overall === "safe" ? styles.safeCard : styles.warningCard}`}>
                <div>
                    <span>{meta.type}</span><br />
                    <span>{meta.contractDate || meta.date}</span>
                    <h3 className={styles.company}>{meta.company}</h3>
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
                    <div key={idx} className={`${styles.item} ${styles[item.status]}`}>
                        <div className={styles.itemHeader}>
                            <strong>{item.title}</strong>
                            <span className={styles.statusMark}>
                {item.status === "safe" && "✔"}
                                {item.status === "info" && "•"}
                                {item.status === "warning" && "!"}
              </span>
                        </div>
                        <p className={styles.itemContent}>{item.content}</p>
                        <p className={styles.itemNote}>{item.note}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
