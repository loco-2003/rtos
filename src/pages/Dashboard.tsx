import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import React from 'react';

export default function Dashboard() {
  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <h1 className="text-4xl font-bold mb-4 font-mono">Real-Time Online Examination System</h1>
        <p className="text-lg text-[#141414]/60 max-w-2xl">
          A simulation of an RTOS-based exam platform ensuring synchronized question release, 
          auto-submission, and cheating detection using Earliest Deadline First (EDF) scheduling.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <Card title="System Architecture">
          <div className="relative p-4 bg-white rounded-lg border border-black/5 aspect-video flex items-center justify-center">
            {/* Simple SVG Diagram */}
            <svg viewBox="0 0 400 250" className="w-full h-full">
              <rect x="120" y="10" width="160" height="40" rx="4" fill="#f3f4f6" stroke="#000" strokeWidth="1.5" />
              <text x="200" y="35" textAnchor="middle" fontSize="10" fontFamily="monospace">Exam Control Server</text>
              
              <rect x="20" y="100" width="100" height="40" rx="4" fill="#f3f4f6" stroke="#000" strokeWidth="1.5" />
              <text x="70" y="125" textAnchor="middle" fontSize="10" fontFamily="monospace">Student Client</text>
              
              <rect x="150" y="100" width="100" height="40" rx="4" fill="#f3f4f6" stroke="#000" strokeWidth="1.5" />
              <text x="200" y="125" textAnchor="middle" fontSize="10" fontFamily="monospace">Proctoring Unit</text>
              
              <rect x="280" y="100" width="100" height="40" rx="4" fill="#f3f4f6" stroke="#000" strokeWidth="1.5" />
              <text x="330" y="125" textAnchor="middle" fontSize="10" fontFamily="monospace">Auto Submit</text>
              
              <rect x="150" y="180" width="100" height="40" rx="4" fill="#f3f4f6" stroke="#000" strokeWidth="1.5" />
              <text x="200" y="205" textAnchor="middle" fontSize="10" fontFamily="monospace">Sync Manager</text>

              {/* Arrows */}
              <path d="M200 50 L70 100" stroke="#000" strokeWidth="1" markerEnd="url(#arrow)" />
              <path d="M200 50 L200 100" stroke="#000" strokeWidth="1" markerEnd="url(#arrow)" />
              <path d="M200 50 L330 100" stroke="#000" strokeWidth="1" markerEnd="url(#arrow)" />
              
              <path d="M70 140 L200 180" stroke="#000" strokeWidth="1" markerEnd="url(#arrow)" />
              <path d="M200 140 L200 180" stroke="#000" strokeWidth="1" markerEnd="url(#arrow)" />
              <path d="M330 140 L200 180" stroke="#000" strokeWidth="1" markerEnd="url(#arrow)" />

              <defs>
                <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
                  <path d="M0,0 L0,6 L9,3 z" fill="#000" />
                </marker>
              </defs>
            </svg>
          </div>
        </Card>

        <Card title="Task Model Specifications">
          <div className="overflow-hidden rounded-lg border border-black/10">
            <table className="w-full text-sm text-left">
              <thead className="bg-black/5 font-mono text-xs uppercase">
                <tr>
                  <th className="p-3">Task</th>
                  <th className="p-3">Period</th>
                  <th className="p-3">WCET</th>
                  <th className="p-3">Type</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 bg-white">
                <tr>
                  <td className="p-3 font-medium">Clock Sync</td>
                  <td className="p-3 font-mono">1s</td>
                  <td className="p-3 font-mono">100ms</td>
                  <td className="p-3"><Badge type="Hard" /></td>
                </tr>
                <tr>
                  <td className="p-3 font-medium">Timer Update</td>
                  <td className="p-3 font-mono">1s</td>
                  <td className="p-3 font-mono">50ms</td>
                  <td className="p-3"><Badge type="Soft" /></td>
                </tr>
                <tr>
                  <td className="p-3 font-medium">Cheating Detect</td>
                  <td className="p-3 font-mono">2s</td>
                  <td className="p-3 font-mono">400ms</td>
                  <td className="p-3"><Badge type="Soft" /></td>
                </tr>
                <tr>
                  <td className="p-3 font-medium">Logging</td>
                  <td className="p-3 font-mono">5s</td>
                  <td className="p-3 font-mono">200ms</td>
                  <td className="p-3"><Badge type="Soft" /></td>
                </tr>
                <tr>
                  <td className="p-3 font-medium">Auto Submit</td>
                  <td className="p-3 font-mono">-</td>
                  <td className="p-3 font-mono">150ms</td>
                  <td className="p-3"><Badge type="Hard" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <div className="border-t border-black/10 pt-8">
        <h3 className="font-mono text-sm uppercase text-black/50 mb-4">Project Team</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {['Anjana M', 'Ansaba Shirin K', 'Hana Nasarath Hakkim', 'Keerthana N', 'Jostin Jaison'].map((name) => (
            <div key={name} className="p-3 bg-white rounded border border-black/5 text-sm font-medium text-center">
              {name}
            </div>
          ))}
        </div>
        <p className="text-center mt-8 text-xs text-black/40 font-mono">
          NSS COLLEGE OF ENGINEERING, PALAKKAD | March 1, 2026
        </p>
      </div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h2 className="font-mono text-sm font-bold uppercase tracking-wider opacity-70 border-l-2 border-black pl-3">
        {title}
      </h2>
      {children}
    </div>
  );
}

function Badge({ type }: { type: 'Hard' | 'Soft' }) {
  return (
    <span className={cn(
      "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider",
      type === 'Hard' ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"
    )}>
      {type}
    </span>
  );
}
