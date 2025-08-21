import React, { useEffect, useRef, useState } from 'react';
import styles from './Chating.module.css';

const BASE_URL = 'https://port-0-ll-ssl-backend-umnqdut2blqqevwyb.sel4.cloudtype.app';
const CONTRACT_ID = 1;
const MEMBER_ID = 1;

async function http(input, init) {
  const res = await fetch(input, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`HTTP ${res.status} - ${res.statusText}${text ? `: ${text}` : ''}`);
  }
  const ct = res.headers.get('content-type') || '';
  return ct.includes('application/json') ? res.json() : null;
}

function formatKST(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleString('ko-KR', { hour12: false });
  } catch {
    return iso;
  }
}

export default function Chating() {
  const [roomId, setRoomId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loadingRoom, setLoadingRoom] = useState(false);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const bottomRef = useRef(null);

  // 방 찾기: GET /api/contracts/1/chat/rooms → 첫 번째 방 선택
  async function resolveRoom() {
    setLoadingRoom(true);
    setError(null);
    try {
      const rooms = await http(`${BASE_URL}/api/contracts/${CONTRACT_ID}/chat/rooms`, { method: 'GET' });
      if (Array.isArray(rooms) && rooms.length > 0) {
        setRoomId(rooms[0].id);
        return rooms[0].id;
      }
      // 방이 없으면 POST /api/contracts/1/chat 로 아무 메시지 하나 보내서 방 생성 유도 후 재조회
      await http(`${BASE_URL}/api/contracts/${CONTRACT_ID}/chat`, {
        method: 'POST',
        body: JSON.stringify({ memberId: MEMBER_ID, message: '안녕하세요' }),
      });
      const rooms2 = await http(`${BASE_URL}/api/contracts/${CONTRACT_ID}/chat/rooms`, { method: 'GET' });
      if (Array.isArray(rooms2) && rooms2.length > 0) {
        setRoomId(rooms2[0].id);
        return rooms2[0].id;
      }
      throw new Error('생성 가능한 채팅방이 없습니다.');
    } catch (e) {
      setError(e.message || '채팅방 확인 중 오류');
      throw e;
    } finally {
      setLoadingRoom(false);
    }
  }

  // 메시지 목록: GET /api/contracts/1/chat/rooms/{chatRoomId}
  async function loadMessages(targetRoomId = roomId) {
    if (!targetRoomId) return;
    setLoadingMsgs(true);
    setError(null);
    try {
      const data = await http(
        `${BASE_URL}/api/contracts/${CONTRACT_ID}/chat/rooms/${targetRoomId}`,
        { method: 'GET' },
      );
      setMessages(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message || '메시지 불러오는 중 오류');
    } finally {
      setLoadingMsgs(false);
    }
  }

  // 최초: 방 확인 후 메시지 로드 + 3초 폴링
  useEffect(() => {
    let intervalId;
    (async () => {
      const id = await resolveRoom().catch(() => null);
      if (id) {
        await loadMessages(id);
        intervalId = setInterval(() => loadMessages(id), 3000);
      }
    })();
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 새 메시지 올 때 맨 아래로 스크롤
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 전송: POST /api/contracts/1/chat/rooms/{chatRoomId}
  async function onSend(e) {
    e.preventDefault();
    if (!roomId) return;
    const msg = text.trim();
    if (!msg) return;
    setSending(true);
    setError(null);
    try {
      await http(`${BASE_URL}/api/contracts/${CONTRACT_ID}/chat/rooms/${roomId}`, {
        method: 'POST',
        body: JSON.stringify({ memberId: MEMBER_ID, message: msg }),
      });
      setText('');
      await loadMessages();
    } catch (e) {
      setError(e.message || '전송 실패');
    } finally {
      setSending(false);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <h1 className={styles.title}>단일 채팅방</h1>
        <div className={styles.subinfo}>
          <span>contractId=1</span>
          <span>memberId=1</span>
          {roomId && <span>roomId={roomId}</span>}
        </div>
      </div>

      {loadingRoom && <p className={styles.muted}>채팅방 확인 중…</p>}
      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.chatbox}>
        {loadingMsgs && messages.length === 0 && (
          <p className={styles.muted}>메시지 불러오는 중…</p>
        )}
        {messages.map((m) => (
          <div
            key={m.id}
            className={`${styles.bubble} ${m.senderType === 'USER' ? styles.me : styles.bot}`}
            title={formatKST(m.createdAt)}
          >
            <div className={styles.bubbleMeta}>
              <span className={styles.tag}>{m.senderType}</span>
              <span className={styles.timestamp}>{formatKST(m.createdAt)}</span>
            </div>
            <div className={styles.content}>{m.content}</div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={onSend} className={styles.inputRow}>
        <input
          className={styles.input}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="메시지를 입력하세요"
          disabled={!roomId}
        />
        <button className={styles.button} type="submit" disabled={sending || !roomId}>
          {sending ? '전송중…' : '보내기'}
        </button>
      </form>

      <div className={styles.help}>
        <small>
          이 화면은 다음 API를 사용합니다:
          <br />
          <code>GET /api/contracts/1/chat/rooms</code> → 첫 번째 방 선택
          <br />
          <code>POST /api/contracts/1/chat</code> → 방이 없을 때 생성 유도
          <br />
          <code>GET /api/contracts/1/chat/rooms/&#123;roomId&#125;</code> → 메시지 목록
          <br />
          <code>POST /api/contracts/1/chat/rooms/&#123;roomId&#125;</code> → 메시지 전송
        </small>
      </div>
    </div>
  );
}
