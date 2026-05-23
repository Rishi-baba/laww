import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const PreviewDemoModal = ({ isOpen, onClose, onGetStarted }) => {
  const [activeStep, setActiveStep] = useState(1);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simProgress, setSimProgress] = useState(0);
  const [simStepMsg, setSimStepMsg] = useState('Staged and ready for AI scanning');
  const [simFinished, setSimFinished] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);

  const startSimulation = () => {
    setIsSimulating(true);
    setSimFinished(false);
    setSimProgress(0);
    
    const steps = [
      { progress: 20, msg: '1. Reading uploaded PDF case briefs...' },
      { progress: 45, msg: '2. Running automated OCR & scanned text extraction...' },
      { progress: 70, msg: '3. Processing facts, witness statements, and dates...' },
      { progress: 90, msg: '4. Executing AI evidence correlation matching...' },
      { progress: 100, msg: '5. Case analysis report complete. Saved to database!' }
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setSimProgress(steps[currentStep].progress);
        setSimStepMsg(steps[currentStep].msg);
        currentStep++;
      } else {
        clearInterval(interval);
        setIsSimulating(false);
        setSimFinished(true);
      }
    }, 900);
  };

  const stepsHeader = [
    { id: 1, name: '1. AI File Scan' },
    { id: 2, name: '2. Court Trends' },
    { id: 3, name: '3. Legal Outcomes' }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/90 backdrop-blur-md px-4 select-none">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 cursor-pointer"
          />

          {/* Modal Card Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="relative max-w-4xl w-full border border-[#C8A45D]/20 bg-[#050505] p-8 md:p-10 rounded-3xl shadow-[0_30px_70px_rgba(0,0,0,0.95),_0_0_40px_rgba(200,164,93,0.06)] overflow-hidden z-10"
          >
            {/* Background luxury elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#C8A45D]/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#C8A45D]/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#C8A45D]/30 to-transparent" />

            {/* Modal Header */}
            <div className="flex justify-between items-start mb-8 pb-4 border-b border-zinc-900/60">
              <div>
                <span className="text-[9px] font-mono font-bold tracking-[0.25em] text-[#C8A45D] block uppercase mb-1.5 animate-pulse">
                  SYSTEM SIMULATOR
                </span>
                <h2 className="text-2xl font-serif text-white tracking-wide">
                  NyayVivek Core Features Demo
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 border border-zinc-900 text-zinc-500 hover:text-white hover:border-zinc-700 bg-zinc-950 rounded-full transition-all cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Step Wizard Nav indicators */}
            <div className="grid grid-cols-3 gap-3 md:gap-4 mb-8">
              {stepsHeader.map((step) => {
                const isActive = activeStep === step.id;
                const isCompleted = activeStep > step.id;
                return (
                  <button
                    key={step.id}
                    onClick={() => {
                      if (step.id === 2 && !simFinished && activeStep === 1) {
                        // Prompt user to simulate first
                        return;
                      }
                      setActiveStep(step.id);
                    }}
                    className={`text-left p-3.5 border rounded-xl transition-all cursor-pointer ${
                      isActive
                        ? 'bg-zinc-950 border-[#C8A45D]/65 shadow-[0_4px_15px_rgba(200,164,93,0.15)] text-[#C8A45D]'
                        : isCompleted
                        ? 'border-zinc-800 bg-zinc-950/40 text-zinc-500 hover:text-zinc-300'
                        : 'border-zinc-900 bg-black/20 text-zinc-600 pointer-events-none'
                    }`}
                  >
                    <span className="text-[10px] font-mono font-bold tracking-widest block uppercase">
                      {step.name}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Step Content wrapper */}
            <div className="min-h-[280px] mb-8 relative">
              {/* STEP 1: AI FILE SCAN SIMULATOR */}
              {activeStep === 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="flex flex-col md:flex-row gap-8"
                >
                  <div className="flex-1">
                    <h3 className="text-lg font-serif text-white mb-2">
                      Scan Case Documents dynamically
                    </h3>
                    <p className="text-zinc-400 text-xs font-sans font-light leading-relaxed mb-6">
                      NyayVivek automatically scans incoming litigation files, reads scanned pages using an offline OCR pipeline, and structures evidence details into structured case files.
                    </p>

                    {/* Simulation trigger button */}
                    <button
                      onClick={startSimulation}
                      disabled={isSimulating}
                      className="px-6 py-3.5 bg-black border border-[#C8A45D]/30 text-[#C8A45D] hover:text-black hover:bg-[#C8A45D] hover:border-[#C8A45D] text-[10px] font-mono font-bold tracking-widest uppercase rounded-lg transition-all duration-300 active:scale-[0.98] shadow-[0_4px_15px_rgba(200,164,93,0.1)] cursor-pointer disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
                    >
                      {isSimulating ? 'SCANNING...' : simFinished ? 'RUN SCAN AGAIN' : 'START SIMULATED SCAN'}
                    </button>
                  </div>

                  {/* Right container: Live Simulation Display */}
                  <div className="w-full md:w-[360px] bg-black border border-zinc-900 rounded-2xl p-5 flex flex-col justify-between shadow-[inset_0_1px_4px_rgba(0,0,0,0.8)]">
                    <div>
                      <div className="flex justify-between items-center mb-3 pb-2 border-b border-zinc-900/60 text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
                        <span>AI Document Pipeline</span>
                        <span className={simFinished ? 'text-[#C8A45D]' : 'text-zinc-600'}>
                          {simFinished ? 'COMPLETED' : isSimulating ? 'ACTIVE' : 'IDLE'}
                        </span>
                      </div>

                      {/* Mock files staging list */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between bg-zinc-950/60 border border-zinc-900/60 p-3 rounded-lg text-xs font-serif text-zinc-300">
                          <span className="truncate">CRA_brief_final.pdf</span>
                          <span className="text-[9px] font-mono text-zinc-500">PDF Document</span>
                        </div>
                        <div className="flex items-center justify-between bg-zinc-950/60 border border-zinc-900/60 p-3 rounded-lg text-xs font-serif text-zinc-300">
                          <span className="truncate">Key_Witness_Statement.pdf</span>
                          <span className="text-[9px] font-mono text-zinc-500">PDF Document</span>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar & Status Msg */}
                    <div className="mt-4">
                      <p className="text-[9px] font-mono text-[#C8A45D] uppercase tracking-wider mb-2 h-4 truncate">
                        {simStepMsg}
                      </p>
                      <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#DFBA73] to-[#C8A45D] transition-all duration-500"
                          style={{ width: `${simProgress}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center mt-2 text-[9px] font-mono text-zinc-600">
                        <span>CORE ENGINE</span>
                        <span className="text-[#C8A45D] font-bold">{simProgress}%</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: COURT TRENDS SIMULATOR */}
              {activeStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="flex flex-col gap-5"
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <h3 className="text-lg font-serif text-white mb-1">
                        Courtroom Trends & Predicted Outcomes
                      </h3>
                      <p className="text-zinc-400 text-xs font-sans font-light leading-relaxed">
                        NyayVivek synthesizes deep judgment pattern analytics based on courtroom historical trends.
                      </p>
                    </div>
                  </div>

                  {/* Compact simulated Trends card matching the actual cockpit */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#070707]/60 border border-[#C8A45D]/15 rounded-2xl p-5 shadow-2xl relative overflow-hidden select-none">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-[#C8A45D]/2 rounded-full blur-xl pointer-events-none" />
                    
                    {/* Left Column: Outcome Themes */}
                    <div>
                      <span className="text-[8.5px] font-mono text-[#8c672b] uppercase tracking-[0.2em] block mb-3 border-b border-[#C8A45D]/10 pb-1.5 font-black">
                        OUTCOME THEMES
                      </span>
                      <div className="space-y-3">
                        {[
                          { name: 'Guilty', val: 48 },
                          { name: 'Not Guilty', val: 48 },
                          { name: 'Petition Allowed', val: 38 }
                        ].map((item, i) => (
                          <div key={i} className="flex flex-col gap-0.5">
                            <div className="flex justify-between text-[11px] font-sans text-zinc-300">
                              <span>{item.name}</span>
                              <span className="text-[#C8A45D] font-bold font-mono">{item.val}%</span>
                            </div>
                            <div className="w-full h-[1.5px] bg-[#2a251e]/40 rounded-full mt-0.5 overflow-hidden">
                              <div className="h-full bg-[#C8A45D] rounded-full" style={{ width: `${item.val}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Right Column: Custody Trends & Case Type */}
                    <div className="flex flex-col justify-between">
                      <div>
                        <span className="text-[8.5px] font-mono text-[#8c672b] uppercase tracking-[0.2em] block mb-3 border-b border-[#C8A45D]/10 pb-1.5 font-black">
                          INTERIM RELIEF / CUSTODY TRENDS
                        </span>
                        <div className="space-y-3">
                          {[
                            { name: 'Accused remained convicted...', val: 40 },
                            { name: 'Accused acquitted and released...', val: 28 }
                          ].map((item, i) => (
                            <div key={i} className="flex flex-col gap-0.5">
                              <div className="flex justify-between text-[11px] font-sans text-zinc-300">
                                <span className="truncate max-w-[160px] block">{item.name}</span>
                                <span className="text-[#C8A45D] font-bold font-mono">{item.val}%</span>
                              </div>
                              <div className="w-full h-[1.5px] bg-[#2a251e]/40 rounded-full mt-0.5 overflow-hidden">
                                <div className="h-full bg-[#C8A45D] rounded-full" style={{ width: `${item.val}%` }} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Small Case Type Box */}
                      <div className="mt-3.5 bg-black/60 border border-zinc-900 px-3 py-1.5 rounded-lg flex items-center justify-between">
                        <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest font-bold">CASE TYPE:</span>
                        <span className="text-[9px] font-serif text-[#C8A45D] font-black uppercase tracking-[0.1em] border border-[#C8A45D]/25 bg-[#C8A45D]/5 px-2 py-0.5 rounded">
                          CRIMINAL
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: LEGAL OUTCOMES & MATCHED JUDGMENTS */}
              {activeStep === 3 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="flex flex-col md:flex-row gap-8"
                >
                  <div className="flex-1">
                    <h3 className="text-lg font-serif text-white mb-2">
                      Outcomes & Judgments Matches
                    </h3>
                    <p className="text-zinc-400 text-xs font-sans font-light leading-relaxed mb-6">
                      NyayVivek matches similar rulings automatically using database libraries. It maps matching indices, judge relief averages, and defense actions directly onto active case reports.
                    </p>

                    <div className="flex flex-wrap gap-4">
                      <div className="flex-1 min-w-[200px] border border-zinc-900 bg-zinc-950/40 p-4 rounded-xl shadow-lg">
                        <span className="text-[8px] font-mono text-[#C8A45D] uppercase tracking-wider block mb-1">AVERAGE RELIEF LEVEL</span>
                        <div className="text-2xl font-serif text-white font-bold mb-1">72.4% Relief Granted</div>
                        <p className="text-[10px] text-zinc-500 leading-relaxed font-sans">For eyewitness timeline contradiction precedents.</p>
                      </div>
                      <div className="flex-1 min-w-[200px] border border-zinc-900 bg-zinc-950/40 p-4 rounded-xl shadow-lg">
                        <span className="text-[8px] font-mono text-[#C8A45D] uppercase tracking-wider block mb-1">JUDICIAL PRECEDENT</span>
                        <div className="text-2xl font-serif text-white font-bold mb-1">State v. Jeesan (2024)</div>
                        <p className="text-[10px] text-zinc-500 leading-relaxed font-sans">High Court rejected eyewitness claims due to phone GPS data.</p>
                      </div>
                    </div>
                  </div>

                  {/* Simulation summary overview */}
                  <div className="w-full md:w-[300px] border border-[#C8A45D]/20 bg-gradient-to-b from-[#120a03] to-[#040404] p-5 rounded-2xl text-center flex flex-col justify-center items-center shadow-[0_0_20px_rgba(200,164,93,0.15)] shrink-0">
                    <div className="w-10 h-10 rounded-full bg-[#C8A45D] flex items-center justify-center text-black font-bold text-lg mb-3 shadow-[0_0_15px_#C8A45D]">
                      ✓
                    </div>
                    <h4 className="text-sm font-serif text-white font-semibold mb-2">
                      Ready to Analyze Your Own Case Files?
                    </h4>
                    <p className="text-zinc-400 text-[10px] font-sans font-light leading-relaxed mb-5">
                      Upload your standard PDF court files to construct custom Evidence Correlation Maps and unlock relief stats automatically.
                    </p>
                    <button
                      onClick={onGetStarted}
                      className="w-full py-3 bg-[#C8A45D] hover:bg-[#d6b570] text-black font-bold text-[10px] font-mono tracking-widest uppercase rounded shadow-[0_0_15px_rgba(200,164,93,0.2)] hover:shadow-[0_0_25px_rgba(200,164,93,0.4)] transition-all duration-300 cursor-pointer"
                    >
                      GET STARTED NOW
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Modal Controls */}
            <div className="flex justify-between items-center border-t border-zinc-900/60 pt-6">
              <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
                NYAYVIVEK // PREVIEW DEMO SUITE
              </span>
              
              <div className="flex gap-4">
                {activeStep > 1 && (
                  <button
                    onClick={() => setActiveStep(prev => prev - 1)}
                    className="px-5 py-2.5 border border-zinc-900 bg-zinc-950 hover:bg-zinc-900/30 hover:border-zinc-700 text-zinc-400 hover:text-white text-[9px] font-mono font-bold tracking-widest uppercase rounded-lg transition-all cursor-pointer"
                  >
                    BACK
                  </button>
                )}
                {activeStep < 3 && (
                  <button
                    onClick={() => {
                      if (activeStep === 1 && !simFinished) {
                        startSimulation();
                        return;
                      }
                      setActiveStep(prev => prev + 1);
                    }}
                    className="px-6 py-2.5 border border-[#C8A45D]/40 bg-[#C8A45D]/5 text-[#C8A45D] hover:text-black hover:bg-[#C8A45D] hover:border-[#C8A45D] text-[9px] font-mono font-bold tracking-widest uppercase rounded-lg transition-all cursor-pointer shadow-[0_4px_10px_rgba(200,164,93,0.05)]"
                  >
                    {activeStep === 1 && !simFinished ? 'RUN SCAN' : 'NEXT STEP >'}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
