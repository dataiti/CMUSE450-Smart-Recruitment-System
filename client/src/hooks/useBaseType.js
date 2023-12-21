import { useEffect, useRef, useState } from "react";

const useBaseType = (
  handleContentChange,
  defaultValue,
  extraWidth = 0,
  extraHeight = 0
) => {
  const [isFocus, setIsFocus] = useState(false);
  const divRef1 = useRef(null);
  const divRef2 = useRef(null);
  const absoluteDivRef = useRef(null);

  const handleFocusInput = () => setIsFocus(true);

  const handleClickOutside = (event) => {
    if (
      divRef1.current &&
      !divRef1.current.contains(event.target) &&
      divRef2.current &&
      !divRef2.current.contains(event.target)
    ) {
      setIsFocus(false);
    }
  };

  const updateAbsoluteDivSize = () => {
    if (divRef1.current && absoluteDivRef.current) {
      const width = divRef1.current.offsetWidth + extraWidth;
      const height = divRef1.current.offsetHeight + extraHeight;
      absoluteDivRef.current.style.width = `${width}px`;
      absoluteDivRef.current.style.height = `${height}px`;
    }
  };

  useEffect(() => {
    const resizeObserver = new ResizeObserver(updateAbsoluteDivSize);
    if (divRef1.current) resizeObserver.observe(divRef1.current);

    document.addEventListener("mousedown", handleClickOutside);
    updateAbsoluteDivSize();

    return () => {
      if (divRef1.current) resizeObserver.unobserve(divRef1.current);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return {
    isFocus,
    divRef1,
    divRef2,
    absoluteDivRef,
    handleFocusInput,
    handleContentChange,
  };
};

export default useBaseType;
