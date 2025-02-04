import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export const usePanelAnimations = (ref, isOpen) => {
  useGSAP(() => {
    if (isOpen) {
      gsap.to(ref.current, {
        transform: "translateY(0)",
      });
    } else {
      gsap.to(ref.current, {
        transform: "translateY(100%)",
      });
    }
  }, [isOpen]);
};
