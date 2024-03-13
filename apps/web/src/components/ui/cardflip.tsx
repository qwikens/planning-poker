import { motion } from "framer-motion";
import { useMemo } from "react";
import "./cardflip.css";

const suits = ["spade", "heart", "diamond", "club"];

const CardFlip = ({
  value,
  canShowVote,
}: {
  value?: number | string;
  canShowVote: boolean;
}) => {
  const randomSuit = useMemo(() => {
    return suits[(Number(value) ?? 0) % 4];
  }, [value]);

  return (
    <div className="cards">
      <motion.label
        drag
        tabIndex={-1}
        dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
        dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
        dragElastic={0.5}
        whileTap={{ cursor: "grabbing" }}
        key={randomSuit}
        className={`card ${randomSuit} `}
        htmlFor={randomSuit}
      >
        <input
          type="checkbox"
          id={randomSuit}
          checked={!canShowVote}
          readOnly
        />
        <div className="back" />
        <div className="front">
          <div className="num-box top suit">{value ?? "A"}</div>
          <div className="num-box bottom suit">{value ?? "A"}</div>
          <div className="suit main" />
        </div>
      </motion.label>
    </div>
  );
};

export default CardFlip;
