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
        <div className="flex flex-col items-center justify-center bg-white p-12 rounded-3xl shadow-sm border border-gray-100 text-center max-w-md w-full">
          <svg
            width="56"
            height="56"
            viewBox="0 0 56 56"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M51.1856 24.2902C50.4944 23.6427 49.7156 22.9164 49.5756 22.3564C49.4181 21.7527 49.7156 20.7464 50.0131 19.7664C50.4506 18.3139 50.9406 16.6689 50.1706 15.3389C49.3919 13.9914 47.7031 13.5977 46.2156 13.2477C45.2356 13.0202 44.2206 12.7752 43.7919 12.3552C43.3631 11.9264 43.1269 10.9114 42.8994 9.93143C42.5494 8.44393 42.1556 6.75518 40.8081 5.97643C39.4781 5.20643 37.8331 5.70518 36.3806 6.13393C35.4006 6.43143 34.3856 6.72893 33.7906 6.57143C33.2394 6.42268 32.5044 5.64393 31.8569 4.96143C30.7981 3.83268 29.5994 2.55518 28.0069 2.55518C26.4144 2.55518 25.2156 3.83268 24.1569 4.96143C23.5094 5.65268 22.7831 6.43143 22.2231 6.58018C21.6194 6.73768 20.6131 6.44018 19.6331 6.14268C18.1806 5.70518 16.5356 5.21518 15.2056 5.98518C13.8581 6.76393 13.4644 8.45268 13.1144 9.94018C12.8869 10.9202 12.6419 11.9352 12.2219 12.3639C11.7931 12.7927 10.7781 13.0289 9.79813 13.2564C8.31063 13.6064 6.62187 14.0002 5.84312 15.3477C5.07312 16.6777 5.57188 18.3227 6.00063 19.7752C6.28938 20.7552 6.59562 21.7614 6.43813 22.3652C6.28938 22.9164 5.51062 23.6514 4.82812 24.2989C3.69938 25.3577 2.42188 26.5564 2.42188 28.1489C2.42188 29.7414 3.69938 30.9402 4.82812 31.9989C5.51938 32.6464 6.29813 33.3727 6.43813 33.9327C6.59562 34.5364 6.29813 35.5427 6.00063 36.5227C5.56313 37.9752 5.07312 39.6202 5.84312 40.9502C6.62187 42.2977 8.31063 42.6914 9.79813 43.0414C10.7781 43.2689 11.7931 43.5052 12.2219 43.9339C12.6506 44.3627 12.8869 45.3777 13.1144 46.3577C13.4644 47.8452 13.8581 49.5339 15.2056 50.3127C16.5356 51.0827 18.1806 50.5839 19.6331 50.1552C20.6131 49.8577 21.6194 49.5602 22.2231 49.7177C22.7744 49.8664 23.5094 50.6452 24.1569 51.3364C25.2156 52.4652 26.4144 53.7427 28.0069 53.7427C29.5994 53.7427 30.7981 52.4652 31.8569 51.3364C32.5044 50.6452 33.2306 49.8664 33.7906 49.7177C34.3944 49.5602 35.4006 49.8577 36.3806 50.1552C37.8331 50.5927 39.4781 51.0827 40.8081 50.3127C42.1556 49.5339 42.5494 47.8452 42.8994 46.3577C43.1269 45.3777 43.3719 44.3627 43.7919 43.9339C44.2206 43.5052 45.2356 43.2689 46.2156 43.0414C47.7031 42.6914 49.3919 42.2977 50.1706 40.9502C50.9406 39.6202 50.4506 37.9752 50.0131 36.5227C49.7244 35.5427 49.4181 34.5364 49.5756 33.9327C49.7244 33.3814 50.5031 32.6464 51.1856 31.9989C52.3144 30.9402 53.5919 29.7414 53.5919 28.1489C53.5919 26.5564 52.3144 25.3577 51.1856 24.2989V24.2902Z"
              fill="#348CE3"
            />
            <path
              d="M43.3825 16.695C42.4025 15.715 40.8538 15.6975 39.8475 16.6512L24.22 31.465L16.1613 24.2025C15.1463 23.2925 13.5975 23.3275 12.6263 24.2987C11.6638 25.2612 11.62 26.81 12.53 27.825L23.3888 39.97C23.59 40.1975 23.8875 40.3287 24.1938 40.3375H24.2025C24.5088 40.3375 24.7975 40.215 24.9988 39.9875L43.435 20.23C44.3713 19.2237 44.345 17.6837 43.3738 16.7125L43.3825 16.695Z"
              fill="#F2F2F2"
            />
          </svg>

          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Test Completed
          </h2>
          <p className="text-gray-500 mb-8">
            Congratulations! Md. Naimur Rahman, You have completed your MCQ Exam
            for Probationary Officer. Thank you for participating.
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
            {/* <img
              src="https://ui-avatars.com/api/?name=Arif+Hossain"
              alt="profile"
            /> */}
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
