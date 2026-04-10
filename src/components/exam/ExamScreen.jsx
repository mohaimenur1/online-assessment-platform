"use client";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { clearActiveExam } from "@/lib/store/slices/examsSlice";
import { useExamAnswers, useBehaviorTracking } from "@/lib/hooks";
import { MOCK_QUESTIONS } from "@/lib/mock-data";
import { Button } from "@/components/ui";
import {
  PhoneIcon,
  EnvelopeIcon,
  ChevronDownIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import ExamTimer from "./ExamTimer";

function WarningBanner({ warnings, onDismiss }) {
  if (!warnings.length) return null;
  return (
    <div className="flex flex-col gap-1 w-full max-w-[800px] mx-auto mb-4">
      {warnings.map((w) => (
        <div
          key={w.id}
          className="flex justify-between items-center bg-red-50 border border-red-200 text-red-600 px-6 py-2 rounded-lg text-sm font-medium"
        >
          <span>⚠️ {w.message}</span>
          <button
            onClick={() => onDismiss(w.id)}
            className="text-red-600 font-bold"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}

function QuestionPanel({
  question,
  qIndex,
  answers,
  setRadio,
  toggleCheckbox,
  setText,
}) {
  const ans = answers[qIndex];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 w-full max-w-[800px] mx-auto">
      <h2 className="text-lg font-bold text-[#374151] mb-8">
        Q{qIndex + 1}. {question.title}
      </h2>

      {question.type === "text" ? (
        <textarea
          value={ans || ""}
          onChange={(e) => setText(qIndex, e.target.value)}
          placeholder="Type your answer here..."
          className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#6336FF] min-h-[160px]"
        />
      ) : (
        <div className="flex flex-col gap-4">
          {question.options.map((opt, i) => {
            const selected =
              question.type === "checkbox"
                ? (ans || []).includes(i)
                : ans === i;
            return (
              <div
                key={i}
                onClick={() => {
                  if (question.type === "radio") setRadio(qIndex, i);
                  else toggleCheckbox(qIndex, i);
                }}
                className="flex items-center gap-4 border border-gray-200 rounded-xl px-5 py-4 cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selected ? "border-[#6336FF]" : "border-gray-300"}`}
                >
                  {selected && (
                    <div className="w-2.5 h-2.5 rounded-full bg-[#6336FF]" />
                  )}
                </div>
                <span className="text-sm text-[#374151] font-medium">
                  {opt}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function ExamScreen({ exam }) {
  const dispatch = useDispatch();
  const questions = MOCK_QUESTIONS[exam.id] || MOCK_QUESTIONS[1] || [];
  const [current, setCurrent] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const { answers, setRadio, toggleCheckbox, setText, answeredCount } =
    useExamAnswers(questions);
  const { warnings, tabSwitchCount, dismissWarning } = useBehaviorTracking();

  function submit() {
    setSubmitted(true);
  }
  function finish() {
    dispatch(clearActiveExam());
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#F8F9FB] flex flex-col items-center justify-center p-8">
        <div className="bg-white p-12 rounded-3xl shadow-sm border border-gray-100 text-center max-w-md w-full">
          <div className="text-6xl mb-6 text-green-500">✓</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Exam Submitted
          </h2>
          <p className="text-gray-500 mb-8">
            Answers: {answeredCount}/{questions.length}
          </p>
          <Button onClick={finish} className="w-full bg-[#6336FF]">
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex flex-col font-sans">
      {/* --- NAVBAR --- */}
      <nav className="w-full bg-white px-8 py-3 flex justify-between items-center shadow-sm border-b border-gray-100 sticky top-0 z-30">
        <div className="flex items-center gap-1">
          <div className="text-[#3F4195] font-bold text-xl uppercase tracking-tighter">
            AKIJ{" "}
            <span className="font-light text-sm border-l border-gray-300 pl-1 text-gray-500">
              Resource
            </span>
          </div>
        </div>
        <h2 className="text-[#374151] text-md font-bold">Akij Resource</h2>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-bold text-[#374151]">Arif Hossain</p>
            <p className="text-[11px] text-gray-400">Ref. ID - 16101121</p>
          </div>
          <div className="h-10 w-10 bg-gray-200 rounded-full overflow-hidden border border-gray-100">
            <img
              src="https://ui-avatars.com/api/?name=Arif+Hossain"
              alt="profile"
            />
          </div>
          <ChevronDownIcon className="h-4 w-4 text-gray-500" />
        </div>
      </nav>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-grow p-10 flex flex-col items-center gap-6">
        <WarningBanner warnings={warnings} onDismiss={dismissWarning} />

        {/* Question Info Box */}
        <div className="w-full max-w-[800px] bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex justify-between items-center">
          <h3 className="text-lg font-bold text-[#374151]">
            Question ({current + 1}/{questions.length})
          </h3>
          <div className="bg-gray-50 px-8 py-3 rounded-xl flex items-center gap-3 text-lg font-bold text-[#374151] min-w-[160px] justify-center">
            <ExamTimer totalSeconds={exam.duration * 60} onTimeout={submit} />
            <span className="text-gray-400 text-sm font-normal">left</span>
          </div>
        </div>

        {/* Active Question */}
        <QuestionPanel
          key={current}
          question={questions[current]}
          qIndex={current}
          answers={answers}
          setRadio={setRadio}
          toggleCheckbox={toggleCheckbox}
          setText={setText}
        />

        {/* Actions */}
        <div className="w-full max-w-[800px] flex justify-between items-center mt-4">
          <button
            onClick={() => setCurrent((c) => Math.max(0, c - 1))}
            className="px-8 py-3 border border-gray-200 rounded-xl text-gray-600 font-bold hover:bg-gray-50 transition-colors"
          >
            Skip this Question
          </button>
          <button
            onClick={() =>
              current < questions.length - 1
                ? setCurrent((c) => c + 1)
                : submit()
            }
            className="px-10 py-3 bg-[#6336FF] text-white rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-[#5229e6] transition-all"
          >
            {current < questions.length - 1 ? "Save & Continue" : "Finish Exam"}
          </button>
        </div>
      </main>

      {/* --- FOOTER --- */}
      <footer className="bg-[#0A0B1A] text-white px-10 py-6 flex flex-wrap justify-between items-center mt-auto">
        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-sm">Powered by</span>
          <div className="font-bold text-lg flex items-center uppercase">
            AKIJ{" "}
            <span className="font-light text-xs border-l border-gray-600 ml-1 pl-1">
              Resource
            </span>
          </div>
        </div>
        <div className="flex gap-8 items-center text-sm">
          <div className="flex items-center gap-4">
            <span className="text-gray-400">Helpline</span>
            <div className="flex items-center gap-2">
              <PhoneIcon className="h-4 w-4 text-[#6336FF]" />
              <span>+88 011020202505</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <EnvelopeIcon className="h-4 w-4 text-[#6336FF]" />
            <span>support@akij.work</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
