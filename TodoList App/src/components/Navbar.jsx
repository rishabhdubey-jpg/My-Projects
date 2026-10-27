import React from 'react'
import { HiCheckCircle, HiOutlineClock } from "react-icons/hi2";

const Navbar = ({ totalTasks, completedCount }) => {
  const pendingCount = totalTasks - completedCount;

  return (
    <header className="w-full max-w-xl mx-auto px-4 pt-6">
      <nav className="flex items-center justify-between px-6 py-4 rounded-3xl bg-white/80 backdrop-blur-md border border-slate-200/60 shadow-xl shadow-slate-200/40">
        
        {/* Brand Logo with polished tracking */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-600 to-rose-500 flex items-center justify-center font-bold text-white text-base shadow-lg shadow-rose-600/25">
            ✓
          </div>
          <div>
            <span className="font-extrabold text-lg text-slate-900 tracking-tight">
              iTask
            </span>
          </div>
        </div>

        {/* Status badges with precise typography */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100/80 text-slate-600 text-xs font-semibold border border-slate-200/60">
            <HiOutlineClock className="w-3.5 h-3.5 text-rose-500" />
            <span>{pendingCount}</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200/60">
            <HiCheckCircle className="w-3.5 h-3.5 text-emerald-500" />
            <span>{completedCount}</span>
          </div>
        </div>

      </nav>
    </header>
  )
}

export default Navbar