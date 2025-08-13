interface ProgressBarProps {
  progressPercent: number;
  showProgressPercent: boolean;
  marginRight: string;
}
export const ProgressBar = ({
  progressPercent,
  showProgressPercent,
  marginRight,
}: ProgressBarProps) => {
  return (
    <div
      className={`flex items-center justify-end w-[65%] dark:text-white ${marginRight}`}
    >
      <div className="mr-3 w-full bg-gray-200 rounded-full h-2 border-[0.5px] dark:bg-gray-800 dark:border-slate-500 dark:text-white">
        <div
          className="bg-yellow-500 h-2 rounded-full"
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>
      {showProgressPercent && <p className="text-sm">{progressPercent}%</p>}
    </div>
  );
};
