// src/pages/ContractPage.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ContractPage.module.css";
import Warning from "../Image/Warning.png";
import Why from "../Image/Why.png";
import paper from "../Image/paper.png";
import Profil from "../Image/profil.png";
import Word from "../Image/Word.png";
import Check from "../Image/check.png";
import BottomIcon from "../Image/ICon.png";

const TOTAL_CHECK_ITEMS = 8; // 체크리스트 항목 수
const BASE = "https://port-0-ll-ssl-backend-umnqdut2blqqevwyb.sel4.cloudtype.app";

const ContractPage = () => {
    const navigate = useNavigate();

    const [hasContract, setHasContract] = useState(false);
    const [loadingContract, setLoadingContract] = useState(true);
    const [contractMeta, setContractMeta] = useState({ companyName: "", date: "", id: 1 });

    // 응답 개수(예/아니오 무관: key 개수)
    const [answeredCount, setAnsweredCount] = useState(0);

    // 로컬스토리지에서 체크리스트 읽기: {"0":true,"1":false,...}
    const readChecklistFromLS = useCallback(() => {
        try {
            const raw = localStorage.getItem("checklistCheckedItems");
            const obj = raw ? JSON.parse(raw) : {};
            const count = Object.keys(obj).length; // 응답 개수(예/아니오 모두 포함)
            setAnsweredCount(count);
        } catch {
            setAnsweredCount(0);
        }
    }, []);

    // 로컬스토리지에서 계약 메타 읽기: latestContract = { id, companyName, date }
    const readContractMeta = useCallback(() => {
        try {
            const raw = localStorage.getItem("latestContract");
            if (!raw) {
                setContractMeta({ companyName: "", date: "", id: null });
                return;
            }
            let meta = null;
            try {
                meta = JSON.parse(raw);
            } catch {
                return;
            }
            const companyName = meta?.companyName || "";
            const date = meta?.date || meta?.createdAt || "";
            const id = meta?.id ?? meta?.contractId ?? null;
            setContractMeta({ companyName, date, id });
        } catch {
            setContractMeta({ companyName: "", date: "", id: null });
        }
    }, []);

    // ✅ 백엔드에서 현재 사용자(1)의 계약 존재 여부 확인
    const fetchContractExistence = useCallback(async () => {
        setLoadingContract(true);
        try {
            const res = await fetch(`${BASE}/api/contract/1`, { method: "GET" });
            // 200이고 imagePath가 존재하면 "있음"으로 판단
            if (res.ok) {
                const data = await res.json();
                const exists = Boolean(data?.imagePath);
                setHasContract(exists);

                // companyName/date가 백엔드에 없다면 기존 localStorage 값 유지
                // 필요 시 여기서 latestContract도 갱신 가능:
                // localStorage.setItem("latestContract", JSON.stringify({ id: data.contractId, companyName: "...", date: new Date().toISOString() }));
            } else if (res.status === 404) {
                // 없으면 404일 수도 있음
                setHasContract(false);
            } else {
                // 그 외 상태코드면 우선 없음으로 처리
                setHasContract(false);
            }
        } catch (e) {
            console.error("contract fetch failed:", e);
            setHasContract(false);
        } finally {
            setLoadingContract(false);
        }
    }, []);

    useEffect(() => {
        readChecklistFromLS();
        readContractMeta();
        fetchContractExistence(); // ← 백엔드 체크 추가

        const onFocus = () => { readChecklistFromLS(); readContractMeta(); fetchContractExistence(); };
        const onVis = () => { if (document.visibilityState === "visible") { readChecklistFromLS(); readContractMeta(); fetchContractExistence(); } };
        const onStorage = (e) => {
            if (e.key === "checklistCheckedItems") readChecklistFromLS();
            if (e.key === "latestContract") readContractMeta();
        };

        window.addEventListener("focus", onFocus);
        document.addEventListener("visibilitychange", onVis);
        window.addEventListener("storage", onStorage);

        return () => {
            window.removeEventListener("focus", onFocus);
            document.removeEventListener("visibilitychange", onVis);
            window.removeEventListener("storage", onStorage);
        };
    }, [readChecklistFromLS, readContractMeta, fetchContractExistence]);

    const goToOcr = () => {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const memberId = user.memberId ?? 1;
        navigate("/ocr", { state: { memberId } });
    };

    const goChecklist = () => navigate("/checklist");

    // ✅ 계약서가 있을 때는 결과 페이지로 이동
    const goContractResult = () => {
        // 필요하면 contractId 전달
        const id = contractMeta.id ?? 6; // 기본값 1
        navigate("/ContractResultPage", { state: { contractId: id } });
    };

    // 완료 기준: 모든 항목 응답
    const isComplete = answeredCount >= TOTAL_CHECK_ITEMS;

    const progress = (answeredCount / TOTAL_CHECK_ITEMS) * 100;
    const circumference = 2 * Math.PI * 40;

    const handleCardKeyDown = (e) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            if (hasContract) {
                goContractResult();
            } else {
                goToOcr();
            }
        }
    };

    // 계약 카드에서 보여줄 회사명/날짜 (없으면 기본값)
    const companyNameA = contractMeta.companyName || "회사명 없음";
    const dateA = contractMeta.date ? new Date(contractMeta.date).toLocaleDateString() : "날짜 없음";

    return (
        <div className={styles.container}>
            {/* 헤더 */}
            <div className={styles.greeting}>안녕하세요, 성현님</div>
            <div className={styles.headerSection}>
                <h1 className={styles.mainTitle}>첫 계약 생성 완료!</h1>
                <button className={styles.Plus} onClick={goToOcr}>
                    {"+"}
                </button>
            </div>

            {/* 계약 섹션(배경/크기 동일) */}
            <div className={styles.contractList}>
                <div
                    className={`${styles.contractCard} ${styles.clickable}`}
                    onClick={hasContract ? goContractResult : goToOcr}
                    onKeyDown={handleCardKeyDown}
                    role="button"
                    tabIndex={0}
                    aria-label={hasContract ? "계약서 확인하기로 이동" : "계약서 가져오기로 이동"}
                >
                    {loadingContract ? (
                        <div className={styles.noContractText}>불러오는 중...</div>
                    ) : hasContract ? (
                        <>
                            <div className={styles.contractInfo}>
                                <p className={styles.contractType}>근로 계약서</p>
                                <div>
                                    <p className={styles.contractDate}>{dateA}</p>
                                    <p className={styles.companyName}>주식회사</p>
                                    <p className={styles.companyName}>{companyNameA}</p>
                                </div>
                            </div>

                            <div className={styles.warningBox}>
                                <img className={styles.warningIcon} src={Warning} alt="주의 아이콘" />
                                <div className={styles.warningBottom}>
                                    <p className={styles.warningText}>핵심 조항 6개 중</p>
                                    <p className={styles.missingCount}>3개 누락</p>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className={styles.noContractText}>{"계약서\n가져오기"}</div>
                            <img className={styles.noContractIcon} src={BottomIcon} alt="아이콘" />
                        </>
                    )}
                </div>

                {/* 종이 배경 이미지는 항상 동일하게 렌더 */}
                <img className={styles.paperBg} src={paper} alt="배경 이미지" />
            </div>

            {/* 슬라이드 인디케이터(더미) */}
            <div className={styles.slideIndicator}>
                <div className={styles.dot}></div>
            </div>

            {/* 하단 카드들 */}
            <div className={styles.bottomSection}>
                <div className={styles.smallCard}>
                    <div>
                        <p className={styles.cardTitle}>AI 대화</p>
                        <div>
                            <p className={styles.cardText}>계약에 대해</p>
                            <p className={styles.cardText}>궁금한게 있나요?</p>
                        </div>
                    </div>
                    <img className={styles.Why} src={Why} alt="AI 배경" />
                </div>

                <div className={styles.smallCard2} onClick={() => navigate("/checklist")}>
                    <div>
                        <p className={styles.cardTitle2}>체크리스트</p>
                        {/* 응답이 전혀 없을 때만 안내 문구 */}
                        {answeredCount === 0 && (
                            <div>
                                <p className={styles.cardText2}>체크리스트를</p>
                                <p className={styles.cardText2}>확인해보세요</p>
                            </div>
                        )}
                    </div>

                    {/* ✅ 배경 체크 이미지: "응답 0개일 때만" 표시 (진행중/완료면 숨김) */}
                    {answeredCount === 0 && (
                        <div className={styles.checkWrapper}>
                            <img className={styles.check} src={Check} alt="체크 배경" />
                        </div>
                    )}

                    {/* 진행 원형/숫자: 응답이 1개 이상이면 표시 */}
                    {answeredCount > 0 && (
                        <div className={styles.progressBarWrapper}>
                            <svg className={styles.progressBarSvg}>
                                <circle className={styles.progressBarBackground} cx="50" cy="50" r="40" />
                                <circle
                                    className={styles.progressBarForeground}
                                    cx="50"
                                    cy="50"
                                    r="40"
                                    style={{
                                        strokeDasharray: circumference,
                                        strokeDashoffset: circumference - (progress / 100) * circumference,
                                    }}
                                />
                            </svg>
                            <div className={styles.checkCountWrapper}>
                                <span className={styles.checkCount}>{answeredCount}</span>
                                <span className={styles.checkTotal}>/{TOTAL_CHECK_ITEMS}</span>
                            </div>
                        </div>
                    )}

                    {/* 상태 배지: 응답이 1개 이상이면 표시 */}
                    {answeredCount > 0 && (
                        <div className={styles.statusBadgeInCard} role="status" aria-live="polite">
                            {answeredCount >= TOTAL_CHECK_ITEMS ? "완료됨" : "진행중"}
                        </div>
                    )}
                </div>
            </div>

            {/* 하단 네비게이션 */}
            <div className={styles.navbar}>
                <div className={`${styles.navItem} ${styles.active}`}>
                    <img className={styles.navIcon} src={Word} alt="내 계약" />
                    <p className={styles.navText}>내 계약</p>
                </div>
                <div className={styles.navItem}>
                    <img className={styles.navIcon} src={Profil} alt="프로필" />
                    <p className={styles.navText}>프로필</p>
                </div>
            </div>
        </div>
    );
};

export default ContractPage;
