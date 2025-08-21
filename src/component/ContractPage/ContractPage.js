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

const ContractPage = () => {
  const navigate = useNavigate();

  const [hasContract, setHasContract] = useState(false);
  const [contractMeta, setContractMeta] = useState({ companyName: "", date: "", id: null });

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
        setHasContract(false);
        setContractMeta({ companyName: "", date: "", id: null });
        return;
      }
      let meta = null;
      try {
        meta = JSON.parse(raw);
      } catch {
        // JSON 파싱이 안 되더라도 존재만 true 처리
        setHasContract(true);
        return;
      }
      const companyName = meta?.companyName || "";
      const date = meta?.date || meta?.createdAt || "";
      const id = meta?.id ?? meta?.contractId ?? null;

      setHasContract(true);
      setContractMeta({ companyName, date, id });
    } catch {
      setHasContract(false);
      setContractMeta({ companyName: "", date: "", id: null });
    }
  }, []);

  useEffect(() => {
    readChecklistFromLS();
    readContractMeta();

    const onFocus = () => { readChecklistFromLS(); readContractMeta(); };
    const onVis = () => { if (document.visibilityState === "visible") { readChecklistFromLS(); readContractMeta(); } };
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
  }, [readChecklistFromLS, readContractMeta]);

  const goToOcr = () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const memberId = user.memberId ?? 1;
    navigate("/ocr", { state: { memberId } });
  };

  const goChecklist = () => navigate("/checklist");

  // 완료 기준: 모든 항목 응답
  const isComplete = answeredCount >= TOTAL_CHECK_ITEMS;

  const progress = (answeredCount / TOTAL_CHECK_ITEMS) * 100;
  const circumference = 2 * Math.PI * 40;

  const handleCardKeyDown = (e) => {
    if (!hasContract && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      goToOcr();
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
        <button className={styles.Plus} onClick={goToOcr}>+</button>
      </div>

      {/* 계약 섹션(배경/크기 동일) */}
      <div className={styles.contractList}>
        <div
          className={`${styles.contractCard} ${!hasContract ? styles.clickable : ""}`}
          onClick={!hasContract ? goToOcr : undefined}
          onKeyDown={!hasContract ? handleCardKeyDown : undefined}
          role={!hasContract ? "button" : undefined}
          tabIndex={!hasContract ? 0 : -1}
          aria-label={!hasContract ? "계약서 가져오기로 이동" : undefined}
        >
          {hasContract ? (
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

        <div className={styles.smallCard2} onClick={goChecklist}>
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
