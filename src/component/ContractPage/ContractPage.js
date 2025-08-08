import React from 'react';
import styles from './ContractPage.module.css';
import { FaRegFileAlt, FaUser } from 'react-icons/fa';
import { MdCheckCircleOutline } from 'react-icons/md';
import { BsQuestionCircle } from 'react-icons/bs';

export default function ContractPage() {
    return (
        <div className={styles.container}>
            <div className={styles.greeting}>
                <p className={styles.subText}>안녕하세요, 성현님</p>
                <h2 className={styles.title}>첫 계약을 생성해봐요!</h2>
            </div>

            <div className={styles.mainCard}>
                <span>계약서<br />가져오기</span>
                <div className={styles.scanIcon}></div>
            </div>

            <div className={styles.subCards}>
                <div className={styles.card}>
                    <span className={styles.cardTitle}>AI 대화</span>
                    <p className={styles.cardDesc}>계약에 대해<br />궁금한게 있나요?</p>
                    <BsQuestionCircle size={32} className={styles.cardIcon} />
                </div>

                <div className={styles.card}>
                    <span className={styles.cardTitle}>체크리스트</span>
                    <p className={styles.cardDesc}>8개<br />조회하기</p>
                    <MdCheckCircleOutline size={32} className={styles.cardIcon} />
                </div>
            </div>

            <div className={styles.tabBar}>
                <div className={styles.tabItemActive}>
                    <FaRegFileAlt />
                    <span>내 계약</span>
                </div>
                <div className={styles.tabItem}>
                    <FaUser />
                    <span>프로필</span>
                </div>
            </div>
        </div>
    );
}
