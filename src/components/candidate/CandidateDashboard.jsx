'use client';
import { useSelector, useDispatch } from 'react-redux';
import { setActiveExam } from '@/lib/store/slices/examsSlice';
import { Card, Badge, Button } from '@/components/ui';

function statusBadgeColor(status) {
  return { active: 'green', upcoming: 'amber', completed: 'blue' }[status] || 'accent';
}

function ExamCard({ exam, onStart }) {
  return (
    <Card>
      <div className="mb-3">
        <h3 className="text-[15px] font-semibold text-[#e2e8f0] mb-2">{exam.title}</h3>
        <Badge color={statusBadgeColor(exam.status)}>{exam.status}</Badge>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        {[
          { label: 'DURATION', value: `${exam.duration}m` },
          { label: 'QUESTIONS', value: exam.questions || '—' },
          {
            label: 'NEG MARK',
            value: exam.negativeMarking ? 'Yes' : 'No',
            color: exam.negativeMarking ? '#ef4444' : '#10b981',
          },
        ].map((s) => (
          <div key={s.label} className="bg-[#1e2535] rounded-lg p-3 text-center">
            <p className="text-[10px] text-[#4a5568] font-semibold tracking-wide mb-1">{s.label}</p>
            <p className="text-base font-bold" style={{ color: s.color || '#e2e8f0' }}>
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {exam.status === 'active' ? (
        <Button onClick={() => onStart(exam)} className="w-full justify-center">
          Start Exam →
        </Button>
      ) : (
        <p className="text-center text-xs text-[#4a5568] py-2">
          {exam.status === 'upcoming' ? 'Not available yet' : 'Exam has ended'}
        </p>
      )}
    </Card>
  );
}

export default function CandidateDashboard() {
  const dispatch = useDispatch();
  const exams = useSelector((s) => s.exams.list);
  const available = exams.filter((e) => e.status !== 'completed').length;

  return (
    <div className="fade-in flex-1 overflow-y-auto p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#e2e8f0]">My Exams</h1>
        <p className="text-sm text-[#8892a4] mt-1">{available} available assessments</p>
      </div>

      <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
        {exams.map((exam) => (
          <ExamCard
            key={exam.id}
            exam={exam}
            onStart={(e) => dispatch(setActiveExam(e))}
          />
        ))}
      </div>
    </div>
  );
}
