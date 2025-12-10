import { Brain   } from "lucide-react"

function HeroBadge() {
  return (
    <div className='mb-8 shadow-[0_0_4px_rgba(255,255,255,0.15)]
      w-50 bg-blue-8 gap-2 text-[.8rem] p-0.5 rounded-lg text-gray-3 flex items-center justify-center cursor-default select-none'>
      <Brain className="w-4 h-4 stroke-accent-gold" />
      <p className="font-medium">Smarter Resume Decisions</p>
    </div>
  )
}

export default HeroBadge
