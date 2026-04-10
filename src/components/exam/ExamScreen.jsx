'use client';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { clearActiveExam } from '@/lib/store/slices/examsSlice';
import { useExamAnswers, useBehaviorTracking } from '@/lib/hooks';
import { MOCK_QUESTIONS } from '@/lib/mock-data';
import { Card, Button, Badge } from '@/components/ui';
import ExamTimer from './ExamTimer';

function WarningBanner({ warnings, onDismiss }) {
  if (!warnings.length) return null;
  return (
    <div className="flex flex-col gap-1">
      {warnings.map((w) => (
        <div
          key={w.id}
          className="flex justify-between items-center bg-red-500/10 border-b border-red-500/20 text-red-400 px-6 py-2 text-sm font-medium"
        >
          {w.message}
          <button
            onClick={() => onDismiss(w.id)}
            className="ml-4 text-red-400 bg-transparent border-none cursor-pointer"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}

function QuestionNavPalette({ questions, current, setCurrent, isAnswered }) {
  return (
    <aside className="w-[180px] bg-[#161b27] border-r border-white/10 overflow-y-auto p-4 flex-shrink-0">
      <p className="text-[11px] text-[#4a5568] mb-3 font-semibold tracking-wide uppercase">
        {questions.filter((_, i) => isAnswered(i)).length}/{questions.length} answered
      </p>
      <div className="grid grid-cols-4 gap-1.5">
        {questions.map((_, i) => {
          const answered = isAnswered(i);
          return (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-8 h-8 rounded-md text-[13px] font-medium transition-all border-none cursor-pointer ${
                current === i
                  ? 'bg-[#6c63ff] text-white'
                  : answered
                  ? 'bg-[rgba(16,185,129,0.12)] text-[#10b981]'
                  : 'bg-[#1e2535] text-[#8892a4] hover:bg-white/10'
              }`}
            >
              {i + 1}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-col gap-1.5">
        {[
          { color: 'bg-[#6c63ff]', label: 'Current' },
          { color: 'bg-[rgba(16,185,129,0.12)]', label: 'Answered', textColor: 'text-[#10b981]' },
          { color: 'bg-[#1e2535]', label: 'Not answered' },
        ].map((l) => (
          <div key={l.label} className="flex items-center gap-1.5">
            <div className={`w-3 h-3 rounded-sm ${l.color}`} />
            <span className="text-[11px] text-[#4a5568]">{l.label}</span>
          </div>
        ))}
      </div>
    </aside>
  );
}

function QuestionPanel({ question, qIndex, answers, setRadio, toggleCheckbox, setText }) {
  const ans = answers[qIndex];

  return (
    <div className="flex-1 overflow-y-auto p-8 max-w-[720px] mx-auto w-full">
      <Card className="mb-4">
        <div className="flex items-center gap-2 mb-4">
          <Badge color="accent">{question.type}</Badge>
          {question.type !== 'text' && (
            <span className="text-xs text-[#8892a4]">
              {question.type === 'checkbox' ? 'Select all that apply' : 'Select one option'}
            </span>
          )}
        </div>

        <h2 className="text-base font-semibold text-[#e2e8f0] leading-relaxed mb-6">
          {qIndex + 1}. {question.title}
        </h2>

        {question.type === 'text' ? (
          <textarea
            value={ans || ''}
            onChange={(e) => setText(qIndex, e.target.value)}
            placeholder="Type your answer here..."
            className="w-full bg-[#1e2535] border border-white/10 rounded-xl px-4 py-3 text-sm text-[#e2e8f0] outline-none focus:border-[#6c63ff] transition-colors placeholder:text-[#4a5568] resize-y min-h-[140px] font-sans"
          />
        ) : (
          <div className="flex flex-col gap-2.5">
            {question.options.map((opt, i) => {
              const selected =
                question.type === 'checkbox'
                  ? (ans || []).includes(i)
                  : ans === i;

              return (
                <div
                  key={i}
                  onClick={() => {
                    if (question.type === 'radio') setRadio(qIndex, i);
                    else toggleCheckbox(qIndex, i);
                  }}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 cursor-pointer transition-all duration-150 ${
                    selected
                      ? 'bg-[rgba(108,99,255,0.12)] border border-[#6c63ff]'
                      : 'bg-[#1e2535] border border-transparent hover:border-white/15'
                  }`}
                >
                  <div
                    className={`w-5 h-5 flex-shrink-0 flex items-center justify-center transition-all ${
                      question.type === 'checkbox' ? 'rounded' : 'rounded-full'
                    } border-2 ${selected ? 'border-[#6c63ff] bg-[#6c63ff]' : 'border-[#4a5568] bg-transparent'}`}
                  >
                    {selected && (
                      <span className="text-white text-[10px] font-bold">
                        {question.type === 'checkbox' ? '✓' : '●'}
                      </span>
                    )}
                  </div>
                  <span className={`text-sm ${selected ? 'text-[#e2e8f0]' : 'text-[#8892a4]'}`}>{opt}</span>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}

function ResultScreen({ answeredCount, totalCount, tabSwitches, onFinish }) {
  const score = Math.min(100, Math.round((answeredCount / totalCount) * 85 + 10));
  const color = score >= 70 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444';
  return (
    <div className="fade-in min-h-screen bg-[#0f1117] flex items-center justify-center flex-col gap-5 p-8">
      <div className="text-5xl">🏆</div>
      <h2 className="text-2xl font-bold text-[#e2e8f0]">Exam Submitted!</h2>
      <Card className="text-center min-w-[260px]">
        <p className="text-5xl font-black mb-2" style={{ color }}>{score}%</p>
        <p className="text-sm text-[#8892a4]">
          {answeredCount} of {totalCount} questions answered
        </p>
        {tabSwitches > 0 && (
          <p className="text-xs text-[#ef4444] mt-2">Tab switches detected: {tabSwitches}</p>
        )}
      </Card>
      <Button onClick={onFinish}>Back to Dashboard</Button>
    </div>
  );
}

export default function ExamScreen({ exam }) {
  const dispatch = useDispatch();
  const questions = MOCK_QUESTIONS[exam.id] || MOCK_QUESTIONS[1] || [];
  const [current, setCurrent] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const { answers, setRadio, toggleCheckbox, setText, isAnswered, answeredCount } = useExamAnswers(questions);
  const { warnings, tabSwitchCount, dismissWarning } = useBehaviorTracking();

  function submit() { setSubmitted(true); }
  function finish() { dispatch(clearActiveExam()); }

  if (submitted) {
    return (
      <ResultScreen
        answeredCount={answeredCount}
        totalCount={questions.length}
        tabSwitches={tabSwitchCount.current}
        onFinish={finish}
      />
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#0f1117]">
      {/* Header */}
      <header className="bg-[#161b27] border-b border-white/10 px-6 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <h1 className="text-sm font-semibold text-[#e2e8f0]">{exam.title}</h1>
          <span className="text-xs text-[#4a5568]">
            Q{current + 1}/{questions.length}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <ExamTimer totalSeconds={exam.duration * 60} onTimeout={submit} />
          <Button onClick={submit} variant="success" size="sm">
            Submit Exam
          </Button>
        </div>
      </header>

      {/* Warning banners */}
      <WarningBanner warnings={warnings} onDismiss={dismissWarning} />

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        <QuestionNavPalette
          questions={questions}
          current={current}
          setCurrent={setCurrent}
          isAnswered={isAnswered}
        />

        <div className="flex-1 flex flex-col overflow-y-auto">
          <QuestionPanel
            key={current}
            question={questions[current]}
            qIndex={current}
            answers={answers}
            setRadio={setRadio}
            toggleCheckbox={toggleCheckbox}
            setText={setText}
          />

          {/* Navigation */}
          <div className="flex justify-between px-8 pb-6 max-w-[720px] mx-auto w-full">
            <Button
              variant="ghost"
              onClick={() => setCurrent((c) => Math.max(0, c - 1))}
              disabled={current === 0}
            >
              ← Prev
            </Button>
            {current < questions.length - 1 ? (
              <Button onClick={() => setCurrent((c) => c + 1)}>Next →</Button>
            ) : (
              <Button variant="success" onClick={submit}>Submit Exam</Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
