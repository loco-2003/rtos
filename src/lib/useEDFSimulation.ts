import { useState, useEffect, useRef } from 'react';
import { TASKS, Task, AUTO_SUBMIT_TASK } from './constants';

interface ScheduledTask {
  task: Task;
  startTime: number;
  endTime: number;
  status: 'running' | 'completed' | 'missed';
}

export interface ReadyTask extends Task {
  absoluteDeadline: number;
  remainingTime: number;
  isLate?: boolean;
}

const AUTO_SUBMIT_TRIGGER_TIME = 20;
const TICK = 0.1;

export function useEDFSimulation() {
  const [time, setTime] = useState(0);
  const [schedule, setSchedule] = useState<ScheduledTask[]>([]);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [readyQueue, setReadyQueue] = useState<ReadyTask[]>([]);
  const [cpuUtilization, setCpuUtilization] = useState(0);
  const [taskDelays, setTaskDelays] = useState<Record<string, number>>({}); // Added delay in seconds
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(0.2); // Default 0.2x

  // Refs for simulation state
  const stateRef = useRef({
    jobs: [] as ReadyTask[],
    simTime: -TICK,
    schedule: [] as ScheduledTask[],
    delays: {} as Record<string, number>, // Ref copy of delays to access in interval
  });

  // Sync state delays to ref
  useEffect(() => {
    stateRef.current.delays = taskDelays;
  }, [taskDelays]);

  useEffect(() => {
    // Calculate theoretical utilization
    const util = TASKS.reduce((acc, task) => acc + (task.wcet / 1000) / task.period, 0);
    setCpuUtilization(util * 100);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPlaying) return;

      const currentState = stateRef.current;
      const prevSimTime = currentState.simTime;
      const currentSimTime = prevSimTime + TICK;
      currentState.simTime = currentSimTime;

      // 1. Release Periodic Tasks
      TASKS.forEach(task => {
        const prevPeriodCount = Math.floor((prevSimTime + 0.0001) / task.period);
        const currPeriodCount = Math.floor((currentSimTime + 0.0001) / task.period);

        if (currPeriodCount > prevPeriodCount) {
           const releaseTime = currPeriodCount * task.period;
           const absoluteDeadline = releaseTime + task.deadline;
           
           // Apply injected delay to WCET
           const addedDelay = currentState.delays[task.id] || 0;
           const actualDuration = (task.wcet / 1000) + addedDelay;

           currentState.jobs.push({
             ...task,
             absoluteDeadline,
             remainingTime: actualDuration
           });
        }
      });

      // 2. Release Aperiodic Auto-Submit Task
      if (prevSimTime < AUTO_SUBMIT_TRIGGER_TIME && currentSimTime >= AUTO_SUBMIT_TRIGGER_TIME) {
         const addedDelay = currentState.delays[AUTO_SUBMIT_TASK.id] || 0;
         currentState.jobs.push({
           ...AUTO_SUBMIT_TASK,
           absoluteDeadline: AUTO_SUBMIT_TRIGGER_TIME + 0.1, 
           remainingTime: (AUTO_SUBMIT_TASK.wcet / 1000) + addedDelay
         });
      }

      // 3. EDF Scheduling
      currentState.jobs.sort((a, b) => a.absoluteDeadline - b.absoluteDeadline);
      const jobToRun = currentState.jobs.length > 0 ? currentState.jobs[0] : null;

      // 4. Execute
      if (jobToRun) {
        jobToRun.remainingTime -= TICK;
        
        // Check for deadline miss
        const isLate = currentSimTime > jobToRun.absoluteDeadline;
        if (isLate) jobToRun.isLate = true;

        // Update Schedule (Gantt)
        const lastLog = currentState.schedule[currentState.schedule.length - 1];
        const isContiguous = lastLog && Math.abs(lastLog.endTime - prevSimTime) < 0.001;
        
        // Determine status
        const status = isLate ? 'missed' : 'running';

        if (lastLog && lastLog.task.id === jobToRun.id && lastLog.status === status && isContiguous) {
           lastLog.endTime = currentSimTime;
        } else {
           currentState.schedule.push({
             task: jobToRun,
             startTime: prevSimTime,
             endTime: currentSimTime,
             status: status
           });
           
           if (currentState.schedule.length > 500) currentState.schedule.shift();
        }

        if (jobToRun.remainingTime <= 0.0001) {
           currentState.jobs.shift(); 
        }
      }

      // 5. Update React State
      setTime(currentSimTime);
      setSchedule([...currentState.schedule]); 
      setActiveTask(jobToRun ? { ...jobToRun } : null);
      setReadyQueue([...currentState.jobs]);

    }, 100 / speed); // Dynamic interval based on speed (100ms base / speed factor)

    return () => clearInterval(interval);
  }, [isPlaying, speed]);

  return { time, schedule, activeTask, logs: [], cpuUtilization, readyQueue, setTaskDelays, taskDelays, isPlaying, setIsPlaying, speed, setSpeed };
}
