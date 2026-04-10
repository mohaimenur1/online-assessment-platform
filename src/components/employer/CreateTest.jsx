"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { addExam } from "@/lib/store/slices/examsSlice";
import { Card, Button, Modal } from "@/components/ui";
import {
  PhoneIcon,
  EnvelopeIcon,
  ChevronDownIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

// Validation Schemas
const step1Schema = yup.object({
  title: yup.string().required("Title is required"),
  totalCandidates: yup.number().positive().integer().required("Required"),
  slots: yup.number().positive().integer().required("Required"),
  questionSets: yup.number().positive().integer().required("Required"),
  questionType: yup.string().required(),
  startTime: yup.string().required("Start time is required"),
  endTime: yup.string().required("End time is required"),
  duration: yup.number().positive().integer().required("Duration is required"),
});

const questionSchema = yup.object({
  title: yup.string().required("Question is required"),
  type: yup.string().required(),
});

// Question Modal Component
function QuestionModal({ initial, onSave, onClose }) {
  const [qData, setQData] = useState(
    initial || { title: "", type: "radio", options: ["", ""] },
  );
  const [error, setError] = useState("");

  function save() {
    if (!qData.title.trim()) {
      setError("Question title is required");
      return;
    }
    onSave(qData);
  }

  function updateOption(i, val) {
    setQData((q) => ({
      ...q,
      options: q.options.map((o, j) => (j === i ? val : o)),
    }));
  }

  return (
    <Modal title={initial ? "Edit Question" : "Add Question"} onClose={onClose}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-medium text-gray-700">
            Question Title *
          </label>
          <textarea
            value={qData.title}
            onChange={(e) => setQData((q) => ({ ...q, title: e.target.value }))}
            placeholder="Enter question here..."
            className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-700 outline-none focus:border-[#6336FF] transition-colors placeholder:text-gray-300 resize-none h-24 bg-white"
          />
          {error && <span className="text-xs text-red-500">{error}</span>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-medium text-gray-700">
            Question Type
          </label>
          <select
            value={qData.type}
            onChange={(e) =>
              setQData((q) => ({
                ...q,
                type: e.target.value,
                options:
                  e.target.value === "text"
                    ? []
                    : q.options?.length
                      ? q.options
                      : ["", ""],
              }))
            }
            className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-700 outline-none focus:border-[#6336FF] bg-white"
          >
            <option value="radio">Radio (Single choice)</option>
            <option value="checkbox">Checkbox (Multi choice)</option>
            <option value="text">Text (Open ended)</option>
          </select>
        </div>

        {qData.type !== "text" && (
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-medium text-gray-700">
              Options
            </label>
            {qData.options.map((opt, i) => (
              <div key={i} className="flex gap-2">
                <input
                  type="text"
                  value={opt}
                  placeholder={`Option ${i + 1}`}
                  onChange={(e) => updateOption(i, e.target.value)}
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:border-[#6336FF] bg-white"
                />
                {qData.options.length > 2 && (
                  <button
                    onClick={() =>
                      setQData((q) => ({
                        ...q,
                        options: q.options.filter((_, j) => j !== i),
                      }))
                    }
                    className="text-red-500 bg-transparent border-none cursor-pointer text-lg px-2 hover:text-red-700"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              className="w-full border border-dashed border-gray-300 rounded-lg py-2 text-sm text-[#6336FF] hover:bg-gray-50 transition-colors"
              onClick={() =>
                setQData((q) => ({ ...q, options: [...q.options, ""] }))
              }
            >
              + Add option
            </button>
          </div>
        )}

        <div className="flex justify-end gap-2 mt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={save}
            className="px-4 py-2 bg-[#6336FF] text-white rounded-lg hover:bg-[#5229e6] transition-colors"
          >
            {initial ? "Save Changes" : "Add Question"}
          </button>
        </div>
      </div>
    </Modal>
  );
}

// Step 1 Component
function StepBasicInfo({ onNext, onCancel }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(step1Schema),
    defaultValues: { questionType: "radio" },
  });

  const inputClass =
    "w-full border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-[#6336FF] transition-all placeholder:text-gray-300 text-gray-700 bg-white";
  const labelClass = "text-sm font-semibold text-gray-700 mb-2 block";

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-6">
      <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
        <h2 className="text-lg font-bold text-gray-800 mb-6">
          Basic Information
        </h2>

        <div className="space-y-6">
          {/* Title */}
          <div>
            <label className={labelClass}>
              Online Test Title <span className="text-red-500">*</span>
            </label>
            <input
              {...register("title")}
              placeholder="Enter online test title"
              className={inputClass}
            />
            {errors.title && (
              <span className="text-xs text-red-500 mt-1 block">
                {errors.title.message}
              </span>
            )}
          </div>

          {/* Row 1 */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>
                Total Candidates <span className="text-red-500">*</span>
              </label>
              <input
                {...register("totalCandidates")}
                type="number"
                placeholder="Enter total candidates"
                className={inputClass}
              />
              {errors.totalCandidates && (
                <span className="text-xs text-red-500 mt-1 block">
                  {errors.totalCandidates.message}
                </span>
              )}
            </div>
            <div>
              <label className={labelClass}>
                Total Slots <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  {...register("slots")}
                  className={`${inputClass} appearance-none`}
                >
                  <option value="">Select total slots</option>
                  {[1, 2, 3, 4, 5, 10, 15, 20, 30, 40, 50].map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
                <ChevronDownIcon className="h-4 w-4 absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
              {errors.slots && (
                <span className="text-xs text-red-500 mt-1 block">
                  {errors.slots.message}
                </span>
              )}
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>
                Total Question Set <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  {...register("questionSets")}
                  className={`${inputClass} appearance-none`}
                >
                  <option value="">Select total question set</option>
                  {[1, 2, 3, 4, 5].map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
                <ChevronDownIcon className="h-4 w-4 absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
              {errors.questionSets && (
                <span className="text-xs text-red-500 mt-1 block">
                  {errors.questionSets.message}
                </span>
              )}
            </div>
            <div>
              <label className={labelClass}>
                Question Type <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  {...register("questionType")}
                  className={`${inputClass} appearance-none`}
                >
                  <option value="">Select question type</option>
                  <option value="radio">Radio</option>
                  <option value="checkbox">Checkbox</option>
                  <option value="text">Text</option>
                  <option value="mixed">Mixed</option>
                </select>
                <ChevronDownIcon className="h-4 w-4 absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Row 3 Time */}
          <div className="grid grid-cols-3 gap-6">
            <div>
              <label className={labelClass}>
                Start Time <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  {...register("startTime")}
                  type="datetime-local"
                  className={inputClass}
                />
                <ClockIcon className="h-4 w-4 absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
              {errors.startTime && (
                <span className="text-xs text-red-500 mt-1 block">
                  {errors.startTime.message}
                </span>
              )}
            </div>
            <div>
              <label className={labelClass}>
                End Time <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  {...register("endTime")}
                  type="datetime-local"
                  className={inputClass}
                />
                <ClockIcon className="h-4 w-4 absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
              {errors.endTime && (
                <span className="text-xs text-red-500 mt-1 block">
                  {errors.endTime.message}
                </span>
              )}
            </div>
            <div>
              <label className={labelClass}>
                Duration (minutes) <span className="text-red-500">*</span>
              </label>
              <input
                {...register("duration")}
                type="number"
                placeholder="Duration Time"
                className={inputClass}
              />
              {errors.duration && (
                <span className="text-xs text-red-500 mt-1 block">
                  {errors.duration.message}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex justify-between items-center">
        <button
          type="button"
          onClick={onCancel}
          className="px-10 py-2.5 border border-gray-300 rounded-xl text-gray-600 font-semibold hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-10 py-2.5 bg-[#6336FF] text-white rounded-xl font-semibold shadow-md hover:bg-[#5229e6] transition-colors"
        >
          Save & Continue
        </button>
      </div>
    </form>
  );
}

// Step 2: Question Sets Component
function StepQuestions({ questions, setQuestions, onBack, onSubmit }) {
  const [modal, setModal] = useState(null);
  const [editData, setEditData] = useState(null);

  function openAdd() {
    setEditData(null);
    setModal({ editIndex: null });
  }
  function openEdit(i) {
    setEditData({ ...questions[i] });
    setModal({ editIndex: i });
  }

  function handleSave(qData) {
    if (modal.editIndex !== null) {
      setQuestions((qs) =>
        qs.map((q, i) => (i === modal.editIndex ? qData : q)),
      );
    } else {
      setQuestions((qs) => [...qs, qData]);
    }
    setModal(null);
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-800">
            Questions ({questions.length})
          </h2>
          <button
            onClick={openAdd}
            className="px-4 py-2 bg-[#6336FF] text-white rounded-lg text-sm font-semibold hover:bg-[#5229e6] transition-colors"
          >
            + Add Question
          </button>
        </div>

        {questions.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-sm bg-gray-50 rounded-xl">
            No questions yet. Click Add Question to start building your
            assessment.
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {questions.map((q, i) => (
              <div
                key={i}
                className="flex items-start justify-between bg-gray-50 rounded-xl px-5 py-4 gap-3 border border-gray-100"
              >
                <div className="flex-1">
                  <p className="text-xs text-[#6336FF] font-semibold mb-1 uppercase tracking-wide">
                    Q{i + 1} · {q.type}
                  </p>
                  <p className="text-sm text-gray-800 font-medium">{q.title}</p>
                  {q.options?.length > 0 && (
                    <p className="text-xs text-gray-400 mt-2">
                      Options: {q.options.filter(Boolean).join(" / ")}
                    </p>
                  )}
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => openEdit(i)}
                    className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() =>
                      setQuestions((qs) => qs.filter((_, j) => j !== i))
                    }
                    className="px-3 py-1.5 text-sm border border-red-200 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex justify-between items-center">
        <button
          onClick={onBack}
          className="px-8 py-2.5 border border-gray-300 rounded-xl text-gray-600 font-semibold hover:bg-gray-50 transition-colors"
        >
          ← Back
        </button>
        <button
          onClick={onSubmit}
          className="px-8 py-2.5 bg-green-600 text-white rounded-xl font-semibold shadow-md hover:bg-green-700 transition-colors"
        >
          ✓ Create Test
        </button>
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

// Main Create Test Page
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
      status: "upcoming",
    };
    dispatch(addExam(newExam));
    setSuccess(true);
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#F8F9FB] flex items-center justify-center">
        <div className="bg-white rounded-2xl p-12 text-center max-w-md shadow-sm border border-gray-100">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Test Created Successfully!
          </h2>
          <p className="text-gray-500 mb-6">
            Your assessment has been published.
          </p>
          <button
            onClick={() => setPage("dashboard")}
            className="px-6 py-2.5 bg-[#6336FF] text-white rounded-lg font-semibold hover:bg-[#5229e6] transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex flex-col font-sans">
      {/* --- NAVBAR --- */}
      <nav className="w-full bg-white px-8 py-3 flex justify-between items-center shadow-sm border-b border-gray-100">
        <div className="flex items-center">
          <div className="text-[#3F4195] font-bold text-xl flex items-center gap-1">
            AKIJ{" "}
            <span className="font-light text-sm border-l border-gray-400 pl-1 uppercase tracking-tighter">
              Resource
            </span>
          </div>
        </div>
        <h2 className="text-[#374151] text-md font-medium">Online Test</h2>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-bold text-[#374151]">Arif Hossain</p>
            <p className="text-[11px] text-gray-400">Ref. ID - 16101121</p>
          </div>
          <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
            <img
              src="https://ui-avatars.com/api/?name=Arif+Hossain"
              alt="profile"
            />
          </div>
          <ChevronDownIcon className="h-4 w-4 text-gray-500" />
        </div>
      </nav>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-grow p-10 max-w-[1100px] mx-auto w-full">
        {/* Manage Online Test Card */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-8 flex justify-between items-center">
          <div className="space-y-4">
            <h1 className="text-xl font-bold text-[#374151]">
              Manage Online Test
            </h1>
            {/* Stepper */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div
                  className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    step === 1
                      ? "bg-[#6336FF] text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  1
                </div>
                <span
                  className={`text-sm font-semibold ${
                    step === 1 ? "text-[#6336FF]" : "text-gray-400"
                  }`}
                >
                  Basic Info
                </span>
              </div>
              <div className="w-16 h-[1px] bg-gray-300"></div>
              <div className="flex items-center gap-2">
                <div
                  className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    step === 2
                      ? "bg-[#6336FF] text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  2
                </div>
                <span
                  className={`text-sm font-semibold ${
                    step === 2 ? "text-[#6336FF]" : "text-gray-400"
                  }`}
                >
                  Questions
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setPage("dashboard")}
            className="px-6 py-2 border border-gray-200 rounded-xl text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>

        {step === 1 && (
          <StepBasicInfo
            onNext={handleStep1}
            onCancel={() => setPage("dashboard")}
          />
        )}
        {step === 2 && (
          <StepQuestions
            questions={questions}
            setQuestions={setQuestions}
            onBack={() => setStep(1)}
            onSubmit={handleSubmit}
          />
        )}
      </main>

      {/* --- FOOTER --- */}
      <footer className="bg-[#0A0B1A] text-white px-10 py-6 flex flex-wrap justify-between items-center mt-auto">
        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-sm">Powered by</span>
          <div className="font-bold text-lg flex items-center">
            AKIJ{" "}
            <span className="font-light text-xs border-l border-gray-600 ml-1 pl-1 uppercase">
              Resource
            </span>
          </div>
        </div>

        <div className="flex gap-8 items-center text-sm">
          <div className="flex items-center gap-4">
            <span className="text-gray-400">Helpline</span>
            <div className="flex items-center gap-2">
              <PhoneIcon className="h-4 w-4" />
              <span>+88 011020202505</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <EnvelopeIcon className="h-4 w-4" />
            <span>support@akij.work</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
