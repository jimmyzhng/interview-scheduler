import { useState } from "react";

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);
  // console.log('Mode', mode);
  // console.log('History', history);

  function transition(newMode, replace = false) {
    // if replace is true, we want to replace the current node
    // ie. going back would skip this current mode
    if (replace) {
      setMode(newMode);

      setHistory(prev => [...prev.slice(0, -1), newMode]);
    } else {
      setMode(newMode);
      setHistory(prev => [...prev, newMode]);
    }

  };

  function back() {
    // if current mode is not initial
    // remove last item of array, and change mode to previous
    if (mode !== initial) {
      history.pop();
      setHistory(history);
      setMode(history[history.length - 1]);
    }
  }

  return { mode, transition, back };
};
