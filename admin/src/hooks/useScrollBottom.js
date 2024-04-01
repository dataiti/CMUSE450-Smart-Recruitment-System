import { useEffect } from "react";

function useScrollToBottom(ref, dependency) {
  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [dependency, ref]);
}

export default useScrollToBottom;
