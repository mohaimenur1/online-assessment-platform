import { useEffect, useRef, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login, logout } from '../store/slices/authSlice';
import { MOCK_EMPLOYER, MOCK_CANDIDATE } from '../mock-data';

// ─── Auth Hook ───
export function useAuth() {
  const dispatch = useDispatch();
  const { user, role, isAuthenticated } = useSelector((s) => s.auth);

  const signIn = useCallback(
    async (email, password, asRole) => {
      await new Promise((r) => setTimeout(r, 700));
      const mock = asRole === 'employer' ? MOCK_EMPLOYER : MOCK_CANDIDATE;
      if (email === mock.email && password === mock.password) {
        dispatch(login({ user: mock, role: asRole }));
        return { success: true };
      }
      return { success: false, error: 'Invalid credentials. Try the pre-filled values.' };
    },
    [dispatch]
  );

  const signOut = useCallback(() => dispatch(logout()), [dispatch]);

  return { user, role, isAuthenticated, signIn, signOut };
}

// ─── Exam Timer Hook ───
export function useTimer(initialSeconds, onTimeout) {
  const [remaining, setRemaining] = useState(initialSeconds);
  const timeoutFired = useRef(false);

  useEffect(() => {
    if (remaining <= 0) return;
    const id = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(id);
          if (!timeoutFired.current) {
            timeoutFired.current = true;
            onTimeout();
          }
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const progress = remaining / initialSeconds;

  return { remaining, minutes, seconds, progress };
}

// ─── Tab Visibility / Behaviour Tracking Hook ───
export function useBehaviorTracking() {
  const [warnings, setWarnings] = useState([]);
  const tabSwitchCount = useRef(0);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        tabSwitchCount.current += 1;
        const count = tabSwitchCount.current;
        setWarnings((prev) => [
          ...prev,
          {
            id: Date.now(),
            message: `⚠️ Tab switch detected! (${count}x) — Do not leave during the exam.`,
          },
        ]);
      }
    };

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setWarnings((prev) => [
          ...prev,
          { id: Date.now(), message: '⚠️ Fullscreen exited. Please stay in fullscreen during the exam.' },
        ]);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const dismissWarning = useCallback((id) => {
    setWarnings((prev) => prev.filter((w) => w.id !== id));
  }, []);

  return { warnings, tabSwitchCount, dismissWarning };
}

// ─── Exam Answers Hook ───
export function useExamAnswers(questions) {
  const [answers, setAnswers] = useState({});

  const setRadio = useCallback((qIndex, optionIndex) => {
    setAnswers((a) => ({ ...a, [qIndex]: optionIndex }));
  }, []);

  const toggleCheckbox = useCallback((qIndex, optionIndex) => {
    setAnswers((a) => {
      const current = a[qIndex] || [];
      const updated = current.includes(optionIndex)
        ? current.filter((i) => i !== optionIndex)
        : [...current, optionIndex];
      return { ...a, [qIndex]: updated };
    });
  }, []);

  const setText = useCallback((qIndex, text) => {
    setAnswers((a) => ({ ...a, [qIndex]: text }));
  }, []);

  const isAnswered = useCallback(
    (qIndex) => {
      const ans = answers[qIndex];
      if (ans === undefined || ans === null) return false;
      if (Array.isArray(ans)) return ans.length > 0;
      if (typeof ans === 'string') return ans.trim().length > 0;
      return ans !== undefined;
    },
    [answers]
  );

  const answeredCount = questions.filter((_, i) => isAnswered(i)).length;

  return { answers, setRadio, toggleCheckbox, setText, isAnswered, answeredCount };
}
