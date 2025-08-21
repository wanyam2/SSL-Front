// 로컬스토리지에 저장/복구하는 공용 스토어

const KEY = "checklistCheckedItems"; // { [itemNumber]: true|false }

export function getChecklistState() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function setChecklistState(stateObj) {
  try {
    localStorage.setItem(KEY, JSON.stringify(stateObj || {}));
  } catch {}
}

export function getAnsweredCount(stateObj) {
  const s = stateObj || getChecklistState();
  return Object.keys(s).length; // 예/아니오 무관, 응답한 개수
}

export function getCompletedCount(stateObj) {
  const s = stateObj || getChecklistState();
  return Object.values(s).filter((v) => v === true).length; // 예(true)만 카운트
}
