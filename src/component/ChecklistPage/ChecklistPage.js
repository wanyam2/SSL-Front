import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./ChecklistPage.module.css";

import {
  getChecklistState,
  setChecklistState,
} from "../../lib/checklistStore";

const BASE = "https://port-0-ll-ssl-backend-umnqdut2blqqevwyb.sel4.cloudtype.app";

// 화면 질문/버튼 템플릿(서버는 상태/guide만 제공)
const TEMPLATE = [
  { itemNumber: 0, title: "근무지와 직무", question: "근무장소가 명확히 적혀 있나요?", description: "근무 장소 주소와 직무 범위가 계약서에 명시되어야 합니다.", yesText: "명시되어 있어요", noText: "아니요", yesDescription: "근무 장소/직무가 구체적으로 기재되어 있습니다." },
  { itemNumber: 1, title: "수습/기간", question: "수습 기간에 대한 조건은 확인했나요?", description: "수습 유무, 기간, 급여/해지 조건 등을 확인하세요.", yesText: "확인했어요", noText: "아니요", yesDescription: "수습 조건이 계약서에 명시되어 있습니다." },
  { itemNumber: 2, title: "임금 조건", question: "월급/시급/연봉이 명시되어 있나요?", description: "금액, 지급일, 산정 방식(주휴/연장 포함)을 확인하세요.", yesText: "명시되어 있어요", noText: "아니요", yesDescription: "임금 조건이 명시되어 있습니다." },
  { itemNumber: 3, title: "초과근무 수당", question: "야근/연장/휴일 수당을 받을 수 있나요?", description: "연장‧야간‧휴일 수당 지급 기준과 계산 방식이 필요합니다.", yesText: "네", noText: "아니요", yesDescription: "초과근무 수당 지급 기준이 명시되어 있습니다." },
  { itemNumber: 4, title: "연차/유급휴가", question: "언제나 휴가를 쓸 수 있게 되어 있나요?", description: "연차 발생/사용 방법과 유급휴가 기준이 명시되어야 합니다.", yesText: "네", noText: "아니요", yesDescription: "연차/유급휴가 규정이 명시되어 있습니다." },
  { itemNumber: 5, title: "퇴직금", question: "퇴직금은 나중에 받을 수 있나요?", description: "퇴직금 발생 조건(1년 이상 등)과 지급 시기가 필요합니다.", yesText: "네", noText: "아니요", yesDescription: "퇴직금 지급 조건이 명시되어 있습니다." },
  { itemNumber: 6, title: "4대 보험", question: "4대 보험은 모두 가입되나요?", description: "국민/건강/고용/산재 가입 및 회사/본인 부담 분이 필요합니다.", yesText: "가입해요", noText: "아니요", yesDescription: "4대 보험 가입 여부가 명시되어 있습니다." },
  { itemNumber: 7, title: "기타 특약", question: "이상하거나 어려운 조항은 없나요?", description: "경업/손해배상/비밀유지 등 특약을 확인하세요.", yesText: "이상없어요", noText: "어려운 조항이 있어요", yesDescription: "추가 특약이 적절히 정리되어 있습니다." },
];

const NEGATIVE_KEYWORDS = ["없음", "명시되지 않음", "미기재", "미 명시", "미표기", "not specified", "none"];

// 서버 isChecked가 true라도 guide에 부정 신호가 있으면 false로 보정
function normalizeDetected(isChecked, guide) {
  const g = String(guide || "").toLowerCase();
  const hasNegative = NEGATIVE_KEYWORDS.some((kw) => g.includes(kw));
  if (hasNegative) return false;
  return isChecked === true || isChecked === "true" || isChecked === 1 || isChecked === "1";
}

