import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ChecklistPage.module.css";

const checklistData = [
  {
    id: 1,
    title: "근무 장소",
    question: "근무 장소가 정확히 적혀 있나요?",
    description: "정확한 근무지 주소 / 지점 명시 여부",
    yesText: "로우커피 학하점",
    yesDescription: "대전광역시 유성구 계산동 학하서로 117-9",
    noText: "아니요",
  },
  {
    id: 2,
    title: "수습 기간",
    question: "수습기간에 대한 조건은 확인했나요?",
    description: "수습 여부 / 수습기간 중 임금 감액 여부 / 해고 가능성",
    yesText: "확인했어요",
    yesDescription: "수습 여부, 임금 감액, 해고 가능성 모두 명시되어 있어요.",
    noText: "아니요",
  },
  {
    id: 3,
    title: "임금 조건",
    question: "월급 외에 수당이 따로 명시되어 있나요?",
    description: "월급/시급/연봉 / 수당 포함 여부 / 성과급 포함 여부 / 지급일",
    yesText: "명시되어 있어요",
    yesDescription: "월급, 수당, 지급일 등이 명확하게 명시되어 있습니다.",
    noText: "아니요",
  },
  {
    id: 4,
    title: "초과근무 수당",
    question: "야근했을 때 수당을 받을 수 있나요?",
    description: "야근수당 / 주말수당 명시 여부 / 수당 지급 기준(시급 x 1.5배 등",
    yesText: "네",
    yesDescription: "초과 근무 시 수당 지급 기준이 명시되어 있습니다.",
    noText: "아니요",
  },
  {
    id: 5,
    title: "연차 유급휴가",
    question: "연차나 휴가는 쓸 수 있게 되어 있나요?",
    description: "연차 발생 기준 / 유급휴가 지급 조건 / 연차 사용 방식",
    yesText: "네",
    yesDescription: "연차 발생 기준 및 사용 방법이 명시되어 있습니다.",
    noText: "아니요",
  },
  {
    id: 6,
    title: "퇴직금 지급 조건",
    question: "퇴직금은 나중에 받을 수 있나요?",
    description: "퇴직금 명시 여부 / 근속시산 요건(1년 이상) / 지급 시점",
    yesText: "받을 수 있어요",
    yesDescription: "퇴직금 지급 조건 및 시기가 명시되어 있습니다.",
    noText: "아니요",
  },
  {
    id: 7,
    title: "4대 보험 가입 여부",
    question: "4대 보험은 모두 가입되나요?",
    description: "국민연금, 건강보험, 고용보험, 산재보험 가입 여부 명시",
    yesText: "가입돼요",
    yesDescription: "4대 보험 가입 여부가 명확하게 명시되어 있습니다.",
    noText: "아니요",
  },
  {
    id: 8,
    title: "기타 특약 조항",
    question: "이상하거나 어려운 문장은 없나요?",
    description: "경업금지 조항, 위약금 조항, 계약 해지 조건 등 부당 조항 포함 여부 확인 필요 등",
    yesText: "이해했어요",
    yesDescription: "불리한 내용의 특약 조항은 확인되지 않았습니다.",
    noText: "어려운 문장이 있어요",
  },
];

const ChecklistPage = () => {
  const navigate = useNavigate();
  const [checkedItems, setCheckedItems] = useState(() => {
    try {
      const storedItems = localStorage.getItem("checklistCheckedItems");
      return storedItems ? JSON.parse(storedItems) : {};
    } catch (error) {
      console.error("Failed to load state from localStorage", error);
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("checklistCheckedItems", JSON.stringify(checkedItems));
    } catch (error) {
      console.error("Failed to save state to localStorage", error);
    }
  }, [checkedItems]);

  const handleYesClick = (id) => {
    setCheckedItems((prev) => ({ ...prev, [id]: true }));
  };

  const handleNoClick = (id) => {
    setCheckedItems((prev) => ({ ...prev, [id]: false }));
  };

  const completedCount = useMemo(() => {
    return Object.values(checkedItems).filter(item => item === true).length;
  }, [checkedItems]);

  const handleGoBack = () => {
    navigate(-1, { state: { completedCount } });
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button className={styles.backButton} onClick={handleGoBack}>
          &lt;
        </button>
        <h2 className={styles.title}>체크리스트</h2>
      </header>

      <div className={styles.list}>
        {checklistData.map((item) => {
          const isChecked = checkedItems[item.id] === true;
          const isNotChecked = checkedItems[item.id] === false;

          return (
            <div
              key={item.id}
              className={`${styles.card} ${isChecked ? styles.checkedCard : ""} ${
                isNotChecked ? styles.uncheckedCard : ""
              }`}
            >
              <div className={styles.cardHeader}>
                <p className={styles.number}>{item.id}. {item.title}</p>
                {isChecked && <div className={styles.checkIcon}>✓</div>}
                {isNotChecked && <div className={styles.warningIcon}>!</div>}
              </div>
              
              {isChecked || isNotChecked ? (
                <>
                  <h3 className={styles.question}>{isChecked ? item.yesText : `"${item.noText}" 선택됨`}</h3>
                  <p className={styles.description}>{isChecked ? item.yesDescription : item.description}</p>
                </>
              ) : (
                <>
                  <h3 className={styles.question}>{item.question}</h3>
                  <p className={styles.description}>{item.description}</p>
                  <div className={styles.buttons}>
                    <button
                      className={styles.yesButton}
                      onClick={() => handleYesClick(item.id)}
                    >
                      {item.yesText}
                    </button>
                    <button
                      className={styles.noButton}
                      onClick={() => handleNoClick(item.id)}
                    >
                      {item.noText}
                    </button>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChecklistPage;