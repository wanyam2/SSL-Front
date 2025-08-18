import React from 'react';
import styles from './ContractPage.module.css';
import { useNavigate } from 'react-router-dom';
import { MdOutlineDocumentScanner } from "react-icons/md";
import { FaRegFileAlt, FaUser } from 'react-icons/fa';
import { FiCheck } from "react-icons/fi";
import axios from "axios";

import { API_BASE } from "../../config/apiBase";

export default function ContractPage() {
    const navigate = useNavigate();

    const handleGoToOCR = () => {
        navigate('/ocr');
    };

    const handleGoToChecklist = async () => {
        try {
            const { data } = await axios.get(`${API_BASE}/api/contract`);
            const list = Array.isArray(data) ? data : [];
            if (!list.length) {
                alert("등록된 계약서가 없습니다. 먼저 업로드 해주세요.");
                return;
            }
            const latest = list[0];
            const contractId = latest.contractId ?? latest.id;
            if (!contractId) {
                alert("계약 ID를 확인할 수 없습니다.");
                return;
            }
            navigate('/ContractResultPage', { state: { contractId } });
        } catch (e) {
            console.error(e);
            alert(e?.response ? `목록 조회 실패 (${e.response.status})` : e?.message || "목록 조회 실패");
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.greeting}>
                <p className={styles.subText}>안녕하세요, 성현님</p>
                <h2 className={styles.title}>첫 계약을 생성해봐요!</h2>
            </div>

            <div
                className={styles.mainCard}
                onClick={handleGoToOCR}
                role="button"
                tabIndex={0}
            >
                <span className={styles.mainCardTitle}>계약서<br/>가져오기</span>
                <MdOutlineDocumentScanner className={styles.scanIcon} size={36} />
            </div>

            <div className={styles.subCards}>
                <div className={`${styles.card} ${styles.cardQA}`}>
                    <span className={styles.cardTitle}>AI 대화</span>
                    <p className={styles.cardDesc}>계약에 대해<br />궁금한게 있나요?</p>
                    <span className={styles.cardQMark}>?</span>
                </div>

                <div
                    className={`${styles.card} ${styles.cardChecklist}`}
                    onClick={handleGoToChecklist}
                    role="button"
                    tabIndex={0}
                >
                    <span className={styles.cardTitle}>체크리스트</span>
                    <p className={styles.cardDesc}><strong>조회하기</strong></p>
                    <div className={styles.cardBadge}>
                        <FiCheck className={styles.cardBadgeIcon} size={28} />
                    </div>
                </div>
            </div>

            <div className={styles.tabBar}>
                <div className={styles.tabItemActive}>
                    <FaRegFileAlt size={25} />
                    <span>내 계약</span>
                </div>
                <div className={styles.tabItem}>
                    <FaUser size={25} />
                    <span>프로필</span>
                </div>
            </div>
        </div>
    );
}
