import { useEffect, useRef, useState } from 'react';

// Motion is presentational: accessible totals always expose the final query result.
export function useChartMotion() {
  const [reduced, setReduced] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [keyboard, setKeyboard] = useState(false);
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(media.matches);
    const onKey = () => setKeyboard(true);
    const onPointer = () => setKeyboard(false);
    media.addEventListener('change', update);
    document.addEventListener('keydown', onKey, true);
    document.addEventListener('pointerdown', onPointer, true);
    return () => {
      media.removeEventListener('change', update);
      document.removeEventListener('keydown', onKey, true);
      document.removeEventListener('pointerdown', onPointer, true);
    };
  }, []);
  return !reduced && !keyboard;
}

// Interpolate arc proportions from the currently drawn state; interrupted updates
// cancel their frame, so a quick filter change cannot restore stale proportions.
export function useAnimatedShares(target, enabled) {
  const current = useRef(enabled ? target.map(() => 0) : target);
  const [values, setValues] = useState(current.current);
  const key = target.join(',');
  const entered = useRef(false);
  useEffect(() => {
    const end = key.split(',').map(Number);
    if (!enabled) {
      current.current = end;
      setValues(end);
      entered.current = true;
      return;
    }
    const start = [...current.current];
    const duration = entered.current ? 380 : 650;
    entered.current = true;
    const startTime = performance.now();
    let frame;
    const draw = now => {
      const progress = Math.min(1, (now - startTime) / duration);
      const eased = 1 - (1 - progress) ** 3;
      const next = end.map((value, i) => start[i] + (value - start[i]) * eased);
      current.current = next;
      setValues(next);
      if (progress < 1) frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, [key, enabled]);
  return enabled ? values : target;
}
