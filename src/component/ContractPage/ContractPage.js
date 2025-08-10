import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ContractPage.module.css";
import Warning from "../Image/Warning.png";
import Why from "../Image/Why.png";
import paper from "../Image/paper.png";
import Profil from "../Image/profil.png";
import Word from "../Image/Word.png";
import Check from "../Image/check.png";

const ContractPage = () => {
  const name = "성현님";
  const totalClauses = 6;
  const missingClauses = 3;
  const totalCheckItems = 8;

  const navigate = useNavigate();
  const [checkedItems, setCheckedItems] = useState(0);

  useEffect(() => {
    try {
      const storedItems = localStorage.getItem("checklistCheckedItems");
      if (storedItems) {
        const parsedItems = JSON.parse(storedItems);
        const completedCount = Object.values(parsedItems).filter(item => item === true).length;
        setCheckedItems(completedCount);
      }
    } catch (error) {
      console.error("Failed to load state from localStorage", error);
    }
  }, []);

  const progress = (checkedItems / totalCheckItems) * 100;
  const circumference = 2 * Math.PI * 40;

  return (
    <div className={styles.container}>
      {/* 헤더 영역 */}
      <div className={styles.greeting}>안녕하세요, {name}</div>

      <div className={styles.headerSection}>
        <h1 className={styles.mainTitle}>첫 계약 생성 완료!</h1>
        <button className={styles.Plus}>+</button>
      </div>

      {/* 계약 리스트 (슬라이드 가능 구조) */}
      <div className={styles.contractList}>
        <div className={styles.contractCard}>
          <div className={styles.contractInfo}>
            <p className={styles.contractType}>근로 계약서</p>
            <div>
              <p className={styles.contractDate}>2025.07.30</p>
              <p className={styles.companyName}>주식회사</p>
              <p className={styles.companyName}>로우커피</p>
            </div>
          </div>
          <div className={styles.warningBox}>
            <img className={styles.warningIcon} src={Warning} alt="주의 아이콘" />
            <div className={styles.warningBottom}>
              <p className={styles.warningText}>
                핵심 조항 {totalClauses}개 중
              </p>
              <p className={styles.missingCount}>{missingClauses}개 누락</p>
            </div>
          </div>
        </div>
        <img className={styles.paperBg} src={paper} alt="배경 이미지" />
      </div>

      {/* 슬라이드 인디케이터 */}
      <div className={styles.slideIndicator}>
        <div className={styles.dot}></div>
      </div>

      <div className={styles.bottomSection}>
        {/* AI 대화 */}
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

        {/* 체크리스트 */}
        <div
          className={styles.smallCard2}
          onClick={() => navigate("/checklist")}
          style={{ cursor: "pointer" }}
        >
          <div>
            <p className={styles.cardTitle2}>체크리스트</p>
            {checkedItems === 0 && (
              <div>
                <p className={styles.cardText2}>체크리스트를</p>
                <p className={styles.cardText2}>확인해보세요</p>
              </div>
            )}
          </div>
          
          {checkedItems > 0 ? (
            <div className={styles.progressBarWrapper}>
              <svg className={styles.progressBarSvg}>
                <circle
                  className={styles.progressBarBackground}
                  cx="50"
                  cy="50"
                  r="40"
                />
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
                <span className={styles.checkCount}>{checkedItems}</span>
                <span className={styles.checkTotal}>/{totalCheckItems}</span>
              </div>
            </div>
          ) : (
            <div className={styles.checkWrapper}>
              <img className={styles.check} src={Check} alt="체크 배경" />
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