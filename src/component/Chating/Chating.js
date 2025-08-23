import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ 라우팅 이동
import styles from "./Chating.module.css";

const BASE_URL = "https://port-0-ll-ssl-backend-umnqdut2blqqevwyb.sel4.cloudtype.app";
const CONTRACT_ID = 1;
const MEMBER_ID = 1;

async function http(input, init) {
    const res = await fetch(input, {
        headers: { "Content-Type": "application/json" },
        ...init,
    });
    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`HTTP ${res.status} - ${res.statusText}${text ? `: ${text}` : ""}`);
    }
    const ct = res.headers.get("content-type") || "";
    return ct.includes("application/json") ? res.json() : null;
}

function formatKST(iso) {
    try {
        const d = new Date(iso);
        return d.toLocaleString("ko-KR", { hour12: false });
    } catch {
        return iso;
    }
}

export default function Chating() {
    const navigate = useNavigate(); // ✅ 뒤로가기 처리

    const [roomId, setRoomId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [loadingRoom, setLoadingRoom] = useState(false);
    const [loadingMsgs, setLoadingMsgs] = useState(false);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState(null);

    const [drawerOpen, setDrawerOpen] = useState(false);

    // 방 확인
    async function resolveRoom() {
        setLoadingRoom(true);
        setError(null);
        try {
            const rooms = await http(`${BASE_URL}/api/contracts/${CONTRACT_ID}/chat/rooms`, { method: "GET" });
            if (Array.isArray(rooms) && rooms.length > 0) {
                setRoomId(rooms[0].id);
                return rooms[0].id;
            }
            // 없으면 생성 유도
            await http(`${BASE_URL}/api/contracts/${CONTRACT_ID}/chat`, {
                method: "POST",
                body: JSON.stringify({ memberId: MEMBER_ID, message: "" }), // ✅ 목데이터 제거
            });
            const rooms2 = await http(`${BASE_URL}/api/contracts/${CONTRACT_ID}/chat/rooms`, { method: "GET" });
            if (Array.isArray(rooms2) && rooms2.length > 0) {
                setRoomId(rooms2[0].id);
                return rooms2[0].id;
            }
            throw new Error("생성 가능한 채팅방이 없습니다.");
        } catch (e) {
            setError(e.message || "채팅방 확인 중 오류");
            throw e;
        } finally {
            setLoadingRoom(false);
        }
    }

    // 메시지 로딩
    async function loadMessages(targetRoomId = roomId) {
        if (!targetRoomId) return;
        setLoadingMsgs(true);
        setError(null);
        try {
            const data = await http(
                `${BASE_URL}/api/contracts/${CONTRACT_ID}/chat/rooms/${targetRoomId}`,
                { method: "GET" }
            );
            setMessages(Array.isArray(data) ? data : []);
        } catch (e) {
            setError(e.message || "메시지 불러오는 중 오류");
        } finally {
            setLoadingMsgs(false);
        }
    }

    // 최초 실행
    useEffect(() => {
        let intervalId;
        (async () => {
            const id = await resolveRoom().catch(() => null);
            if (id) {
                await loadMessages(id);
                intervalId = setInterval(() => loadMessages(id), 3000);
            }
        })();
        return () => intervalId && clearInterval(intervalId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // 메시지 전송
    async function onSend(e) {
        e?.preventDefault();
        if (!roomId) return;
        const msg = text.trim();
        if (!msg) return;
        setSending(true);
        setError(null);
        try {
            await http(`${BASE_URL}/api/contracts/${CONTRACT_ID}/chat/rooms/${roomId}`, {
                method: "POST",
                body: JSON.stringify({ memberId: MEMBER_ID, message: msg }),
            });
            setText("");
            await loadMessages();
        } catch (e) {
            setError(e.message || "전송 실패");
        } finally {
            setSending(false);
        }
    }

    return (
        <div className={styles.page}>
            {/* 상단바 */}
            <header className={styles.header}>
                {/* ✅ 뒤로가기 → "/" */}
                <button className={styles.iconBtn} aria-label="뒤로가기" onClick={() => navigate("/")}>
                    ‹
                </button>
                <div className={styles.headerTitle}>AI 대화</div>
                <button className={styles.iconBtn} aria-label="메뉴" onClick={() => setDrawerOpen(true)}>
                    ≡
                </button>
            </header>

            {/* 본문 */}
            <main className={styles.surface}>
                <section className={styles.chatWrap}>
                    {loadingMsgs && messages.length === 0 && (
                        <p className={styles.muted}>메시지 불러오는 중…</p>
                    )}

                    <div className={styles.messages}>
                        {messages.map((m) => (
                            <div
                                key={m.id}
                                className={`${styles.bubble} ${m.senderType === "USER" ? styles.me : styles.bot}`}
                                title={formatKST(m.createdAt)}
                            >
                                <div className={styles.metaRow}>
                                    <span className={styles.tag}>{m.senderType === "USER" ? "나" : "AI"}</span>
                                    <span className={styles.time}>{formatKST(m.createdAt)}</span>
                                </div>
                                <div className={styles.text}>{m.content}</div>
                            </div>
                        ))}
                    </div>

                    <form className={styles.inputDock} onSubmit={onSend}>
                        <input
                            className={styles.input}
                            placeholder="무엇이든 물어보세요!"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            disabled={!roomId}
                        />
                        <button className={styles.sendFab} type="submit" disabled={sending || !roomId}>
                            ➤
                        </button>
                    </form>
                </section>

                {loadingRoom && <p className={styles.muted}>채팅방 확인 중…</p>}
                {error && <p className={styles.error}>{error}</p>}
            </main>

            {/* 사이드 드로어 */}
            <div className={`${styles.drawer} ${drawerOpen ? styles.open : ""}`} role="dialog" aria-modal="true">
                <div className={styles.drawerHeader}>
                    <div className={styles.searchBar}>
                        <span className={styles.searchIcon}>🔍</span>
                        <input className={styles.searchInput} placeholder="검색" />
                    </div>
                    <button className={styles.iconBtn} onClick={() => setDrawerOpen(false)} aria-label="닫기">
                        ✕
                    </button>
                </div>

                <div className={styles.drawerBody}>
                    <div className={styles.sectionTitle}>최근</div>
                    <div className={styles.emptyNote}>이전 기록이 없습니다.</div>
                </div>
            </div>

            {drawerOpen && <div className={styles.scrim} onClick={() => setDrawerOpen(false)} />}
        </div>
    );
}
