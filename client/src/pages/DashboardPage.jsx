import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { mockCases } from "../data/mockCases";
import useAuthStore from "../store/useAuthStore";

const DashboardPage = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const [selectedCaseId, setSelectedCaseId] = useState(mockCases[0].id);
  const [activeTab, setActiveTab] = useState("overview");
  const [completedActions, setCompletedActions] = useState({});

  // Get active case data
  const activeCase =
    mockCases.find((c) => c.id === selectedCaseId) || mockCases[0];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const toggleAction = (idx) => {
    setCompletedActions((prev) => ({
      ...prev,
      [selectedCaseId + "-" + idx]: !prev[selectedCaseId + "-" + idx],
    }));
  };

  // Nav menu tabs definitions (Exactly 7 tabs)
  const tabs = [
    {
      id: "overview",
      name: "Overview",
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.8}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
          />
        </svg>
      ),
    },
    {
      id: "legal_sections",
      name: "Legal Sections",
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.8}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-.778.099-1.533.284-2.253"
          />
        </svg>
      ),
    },
    {
      id: "similar_cases",
      name: "Similar Cases",
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.8}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m11.314 11.314l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z"
          />
        </svg>
      ),
    },
    {
      id: "evidence_mapping",
      name: "Evidence Mapping",
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.8}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94-3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
          />
        </svg>
      ),
    },
    {
      id: "missing_evidence",
      name: "Missing Evidence",
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.8}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.822 7.822L21 21m-2.228-2.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
          />
        </svg>
      ),
    },
    {
      id: "analytics",
      name: "Analytics",
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.8}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white p-6 relative overflow-hidden font-sans select-none">
      {/* 1. Cinematic Radial Amber Glowing Backlights */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#C8A45D]/5 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-[#C8A45D]/5 rounded-full blur-[180px] pointer-events-none" />

      {/* 2. Top Floating Navigation Header (Identical to WorkspacePage.jsx) */}
      <header className="max-w-7xl mx-auto flex items-center justify-between pb-6 border-b border-zinc-900/60 mb-8 relative z-10">
        <Link to="/" className="flex items-center gap-3 group">
          <svg
            className="w-7 h-7 text-[#C8A45D] transition-transform group-hover:scale-105"
            viewBox="0 0 100 100"
            fill="none"
          >
            <path
              d="M50 25V75M50 75H60M50 75H40"
              stroke="currentColor"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            <path
              d="M28 35C38 32 62 32 72 35"
              stroke="currentColor"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            <circle
              cx="28"
              cy="35"
              r="3"
              fill="#000"
              stroke="currentColor"
              strokeWidth="3.5"
            />
            <circle
              cx="72"
              cy="35"
              r="3"
              fill="#000"
              stroke="currentColor"
              strokeWidth="3.5"
            />
            <circle cx="50" cy="25" r="3" fill="currentColor" />
          </svg>
          <span className="text-[#C8A45D] text-xs font-serif tracking-[0.35em] uppercase font-bold">
            NYAYVIVEK
          </span>
        </Link>

        <div className="flex items-center gap-6">
          <nav className="flex items-center gap-5 bg-zinc-950/50 border border-zinc-900 px-6 py-2.5 rounded-full backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
            <Link
              to="/dashboard"
              className="text-xs font-mono tracking-widest text-[#C8A45D] font-semibold hover:scale-105 transition-all uppercase"
            >
              DASHBOARD
            </Link>
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
            <Link
              to="/workspace"
              className="text-xs font-mono tracking-widest text-zinc-400 hover:text-white hover:scale-105 transition-all uppercase"
            >
              WORKSPACE
            </Link>
          </nav>

          <button
            type="button"
            onClick={handleLogout}
            className="text-xs font-mono tracking-widest text-zinc-500 hover:text-red-400 border border-zinc-900 hover:border-red-950/40 hover:bg-red-950/15 px-5 py-2.5 rounded-full transition-all uppercase cursor-pointer shadow-[0_4px_15px_rgba(0,0,0,0.3)] hover:shadow-[0_0_15px_rgba(239,68,68,0.15)]"
          >
            LOGOUT
          </button>
        </div>
      </header>

      {/* 3. Executive Brand and Title Header Block (Directly below navbar) */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between mb-8 relative z-10 gap-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-serif text-white tracking-wide">
              NyayVivek{" "}
              <span className="font-serif italic font-medium text-[#C8A45D] ml-2">
                Intelligence Suite
              </span>
            </h1>
          </div>
          <p className="text-zinc-400 text-xs font-sans font-light mt-2 max-w-3xl leading-relaxed">
            Interact directly with parsed criminal and commercial case profiles.
            Track corroboration states, contradiction severity ratios, and court
            tendencies.
          </p>
        </div>

        {/* Dynamic Boxed Case Selector */}
        <div className="flex items-center bg-[#050505] border border-[#C8A45D]/20 px-5 py-3 rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.9)] relative group hover:border-[#C8A45D]/40 transition-all min-w-[280px]">
          <span className="text-[10px] font-mono text-zinc-500 tracking-[0.2em] mr-3 shrink-0 uppercase font-semibold">
            CASE FILE:
          </span>
          <div className="relative flex-1">
            <select
              value={selectedCaseId}
              onChange={(e) => setSelectedCaseId(e.target.value)}
              className="w-full bg-transparent text-xs font-serif text-[#C8A45D] font-medium tracking-wide border-none outline-none cursor-pointer focus:ring-0 appearance-none pr-8 [&>option]:bg-zinc-950 [&>option]:text-white"
            >
              {mockCases.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.case_title}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none text-[#C8A45D]">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Main Dashboard Layout Grid */}
      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10 pb-16">
        {/* LEFT COLUMN: Sidebar with Profile Card & Menu links */}
        <section className="lg:col-span-4 flex flex-col gap-6">
          {/* Active Case Details Panel (Exactly matched to reference) */}
          <div className="bg-gradient-to-b from-[#0a0a0a] to-[#040404] border border-[#C8A45D]/20 rounded-2xl p-6 shadow-[0_15px_35px_rgba(0,0,0,0.9)] relative overflow-hidden group transition-all duration-300">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#C8A45D]/2 rounded-full blur-xl pointer-events-none" />

            <div className="flex items-center justify-between mb-2">
              <span className="border border-[#c5a059]/40 bg-[#c5a059]/5 text-[9px] font-mono uppercase text-[#c5a059] font-bold px-3 py-1 rounded tracking-wider">
                FULLY PROCESSED
              </span>
            </div>

            <h2 className="text-base font-serif text-white tracking-normal font-semibold leading-relaxed select-text mt-3.5">
              {activeCase.case_title}
            </h2>

            <div className="text-[10px] font-mono text-zinc-500 flex flex-wrap gap-2 items-center mt-3 pt-3 border-t border-zinc-900/60">
              <span className="text-[#C8A45D]/90 font-medium">
                {activeCase.filing_index}
              </span>
              <span className="text-zinc-800">•</span>
              <span>{activeCase.type}</span>
            </div>
          </div>

          {/* Interactive 7 Navigation Tabs Menu (Precisely Styled to reference) */}
          <div className="bg-zinc-950/40 border border-zinc-900/80 rounded-xl p-3 flex flex-col gap-1 shadow-[inset_0_1px_3px_rgba(0,0,0,0.8)]">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center justify-between text-left px-4 py-3.5 rounded-lg text-xs font-mono tracking-wider transition-all cursor-pointer relative ${
                    isActive
                      ? "bg-gradient-to-r from-[#C8A45D]/10 to-[#C8A45D]/2 border border-[#C8A45D]/40 border-l-[3px] border-l-[#C8A45D] text-[#C8A45D] font-bold shadow-[0_4px_12px_rgba(0,0,0,0.4)]"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/30 border border-transparent border-l-2 border-l-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-sm ${isActive ? "text-[#C8A45D]" : "text-zinc-500"}`}
                    >
                      {tab.icon}
                    </span>
                    <span className="uppercase">{tab.name}</span>
                  </div>
                  {isActive && (
                    <svg
                      className="w-3.5 h-3.5 text-[#C8A45D]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>

          {/* Sidebar Footer Stats (Matched to reference) */}
          <div className="bg-gradient-to-r from-zinc-950 to-zinc-900 border border-zinc-900/60 rounded-xl p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 font-semibold">
                Documents Indexed
              </span>
              <span className="text-xs font-mono text-white font-bold">
                {activeCase.indexed_files.length} Files
              </span>
            </div>
            <div className="w-full h-0.5 bg-zinc-900 rounded-full overflow-hidden relative shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)]">
              <div
                className="absolute top-0 left-0 h-full bg-[#C8A45D] rounded-full transition-all duration-500 shadow-[0_0_8px_#C8A45D]"
                style={{
                  width: `${(activeCase.indexed_files.length / 5) * 100}%`,
                }}
              />
            </div>
          </div>
        </section>

        {/* RIGHT COLUMN: Glassmorphic Main View Card */}
        <section className="lg:col-span-8 flex flex-col justify-between min-h-[640px] bg-gradient-to-b from-[#0a0a0a] to-[#030303] border border-[#C8A45D]/10 backdrop-blur-xl rounded-2xl p-8 shadow-[0_15px_40px_rgba(0,0,0,0.9)] hover:border-[#C8A45D]/20 transition-all duration-500">
          <div className="w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab + selectedCaseId}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="w-full"
              >
                {/* 3.1 VIEW: OVERVIEW */}
                {activeTab === "overview" && (
                  <div>
                    {/* Header Group */}
                    <div className="flex items-center gap-3 mb-6">
                      <svg
                        className="w-5 h-5 text-[#C8A45D]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <h3 className="text-xl font-serif text-white font-medium">
                        Case Summary Profile
                      </h3>
                    </div>

                    {/* Brief Summary paragraph */}
                    <p className="text-sm font-sans text-zinc-300 font-light leading-relaxed select-text mb-8">
                      {activeCase.brief_summary}
                    </p>

                    {/* Metadata boxes */}
                    <div className="grid grid-cols-1  sm:grid-cols-3 gap-4 mb-8">
                      <div className="border border-zinc-900/80 bg-zinc-950/20 p-4 rounded-xl">
                        <span className="text-[8px] font-mono text-zinc-500 tracking-wider uppercase block">
                          JURISDICTION VENUE
                        </span>
                        <span className="text-[11px] font-sans text-[#C8A45D] mt-1.5 block select-text font-normal leading-relaxed">
                          {activeCase.jurisdiction}
                        </span>
                      </div>

                      <div className="border border-zinc-900/80 bg-zinc-950/20 p-4 rounded-xl">
                        <span className="text-[8px] font-mono text-zinc-500 tracking-wider uppercase block">
                          DATE LOGGED
                        </span>
                        <span className="text-[11px] font-sans text-[#C8A45D]/80 mt-1.5 block select-text font-normal">
                          {activeCase.date_logged}
                        </span>
                      </div>
                    </div>

                    {/* Indexed Files Grid Table (Exactly styled like reference) */}
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#C8A45D] block mb-4 font-bold">
                        Processed Case Documents
                      </span>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="border-b border-zinc-900 text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
                              <th className="pb-3.5 font-bold">
                                DOCUMENT NAME
                              </th>
                              <th className="pb-3.5 font-bold text-right">
                                STATUS
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-zinc-900/40">
                            {activeCase.indexed_files.map((file, idx) => (
                              <tr
                                key={idx}
                                className="group hover:bg-zinc-900/10 transition-colors"
                              >
                                <td className="py-4 pr-3 flex items-center gap-3">
                                  <svg
                                    className="w-4 h-4 text-zinc-500 shrink-0"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={1.8}
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                                    />
                                  </svg>
                                  <span className="text-xs text-white font-medium select-text truncate max-w-[240px] md:max-w-xs">
                                    {file.name}
                                  </span>
                                </td>
                                <td className="py-4 text-right">
                                  <span className="inline-flex items-center gap-1.5 text-[9px] font-mono tracking-widest text-[#00E5A3] font-bold select-none">
                                    <svg
                                      className="w-3.5 h-3.5 text-[#00E5A3]"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                      strokeWidth={2.5}
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                      />
                                    </svg>
                                    {file.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3.2 VIEW: LEGAL SECTIONS */}
                {activeTab === "legal_sections" && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <svg
                        className="w-5 h-5 text-[#C8A45D]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        />
                      </svg>
                      <h2 className="text-2xl font-serif text-white tracking-wide">
                        Predicted Statutes & Provisions
                      </h2>
                    </div>
                    <p className="text-zinc-500 text-xs font-light mb-8 font-sans">
                      Semantic intelligence mapping of Indian Penal Code (IPC)
                      and statutory legal provisions predicted for matching
                      briefs.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {activeCase.predicted_sections.map((section, idx) => (
                        <div
                          key={idx}
                          className="bg-black/50 border border-zinc-900 rounded-xl p-6 relative overflow-hidden group hover:border-[#C8A45D]/30 transition-all duration-300 hover:shadow-[0_10px_25px_rgba(0,0,0,0.7)] hover:-translate-y-1"
                        >
                          <div className="absolute top-0 right-0 w-24 h-24 bg-[#C8A45D]/1 rounded-full blur-xl pointer-events-none group-hover:bg-[#C8A45D]/3 transition-colors" />
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-[8px] font-mono tracking-wider bg-zinc-950 border border-[#C8A45D]/25 text-[#C8A45D] font-bold px-2.5 py-1 rounded">
                              IPC STATUTORY SECTION
                            </span>
                            <span className="w-2 h-2 rounded-full bg-[#C8A45D]" />
                          </div>

                          <h3 className="text-lg font-serif text-white mb-3 font-semibold select-text">
                            {section}
                          </h3>

                          <div className="mt-4 pt-4 border-t border-zinc-900 flex items-center justify-between text-[9px] font-mono text-zinc-500">
                            <span>COGNIZABILITY: COGNIZABLE</span>
                            <span>ACTION: WARRANT ARREST</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3.3 VIEW: SIMILAR CASES */}
                {activeTab === "similar_cases" && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <svg
                        className="w-5 h-5 text-[#C8A45D]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                        />
                      </svg>
                      <h2 className="text-2xl font-serif text-white tracking-wide">
                        Jurisprudence Retrieval Engine
                      </h2>
                    </div>
                    <p className="text-zinc-500 text-xs font-light mb-8 font-sans">
                      Semantic indexing of historical trial logs and Supreme
                      Court precedents calculated using multidimensional cosine
                      matching indices.
                    </p>

                    <div className="space-y-5">
                      {activeCase.similar_cases.map((caseItem, idx) => (
                        <div
                          key={idx}
                          className="flex flex-col md:flex-row items-stretch border border-zinc-900 bg-black/40 rounded-xl overflow-hidden hover:border-[#C8A45D]/25 transition-all duration-300 group hover:-translate-y-0.5"
                        >
                          <div className="md:w-32 bg-zinc-950 border-r border-zinc-900 p-5 flex flex-col items-center justify-center text-center">
                            <span className="text-[8px] font-mono text-zinc-500 uppercase block mb-1">
                              COSINE SCORE
                            </span>
                            <span className="text-2xl font-serif text-[#C8A45D] font-bold block">
                              {(caseItem.similarity_score * 100).toFixed(0)}%
                            </span>
                            <span className="text-[8px] font-mono text-[#C8A45D] font-semibold block mt-1">
                              MATCH
                            </span>

                            <div className="w-full bg-zinc-900 h-1 rounded-full mt-3 overflow-hidden">
                              <div
                                className="h-full bg-[#C8A45D] rounded-full"
                                style={{
                                  width: `${caseItem.similarity_score * 100}%`,
                                }}
                              />
                            </div>
                          </div>

                          <div className="flex-1 p-6 relative">
                            <div className="absolute top-4 right-4 text-[9px] font-mono bg-zinc-950 px-2 py-0.5 text-zinc-500 rounded uppercase">
                              PRECEDENT RECORD
                            </div>
                            <h3 className="text-base font-serif text-white mb-2 font-medium tracking-wide select-text">
                              {caseItem.case_title}
                            </h3>
                            <p className="text-zinc-400 text-xs font-light leading-relaxed select-text mt-3">
                              {caseItem.summary}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3.4 VIEW: EVIDENCE MAPPING (Interactive Visual Forensics Network Flow) */}
                {activeTab === "evidence_mapping" && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <svg
                        className="w-5 h-5 text-[#C8A45D]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94-3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                        />
                      </svg>
                      <h2 className="text-2xl font-serif text-white tracking-wide">
                        Evidence Linkage Topology
                      </h2>
                    </div>
                    <p className="text-zinc-500 text-xs font-light mb-8 font-sans">
                      Holographic correlation graph showing spatial cell
                      triangulation corroboration paths against witness
                      timelines.
                    </p>

                    {/* Holographic Interactive Canvas */}
                    <div className="relative border border-zinc-900 bg-zinc-950/20 rounded-2xl p-6 h-[340px] flex items-center justify-center overflow-hidden shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]">
                      {/* Background grid texture */}
                      <div
                        className="absolute inset-0 opacity-[0.03] pointer-events-none"
                        style={{
                          backgroundImage:
                            "radial-gradient(circle, white 1px, transparent 1px)",
                          backgroundSize: "16px 16px",
                        }}
                      />

                      {/* Animated connecting flow lines using SVG */}
                      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                        {/* Connecting paths with gold glow and animation */}
                        <path
                          d="M 90,170 C 180,90 220,90 320,110"
                          stroke="rgba(200, 164, 93, 0.4)"
                          strokeWidth="1.5"
                          strokeDasharray="5,5"
                          fill="none"
                          className="animate-pulse"
                        />
                        <path
                          d="M 90,170 C 180,250 220,250 320,230"
                          stroke="rgba(200, 164, 93, 0.4)"
                          strokeWidth="1.5"
                          strokeDasharray="5,5"
                          fill="none"
                          className="animate-pulse"
                        />
                        <path
                          d="M 320,110 L 520,170"
                          stroke="rgba(200, 164, 93, 0.5)"
                          strokeWidth="2"
                          strokeDasharray="8,4"
                          fill="none"
                        />
                        <path
                          d="M 320,230 L 520,170"
                          stroke="rgba(200, 164, 93, 0.5)"
                          strokeWidth="2"
                          strokeDasharray="8,4"
                          fill="none"
                        />
                      </svg>

                      {/* Interactive Nodes */}
                      <div className="relative w-full h-full z-10 flex justify-between items-center px-4 md:px-12">
                        {/* Left Nodes - Sources */}
                        <div className="flex flex-col gap-16">
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="bg-black border border-zinc-800 p-3 rounded-lg flex items-center gap-2.5 shadow-lg max-w-[170px]"
                          >
                            <div className="w-7 h-7 bg-amber-950/30 border border-amber-900/50 flex items-center justify-center text-[#C8A45D] rounded shrink-0">
                              <span className="text-[10px] font-mono font-bold">
                                FIR
                              </span>
                            </div>
                            <div className="truncate">
                              <span className="text-[8px] font-mono text-zinc-500 block uppercase">
                                PRIMARY
                              </span>
                              <span className="text-[10px] font-serif text-white truncate block">
                                FIR_102.pdf
                              </span>
                            </div>
                          </motion.div>

                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="bg-black border border-zinc-800 p-3 rounded-lg flex items-center gap-2.5 shadow-lg max-w-[170px]"
                          >
                            <div className="w-7 h-7 bg-amber-950/30 border border-amber-900/50 flex items-center justify-center text-[#C8A45D] rounded shrink-0">
                              <span className="text-[10px] font-mono font-bold">
                                WTS
                              </span>
                            </div>
                            <div className="truncate">
                              <span className="text-[8px] font-mono text-zinc-500 block uppercase">
                                WITNESS
                              </span>
                              <span className="text-[10px] font-serif text-white truncate block">
                                Key_Witness.txt
                              </span>
                            </div>
                          </motion.div>
                        </div>

                        {/* Center Nodes - Core Forensics Synthesis */}
                        <div className="flex flex-col gap-8">
                          <motion.div
                            animate={{ scale: [1, 1.02, 1] }}
                            transition={{ repeat: Infinity, duration: 4 }}
                            className="bg-[#050505] border border-[#C8A45D]/40 p-4 rounded-xl flex flex-col items-center justify-center shadow-[0_0_20px_rgba(200,164,93,0.15)] text-center w-[150px] relative"
                          >
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[1px] bg-[#C8A45D]" />
                            <span className="text-[7px] font-mono text-[#C8A45D] tracking-[0.25em] block uppercase mb-1">
                              COGNITIVE HUB
                            </span>
                            <span className="text-xs font-serif text-white font-semibold">
                              Triangulation synthesis
                            </span>
                            <div className="w-10 h-[2px] bg-gradient-to-r from-transparent via-[#C8A45D] to-transparent mt-2" />
                          </motion.div>
                        </div>

                        {/* Right Node - Culmination Dossier */}
                        <div>
                          <motion.div
                            whileHover={{ scale: 1.08 }}
                            className="bg-gradient-to-b from-[#1b1203] to-[#040404] border border-[#C8A45D] p-4 rounded-2xl flex flex-col items-center justify-center text-center shadow-[0_0_25px_rgba(200,164,93,0.25)] w-[160px]"
                          >
                            <div className="w-9 h-9 rounded-full bg-[#C8A45D] flex items-center justify-center text-black font-bold text-lg mb-2 shadow-[0_0_15px_#C8A45D]">
                              ✓
                            </div>
                            <span className="text-[8px] font-mono text-[#C8A45D] uppercase tracking-wider block mb-1">
                              DOSSIER INDEX
                            </span>
                            <span className="text-xs font-serif text-white font-bold leading-tight">
                              State v. Singhania
                            </span>
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3.5 VIEW: CONTRADICTIONS */}

                {/* 3.6 VIEW: MISSING EVIDENCE */}
                {activeTab === "missing_evidence" && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <svg
                        className="w-5 h-5 text-red-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                      </svg>
                      <h2 className="text-2xl font-serif text-white tracking-wide">
                        Audit Warnings: Missing Evidence
                      </h2>
                    </div>
                    <p className="text-zinc-500 text-xs font-light mb-8 font-sans">
                      Automated index verification against Indian Evidence Act
                      (IEA) standards highlighting structural voids in legal
                      corroboration.
                    </p>

                    <div className="space-y-4">
                      {activeCase.missing_evidence.map((evidence, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-5 bg-gradient-to-r from-red-950/20 to-transparent border border-red-900/30 p-5 rounded-xl hover:border-red-900/50 transition-colors shadow-[0_4px_15px_rgba(239,68,68,0.02)]"
                        >
                          <div className="w-10 h-10 rounded-lg bg-red-950/30 flex items-center justify-center text-red-400 border border-red-900/30 select-none shrink-0">
                            <svg
                              className="w-5 h-5 text-red-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={1.8}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                              />
                            </svg>
                          </div>
                          <div>
                            <span className="text-[8px] font-mono text-red-400 font-bold uppercase tracking-wider block mb-1">
                              IEA EVIDENTIARY VOID DETECTED
                            </span>
                            <p className="text-sm font-serif text-zinc-200 font-light select-text">
                              {evidence}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3.7 VIEW: ANALYTICS (Interactive Actions Checklist) */}
                {activeTab === "analytics" && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <svg
                        className="w-5 h-5 text-blue-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2-h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                        />
                      </svg>
                      <h2 className="text-2xl font-serif text-white tracking-wide">
                        Investigative Operations Workflows
                      </h2>
                    </div>
                    <p className="text-zinc-500 text-xs font-light mb-8 font-sans">
                      Targeted procedural step recommendations to mitigate
                      identified evidentiary gaps and prepare courtroom
                      submissions.
                    </p>

                    <div className="space-y-4">
                      {activeCase.recommended_actions.map((action, idx) => {
                        const isDone =
                          !!completedActions[selectedCaseId + "-" + idx];
                        return (
                          <div
                            key={idx}
                            onClick={() => toggleAction(idx)}
                            className={`flex items-center justify-between border p-5 rounded-xl transition-all cursor-pointer ${
                              isDone
                                ? "bg-emerald-950/10 border-emerald-900/50"
                                : "border-zinc-900 bg-black/40 hover:border-zinc-800"
                            }`}
                          >
                            <div className="flex items-center gap-5">
                              <span
                                className={`text-2xl font-serif font-bold tracking-tight transition-colors ${isDone ? "text-emerald-400" : "text-[#C8A45D]"}`}
                              >
                                0{idx + 1}
                              </span>
                              <div>
                                <span
                                  className={`text-[8px] font-mono font-bold uppercase tracking-wider block mb-1 ${isDone ? "text-emerald-500" : "text-zinc-500"}`}
                                >
                                  TARGETED INVESTIGATION ACTION ITEM
                                </span>
                                <p
                                  className={`text-sm font-sans font-light select-text transition-all ${isDone ? "text-zinc-500 line-through" : "text-zinc-200"}`}
                                >
                                  {action}
                                </p>
                              </div>
                            </div>

                            <div className="shrink-0 pl-4">
                              {isDone ? (
                                <span className="text-[9px] font-mono tracking-widest text-emerald-400 border border-emerald-950 bg-emerald-950/20 px-3.5 py-2 rounded uppercase font-bold flex items-center gap-1.5 shadow-[0_0_10px_rgba(16,185,129,0.15)] select-none">
                                  ✓ COMPLETED
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleAction(idx);
                                  }}
                                  className="text-[9px] font-mono tracking-widest text-[#C8A45D] border border-[#C8A45D]/30 hover:border-[#C8A45D] hover:bg-[#C8A45D] hover:text-black px-4 py-2 rounded transition-all uppercase cursor-pointer"
                                >
                                  EXECUTE
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* RIGHT COLUMN: Footer buttons wrapper */}
          <div className="flex flex-col sm:flex-row items-center justify-between border-t border-zinc-900 pt-6 mt-8 gap-4 select-none">
            <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">
              NyayVivek Core Index • Mapped in deep dark precision
            </span>
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <button
                onClick={() => navigate("/workspace")}
                className="flex-1 sm:flex-initial text-[10px] font-mono tracking-widest bg-[#C8A45D] hover:bg-[#d6b570] text-black font-bold px-6 py-3 rounded hover:shadow-[0_0_25px_rgba(200,164,93,0.3)] transition-all cursor-pointer flex items-center justify-center gap-1 uppercase"
              >
                ANALYZE ANOTHER BRIEF{" "}
                <span className="font-sans font-bold">&gt;</span>
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default DashboardPage;
