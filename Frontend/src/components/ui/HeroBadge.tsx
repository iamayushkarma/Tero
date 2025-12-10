import { Brain } from "lucide-react";

function HeroBadge() {
  return (
    <div className="bg-blue-8 text-gray-3 mb-8 flex w-50 cursor-default items-center justify-center gap-2 rounded-lg p-0.5 text-[.8rem] shadow-[0_0_4px_rgba(255,255,255,0.15)] select-none">
      <Brain className="stroke-accent-gold h-4 w-4" />
      <p className="font-medium">Smarter Resume Decisions</p>
    </div>
  );
}

export default HeroBadge;
