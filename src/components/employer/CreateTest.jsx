'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { addExam } from '@/lib/store/slices/examsSlice';
import { Card, Button, Modal } from '@/components/ui';

// ─── Validation Schemas ───
const step1Schema = yup.object({
  title: yup.string().required('Title is required'),
  totalCandidates: yup.number().positive().integer().required('Required'),
  slots: yup.number().positive().integer().required('Required'),
  questionSets: yup.number().positive().integer().required('Required'),
  questionType: yup.string().required(),
  startTime: yup.string().required('Start time is required'),
  endTime: yup.string().required('End time is required'),
  duration: yup.number().positive().integer().required('Duration is required'),
});

const questionSchema = yup.object({
  title: yup.string().required('Question is required'),
  type: yup.string().required(),
});

// ─── Question Modal ───
function QuestionModal({ initial, onSave, onClose }) {
  const [qData, setQData] = useState(
    initial || { title: '', type: 'radio', options: ['', ''] }
  );
  const [error, setError] = useState('');

  function save() {
    if (!qData.title.trim()) { setError('Question title is required'); return; }
    onSave(qData);
  }

  function updateOption(i, val) {
    setQData((q) => ({ ...q, options: q.options.map((o, j) => (j === i ? val : o)) }));
  }

  return (
    <Modal title={initial ? 'Edit Question' : 'Add Question'} onClose={onClose}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-medium text-[#8892a4]">Question Title *</label>
          <textarea
            value={qData.title}
            onChange={(e) => setQData((q) => ({ ...q, title: e.target.value }))}
            placeholder="Enter question here..."
            className="bg-[#1e2535] border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-[#e2e8f0] outline-none focus:border-[#6c63ff] transition-colors placeholder:text-[#4a5568] resize-none h-24"
          />
          {error && <span className="text-xs text-red-400">{error}</span>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-medium text-[#8892a4]">Question Type</label>
          <select
            value={qData.type}
            onChange={(e) =>
              setQData((q) => ({
                ...q,
                type: e.target.value,
                options: e.target.value === 'text' ? [] : q.options?.length ? q.options : ['', ''],
              }))
            }
            className="bg-[#1e2535] border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-[#e2e8f0] outline-none focus:border-[#6c63ff]"
          >
            <option value="radio">Radio (Single choice)</option>
            <option value="checkbox">Checkbox (Multi choice)</option>
            <option value="text">Text (Open ended)</option>
          </select>
        </div>

        {qData.type !== 'text' && (
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-medium text-[#8892a4]">Options</label>
            {qData.options.map((opt, i) => (
              <div key={i} className="flex gap-2">
                <input
                  type="text"
                  value={opt}
                  placeholder={`Option ${i + 1}`}
                  onChange={(e) => updateOption(i, e.target.value)}
                  className="flex-1 bg-[#1e2535] border border-white/10 rounded-lg px-3 py-2 text-sm text-[#e2e8f0] outline-none focus:border-[#6c63ff]"
                />
                {qData.options.length > 2 && (
                  <button
                    onClick={() => setQData((q) => ({ ...q, options: q.options.filter((_, j) => j !== i) }))}
                    className="text-red-400 bg-transparent border-none cursor-pointer text-lg px-2"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setQData((q) => ({ ...q, options: [...q.options, ''] }))}
            >
              + Add option
            </Button>
          </div>
        )}

        <div className="flex justify-end gap-2 mt-2">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={save}>{initial ? 'Save Changes' : 'Add Question'}</Button>
        </div>
      </div>
    </Modal>
  );
}

// ─── Step 1: Basic Info ───
function StepBasicInfo({ onNext }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(step1Schema),
    defaultValues: { questionType: 'radio' },
  });
  return (
    <form onSubmit={handleSubmit(onNext)}>
      <Card className="mb-4">
        <p className="text-[11px] font-semibold text-[#4a5568] tracking-widest uppercase mb-4">
          Basic Information
        </p>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium text-[#8892a4]">Test Title *</label>
            <input {...register('title')} placeholder="e.g. Frontend Engineering Assessment"
              className="bg-[#1e2535] border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-[#e2e8f0] outline-none focus:border-[#6c63ff] transition-colors placeholder:text-[#4a5568]" />
            {errors.title && <span className="text-xs text-red-400">{errors.title.message}</span>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { name: 'totalCandidates', label: 'Total Candidates', placeholder: '50' },
              { name: 'slots', label: 'Total Slots', placeholder: '30' },
            ].map((f) => (
              <div key={f.name} className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-[#8892a4]">{f.label} *</label>
                <input {...register(f.name)} type="number" placeholder={f.placeholder}
                  className="bg-[#1e2535] border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-[#e2e8f0] outline-none focus:border-[#6c63ff] placeholder:text-[#4a5568]" />
                {errors[f.name] && <span className="text-xs text-red-400">{errors[f.name].message}</span>}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-[#8892a4]">Question Sets *</label>
              <input {...register('questionSets')} type="number" placeholder="3"
                className="bg-[#1e2535] border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-[#e2e8f0] outline-none focus:border-[#6c63ff] placeholder:text-[#4a5568]" />
              {errors.questionSets && <span className="text-xs text-red-400">{errors.questionSets.message}</span>}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-[#8892a4]">Question Type</label>
              <select {...register('questionType')}
                className="bg-[#1e2535] border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-[#e2e8f0] outline-none focus:border-[#6c63ff]">
                <option value="radio">Radio</option>
                <option value="checkbox">Checkbox</option>
                <option value="text">Text</option>
                <option value="mixed">Mixed</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[
              { name: 'startTime', label: 'Start Time', type: 'datetime-local' },
              { name: 'endTime', label: 'End Time', type: 'datetime-local' },
              { name: 'duration', label: 'Duration (min)', type: 'number', placeholder: '60' },
            ].map((f) => (
              <div key={f.name} className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-[#8892a4]">{f.label} *</label>
                <input {...register(f.name)} type={f.type} placeholder={f.placeholder}
                  className="bg-[#1e2535] border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-[#e2e8f0] outline-none focus:border-[#6c63ff] placeholder:text-[#4a5568]" />
                {errors[f.name] && <span className="text-xs text-red-400">{errors[f.name].message}</span>}
              </div>
            ))}
          </div>
        </div>
      </Card>
      <div className="flex justify-end">
        <Button type="submit">Next: Question Sets →</Button>
      </div>
    </form>
  );
}

// ─── Step 2: Question Sets ───
function StepQuestions({ questions, setQuestions, onBack, onSubmit }) {
  const [modal, setModal] = useState(null); // null | { editIndex: number|null }
  const [editData, setEditData] = useState(null);

  function openAdd() { setEditData(null); setModal({ editIndex: null }); }
  function openEdit(i) { setEditData({ ...questions[i] }); setModal({ editIndex: i }); }

  function handleSave(qData) {
    if (modal.editIndex !== null) {
      setQuestions((qs) => qs.map((q, i) => (i === modal.editIndex ? qData : q)));
    } else {
      setQuestions((qs) => [...qs, qData]);
    }
    setModal(null);
  }

  return (
    <div>
      <Card className="mb-4">
        <div className="flex justify-between items-center mb-4">
          <p className="text-[11px] font-semibold text-[#4a5568] tracking-widest uppercase">
            Questions ({questions.length})
          </p>
          <Button size="sm" onClick={openAdd}>+ Add Question</Button>
        </div>

        {questions.length === 0 ? (
          <div className="text-center py-10 text-[#4a5568] text-sm">
            No questions yet. Click &ldquo;+ Add Question&rdquo; to start.
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {questions.map((q, i) => (
              <div key={i} className="flex items-start justify-between bg-[#1e2535] rounded-xl px-4 py-3 gap-3">
                <div className="flex-1">
                  <p className="text-xs text-[#6c63ff] font-medium mb-1">
                    Q{i + 1} · {q.type}
                  </p>
                  <p className="text-sm text-[#e2e8f0]">{q.title}</p>
                  {q.options?.length > 0 && (
                    <p className="text-xs text-[#4a5568] mt-1">{q.options.filter(Boolean).join(' / ')}</p>
                  )}
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <Button size="sm" variant="ghost" onClick={() => openEdit(i)}>Edit</Button>
                  <Button size="sm" variant="danger" onClick={() => setQuestions((qs) => qs.filter((_, j) => j !== i))}>
                    Del
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <div className="flex justify-between">
        <Button variant="ghost" onClick={onBack}>← Back</Button>
        <Button variant="success" onClick={onSubmit}>✓ Create Test</Button>
      </div>

      {modal && (
        <QuestionModal
          initial={editData}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}

// ─── Main Create Test Page ───
export default function CreateTest({ setPage }) {
  const dispatch = useDispatch();
  const exams = useSelector((s) => s.exams.list);
  const [step, setStep] = useState(1);
  const [step1Data, setStep1Data] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [success, setSuccess] = useState(false);

  function handleStep1(data) {
    setStep1Data(data);
    setStep(2);
  }

  function handleSubmit() {
    const newExam = {
      id: exams.length + 1,
      title: step1Data.title,
      candidates: 0,
      questionSets: parseInt(step1Data.questionSets),
      slots: parseInt(step1Data.slots),
      duration: parseInt(step1Data.duration),
      questions: questions.length,
      negativeMarking: false,
      startTime: step1Data.startTime,
      endTime: step1Data.endTime,
      status: 'upcoming',
    };
    dispatch(addExam(newExam));
    setSuccess(true);
  }

  if (success) {
    return (
      <div className="fade-in flex-1 flex items-center justify-center flex-col gap-4 p-8">
        <div className="text-5xl">✅</div>
        <h2 className="text-2xl font-bold text-[#e2e8f0]">Test Created Successfully!</h2>
        <p className="text-[#8892a4]">Your assessment has been published.</p>
        <Button onClick={() => setPage('dashboard')}>Back to Dashboard</Button>
      </div>
    );
  }

  return (
    <div className="fade-in flex-1 overflow-y-auto p-8 max-w-[700px]">
      <div className="mb-6">
        <button
          onClick={() => setPage('dashboard')}
          className="bg-transparent border-none text-[#8892a4] cursor-pointer text-sm mb-2 hover:text-[#e2e8f0]"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-bold text-[#e2e8f0]">Create Online Test</h1>
      </div>

      {/* Step indicator */}
      <div className="flex gap-0 mb-6 bg-[#1e2535] rounded-xl p-1">
        {['Basic Info', 'Question Sets'].map((s, i) => (
          <button
            key={i}
            onClick={() => i + 1 < step && setStep(i + 1)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-150 border-none cursor-pointer ${
              step === i + 1
                ? 'bg-[#6c63ff] text-white'
                : step > i + 1
                ? 'bg-[rgba(108,99,255,0.12)] text-[#6c63ff]'
                : 'bg-transparent text-[#8892a4]'
            }`}
          >
            {i + 1}. {s}
          </button>
        ))}
      </div>

      {step === 1 && <StepBasicInfo onNext={handleStep1} />}
      {step === 2 && (
        <StepQuestions
          questions={questions}
          setQuestions={setQuestions}
          onBack={() => setStep(1)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
