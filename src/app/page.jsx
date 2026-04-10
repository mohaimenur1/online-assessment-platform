"use client";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useAuth } from "@/lib/hooks";

import RoleSelector from "@/components/RoleSelector";
import LoginPage from "@/components/LoginPage";
import Sidebar from "@/components/Sidebar";

import EmployerDashboard from "@/components/employer/EmployerDashboard";
import CreateTest from "@/components/employer/CreateTest";

import CandidateDashboard from "@/components/candidate/CandidateDashboard";
import ExamScreen from "@/components/exam/ExamScreen";

export default function Home() {
  const { isAuthenticated, role } = useAuth();
  const activeExam = useSelector((s) => s.exams.activeExam);

  const [selectedRole, setSelectedRole] = useState(null);
  const [page, setPage] = useState("dashboard");
  // Step 2: login
  if (!isAuthenticated) {
    return <LoginPage role={selectedRole} />;
  }

  // Step 3: candidate taking an exam
  if (role === "candidate" && activeExam) {
    return <ExamScreen exam={activeExam} />;
  }

  // Step 4: main layout with sidebar
  return (
    <div className="flex min-h-screen bg-[#0f1117]">
      <main className="flex-1 flex flex-col min-w-0">
        {role === "employer" && (
          <>
            {page === "dashboard" && <EmployerDashboard setPage={setPage} />}
            {page === "create" && <CreateTest setPage={setPage} />}
          </>
        )}

        {role === "candidate" && (
          <>{page === "dashboard" && <CandidateDashboard />}</>
        )}
      </main>
    </div>
  );
}
