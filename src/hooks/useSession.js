import { useCallback, useEffect, useRef, useState } from 'react';

const SESSION_KEY = 'app_session';
const SESSION_TTL = 30 * 60 * 1000; // 30 minutes

function getStoredSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const obj = JSON.parse(raw);
    if (!obj || typeof obj.sessionStart !== 'number') return null;
    return obj;
  } catch {
    return null;
  }
}

function cameFromQR() {
  const params = new URLSearchParams(window.location.search);
  return params.get('qr') === '1';
}

export default function useSession() {
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);

  const timeoutRef = useRef(null);
  const intervalRef = useRef(null);

  const clearTimers = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const expireNow = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    clearTimers();
    setIsSessionActive(false);
    setIsExpired(true);
    setRemainingTime(0);
  }, []);

  const startSession = useCallback(() => {
    localStorage.setItem(
      SESSION_KEY,
      JSON.stringify({ sessionStart: Date.now() })
    );

    // remove ?qr=1 from URL so refresh can't restart session
    window.history.replaceState({}, '', window.location.pathname);

    setIsSessionActive(true);
    setIsExpired(false);
    setRemainingTime(SESSION_TTL);

    clearTimers();

    timeoutRef.current = setTimeout(expireNow, SESSION_TTL);

    intervalRef.current = setInterval(() => {
      const s = getStoredSession();
      if (!s) return expireNow();

      const rem = Math.max(
        0,
        SESSION_TTL - (Date.now() - s.sessionStart)
      );
      setRemainingTime(rem);
    }, 1000);
  }, [expireNow]);

  useEffect(() => {
    const sess = getStoredSession();

    // ✅ Existing valid session
    if (sess) {
      const elapsed = Date.now() - sess.sessionStart;
      if (elapsed >= SESSION_TTL) {
        expireNow();
        return;
      }

      const remaining = SESSION_TTL - elapsed;
      setIsSessionActive(true);
      setIsExpired(false);
      setRemainingTime(remaining);

      timeoutRef.current = setTimeout(expireNow, remaining);
      intervalRef.current = setInterval(() => {
        const rem = Math.max(
          0,
          SESSION_TTL - (Date.now() - sess.sessionStart)
        );
        setRemainingTime(rem);
      }, 1000);

      return clearTimers;
    }

    // ❌ No session → only start if QR scanned
    if (cameFromQR()) {
      startSession();
      return;
    }

    // 🔒 Locked state
    setIsSessionActive(false);
    setIsExpired(true);
    setRemainingTime(0);
  }, [expireNow, startSession]);

  return {
    isSessionActive,
    isExpired,
    remainingTime
  };
}
