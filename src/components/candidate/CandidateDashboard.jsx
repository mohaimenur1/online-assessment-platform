"use client";
import { useSelector, useDispatch } from "react-redux";
import { setActiveExam } from "@/lib/store/slices/examsSlice";
import {
  MagnifyingGlassIcon,
  ClockIcon,
  DocumentTextIcon,
  NoSymbolIcon,
  PhoneIcon,
  EnvelopeIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

// Note: Replaced custom Card/Badge with standard Tailwind to match the light theme in the image
function ExamCard({ exam, onStart }) {
  const isAvailable = exam.status === "active";

  return (
    <div className="bg-white border border-gray-100 rounded-[20px] p-6 shadow-sm flex flex-col hover:shadow-md transition-shadow">
      <h3 className="text-[17px] font-bold text-[#374151] mb-5 leading-tight h-[44px] line-clamp-2">
        {exam.title}
      </h3>

      <div className="flex flex-row gap-3 mb-6">
        <div className="flex items-center gap-2 text-gray-500">
          <ClockIcon className="h-5 w-5 text-gray-400" />
          <span className="text-sm font-medium">
            Duration:{" "}
            <span className="text-[#374151] font-semibold">
              {exam.duration} min
            </span>
          </span>
        </div>
        <div className="flex items-center gap-2 text-gray-500">
          <DocumentTextIcon className="h-5 w-5 text-gray-400" />
          <span className="text-sm font-medium">
            Question:{" "}
            <span className="text-[#374151] font-semibold">
              {exam.questions || "20"}
            </span>
          </span>
        </div>
        <div className="flex items-center gap-2 text-gray-500">
          <NoSymbolIcon className="h-5 w-5 text-gray-400" />
          <span className="text-sm font-medium">
            Negative Marking:{" "}
            <span className="text-[#374151] font-semibold">
              {exam.negativeMarking ? "-0.25/wrong" : "No"}
            </span>
          </span>
        </div>
      </div>

      <button
        onClick={() => isAvailable && onStart(exam)}
        disabled={!isAvailable}
        className={`w-[120px] py-2.5 rounded-xl font-semibold text-sm transition-all border ${
          isAvailable
            ? "border-[#6336FF] text-[#6336FF] hover:bg-[#6336FF] hover:text-white"
            : "border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50"
        }`}
      >
        Start
      </button>
    </div>
  );
}

export default function CandidateDashboard() {
  const dispatch = useDispatch();
  const exams = useSelector((s) => s.exams.list);

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex flex-col font-sans">
      {/* --- NAVBAR --- */}
      <nav className="w-full bg-white px-8 py-3 flex justify-between items-center shadow-sm border-b border-gray-100">
        <div className="flex items-center">
          <div className="flex items-center gap-1">
            <div className="bg-[#3F4195] text-white p-1 rounded font-bold text-lg px-2">
              AKIJ
            </div>
            <div className="font-light text-sm border-l border-gray-400 pl-1 uppercase tracking-tighter text-gray-600">
              Resource
            </div>
          </div>
        </div>
        <h2 className="text-[#374151] text-md font-medium">Dashboard</h2>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-bold text-[#374151]">Arif Hossain</p>
            <p className="text-[11px] text-gray-400">Ref. ID - 16101121</p>
          </div>
          <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden border border-gray-100">
            <img
              src="https://ui-avatars.com/api/?name=Arif+Hossain"
              alt="profile"
            />
          </div>
          <ChevronDownIcon className="h-4 w-4 text-gray-500" />
        </div>
      </nav>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-grow p-10 max-w-[1400px] mx-auto w-full">
        {/* Header Search Bar Area */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <h1 className="text-xl font-bold text-[#374151] whitespace-nowrap uppercase tracking-wide">
            Online Tests
          </h1>

          <div className="relative w-full max-w-[450px]">
            <input
              type="text"
              placeholder="Search by exam title"
              className="w-full bg-white border border-gray-200 rounded-xl py-2.5 px-4 pr-12 outline-none shadow-sm focus:border-[#6336FF] text-sm text-gray-950"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 bg-indigo-50 p-2 rounded-lg cursor-pointer">
              <MagnifyingGlassIcon className="h-4 w-4 text-[#6336FF] stroke-[3px]" />
            </div>
          </div>
        </div>

        {/* Exams Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {exams.map((exam) => (
            <ExamCard
              key={exam.id}
              exam={exam}
              onStart={(e) => dispatch(setActiveExam(e))}
            />
          ))}
        </div>

        {/* Pagination Section (Matching the Image) */}
        <div className="mt-10 flex justify-between items-center">
          <div className="flex gap-2">
            <button className="p-2 border border-gray-200 rounded-lg bg-white text-gray-400 hover:bg-gray-50">
              <ChevronLeftIcon className="h-4 w-4" />
            </button>
            <button className="px-4 py-2 border border-gray-200 rounded-lg bg-white font-bold text-[#374151] shadow-sm">
              1
            </button>
            <button className="p-2 border border-gray-200 rounded-lg bg-white text-gray-400 hover:bg-gray-50">
              <ChevronRightIcon className="h-4 w-4" />
            </button>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <span>Online Test Per Page</span>
            <div className="bg-white border border-gray-200 px-3 py-1.5 rounded-lg flex items-center gap-4 cursor-pointer shadow-sm">
              <span className="font-bold text-[#374151]">8</span>
              <ChevronDownIcon className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>
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
