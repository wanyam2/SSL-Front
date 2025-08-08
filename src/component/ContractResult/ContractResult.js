import React, { useState } from 'react';
import styles from './ContractResult.module.css';
import { checklistItems } from './ContractChecklist';

export default function ContractResult() {
    const [tab, setTab] = useState('기본');

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <button className={styles.backBtn}>←</button>
                <h2>계약서 결과</h2>
            </div>

            <div className={styles.contractBox}>
                <div className={styles.contractMeta}>
                    <span className={styles.contractType}>근로계약서</span>
                    <span className={styles.contractDate}>2025.07.30</span>
                    <h3 className={styles.company}>주식회사 해이커피</h3>
                </div>
                <div className={styles.alertBadge}>⚠️ 주의</div>
            </div>

            <div className={styles.tabMenu}>
                <button onClick={() => setTab('기본')} className={tab === '기본' ? styles.active : ''}>기본 정보</button>
                <button onClick={() => setTab('조항')} className={tab === '조항' ? styles.active : ''}>핵심 조항</button>
            </div>

            <div className={styles.contentArea}>
                {tab === '기본' ? (
                    <div className={styles.emptyBox}>
                        <p className={styles.emptyText}>내용 없음<br />아직 작업 X</p>
                    </div>
                ) : (
                    <div className={styles.checklist}>
                        {checklistItems.map((item, idx) => (
                            <div key={idx} className={`${styles.item} ${styles[item.status]}`}>
                                <div className={styles.itemHeader}>
                                    <strong>{item.title}</strong>
                                    <span className={styles.statusMark}>
                    {item.status === 'info' && '✔'}
                                        {item.status === 'danger' && '✖'}
                                        {item.status === 'warning' && '⚠'}
                  </span>
                                </div>
                                <p className={styles.itemContent}>{item.content}</p>
                                <p className={styles.itemNote}>{item.note}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
