import React from 'react';
import { 
  CheckCircle, 
  Clock, 
  Calendar, 
  Layers, 
  TrendingUp, 
  GitBranch, 
  ListTodo, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Sprint, SprintTask } from '../types';

interface ScrumBoardViewProps {
  sprints: Sprint[];
  onUpdateTaskStatus: (sprintId: string, taskId: string, status: string) => void;
}

export const ScrumBoardView: React.FC<ScrumBoardViewProps> = ({
  sprints,
  onUpdateTaskStatus,
}) => {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
              Metodologi Penelitian (Bab 2.1.6 &amp; Bab 3.1)
            </span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">
            Framework Manajemen Pengujian Agile Scrum
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Pengujian kerentanan website Republika dikelola dalam 3 siklus Sprint iteratif: Mulai dari Spidering &amp; Deteksi Arsitektur, Pemindaian Aktif/Pasif OWASP ZAP, hingga Analisis Klasifikasi Risiko &amp; Mitigasi.
          </p>
        </div>

        {/* Sprint Summary Pill */}
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-center min-w-[90px]">
            <span className="text-xs text-slate-400">Total Sprints</span>
            <p className="text-lg font-extrabold text-white">3 Sprints</p>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-cyan-950/40 border border-cyan-800/60 text-center min-w-[90px]">
            <span className="text-xs text-cyan-400 font-semibold">Total Points</span>
            <p className="text-lg font-extrabold text-cyan-400">90 SP</p>
          </div>
        </div>
      </div>

      {/* Sprints 3-Column Kanban Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {sprints.map((sprint) => {
          const completionPercent = Math.round(
            (sprint.storyPointsCompleted / sprint.storyPointsTotal) * 100
          );

          let statusBadgeClass = 'bg-slate-800 text-slate-300 border-slate-700';
          if (sprint.status === 'Completed') {
            statusBadgeClass = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
          } else if (sprint.status === 'In Progress' || sprint.status === 'Active') {
            statusBadgeClass = 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30 animate-pulse';
          }

          return (
            <div
              key={sprint.id}
              className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {/* Sprint Header */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-xs font-mono font-bold text-slate-400">
                      SPRINT {sprint.number}
                    </span>
                    <h3 className="text-base font-bold text-white mt-0.5">
                      {sprint.name.replace(`Sprint ${sprint.number}: `, '')}
                    </h3>
                  </div>
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${statusBadgeClass}`}>
                    {sprint.status}
                  </span>
                </div>

                {/* Sprint Goal */}
                <p className="text-xs text-slate-300 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80 leading-relaxed">
                  <strong>Tujuan:</strong> {sprint.goal}
                </p>

                {/* Dates & Story Points Progress */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      {sprint.startDate} s/d {sprint.endDate}
                    </span>
                    <span className="font-mono font-bold text-cyan-400">
                      {sprint.storyPointsCompleted} / {sprint.storyPointsTotal} SP ({completionPercent}%)
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-300"
                      style={{ width: `${completionPercent}%` }}
                    ></div>
                  </div>
                </div>

                {/* Sprint Tasks List */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <ListTodo className="w-3.5 h-3.5" />
                      Sprint Backlog &amp; Checklist:
                    </span>
                    <span>Status</span>
                  </div>

                  <div className="space-y-2">
                    {sprint.tasks.map((task) => (
                      <div
                        key={task.id}
                        className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80 flex items-center justify-between gap-2 text-xs"
                      >
                        <div className="space-y-0.5 flex-1 min-w-0">
                          <span className="font-mono text-[10px] text-slate-500">
                            {task.id} ({task.points} SP)
                          </span>
                          <p className="text-slate-200 truncate font-medium">
                            {task.title}
                          </p>
                        </div>

                        <select
                          value={task.status}
                          onChange={(e) => onUpdateTaskStatus(sprint.id, task.id, e.target.value)}
                          className={`text-[11px] font-semibold px-2 py-1 rounded border focus:outline-none ${
                            task.status === 'Done' ? 'bg-emerald-950/80 border-emerald-700 text-emerald-300' :
                            task.status === 'In Progress' ? 'bg-blue-950/80 border-blue-700 text-blue-300' :
                            'bg-slate-900 border-slate-700 text-slate-400'
                          }`}
                        >
                          <option value="Todo">Todo</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Done">Done</option>
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sprint Footer Note */}
              <div className="pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Evaluasi Sprint Review &amp; Retro</span>
                <span className="text-emerald-400 font-medium flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Terverifikasi
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Research Schedule Timeline (Tabel 3.4 Jadwal Penelitian) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-cyan-400" />
              Tabel 3.4 Jadwal Rencana Penelitian Tugas Akhir (April - Mei 2026)
            </h3>
            <p className="text-xs text-slate-400">
              Pelaksanaan pada PT Republika Media Mandiri, Tebet, Jakarta Selatan
            </p>
          </div>
          <span className="text-xs font-mono text-cyan-400 font-bold bg-cyan-950 px-2.5 py-1 rounded border border-cyan-800">
            Jadwal: Sesuai Target
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-slate-800">
            <thead className="bg-slate-950 text-slate-300 font-semibold border-b border-slate-800 text-center">
              <tr>
                <th className="py-2.5 px-3 text-left border-r border-slate-800" rowSpan={2}>
                  Kegiatan Penelitian
                </th>
                <th className="py-1 px-2 border-r border-slate-800" colSpan={4}>
                  Bulan April 2026 (Minggu Ke-)
                </th>
                <th className="py-1 px-2" colSpan={4}>
                  Bulan Mei 2026 (Minggu Ke-)
                </th>
              </tr>
              <tr className="border-t border-slate-800 text-[11px] text-slate-400">
                <th className="py-1 border-r border-slate-800">1</th>
                <th className="py-1 border-r border-slate-800">2</th>
                <th className="py-1 border-r border-slate-800">3</th>
                <th className="py-1 border-r border-slate-800">4</th>
                <th className="py-1 border-r border-slate-800">1</th>
                <th className="py-1 border-r border-slate-800">2</th>
                <th className="py-1 border-r border-slate-800">3</th>
                <th className="py-1">4</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-center text-[11px]">
              {[
                { name: 'Wawancara & Observasi PT Republika', schedule: [1, 2, 0, 0, 0, 0, 0, 0] },
                { name: 'Identifikasi Masalah & Studi Literatur', schedule: [1, 2, 3, 0, 0, 0, 0, 0] },
                { name: 'Sprint 1: Spidering & Arsitektur', schedule: [0, 1, 2, 0, 0, 0, 0, 0] },
                { name: 'Sprint 2: OWASP ZAP Scanning (Active/Passive)', schedule: [0, 0, 1, 2, 0, 0, 0, 0] },
                { name: 'Sprint 3: Analisis Risiko & Mitigasi Patching', schedule: [0, 0, 0, 0, 1, 2, 0, 0] },
                { name: 'Penyusunan Dashboard BI & Laporan TA', schedule: [0, 0, 0, 1, 2, 3, 4, 0] },
              ].map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-800/30">
                  <td className="py-2 px-3 text-left font-medium text-slate-200 border-r border-slate-800">
                    {row.name}
                  </td>
                  {row.schedule.map((val, colIdx) => (
                    <td
                      key={colIdx}
                      className={`py-2 border-r border-slate-800 ${colIdx === 7 ? 'border-r-0' : ''} ${
                        val > 0 ? 'bg-cyan-600/30 text-cyan-300 font-bold' : 'text-slate-700'
                      }`}
                    >
                      {val > 0 ? '✓' : '-'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
