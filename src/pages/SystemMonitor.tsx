import { useEDFSimulation } from '@/lib/useEDFSimulation';
import { TASKS } from '@/lib/constants';
import { motion, AnimatePresence } from 'motion/react';
import { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Play, Pause, FastForward, Info, HelpCircle } from 'lucide-react';

export default function SystemMonitor() {
  const { 
    time, schedule, activeTask, cpuUtilization, readyQueue, 
    setTaskDelays, taskDelays, isPlaying, setIsPlaying, speed, setSpeed 
  } = useEDFSimulation();
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isAutoScroll, setIsAutoScroll] = useState(true);

  // Pixel scaling for the timeline
  const PX_PER_SEC = 60;
  const totalWidth = Math.max(time * PX_PER_SEC + 200, 800); // Ensure at least 800px or time-based width

  // Auto-scroll logic
  useEffect(() => {
    if (isAutoScroll && scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = scrollContainerRef.current.scrollWidth;
    }
  }, [time, isAutoScroll]);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      // If user scrolls away from the right edge (with some buffer), disable auto-scroll
      const isAtRight = scrollWidth - (scrollLeft + clientWidth) < 50;
      setIsAutoScroll(isAtRight);
    }
  };

  const handleDelayChange = (taskId: string, delay: number) => {
    setTaskDelays(prev => ({
      ...prev,
      [taskId]: delay
    }));
  };

  // Prepare data for Gantt Chart
  // We want to show the last 20 seconds of activity
  const windowSize = 20;
  const startTime = Math.max(0, time - windowSize);
  
  // Filter relevant schedule items
  const visibleSchedule = schedule.filter(s => s.endTime > startTime);

  return (
    <div className="p-6 h-full flex flex-col bg-[#f8f9fa]">
      <header className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold font-mono uppercase tracking-tight text-black/80">System Monitor</h1>
          <p className="text-sm text-black/50 font-mono">Earliest Deadline First (EDF) Scheduler</p>
        </div>
        
        {/* Simulation Controls */}
        <div className="flex items-center gap-4 bg-white p-2 rounded-lg border border-black/5 shadow-sm">
           <button 
             onClick={() => setIsPlaying(!isPlaying)}
             className="w-8 h-8 flex items-center justify-center rounded hover:bg-black/5 text-black/70 transition-colors"
             title={isPlaying ? "Pause Simulation" : "Resume Simulation"}
           >
             {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
           </button>
           
           <div className="h-4 w-px bg-black/10" />
           
           <div className="flex items-center gap-1">
             {[0.1, 0.2, 0.5, 1.0].map((s) => (
               <button
                 key={s}
                 onClick={() => setSpeed(s)}
                 className={cn(
                   "px-2 py-1 text-[10px] font-mono font-bold rounded transition-colors",
                   speed === s ? "bg-black text-white" : "text-black/40 hover:bg-black/5"
                 )}
               >
                 {s}x
               </button>
             ))}
           </div>
        </div>

        <div className="flex gap-4">
          <Metric label="System Time" value={`${time.toFixed(1)}s`} />
          <Metric label="CPU Util" value={`${cpuUtilization.toFixed(1)}%`} />
        </div>
      </header>

      {/* Scheduler Insight Panel */}
      <div className="mb-6 bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-start gap-4 shadow-sm">
        <div className="p-2 bg-blue-100 text-blue-600 rounded-full mt-0.5">
          <Info size={18} />
        </div>
        <div>
          <h3 className="text-sm font-bold text-blue-900 mb-1">Scheduler Decision Logic</h3>
          {activeTask ? (
            <div className="text-sm text-blue-800">
              Executing <span className="font-bold">{activeTask.name}</span> because it has the <span className="font-bold underline decoration-blue-300">earliest deadline</span> (t={(activeTask as any).absoluteDeadline?.toFixed(1)}s) among all ready tasks.
            </div>
          ) : (
            <div className="text-sm text-blue-800">
              CPU is <span className="font-bold">IDLE</span>. No tasks are currently ready to run. Waiting for next task release.
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        {/* Left Col: Task Status & Ready Queue */}
        <div className="lg:col-span-1 flex flex-col gap-6 overflow-y-auto pr-2">
          <div className="space-y-4">
            {TASKS.map(task => {
              const isActive = activeTask?.id === task.id;
              return (
                <motion.div 
                  key={task.id}
                  animate={{ 
                    scale: isActive ? 1.02 : 1,
                    borderColor: isActive ? task.color : 'rgba(0,0,0,0.1)'
                  }}
                  className="p-4 bg-white rounded-lg border border-black/10 shadow-sm relative overflow-hidden"
                >
                  {isActive && (
                    <motion.div 
                      layoutId="active-glow"
                      className="absolute inset-0 bg-current opacity-5 pointer-events-none"
                      style={{ color: task.color }}
                    />
                  )}
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-sm">{task.name}</h3>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/5 uppercase">
                      {task.type}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono text-black/60">
                    <div>Period: {task.period}s</div>
                    <div>WCET: {task.wcet}ms</div>
                    <div>Deadline: {task.deadline}s</div>
                  </div>
                  
                  {/* Delay Control */}
                  <div className="mt-3 pt-2 border-t border-black/5 flex items-center justify-between">
                    <label className="text-[10px] font-mono uppercase text-black/40">Add Delay (s)</label>
                    <input 
                      type="number" 
                      min="0" 
                      step="0.1"
                      value={taskDelays[task.id] || 0}
                      onChange={(e) => handleDelayChange(task.id, parseFloat(e.target.value) || 0)}
                      className="w-16 text-right text-xs font-mono bg-black/5 rounded px-1 py-0.5 border-none focus:ring-1 focus:ring-black/20"
                    />
                  </div>

                  {isActive && (
                    <div className="mt-3 flex items-center gap-2 text-xs font-bold" style={{ color: task.color }}>
                      <div className="w-2 h-2 rounded-full bg-current animate-pulse" />
                      EXECUTING
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Ready Queue Section */}
          <div className="bg-white rounded-lg border border-black/10 p-4 shadow-sm flex flex-col">
            <h3 className="font-mono text-xs uppercase text-black/40 mb-3 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-black/40" />
              Ready Queue (EDF Sorted)
            </h3>
            <div className="space-y-2 flex-1 relative">
              <AnimatePresence mode="popLayout">
                {readyQueue.length === 0 ? (
                  <motion.div 
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-xs text-black/30 font-mono text-center py-8 bg-black/5 rounded border border-dashed border-black/10 flex flex-col items-center justify-center h-full"
                  >
                    <span>Queue Empty</span>
                  </motion.div>
                ) : (
                  readyQueue.map((task, i) => (
                    <motion.div 
                      layout
                      key={`${task.id}-${task.absoluteDeadline}`}
                      initial={{ opacity: 0, x: -20, scale: 0.95 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
                      transition={{ type: "spring", stiffness: 500, damping: 30, mass: 1 }}
                      className="flex items-center justify-between text-xs p-2.5 bg-white border border-black/10 rounded shadow-sm hover:border-black/20 transition-colors"
                    >
                       <div className="flex items-center gap-3">
                          <span className="font-mono text-black/40 w-4 text-[10px] text-center">#{i+1}</span>
                          <div className="flex flex-col">
                            <span className="font-bold flex items-center gap-2">
                              {task.name}
                              {i === 0 && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
                            </span>
                            <span className="text-[10px] text-black/50 font-mono uppercase">{task.type}</span>
                          </div>
                       </div>
                       <div className="text-right">
                         <div className={cn(
                           "font-mono font-bold",
                           task.isLate ? "text-red-600 animate-pulse" : "text-black/70"
                         )}>
                           D: {task.absoluteDeadline.toFixed(1)}s
                         </div>
                         <div className="text-[10px] text-black/40">Deadline</div>
                       </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
          
          {/* Legend */}
          <div className="bg-white rounded-lg border border-black/10 p-4 shadow-sm">
            <h3 className="font-mono text-xs uppercase text-black/40 mb-3">Legend</h3>
            <div className="grid grid-cols-2 gap-3 text-[10px] text-black/60">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-emerald-500 animate-pulse" />
                <span>Active Task</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-red-500" />
                <span>Deadline Missed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded border border-black/20 bg-white" />
                <span>Idle / Waiting</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-px h-3 bg-red-500" />
                <span>Current Time</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Gantt Chart Visualization */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-black/5 shadow-sm p-6 flex flex-col overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-mono text-sm font-bold uppercase tracking-wider">Execution Timeline</h3>
              <p className="text-xs text-black/40 mt-1">Real-time task scheduling visualization</p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-black/5 rounded-full">
               <div className={cn("w-2 h-2 rounded-full transition-colors", isAutoScroll ? "bg-emerald-500 animate-pulse" : "bg-gray-400")} />
               <button 
                 onClick={() => setIsAutoScroll(!isAutoScroll)}
                 className="text-[10px] font-mono font-bold uppercase tracking-wider hover:opacity-70"
               >
                 {isAutoScroll ? "Live View" : "Paused"}
               </button>
            </div>
          </div>
          
          <div 
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex-1 overflow-x-auto relative border border-black/5 rounded-lg bg-black/[0.02] shadow-inner"
          >
            <div style={{ width: totalWidth, height: '100%', position: 'relative' }}>
              {/* Time Grid Lines */}
              {Array.from({ length: Math.ceil(totalWidth / PX_PER_SEC) }).map((_, i) => (
                <div 
                  key={i} 
                  className="absolute top-0 bottom-0 border-l border-black/5 text-[9px] font-mono text-black/20 pl-1 pt-1 select-none"
                  style={{ left: i * PX_PER_SEC }}
                >
                  {i}s
                </div>
              ))}

              {/* Tasks Rows */}
              <div className="absolute inset-0 flex flex-col justify-evenly py-6">
                {TASKS.map((task) => {
                  const isActive = activeTask?.id === task.id;
                  return (
                    <div 
                      key={task.id} 
                      className={cn(
                        "relative h-12 w-full flex items-center transition-colors duration-300 group",
                        isActive ? "bg-black/[0.03]" : "bg-transparent"
                      )}
                    >
                      {/* Sticky Label */}
                      <div className="sticky left-0 z-10 w-32 shrink-0 pl-4 pr-4 bg-white/95 backdrop-blur-sm h-full flex items-center border-r border-black/5 shadow-[4px_0_12px_rgba(0,0,0,0.02)]">
                        <div className="flex flex-col">
                          <span className={cn(
                            "text-[10px] font-mono font-bold uppercase tracking-wider transition-colors",
                            isActive ? "text-black" : "text-black/40"
                          )}>
                            {task.name}
                          </span>
                        </div>
                        {isActive && (
                          <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
                        )}
                      </div>

                      {/* Task Bars */}
                      <div className="flex-1 h-full relative">
                        {/* Active Row Highlight Glow */}
                        {isActive && (
                           <motion.div 
                             initial={{ opacity: 0 }}
                             animate={{ opacity: 1 }}
                             exit={{ opacity: 0 }}
                             className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-50"
                             style={{ backgroundColor: `${task.color}08` }}
                           />
                        )}

                        {schedule
                          .filter(s => s.task.id === task.id)
                          .map((s, i) => (
                            <div
                              key={i}
                              className="absolute top-3 bottom-3 rounded-[2px] min-w-[2px] shadow-sm border border-black/5"
                              style={{
                                left: s.startTime * PX_PER_SEC,
                                width: Math.max((s.endTime - s.startTime) * PX_PER_SEC, 2),
                                backgroundColor: task.color
                              }}
                            />
                          ))}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Current Time Indicator Line */}
              <div 
                className="absolute top-0 bottom-0 w-px bg-red-500 z-20 shadow-[0_0_8px_rgba(239,68,68,0.4)]"
                style={{ left: time * PX_PER_SEC }}
              >
                <div className="absolute -top-1 -translate-x-1/2 text-[9px] font-bold text-white bg-red-500 px-1.5 py-0.5 rounded-full shadow-sm">
                  {time.toFixed(1)}s
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`px-4 py-2 rounded border ${highlight ? 'bg-black text-white border-black' : 'bg-white border-black/10'}`}>
      <div className={`text-[10px] font-mono uppercase ${highlight ? 'text-white/60' : 'text-black/40'}`}>{label}</div>
      <div className="font-mono font-bold text-lg leading-none mt-1">{value}</div>
    </div>
  );
}
