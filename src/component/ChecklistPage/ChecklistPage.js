import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./ChecklistPage.module.css";

const ChecklistPage = () => {
  const navigate = useNavigate();
  const [checklistData, setChecklistData] = useState([]);
  const [checkedItems, setCheckedItems] = useState({});
  const contractId = 1; // 고정

  // ✅ 서버에서 체크리스트 불러오기
  useEffect(() => {
    const fetchChecklist = async () => {
      try {
        const res = await axios.get(
          `https://port-0-ll-ssl-backend-umnqdut2blqqevwyb.sel4.cloudtype.app/api/checklists/contract/${contractId}`
        );
        setChecklistData(res.data);
      } catch (error) {
        console.error("Failed to fetch checklist", error);
      }
    };

    fetchChecklist();
  }, []);

  // ✅ localStorage 복구
  useEffect(() => {
    try {
      const storedItems = localStorage.getItem("checklistCheckedItems");
      if (storedItems) setCheckedItems(JSON.parse(storedItems));
    } catch (error) {
      console.error("Failed to load state from localStorage", error);
    }
  }, []);

  // ✅ localStorage 저장
  useEffect(() => {
    try {
      localStorage.setItem("checklistCheckedItems", JSON.stringify(checkedItems));
    } catch (error) {
      console.error("Failed to save state to localStorage", error);
    }
  }, [checkedItems]);

  // ✅ API로 체크 상태 저장
  const saveChecklistToAPI = async (updatedItems) => {
    const itemsArray = Object.entries(updatedItems).map(([key, value]) => ({
      itemNumber: Number(key),
      isChecked: value,
    }));

    try {
      await axios.post(
        "https://port-0-ll-ssl-backend-umnqdut2blqqevwyb.sel4.cloudtype.app/api/checklists",
        { contractId, items: itemsArray }
      );
    } catch (error) {
      console.error("Failed to save checklist to API", error);
    }
  };

  const handleYesClick = (id) => {
    setCheckedItems((prev) => {
      const updated = { ...prev, [id]: true };
      saveChecklistToAPI(updated);
      return updated;
    });
  };

  const handleNoClick = (id) => {
    setCheckedItems((prev) => {
      const updated = { ...prev, [id]: false };
      saveChecklistToAPI(updated);
      return updated;
    });
  };

  const completedCount = useMemo(() => {
    return Object.values(checkedItems).filter((item) => item === true).length;
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
          const isChecked = checkedItems[item.itemNumber] === true;
          const isNotChecked = checkedItems[item.itemNumber] === false;

          return (
            <div
              key={item.itemNumber}
              className={`${styles.card} ${isChecked ? styles.checkedCard : ""} ${
                isNotChecked ? styles.uncheckedCard : ""
              }`}
            >
              <div className={styles.cardHeader}>
                <p className={styles.number}>{item.itemNumber}. {item.title}</p>
                {isChecked && <div className={styles.checkIcon}>✓</div>}
                {isNotChecked && <div className={styles.warningIcon}>!</div>}
              </div>
              
              {isChecked || isNotChecked ? (
                <>
                  <h3 className={styles.question}>
                    {isChecked ? item.yesText : `"${item.noText}" 선택됨`}
                  </h3>
                  <p className={styles.description}>
                    {isChecked ? item.yesDescription : item.description}
                  </p>
                </>
              ) : (
                <>
                  <h3 className={styles.question}>{item.question}</h3>
                  <p className={styles.description}>{item.description}</p>
                  <div className={styles.buttons}>
                    <button
                      className={styles.yesButton}
                      onClick={() => handleYesClick(item.itemNumber)}
                    >
                      {item.yesText}
                    </button>
                    <button
                      className={styles.noButton}
                      onClick={() => handleNoClick(item.itemNumber)}
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
