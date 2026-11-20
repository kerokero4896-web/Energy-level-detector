// 미리보기용 가짜 저장소. http://localhost:8123/?mock=1 로 열면 claude.ai의 db를 흉내 낸다.
// 주소 뒤 옵션: snap=첫 기록이 올 때까지 ms(기본 50) · use=연결까지 ms(기본 0) · usenull=1(연결 안 됨)
//              owner=0(주인 아님) · seed=0(시작 기록 없음) · failset=1(저장 실패)
// 시작 기록: 이틀 전 = 체크 1개·결과 없음, 어제 = 체크 1개·결과 "뻗음"
(() => {
  const q = new URLSearchParams(location.search);
  const num = (k, d) => (q.has(k) ? Number(q.get(k)) : d);
  const snapDelay = num("snap", 50);
  const useDelay = num("use", 0);
  const useNull = q.get("usenull") === "1";
  const owner = q.get("owner") !== "0";
  let failSet = q.get("failset") === "1";
  const pad = (n) => String(n).padStart(2, "0");
  const keyOf = (d) => d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
  const dk = (o) => keyOf(new Date(Date.now() - 6 * 3600e3 - o * 86400e3));
  const check = (daysAgo, gut, score) => ({ at: new Date(Date.now() - daysAgo * 86400e3).toISOString(), gut, score, level: "ok", sleepH: "5-6", wake: "plain", pushed: 1, used: null, flags: ["late"], v: 1 });
  const server = new Map();
  if (q.get("seed") !== "0") {
    server.set(dk(2), { date: dk(2), checks: [check(2, 6, 6.5)], outcome: null, outcomeAt: null, updatedAt: null });
    server.set(dk(1), { date: dk(1), checks: [check(1, 7, 5)], outcome: "crashed", outcomeAt: new Date().toISOString(), updatedAt: null });
  }
  const copy = (o) => JSON.parse(JSON.stringify(o));
  const deep = (o) => { Object.freeze(o); for (const v of Object.values(o)) if (v && typeof v === "object") deep(v); return o; };
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const listeners = [];
  let served = false;
  const docSnap = (id, v) => Object.freeze({ id, exists: v !== undefined, data: () => (v === undefined ? undefined : deep(copy(v))), metadata: { fromCache: false, hasPendingWrites: false } });
  const snapOf = () => {
    const docs = [...server.entries()].sort((a, b) => (a[0] < b[0] ? 1 : -1)).map(([id, v]) => docSnap(id, v));
    return { docs, size: docs.length, empty: !docs.length, metadata: { fromCache: false, hasPendingWrites: false }, docChanges: () => [] };
  };
  const emit = () => { if (served) for (const l of listeners) l(snapOf()); };
  const db = {
    collection() {
      const ref = {
        orderBy() { return ref; },
        limit() { return ref; },
        onSnapshot(next) {
          listeners.push(next);
          setTimeout(() => { served = true; next(snapOf()); }, snapDelay);
          return () => {};
        },
        doc(id) {
          return {
            async get() { await wait(40); return docSnap(id, server.get(id)); },
            async set(body) {
              await wait(60);
              if (failSet) throw { code: "unavailable", message: "mock: 저장 실패" };
              server.set(id, copy(body));
              setTimeout(emit, 20);
            },
          };
        },
      };
      return ref;
    },
  };
  const user = { isOwner: async () => owner };
  window.claude = { use: (n) => new Promise((r) => setTimeout(() => r(useNull ? null : n === "db" ? db : n === "user" ? user : null), useDelay)) };
  window.__mock = { server, dk, setFail: (v) => { failSet = v; } };
})();
