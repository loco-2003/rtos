import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, MonitorPlay, ShieldAlert, FileText, Cpu, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#F5F5F5] text-[#141414] font-sans overflow-hidden">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-black/5 flex items-center justify-between px-4 z-50">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-black rounded-sm" />
          <h1 className="font-mono text-lg font-bold tracking-tight">RTOS EXAM</h1>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-black/60 hover:bg-black/5 rounded-lg">
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed md:static inset-y-0 left-0 w-64 border-r border-black/5 bg-white flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-50 transition-transform duration-300 ease-in-out md:transform-none",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 border-b border-black/5 hidden md:block">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 bg-black rounded-sm" />
            <h1 className="font-mono text-lg font-bold tracking-tight">RTOS EXAM</h1>
          </div>
          <p className="text-[10px] text-black/40 font-mono uppercase tracking-wider pl-5">v1.0.0 | EDF Scheduler</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 mt-16 md:mt-0">
          <NavItem to="/" icon={<LayoutDashboard size={18} />} label="Overview" onClick={() => setIsSidebarOpen(false)} />
          <NavItem to="/monitor" icon={<Cpu size={18} />} label="System Monitor" onClick={() => setIsSidebarOpen(false)} />
          <NavItem to="/exam" icon={<FileText size={18} />} label="Student Client" onClick={() => setIsSidebarOpen(false)} />
          <NavItem to="/proctor" icon={<ShieldAlert size={18} />} label="Proctoring Unit" onClick={() => setIsSidebarOpen(false)} />
        </nav>

        <div className="p-4 border-t border-black/5">
          <div className="bg-black text-white p-4 rounded-xl shadow-lg shadow-black/10">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
              <span className="text-[10px] font-mono uppercase font-bold tracking-wider">System Online</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-mono opacity-60">
                <span>PORT</span>
                <span>3000</span>
              </div>
              <div className="flex justify-between text-[10px] font-mono opacity-60">
                <span>PROTOCOL</span>
                <span>HTTPS</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-[#F5F5F5] pt-16 md:pt-0">
        {children}
      </main>
    </div>
  );
}

function NavItem({ to, icon, label, onClick }: { to: string; icon: React.ReactNode; label: string; onClick?: () => void }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
          isActive
            ? "bg-black text-white shadow-md shadow-black/10 translate-x-1"
            : "text-black/60 hover:bg-black/5 hover:text-black hover:translate-x-1"
        )
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
}
