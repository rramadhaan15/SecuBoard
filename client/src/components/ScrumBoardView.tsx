import React from 'react';
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
      {/* Page Header */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wide text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
              Metodologi Penelitian (Bab 2.1.6 &amp; Bab 3.1)
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight font-sans">
            Framework Manajemen Pengujian Agile Scrum
          </h2>
          <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
            Pengujian kerentanan website Republika dikelola dalam 3 siklus Sprint iteratif: Mulai dari Spidering &amp; Deteksi Arsitektur, Pemindaian Aktif/Pasif OWASP ZAP, hingga Analisis Klasifikasi Risiko &amp; Mitigasi Patching.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center min-w-[95px]">
            <span className="text-xs text-slate-600 block font-semibold">Total Sprints</span>
            <p className="text-xl font-extrabold text-slate-900 font-mono">3 Sprints</p>
          </div>
          <div className="px-4 py-2.5 rounded-xl bg-blue-50 border border-blue-200 text-center min-w-[95px]">
            <span className="text-xs text-blue-700 font-bold block">Total Points</span>
            <p className="text-xl font-extrabold text-blue-700 font-mono">90 SP</p>
          </div>
        </div>
      </div>

      {/* Sprints 3-Column Kanban Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {sprints.map((sprint) => {
          const completionPercent = Math.round(
            (sprint.storyPointsCompleted / sprint.storyPointsTotal) * 100
          );

          let statusBadgeClass = 'bg-slate-100 text-slate-700 border-slate-200';
          if (sprint.status === 'Completed') {
            statusBadgeClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';
          } else if (sprint.status === 'In Progress' || sprint.status === 'Active') {
            statusBadgeClass = 'bg-blue-50 text-blue-700 border-blue-200';
          }

          return (
            <div
              key={sprint.id}
              className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs flex flex-col justify-between space-y-5 transition-all"
            >
              <div className="space-y-4">
                {/* Sprint Header */}
                <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-100">
                  <div>
                    <span className="text-xs font-mono font-bold text-blue-700">
                      SPRINT {sprint.number}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-0.5">
                      {sprint.name.replace(`Sprint ${sprint.number}: `, '')}
                    </h3>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded border ${statusBadgeClass}`}>
                    {sprint.status}
                  </span>
                </div>

                {/* Sprint Goal */}
                <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    Sprint Goal
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {sprint.goal}
                  </p>
                </div>

                {/* Dates & Story Points */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span className="text-xs text-slate-500 font-mono font-medium">
                      {sprint.startDate} &rarr; {sprint.endDate}
                    </span>
                    <span className="font-mono font-bold text-blue-700">
                      {sprint.storyPointsCompleted} / {sprint.storyPointsTotal} SP ({completionPercent}%)
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                    <div
                      className="h-full bg-blue-600 transition-all duration-300"
                      style={{ width: `${completionPercent}%` }}
                    ></div>
                  </div>
                </div>

                {/* Sprint Tasks List */}
                <div className="space-y-2.5 pt-1">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 uppercase tracking-wider">
                    <span>Sprint Backlog</span>
                    <span>Status Task</span>
                  </div>

                  <div className="space-y-2">
                    {sprint.tasks.map((task) => (
                      <div
                        key={task.id}
                        className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 text-xs transition-colors"
                      >
                        <div className="space-y-0.5 flex-1 min-w-0">
                          <span className="font-mono text-xs text-blue-700 font-bold">
                            {task.id} &bull; {task.points} SP
                          </span>
                          <p className="text-slate-900 truncate font-semibold">
                            {task.title}
                          </p>
                        </div>

                        <select
                          value={task.status}
                          onChange={(e) => onUpdateTaskStatus(sprint.id, task.id, e.target.value)}
                          className={`text-xs font-bold px-2.5 py-1 rounded-md border focus:outline-none transition-all text-center [text-align-last:center] cursor-pointer ${
                            task.status === 'Done' ? 'bg-emerald-50 border-emerald-300 text-emerald-800' :
                            task.status === 'In Progress' ? 'bg-blue-50 border-blue-300 text-blue-800' :
                            'bg-white border-slate-300 text-slate-700'
                          }`}
                        >
                          <option value="Todo" className="text-center">Todo</option>
                          <option value="In Progress" className="text-center">In Progress</option>
                          <option value="Done" className="text-center">Done</option>
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sprint Footer */}
              <div className="pt-3 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
                <span>Review &amp; Retrospektif</span>
                <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Terverifikasi
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Research Schedule Table: High contrast, easy to read */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Tabel 3.4 Jadwal Rencana Penelitian Tugas Akhir (April - Mei 2026)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Pelaksanaan studi kasus pada PT Republika Media Mandiri, Tebet, Jakarta Selatan
            </p>
          </div>
          <span className="text-xs font-mono text-blue-700 font-bold bg-blue-50 px-3 py-1 rounded-full border border-blue-200 self-start sm:self-auto">
            Status: Sesuai Target (On-Track)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-slate-200 rounded-lg overflow-hidden">
            <thead className="bg-slate-50 text-slate-800 font-bold border-b border-slate-200 text-center">
              <tr>
                <th className="py-3 px-4 text-left border-r border-slate-200 text-xs" rowSpan={2}>
                  Kegiatan Penelitian
                </th>
                <th className="py-2.5 px-2 border-r border-slate-200 text-xs" colSpan={4}>
                  Bulan April 2026 (Minggu Ke-)
                </th>
                <th className="py-2.5 px-2 text-xs" colSpan={4}>
                  Bulan Mei 2026 (Minggu Ke-)
                </th>
              </tr>
              <tr className="border-t border-slate-200 text-xs text-slate-600 font-semibold">
                <th className="py-2 border-r border-slate-200">1</th>
                <th className="py-2 border-r border-slate-200">2</th>
                <th className="py-2 border-r border-slate-200">3</th>
                <th className="py-2 border-r border-slate-200">4</th>
                <th className="py-2 border-r border-slate-200">1</th>
                <th className="py-2 border-r border-slate-200">2</th>
                <th className="py-2 border-r border-slate-200">3</th>
                <th className="py-2">4</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-center text-xs">
              {[
                { name: 'Wawancara & Observasi PT Republika', schedule: [1, 2, 0, 0, 0, 0, 0, 0] },
                { name: 'Identifikasi Masalah & Studi Literatur', schedule: [1, 2, 3, 0, 0, 0, 0, 0] },
                { name: 'Sprint 1: Spidering & Arsitektur', schedule: [0, 1, 2, 0, 0, 0, 0, 0] },
                { name: 'Sprint 2: OWASP ZAP Scanning (Active/Passive)', schedule: [0, 0, 1, 2, 0, 0, 0, 0] },
                { name: 'Sprint 3: Analisis Risiko & Mitigasi Patching', schedule: [0, 0, 0, 0, 1, 2, 0, 0] },
                { name: 'Penyusunan Dashboard BI & Laporan TA', schedule: [0, 0, 0, 1, 2, 3, 4, 0] },
              ].map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 text-left font-semibold text-slate-800 border-r border-slate-200">
                    {row.name}
                  </td>
                  {row.schedule.map((val, colIdx) => (
                    <td
                      key={colIdx}
                      className={`py-3 border-r border-slate-200 font-mono ${colIdx === 7 ? 'border-r-0' : ''} ${
                        val > 0 ? 'bg-blue-50 text-blue-700 font-extrabold text-sm' : 'text-slate-300'
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
