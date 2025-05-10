import { cn } from "@/app/lib/utils";
import { PrizeDetails } from "@/components/types";

interface ColorTheme {
  titleBg?: string;
  titleText?: string;
}

const ResultCard = ({
  title,
  data,
  logoSrc,
  colorTheme = {
    titleBg: "bg-neutral-800",
    titleText: "text-white",
  },
}: {
  title: string;
  data: PrizeDetails;
  logoSrc?: string;
  colorTheme?: ColorTheme;
}) => {
  return (
    <div className="bg-white border rounded-lg shadow-md w-full max-w-lg overflow-hidden">
      {/* Title Bar */}
      <div
        className={cn(
          colorTheme.titleBg,
          colorTheme.titleText,
          "px-2 py-1.5 text-lg font-semibold text-center border-b-neutral-800 border-b flex items-center"
        )}
      >
        {logoSrc && (
          <img src={logoSrc} alt={`${title} logo`} className="h-12 max-h-12 w-auto rounded" />
        )}
        <p className="flex-1 -translate-x-3">{title}</p>
      </div>

      {/* Top 3 Prizes */}
      <div className="p-4 border-b border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xs text-gray-600">1st Prize 首奖</p>
            <p className="text-3xl font-bold font-mono">{data.firstPrize}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600">2nd Prize 二奖</p>
            <p className="text-3xl font-bold font-mono">{data.secondPrize}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600">3rd Prize 三奖</p>
            <p className="text-3xl font-bold font-mono">{data.thirdPrize}</p>
          </div>
        </div>
      </div>

      {/* Special Prizes */}
      <div className="p-1.5 md:p-4 border-b border-gray-200">
        <div className="bg-neutral-800 text-white text-sm font-medium px-4 py-1.5">
          Special 特别奖
        </div>
        <div className="grid grid-cols-5 gap-2 mt-2">
          {data.special.map((prize, i) => (
            <div
              key={`special-${i}`}
              className="bg-gray-100 text-center p-2 rounded font-mono text-lg"
            >
              {prize}
            </div>
          ))}
        </div>
      </div>

      {/* Consolation Prizes */}
      <div className="p-1.5 md:p-4">
        <div className="bg-neutral-800 text-white text-sm font-medium px-4 py-1.5">
          Consolation 安慰奖
        </div>
        <div className="grid grid-cols-5 gap-2 mt-2">
          {data.consolation.map((prize, i) => (
            <div
              key={`consolation-${i}`}
              className="bg-gray-100 text-center p-2 rounded font-mono text-lg"
            >
              {prize}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResultCard;
