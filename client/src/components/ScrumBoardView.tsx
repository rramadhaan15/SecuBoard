import React from 'react';
import { 
  Layers, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Target, 
  Award, 
  ArrowRight,
  TrendingUp,
  FileCheck2,
  Sparkles
} from 'lucide-react';
import { Sprint } from '../types';

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
      <div className="relative overflow-hidden rounded-2xl bg-[#0c1322] border border-[#17233d] p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
              Metodologi Penelitian (Bab 2.1.6 &amp; Bab 3.1)
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
            Framework Manajemen Pengujian Agile Scrum
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Pengujian kerentanan website Republika dikelola dalam 3 siklus Sprint iteratif: Mulai dari Spidering &amp; Deteksi Arsitektur, Pemindaian Aktif/Pasif OWASP ZAP, hingga Analisis Klasifikasi Risiko &amp; Mitigasi Patching.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <div className="px-4 py-2.5 rounded-xl bg-[#080c14] border border-[#17233d] text-center min-w-[90px]">
            <span className="text-[11px] text-slate-400 block">Total Sprints</span>
            <p className="text-lg font-bold text-white font-mono">3 Sprints</p>
          </div>
          <div className="px-4 py-2.5 rounded-xl bg-cyan-950/60 border border-cyan-800 text-center min-w-[90px]">
            <span className="text-[11px] text-cyan-400 font-semibold block">Total Points</span>
            <p className="text-lg font-bold text-cyan-300 font-mono">90 SP</p>
          </div>
        </div>
      </div>

      {/* Sprints 3-Column Kanban Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {sprints.map((sprint) => {
          const completionPercent = Math.round(
            (sprint.storyPointsCompleted / sprint.storyPointsTotal) * 100
          );

          let statusBadgeClass = 'bg-[#17233d] text-slate-300 border-[#253a63]';
          if (sprint.status === 'Completed') {
            statusBadgeClass = 'bg-emerald-950/80 text-emerald-400 border-emerald-800';
          } else if (sprint.status === 'In Progress' || sprint.status === 'Active') {
            statusBadgeClass = 'bg-cyan-950/80 text-cyan-400 border-cyan-800';
          }

          return (
            <div
              key={sprint.id}
              className="bg-[#0c1322] border border-[#17233d] hover:border-cyan-500/40 rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-5 transition-all duration-200"
            >
              <div className="space-y-4">
                {/* Sprint Header */}
                <div className="flex items-start justify-between gap-2 pb-3 border-b border-[#17233d]">
                  <div>
                    <span className="text-xs font-mono font-bold text-cyan-400">
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
                <div className="p-3.5 rounded-xl bg-[#080c14] border border-[#17233d] space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Sprint Goal:
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {sprint.goal}
                  </p>
                </div>

                {/* Dates & Story Points */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1 text-[11px]">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {sprint.startDate} &rarr; {sprint.endDate}
                    </span>
                    <span className="font-mono font-bold text-cyan-400">
                      {sprint.storyPointsCompleted} / {sprint.storyPointsTotal} SP ({completionPercent}%)
                    </span>
                  </div>

                  {/* Progress Bar with Cyan Gradient */}
                  <div className="w-full h-2 rounded-full bg-[#080c14] overflow-hidden border border-[#17233d]">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300"
                      style={{ width: `${completionPercent}%` }}
                    ></div>
                  </div>
                </div>

                {/* Sprint Tasks List */}
                <div className="space-y-2.5 pt-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <span>Sprint Backlog:</span>
                    <span>Status Task</span>
                  </div>

                  <div className="space-y-2">
                    {sprint.tasks.map((task) => (
                      <div
                        key={task.id}
                        className="p-3 rounded-xl bg-[#080c14] border border-[#17233d] hover:border-[#253a63] flex items-center justify-between gap-3 text-xs transition-colors"
                      >
                        <div className="space-y-0.5 flex-1 min-w-0">
                          <span className="font-mono text-[10px] text-cyan-400">
                            {task.id} &bull; {task.points} SP
                          </span>
                          <p className="text-slate-200 truncate font-semibold">
                            {task.title}
                          </p>
                        </div>

                        <select
                          value={task.status}
                          onChange={(e) => onUpdateTaskStatus(sprint.id, task.id, e.target.value)}
                          className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border focus:outline-none transition-all ${
                            task.status === 'Done' ? 'bg-emerald-950 border-emerald-800 text-emerald-300' :
                            task.status === 'In Progress' ? 'bg-cyan-950 border-cyan-800 text-cyan-300' :
                            'bg-[#17233d] border-[#253a63] text-slate-400'
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

              {/* Sprint Footer */}
              <div className="pt-3 border-t border-[#17233d] text-[11px] text-slate-400 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <FileCheck2 className="w-3.5 h-3.5 text-slate-400" />
                  Review &amp; Retrospektif
                </span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Terverifikasi
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Research Schedule Table (Tabel 3.4 Jadwal Rencana Penelitian) */}
      <div className="bg-[#0c1322] border border-[#17233d] rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#17233d]">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-cyan-400" />
              Tabel 3.4 Jadwal Rencana Penelitian Tugas Akhir (April - Mei 2026)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Pelaksanaan studi kasus pada PT Republika Media Mandiri, Tebet, Jakarta Selatan
            </p>
          </div>
          <span className="text-xs font-mono text-cyan-400 font-semibold bg-cyan-950 px-3 py-1 rounded-full border border-cyan-800 self-start sm:self-auto">
            Jadwal: Sesuai Target (On-Track)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-[#17233d] rounded-xl overflow-hidden">
            <thead className="bg-[#080c14] text-slate-300 font-semibold border-b border-[#17233d] text-center">
              <tr>
                <th className="py-3 px-4 text-left border-r border-[#17233d]" rowSpan={2}>
                  Kegiatan Penelitian
                </th>
                <th className="py-2 px-2 border-r border-[#17233d]" colSpan={4}>
                  Bulan April 2026 (Minggu Ke-)
                </th>
                <th className="py-2 px-2" colSpan={4}>
                  Bulan Mei 2026 (Minggu Ke-)
                </th>
              </tr>
              <tr className="border-t border-[#17233d] text-[11px] text-slate-400">
                <th className="py-1.5 border-r border-[#17233d]">1</th>
                <th className="py-1.5 border-r border-[#17233d]">2</th>
                <th className="py-1.5 border-r border-[#17233d]">3</th>
                <th className="py-1.5 border-r border-[#17233d]">4</th>
                <th className="py-1.5 border-r border-[#17233d]">1</th>
                <th className="py-1.5 border-r border-[#17233d]">2</th>
                <th className="py-1.5 border-r border-[#17233d]">3</th>
                <th className="py-1.5">4</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#17233d] text-center text-[11px]">
              {[
                { name: 'Wawancara & Observasi PT Republika', schedule: [1, 2, 0, 0, 0, 0, 0, 0] },
                { name: 'Identifikasi Masalah & Studi Literatur', schedule: [1, 2, 3, 0, 0, 0, 0, 0] },
                { name: 'Sprint 1: Spidering & Arsitektur', schedule: [0, 1, 2, 0, 0, 0, 0, 0] },
                { name: 'Sprint 2: OWASP ZAP Scanning (Active/Passive)', schedule: [0, 0, 1, 2, 0, 0, 0, 0] },
                { name: 'Sprint 3: Analisis Risiko & Mitigasi Patching', schedule: [0, 0, 0, 0, 1, 2, 0, 0] },
                { name: 'Penyusunan Dashboard BI & Laporan TA', schedule: [0, 0, 0, 1, 2, 3, 4, 0] },
              ].map((row, idx) => (
                <tr key={idx} className="hover:bg-[#111a2e]/60 transition-colors">
                  <td className="py-2.5 px-4 text-left font-medium text-slate-200 border-r border-[#17233d]">
                    {row.name}
                  </td>
                  {row.schedule.map((val, colIdx) => (
                    <td
                      key={colIdx}
                      className={`py-2.5 border-r border-[#17233d] ${colIdx === 7 ? 'border-r-0' : ''} ${
                        val > 0 ? 'bg-cyan-950/50 text-cyan-300 font-bold' : 'text-slate-700'
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
