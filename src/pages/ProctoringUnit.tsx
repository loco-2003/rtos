import React from 'react';
import { Shield, User, AlertTriangle } from 'lucide-react';

const STUDENTS = [
  { id: 1, name: 'Anjana M', status: 'Active', warnings: 0, progress: 45 },
  { id: 2, name: 'Ansaba Shirin K', status: 'Active', warnings: 1, progress: 30 },
  { id: 3, name: 'Hana Nasarath', status: 'Idle', warnings: 0, progress: 60 },
];

export default function ProctoringUnit() {
  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <header className="mb-6 md:mb-8">
        <h1 className="text-xl md:text-2xl font-bold font-mono uppercase tracking-tight mb-2">Proctoring Unit</h1>
        <p className="text-sm md:text-base text-black/60">Live monitoring of student clients via AI detection module.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {STUDENTS.map(student => (
          <React.Fragment key={student.id}>
            <StudentCard student={student} />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

interface Student {
  id: number;
  name: string;
  status: string;
  warnings: number;
  progress: number;
}

function StudentCard({ student }: { student: Student }) {
  const isWarning = student.warnings > 0;
  const isDisconnected = student.status === 'Disconnected';

  return (
    <div className={`bg-white rounded-xl border ${isWarning ? 'border-red-200' : 'border-black/10'} p-5 shadow-sm relative overflow-hidden`}>
      {isDisconnected && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-[1px] flex items-center justify-center z-10">
          <div className="bg-black/80 text-white px-3 py-1 rounded-full text-xs font-mono">OFFLINE</div>
        </div>
      )}
      
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
            <User size={20} className="text-black/40" />
          </div>
          <div>
            <h3 className="font-bold text-sm">{student.name}</h3>
            <div className="flex items-center gap-1.5">
              <div className={`w-1.5 h-1.5 rounded-full ${student.status === 'Active' ? 'bg-green-500' : 'bg-amber-500'}`} />
              <span className="text-xs text-black/50">{student.status}</span>
            </div>
          </div>
        </div>
        {student.warnings > 0 && (
          <div className="flex items-center gap-1 text-red-600 bg-red-50 px-2 py-1 rounded text-xs font-bold">
            <AlertTriangle size={12} />
            {student.warnings}
          </div>
        )}
      </div>

      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-black/40">Exam Progress</span>
            <span className="font-mono">{student.progress}%</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-black rounded-full" 
              style={{ width: `${student.progress}%` }} 
            />
          </div>
        </div>

        <div className="pt-3 border-t border-black/5 flex justify-between items-center">
          <div className="flex gap-2">
            <StatusBadge label="Cam" active={true} />
            <StatusBadge label="Mic" active={true} />
            <StatusBadge label="Screen" active={true} />
          </div>
          <Shield size={14} className="text-black/20" />
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ label, active }: { label: string; active: boolean }) {
  return (
    <div className={`px-1.5 py-0.5 rounded text-[10px] font-mono uppercase ${active ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
      {label}
    </div>
  );
}