const ChecklistPage = () => {
  const navigate = useNavigate();

  const contractId = 1; // 고정 ID

  // 화면에 바로 그릴 템플릿
  const [cards] = useState(TEMPLATE);

  // 사용자가 누른 응답: { [num]: true|false }  (공용 스토어로 초기화)
  const [userChoice, setUserChoice] = useState(getChecklistState());

  // 서버 판단값/가이드: { [num]: { detected: boolean, guide: string } }
  const [serverState, setServerState] = useState({});

  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");

  // ---- userChoice 변경 시 공용 스토어에 즉시 반영 (서로 공유의 핵심)
  useEffect(() => {
    setChecklistState(userChoice);
  }, [userChoice]);

  // ---- 서버 불러오기(없으면 시드 → 재시도)
  const postSeedOnce = useCallback(async () => {
    const payload = {
      contractId,
      items: Array.from({ length: 8 }, (_, i) => ({ itemNumber: i, isChecked: false })),
    };
    await axios.post(`${BASE}/checklists`, payload, {
      headers: { "Content-Type": "application/json", Accept: "application/json" },
    });
  }, [contractId]);

  const fetchChecklist = useCallback(async () => {
    const res = await axios.get(`${BASE}/checklists/contract/${contractId}`, {
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      validateStatus: () => true,
    });

    if (res.status === 200) {
      const items = Array.isArray(res.data?.items) ? res.data.items : [];
      const map = {};
      for (const it of items) {
        const n = Number(it.itemNumber);
        if (Number.isNaN(n)) continue;
        const detected = normalizeDetected(it.isChecked, it.guide);
        map[n] = { detected, guide: typeof it.guide === "string" ? it.guide.trim() : "" };
      }
      setServerState(map);
      setErrMsg("");
      return true;
    }

    if (res.status === 404) {
      try {
        await postSeedOnce();
        return await fetchChecklist();
      } catch (e) {
        setErrMsg("체크리스트 생성 실패");
        return false;
      }
    }

    setErrMsg(`불러오기 실패: ${res.status}`);
    return false;
  }, [contractId, postSeedOnce]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        await fetchChecklist();
      } finally {
        setLoading(false);
      }
    })();
  }, [fetchChecklist]);

  // ---- 선택 저장(서버 동기화)
  const saveChecklistToAPI = useCallback(
    async (updated) => {
      const itemsArray = Object.entries(updated).map(([key, value]) => ({
        itemNumber: Number(key),
        isChecked: value,
      }));
      try {
        await axios.post(`${BASE}/checklists`, { contractId, items: itemsArray }, {
          headers: { "Content-Type": "application/json", Accept: "application/json" },
        });
      } catch (e) {
        console.error("Failed to save checklist to API", e?.response?.status || e?.message);
      }
    },
    [contractId]
  );

  const handleYesClick = (num) =>
    setUserChoice((p) => {
      const updated = { ...p, [num]: true };
      saveChecklistToAPI(updated);
      return updated;
    });

  const handleNoClick = (num) =>
    setUserChoice((p) => {
      const updated = { ...p, [num]: false };
      saveChecklistToAPI(updated);
      return updated;
    });

  const handleResetClick = (num) =>
    setUserChoice((p) => {
      const next = { ...p };
      delete next[num];
      saveChecklistToAPI(next);
      return next;
    });

  // 카드 상태 아이콘(서버 탐지 vs 내 선택 비교)
  const getIconType = (num) => {
    const choice = userChoice[num];
    if (choice === undefined) return "none";
    const detected = serverState[num]?.detected === true;
    if (detected && choice === true) return "check"; // 서버도 O + 내가 O
    if (!detected && (choice === true || choice === false)) return "warn"; // 서버 X인데 내가 응답함
    return "none";
  };

  // 완료 개수(내가 '예'로 체크한 수) — 필요하면 사용
  const completedCount = useMemo(
    () => Object.values(userChoice).filter((v) => v === true).length,
    [userChoice]
  );

  const handleGoBack = () => navigate(-1, { state: { completedCount } });

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button className={styles.backButton} onClick={handleGoBack}>&lt;</button>
        <h2 className={styles.title}>체크리스트</h2>
      </header>

      {!!errMsg && <div className={styles.error}>{errMsg}</div>}

      <div className={styles.list}>
        {loading && <div className={styles.emptyState}>불러오는 중...</div>}

        {/* 백엔드 이전에도 TEMPLATE를 즉시 렌더 */}
        {!loading &&
          cards.map((item) => {
            const choice = userChoice[item.itemNumber];
            const icon = getIconType(item.itemNumber);
            const guide = serverState[item.itemNumber]?.guide;

            return (
              <div
                key={item.itemNumber}
                className={`${styles.card} ${icon === "check" ? styles.checkedCard : ""} ${
                  icon === "warn" ? styles.uncheckedCard : ""
                }`}
              >
                <div className={styles.cardHeader}>
                  <p className={styles.number}>
                    {item.itemNumber}. {item.title}
                  </p>

                  {icon === "check" && (
                    <div className={styles.checkIcon} onClick={() => handleResetClick(item.itemNumber)}>
                      ✓
                    </div>
                  )}
                  {icon === "warn" && (
                    <div className={styles.warningIcon} onClick={() => handleResetClick(item.itemNumber)}>
                      !
                    </div>
                  )}
                </div>

                {choice === true ? (
                  <>
                    <h3 className={styles.question}>{item.yesText}</h3>
                    <p className={styles.description}>
                      {guide && guide.trim() ? guide : item.yesDescription || item.description}
                    </p>
                  </>
                ) : choice === false ? (
                  <>
                    <h3 className={styles.question}>"{item.noText}" 선택됨</h3>
                    <p className={styles.description}>{item.description}</p>
                  </>
                ) : (
                  <>
                    <h3 className={styles.question}>{item.question}</h3>
                    <p className={styles.description}>{item.description}</p>
                    <div className={styles.buttons}>
                      <button className={styles.yesButton} onClick={() => handleYesClick(item.itemNumber)}>
                        {item.yesText}
                      </button>
                      <button className={styles.noButton} onClick={() => handleNoClick(item.itemNumber)}>
                        {item.noText}
                      </button>
                    </div>
                  </>
                )}
              </div>
            );
          })}

        {!loading && cards.length === 0 && (
          <div className={styles.emptyState}>체크리스트 항목이 없습니다.</div>
        )}
      </div>
    </div>
  );
};

export default ChecklistPage;
