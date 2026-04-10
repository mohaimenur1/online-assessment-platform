"use client";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Card, Badge, Button, StatCard, Modal, Avatar } from "@/components/ui";
import { MOCK_CANDIDATES } from "@/lib/mock-data";
import {
  MagnifyingGlassIcon,
  UserGroupIcon,
  DocumentTextIcon,
  ClockIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PhoneIcon,
  EnvelopeIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";

// Status color function
function statusColor(status) {
  return (
    { active: "green", upcoming: "amber", completed: "blue" }[status] ||
    "accent"
  );
}

// Score color function for candidates modal
const scoreColor = (s) =>
  s >= 80 ? "#10b981" : s >= 60 ? "#f59e0b" : "#ef4444";

// Candidates Modal Component
function CandidatesModal({ exam, onClose }) {
  const candidates = MOCK_CANDIDATES.filter((c) => c.examId === exam.id);

  return (
    <Modal title={`Candidates — ${exam.title}`} onClose={onClose} width={580}>
      {candidates.length === 0 ? (
        <p className="text-center text-[#4a5568] py-8 text-sm">
          No candidates for this exam yet.
        </p>
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
                  <span
                    className="text-sm font-bold"
                    style={{ color: scoreColor(c.score) }}
                  >
                    {c.score}%
                  </span>
                )}
                <Badge
                  color={
                    c.status === "completed"
                      ? "green"
                      : c.status === "in-progress"
                        ? "amber"
                        : "accent"
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

function ExamCard({ exam, onViewCandidates }) {
  return (
    <div className="bg-white border border-gray-100 rounded-[20px] p-6 shadow-sm flex flex-col">
      <div className="flex justify-between items-start mb-5">
        <h3 className="text-[17px] font-bold text-[#374151] leading-tight">
          {exam.title}
        </h3>
        <Badge color={statusColor(exam.status)}>{exam.status}</Badge>
      </div>

      <div className="flex flex-wrap gap-y-4 gap-x-6 mb-6">
        <div className="flex items-center gap-2 text-gray-500">
          <UserGroupIcon className="h-5 w-5 text-gray-400" />
          <span className="text-sm font-medium">
            Candidates:{" "}
            <span className="text-[#374151] font-semibold">
              {exam.candidates || "Not Set"}
            </span>
          </span>
        </div>
        <div className="flex items-center gap-2 text-gray-500">
          <DocumentTextIcon className="h-5 w-5 text-gray-400" />
          <span className="text-sm font-medium">
            Question Set:{" "}
            <span className="text-[#374151] font-semibold">
              {exam.questionSets || "Not Set"}
            </span>
          </span>
        </div>
        <div className="flex items-center gap-2 text-gray-500">
          <ClockIcon className="h-5 w-5 text-gray-400" />
          <span className="text-sm font-medium">
            Duration:{" "}
            <span className="text-[#374151] font-semibold">
              {exam.duration ? `${exam.duration}m` : "Not Set"}
            </span>
          </span>
        </div>
      </div>

      <button
        onClick={() => onViewCandidates(exam)}
        className="w-[160px] border border-[#6336FF] text-[#6336FF] font-semibold py-2 rounded-lg hover:bg-[#6336FF] hover:text-white transition-all text-sm"
      >
        View Candidates
      </button>
    </div>
  );
}

export default function EmployerDashboard({ setPage }) {
  const exams = useSelector((s) => s.exams.list);
  const [viewExam, setViewExam] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [showPerPageDropdown, setShowPerPageDropdown] = useState(false);

  // Calculate stats
  const active = exams.filter((e) => e.status === "active").length;
  const totalCandidates = exams.reduce((a, e) => a + e.candidates, 0);
  const avgDuration =
    exams.length > 0
      ? Math.round(
          exams.reduce((a, e) => a + (parseInt(e.duration) || 0), 0) /
            exams.length,
        )
      : 0;

  // Filter exams based on search
  const filteredExams = exams.filter((exam) =>
    exam.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentExams = filteredExams.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredExams.length / itemsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  // Handle items per page change
  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(value);
    setCurrentPage(1);
    setShowPerPageDropdown(false);
  };

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
        <h2 className="text-[#374151] text-md font-medium">Dashboard</h2>
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
      <main className="flex-grow p-10 max-w-[1400px] mx-auto w-full">
        {/* Header Search Bar Area */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <h1 className="text-xl font-bold text-[#374151] whitespace-nowrap">
            Online Tests
          </h1>

          <div className="relative w-full max-w-[500px]">
            <input
              type="text"
              placeholder="Search by exam title"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-white border border-indigo-100 rounded-lg py-2.5 px-4 pr-10 outline-none shadow-sm focus:border-indigo-400"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-indigo-50 p-1.5 rounded-md">
              <MagnifyingGlassIcon className="h-4 w-4 text-[#6336FF]" />
            </div>
          </div>

          <button
            onClick={() => setPage("create")}
            className="bg-[#6336FF] text-white px-6 py-2.5 rounded-lg font-semibold shadow-md hover:bg-[#5229e6] transition-all whitespace-nowrap"
          >
            Create Online Test
          </button>
        </div>

        {/* Exams Grid */}
        {currentExams.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-[20px]">
            <p className="text-gray-500">No exams found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentExams.map((exam) => (
              <ExamCard
                key={exam.id}
                exam={exam}
                onViewCandidates={setViewExam}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {filteredExams.length > 0 && (
          <div className="mt-10 flex justify-between items-center">
            <div className="flex gap-2">
              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className={`p-2 border border-gray-200 rounded bg-white ${
                  currentPage === 1
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-400 hover:bg-gray-50"
                }`}
              >
                <ChevronLeftIcon className="h-4 w-4" />
              </button>
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => paginate(index + 1)}
                  className={`px-4 py-2 border rounded ${
                    currentPage === index + 1
                      ? "bg-[#6336FF] text-white border-[#6336FF]"
                      : "border-gray-200 bg-white font-bold text-[#374151] hover:bg-gray-50"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className={`p-2 border border-gray-200 rounded bg-white ${
                  currentPage === totalPages
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-400 hover:bg-gray-50"
                }`}
              >
                <ChevronRightIcon className="h-4 w-4" />
              </button>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-500 relative">
              <span>Online Test Per Page</span>
              <div
                className="bg-white border border-gray-200 px-3 py-1 rounded flex items-center gap-4 cursor-pointer hover:bg-gray-50"
                onClick={() => setShowPerPageDropdown(!showPerPageDropdown)}
              >
                <span className="font-bold text-[#374151]">{itemsPerPage}</span>
                <ChevronDownIcon className="h-4 w-4" />
              </div>
              {showPerPageDropdown && (
                <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[100px]">
                  {[4, 8, 12, 16].map((value) => (
                    <div
                      key={value}
                      className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-[#374151]"
                      onClick={() => handleItemsPerPageChange(value)}
                    >
                      {value}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
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

      {viewExam && (
        <CandidatesModal exam={viewExam} onClose={() => setViewExam(null)} />
      )}
    </div>
  );
}
