"use client";

// ─── Button ───
export function Button({
  children,
  onClick,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  type = "button",
}) {
  const base =
    "inline-flex items-center gap-1.5 rounded-lg font-medium transition-all duration-150 cursor-pointer border-0 disabled:opacity-50 disabled:cursor-not-allowed";
  const sizes = {
    sm: "px-3.5 py-1.5 text-[13px]",
    md: "px-5 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
  };
  const variants = {
    primary: "bg-[#6c63ff] text-white hover:bg-[#5a52e0]",
    ghost:
      "bg-transparent text-[#8892a4] border border-white/10 hover:bg-white/5",
    danger: "bg-[#ef4444] text-white hover:bg-red-600",
    success: "bg-[#10b981] text-white hover:bg-emerald-600",
    outline:
      "bg-transparent border border-[#6c63ff] text-[#6c63ff] hover:bg-[rgba(108,99,255,0.1)]",
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

// ─── Input ───
export function Input({
  label,
  error,
  className = "",
  required = false,
  ...props
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-[13px] font-medium text-[#8892a4]">
          {label}
          {required && <span className="text-[#ef4444] ml-1">*</span>}
        </label>
      )}
      <input
        {...props}
        className="bg-[#1e2535] border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-[#e2e8f0] outline-none focus:border-[#6c63ff] transition-colors placeholder:text-[#4a5568] w-full"
      />
      {error && <span className="text-[#ef4444] text-xs">{error}</span>}
    </div>
  );
}

// ─── Textarea ───
export function Textarea({ label, error, className = "", ...props }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-[13px] font-medium text-[#8892a4]">
          {label}
        </label>
      )}
      <textarea
        {...props}
        className="bg-[#1e2535] border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-[#e2e8f0] outline-none focus:border-[#6c63ff] transition-colors placeholder:text-[#4a5568] w-full resize-y min-h-[120px]"
      />
      {error && <span className="text-[#ef4444] text-xs">{error}</span>}
    </div>
  );
}

// ─── Select ───
export function Select({
  label,
  options = [],
  error,
  className = "",
  ...props
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-[13px] font-medium text-[#8892a4]">
          {label}
        </label>
      )}
      <select
        {...props}
        className="bg-[#1e2535] border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-[#e2e8f0] outline-none focus:border-[#6c63ff] transition-colors w-full"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {error && <span className="text-[#ef4444] text-xs">{error}</span>}
    </div>
  );
}

// ─── Card ───
export function Card({ children, className = "", onClick }) {
  return (
    <div
      onClick={onClick}
      className={`bg-[#161b27] border border-white/10 rounded-xl p-5 transition-all duration-150 ${onClick ? "cursor-pointer hover:border-white/20" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

// ─── Badge ───
export function Badge({ children, color = "accent" }) {
  const colors = {
    accent: "bg-[rgba(108,99,255,0.12)] text-[#6c63ff]",
    green: "bg-[rgba(16,185,129,0.12)] text-[#10b981]",
    amber: "bg-[rgba(245,158,11,0.1)] text-[#f59e0b]",
    red: "bg-[rgba(239,68,68,0.1)] text-[#ef4444]",
    blue: "bg-[rgba(59,130,246,0.1)] text-[#3b82f6]",
  };
  return (
    <span
      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[color] || colors.accent}`}
    >
      {children}
    </span>
  );
}

// ─── Modal ───
export function Modal({ children, onClose, title, width = 480 }) {
  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="fade-in bg-gray-100 text-slate-950 border border-white/15 rounded-2xl p-6 w-full overflow-y-auto max-h-[90vh]"
        style={{ maxWidth: width }}
      >
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg font-semibold text-[#e2e8f0]">{title}</h2>
          <button
            onClick={onClose}
            className="bg-transparent border-none text-[#8892a4] cursor-pointer text-xl leading-none hover:text-[#e2e8f0]"
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ─── Stat Card ───
export function StatCard({ label, value, icon }) {
  return (
    <div className="bg-[#1e2535] rounded-xl p-4 flex flex-col gap-1">
      <div className="flex items-center gap-1.5 text-[13px] text-[#8892a4]">
        {icon && <span className="text-sm">{icon}</span>}
        {label}
      </div>
      <div className="text-2xl font-bold text-[#e2e8f0]">{value}</div>
    </div>
  );
}

// ─── Spinner ───
export function Spinner() {
  return (
    <div className="w-5 h-5 border-2 border-white/20 border-t-[#6c63ff] rounded-full animate-spin" />
  );
}

// ─── Avatar ───
export function Avatar({ name, size = "md" }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const sizes = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
  };
  return (
    <div
      className={`${sizes[size]} rounded-full bg-[rgba(108,99,255,0.15)] flex items-center justify-center font-semibold text-[#6c63ff] flex-shrink-0`}
    >
      {initials}
    </div>
  );
}
