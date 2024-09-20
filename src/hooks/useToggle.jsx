import { useState } from "react";

function useToggle() {
  const [value, setValue] = useState(false);
  const toggle = (e) => {
    e && e.preventDefault();
    setValue(!value);
  };

  return [value, toggle];
}

export default useToggle
