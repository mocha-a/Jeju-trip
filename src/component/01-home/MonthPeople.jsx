import { useEffect } from "react";
import { animate, useMotionValue, useTransform, motion } from "framer-motion";

function MonthPeople({ count }) {
  const motionVal = useMotionValue(0);
  const rounded = useTransform(motionVal, (latest) =>
    Math.round(latest).toLocaleString()
  );

  useEffect(() => {
    const controls = animate(motionVal, count, { duration: 2 });
    return () => controls.stop();
  }, [count]);

  return <motion.b>{rounded}</motion.b>;
}

export default MonthPeople