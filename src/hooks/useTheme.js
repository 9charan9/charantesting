import { useState } from "react";

export const useTheme = () => {
  const [dark, setDark] = useState(false);
  const toggle = () => setDark(!dark);
  return { dark, toggle };
};
