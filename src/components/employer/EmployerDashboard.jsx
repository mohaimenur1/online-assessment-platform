'use client';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Card, Badge, Button, StatCard, Modal, Avatar } from '@/components/ui';
import { MOCK_CANDIDATES } from '@/lib/mock-data';

function statusColor(status) {
  return { active: 'green', upcoming: 'amber', completed: 'blue' }[status] || 'accent';
}

function ExamCard({ exam, onViewCandidates }) {
  return (
    <Card>
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-[15px] font-semibold text-[#e2e8f0] leading-snug flex-1 mr-3">{exam.title}</h3>
        <Badge color={statusColor(exam.status)}>{exam.status}</Badge>
      </div>

      <div className="grid grid-cols-2 gap-2.5 mb-4">
        {[
          { label: 'CANDIDATES', value: exam.candidates },
          { label: 'SLOTS', value: exam.slots },
          { label: 'QUESTION SETS', value: exam.questionSets },
          { label: 'DURATION', value: `${exam.duration}m` },
        ].map((s) => (
          <div key={s.label} className="bg-[#1e2535] rounded-lg p-3">
            <p className="text-[10px] text-[#4a5568] font-semibold mb-1 tracking-wide">{s.label}</p>
            <p className="text-lg font-bold text-[#e2e8f0]">{s.value}</p>
          </div>
        ))}
      </div>

      <Button onClick={() => onViewCandidates(exam)} size="sm" className="w-full justify-center">
        View Candidates
      </Button>
    </Card>
  );
}

function CandidatesModal({ exam, onClose }) {
  const candidates = MOCK_CANDIDATES.filter((c) => c.examId === exam.id);
  const scoreColor = (s) => (s >= 80 ? '#10b981' : s >= 60 ? '#f59e0b' : '#ef4444');

  return (
    <Modal title={`Candidates — ${exam.title}`} onClose={onClose} width={580}>
      {candidates.length === 0 ? (
        <p className="text-center text-[#4a5568] py-8 text-sm">No candidates for this exam yet.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {candidates.map((c) => (
            <div
              key={c.id}
              className="flex items-center justify-between bg-[#1e2535] rounded-xl px-4 py-3 gap-3"
            >
              <div className="flex items-center gap-3">
                <Avatar name={c.name} size="sm" />
                <div>
                  <p className="text-sm font-medium text-[#e2e8f0]">{c.name}</p>
                  <p className="text-xs text-[#8892a4]">{c.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {c.score !== null && (
                  <span className="text-sm font-bold" style={{ color: scoreColor(c.score) }}>
                    {c.score}%
                  </span>
                )}
                <Badge
                  color={
                    c.status === 'completed' ? 'green' : c.status === 'in-progress' ? 'amber' : 'accent'
                  }
                >
                  {c.status}
                </Badge>
                <span className="text-xs text-[#4a5568]">{c.time}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
}

export default function EmployerDashboard({ setPage }) {
  const exams = useSelector((s) => s.exams.list);
  const [viewExam, setViewExam] = useState(null);

  const active = exams.filter((e) => e.status === 'active').length;
  const totalCandidates = exams.reduce((a, e) => a + e.candidates, 0);

  return (
    <div className="fade-in flex-1 overflow-y-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#e2e8f0]">Dashboard</h1>
          <p className="text-sm text-[#8892a4] mt-1">Manage your online assessments</p>
        </div>
        <Button onClick={() => setPage('create')}>+ Create Test</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        <StatCard label="Total Exams" value={exams.length} icon="📋" />
        <StatCard label="Active" value={active} icon="🟢" />
        <StatCard label="Total Candidates" value={totalCandidates} icon="👥" />
        <StatCard label="Avg Duration" value="86m" icon="⏱" />
      </div>

      <h2 className="text-base font-semibold text-[#e2e8f0] mb-3">All Tests</h2>
      <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
        {exams.map((exam) => (
          <ExamCard key={exam.id} exam={exam} onViewCandidates={setViewExam} />
        ))}
      </div>

      {viewExam && <CandidatesModal exam={viewExam} onClose={() => setViewExam(null)} />}
    </div>
  );
}
