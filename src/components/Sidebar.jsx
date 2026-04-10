"use client";
import { useAuth } from "@/lib/hooks";
import { Button } from "@/components/ui";

const employerNav = [
  { id: "dashboard", icon: "◈", label: "Dashboard" },
  { id: "create", icon: "+", label: "Create Test" },
];
const candidateNav = [{ id: "dashboard", icon: "◈", label: "My Exams" }];

export default function Sidebar({ page, setPage }) {
  const { user, role, signOut } = useAuth();
  const nav = role === "employer" ? employerNav : candidateNav;

  return (
    <aside className="w-[220px] bg-[#161b27] border-r border-white/10 flex flex-col h-screen sticky top-0 flex-shrink-0">
      {/* Logo */}
      <div className="px-5 pt-6 pb-4">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-7 h-7 bg-[#6c63ff] rounded-lg flex items-center justify-center text-[13px] font-bold text-white">
            A
          </div>
          <span className="text-[15px] font-bold text-[#e2e8f0]">assess</span>
        </div>
        <p className="text-[11px] text-[#4a5568] ml-9">
          {role === "employer" ? "Employer Panel" : "Candidate Panel"}
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2">
        {nav.map((n) => (
          <button
            key={n.id}
            onClick={() => setPage(n.id)}
            className={`flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg mb-0.5 text-sm font-medium transition-all duration-150 border-none cursor-pointer ${
              page === n.id
                ? "bg-[rgba(108,99,255,0.12)] text-[#6c63ff]"
                : "bg-transparent text-[#8892a4] hover:bg-white/5 hover:text-[#e2e8f0]"
            }`}
          >
            <span className="text-base">{n.icon}</span>
            {n.label}
          </button>
        ))}
      </nav>

      {/* User */}
      <div className="px-5 py-4 border-t border-white/10">
        <p className="text-[13px] font-medium text-[#e2e8f0] mb-0.5">
          {user?.name}
        </p>
        <p className="text-xs text-[#4a5568] mb-3">{user?.email}</p>
        <Button
          onClick={signOut}
          variant="ghost"
          size="sm"
          className="w-full justify-center"
        >
          Sign out
        </Button>
      </div>
    </aside>
  );
}
