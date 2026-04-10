'use client';
import { Card, Badge } from '@/components/ui';

export default function RoleSelector({ onSelect }) {
  return (
    <div className="min-h-screen bg-[#0f1117] flex items-center justify-center p-4">
      <div className="fade-in w-full max-w-[480px] text-center">
        <div className="w-16 h-16 bg-[#6c63ff] rounded-2xl flex items-center justify-center text-3xl font-bold text-white mx-auto mb-4">
          A
        </div>
        <h1 className="text-[30px] font-black text-[#e2e8f0] mb-2">AssessAI</h1>
        <p className="text-[#8892a4] mb-10 text-[15px]">Online Assessment Platform</p>

        <div className="grid grid-cols-2 gap-4">
          <Card
            onClick={() => onSelect('employer')}
            className="cursor-pointer text-center py-8 hover:border-[#6c63ff]/40"
          >
            <div className="text-4xl mb-3">🏢</div>
            <h3 className="text-base font-semibold text-[#e2e8f0] mb-2">Employer</h3>
            <p className="text-xs text-[#8892a4]">Create & manage assessments, view candidate results</p>
          </Card>

          <Card
            onClick={() => onSelect('candidate')}
            className="cursor-pointer text-center py-8 hover:border-[#10b981]/40"
          >
            <div className="text-4xl mb-3">🎓</div>
            <h3 className="text-base font-semibold text-[#e2e8f0] mb-2">Candidate</h3>
            <p className="text-xs text-[#8892a4]">Take assessments and submit your answers</p>
          </Card>
        </div>

        <p className="text-xs text-[#4a5568] mt-6">Select your role to continue</p>
      </div>
    </div>
  );
}
