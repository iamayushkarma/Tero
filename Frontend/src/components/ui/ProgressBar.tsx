import { useEffect, useState } from "react";

type ProgressBarProps = {
  percentage: number;
  color: string;
  type: string;
  delay?: number;
};
function ProgressBar({ percentage, color, type, delay = 0 }: ProgressBarProps) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => {
      setWidth(percentage);
    }, delay);
    return () => clearTimeout(timer);
  }, [percentage, delay]);
  return (
    <div>
      <div className="mb-4 flex justify-between md:mb-1">
        <span className="text-gray-12 dark:text-gray-3 font-medium">{type}</span>
        <span style={{ color }} className="font-medium">
          {percentage}%
        </span>
      </div>
      <div className="border-gray-5 dark:border-gray-11/30 w-full overflow-hidden rounded-md border-2">
        <div
          style={{ width: `${width}%`, backgroundColor: color }}
          className="p-1 transition-all duration-1000 ease-out"
        ></div>
      </div>
    </div>
  );
}

export default ProgressBar;
