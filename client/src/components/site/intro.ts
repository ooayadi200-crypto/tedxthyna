import { createContext, useContext } from "react";

/** True once the opening sequence has finished (or was skipped / already seen this session). */
export const IntroContext = createContext(true);
export const useIntroDone = () => useContext(IntroContext);
