import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import { toast, Toaster } from "sonner";
import { FaRegCircleCheck } from "react-icons/fa6";
import { BiError } from "react-icons/bi";
import { RiErrorWarningLine } from "react-icons/ri";

const ANALYZING_STEPS = [
  "Parsing document structure…",
  "Checking ATS keyword density…",
  "Evaluating section completeness…",
  "Scoring clarity and formatting…",
  "Generating interview questions…",
  "Finalising your report…",
];

const ScoreRing = ({ score }) => {
  const radius = 52;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (circ * score) / 100;
  const color = score >= 85 ? "#10b981" : score >= 65 ? "#f59e0b" : "#ef4444";

  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      <circle cx="60" cy="60" r={radius} fill="none" stroke="#374151" strokeWidth="8" />
      <circle
        cx="60" cy="60" r={radius}
        fill="none"
        stroke={color}
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        transform="rotate(-90 60 60)"
        style={{ transition: "stroke-dashoffset 1.2s ease" }}
      />
      <text x="60" y="56" textAnchor="middle" fill={color} fontSize="22" fontWeight="600">{score}</text>
      <text x="60" y="72" textAnchor="middle" fill="#6b7280" fontSize="11">/100</text>
    </svg>
  );
};

const ScoreBadge = ({ score }) => {
  const config =
    score >= 85
      ? { label: "Excellent", bg: "bg-emerald-900/40", text: "text-emerald-400" }
      : score >= 65
      ? { label: "Good", bg: "bg-amber-900/40", text: "text-amber-400" }
      : { label: "Needs Work", bg: "bg-red-900/40", text: "text-red-400" };
  return (
    <span className={`text-xs font-medium px-3 py-1 rounded-full ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
};

const AnalyzingView = ({ fileName }) => {
  const [stepIdx, setStepIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStepIdx((prev) => (prev + 1) % ANALYZING_STEPS.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center gap-5 px-6 py-16 border border-dashed border-emerald-800/60 rounded-2xl bg-gray-800/30 backdrop-blur-sm text-center">
      {/* Spinner */}
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 rounded-full border-4 border-emerald-900/40" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-emerald-400 animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
          </svg>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold text-emerald-400">Analysing your resume…</h2>
        {fileName && (
          <p className="text-sm text-gray-400 truncate max-w-xs">{fileName}</p>
        )}
      </div>

      <div className="bg-gray-800/60 rounded-xl px-6 py-4 flex flex-col gap-1 max-w-sm w-full">
        <p className="text-sm text-white font-medium">Please wait · This takes 1–2 minutes</p>
        <p className="text-xs text-gray-400">We're scanning for ATS compatibility, section completeness, keyword density, and more.</p>
      </div>

      {/* Step label */}
      <p className="text-xs text-emerald-600 min-h-[16px] transition-all duration-500">
        {ANALYZING_STEPS[stepIdx]}
      </p>

      {/* Animated dots */}
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-2 h-2 rounded-full bg-emerald-500 opacity-40"
            style={{ animation: `pulse 1.4s ease-in-out ${i * 0.2}s infinite` }}
          />
        ))}
      </div>

      <style>{`@keyframes pulse { 0%,100%{opacity:.3} 50%{opacity:1} }`}</style>
    </div>
  );
};

const ResumeScreening = () => {
  const VITE_API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  const fileInputRef = useRef(null);
  const [uploadState, setUploadState] = useState({
    file: null,
    loading: false,
    response: null,
    error: null,
  });
  const [expandedCategory, setExpandedCategory] = useState(null);

  const toggleCategory = (category) => {
    setExpandedCategory((prev) => (prev === category ? null : category));
  };

  const uploadFileToServer = async (file) => {
    const formData = new FormData();
    formData.append("resume", file);
    formData.append("userId", localStorage.getItem("userId") || "anonymous");
    await axios.post(`${VITE_API_URL}/resume/upload`, formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "multipart/form-data",
      },
    });
  };

  const handleFileSelection = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (selectedFile.size > 20 * 1024 * 1024) {
      toast.error("File should be less than 20MB");
      return;
    }

    setUploadState({ file: selectedFile, loading: true, response: null, error: null });

    const form = new FormData();
    form.append("file", selectedFile);

    try {
      await uploadFileToServer(selectedFile);

      const response = await axios.post("https://kpeduresumeapi.vercel.app/", form);
      let responseData = response.data;
      if (typeof responseData === "string") {
        responseData = JSON.parse(responseData);
      }
      setUploadState((prev) => ({ ...prev, loading: false, response: responseData }));
    } catch (error) {
      setUploadState({ file: null, loading: false, response: null, error: "Something went wrong" });
      toast.error("Something went wrong");
    }
  };

  const { file, loading, response } = uploadState;

  // Normalise key casing from API (handles both "Issues List" and "Issues list" etc.)
  const atsScore = response?.["ATS Score"];
  const breakdown = response?.["Breakdown"];
  const issuesList = response?.["Issues List"] || response?.["Issues list"] || [];
  const sectionAvailability = response?.["Section Availability"] || response?.["Section availability"];
  const resumeSummary = response?.["Resume Summary"];
  const improvementSuggestions = response?.["Improvement Suggestions"];
  const interviewQA = response?.["Interview Questions with Answers"];

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12 px-4">
      <Toaster richColors position="top-right" />
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4 bg-clip-text text-center text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-600">
          Resume &amp; Interview Prep
        </h1>
        <p className="text-base text-gray-400 text-center mb-10 max-w-xl mx-auto">
          Enhance your resume with AI-powered suggestions, and prepare for interviews with questions tailored to your resume
        </p>

        {/* Upload View */}
        {!loading && !response && (
          <div className="flex flex-col items-center justify-center gap-5 px-6 py-14 border border-dashed border-emerald-800/60 rounded-2xl bg-gray-800/20 backdrop-blur-sm max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-900/40 flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="12" y1="18" x2="12" y2="12"/>
                <line x1="9" y1="15" x2="15" y2="15"/>
              </svg>
            </div>
            <div className="text-center">
              <p className="text-base font-medium text-white mb-1">Upload your resume</p>
              <p className="text-sm text-gray-400">PDF format only · AI-powered analysis</p>
            </div>
            <input ref={fileInputRef} type="file" accept=".pdf" onChange={handleFileSelection} className="hidden" />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 px-6 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/>
                <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
              </svg>
              Choose resume
            </button>
            <p className="text-xs text-emerald-700">Max file size: 20MB</p>
          </div>
        )}

        {/* Analyzing View */}
        {loading && <AnalyzingView fileName={file?.name} />}

        {/* Results View */}
        {response && (
          <div className="w-full space-y-5">
            <button
              onClick={() => setUploadState({ file: null, loading: false, response: null, error: null })}
              className="flex items-center gap-2 border border-emerald-700 text-emerald-400 hover:bg-emerald-900/30 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              ↑ Upload new resume
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* Left Panel */}
              <div className="lg:col-span-1 flex flex-col gap-4 px-5 py-7 bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700">
                {/* Score */}
                <div className="flex flex-col items-center gap-2 pb-6 border-b border-gray-700">
                  <p className="text-sm text-gray-400">ATS Score</p>
                  <ScoreRing score={atsScore} />
                  <ScoreBadge score={atsScore} />
                  {issuesList.length > 0 && (
                    <p className="text-xs text-gray-500">{issuesList.length} issue{issuesList.length > 1 ? "s" : ""} found</p>
                  )}
                </div>

                {/* Breakdown */}
                {breakdown && (
                  <div>
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Score Breakdown</p>
                    <div className="grid grid-cols-3 gap-2">
                      {Object.entries(breakdown).map(([key, val]) => (
                        <div key={key} className="flex flex-col items-center bg-gray-800/50 rounded-lg py-2 px-1">
                          <span className="text-base font-semibold text-emerald-400">{val}</span>
                          <span className="text-[10px] text-gray-500 capitalize mt-0.5 text-center">{key}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Issues */}
                {issuesList.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Issues</p>
                    <div className="flex flex-col gap-1.5">
                      {issuesList.map((issue, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-gray-300 capitalize p-2 rounded-md bg-gray-800/50 hover:bg-gray-800 transition-colors text-sm">
                          <BiError className="text-amber-400 flex-shrink-0" />
                          {issue}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Section Availability */}
                {sectionAvailability && (
                  <div>
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Sections</p>
                    <div className="flex flex-col gap-1.5">
                      {Object.entries(sectionAvailability).map(([key, value], idx) => (
                        <div key={idx} className="flex items-center gap-2 text-gray-300 p-2 rounded-md bg-gray-800/50 hover:bg-gray-800 transition-colors text-sm">
                          {value === false
                            ? <RiErrorWarningLine className="text-red-400 flex-shrink-0" />
                            : <FaRegCircleCheck className="text-emerald-400 flex-shrink-0" />}
                          {key}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Panel */}
              <div className="lg:col-span-2 flex flex-col gap-4">
                {/* Summary */}
                {resumeSummary && (
                  <div className="flex flex-col gap-3 px-5 sm:px-8 py-7 bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700">
                    <div className="mb-1">
                      <h2 className="text-lg text-emerald-300 font-semibold flex items-center gap-2">
                        <span className="inline-block w-1.5 h-5 bg-emerald-400 rounded-sm" />
                        Summary
                      </h2>
                      <p className="text-xs text-gray-500 mt-0.5">A short overview of your resume</p>
                    </div>
                    <p className="text-sm text-gray-200 leading-relaxed">{resumeSummary}</p>
                  </div>
                )}

                {/* Improvements */}
                {improvementSuggestions?.length > 0 && (
                  <div className="flex flex-col gap-3 px-5 sm:px-8 py-7 bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700">
                    <div className="mb-1">
                      <h2 className="text-lg text-emerald-300 font-semibold flex items-center gap-2">
                        <span className="inline-block w-1.5 h-5 bg-emerald-400 rounded-sm" />
                        Improvements
                      </h2>
                      <p className="text-xs text-gray-500 mt-0.5">Suggestions to align with industry standards</p>
                    </div>
                    {improvementSuggestions.map((improvement, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 rounded-md bg-gray-800/50 hover:bg-gray-800 transition-colors">
                        <span className="font-bold text-emerald-400 min-w-4 mt-0.5">•</span>
                        <p className="text-sm text-gray-200 leading-relaxed">{improvement}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Interview Questions */}
                {interviewQA?.length > 0 && (
                  <div className="flex flex-col gap-3 px-5 sm:px-8 py-7 bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700">
                    <div className="mb-1">
                      <h2 className="text-lg text-emerald-300 font-semibold flex items-center gap-2">
                        <span className="inline-block w-1.5 h-5 bg-emerald-400 rounded-sm" />
                        Interview Questions
                      </h2>
                      <p className="text-xs text-gray-500 mt-0.5">Practice questions tailored just for you</p>
                    </div>
                    {interviewQA.map((item, idx) => (
                      <div key={idx} className="border border-gray-700 rounded-lg overflow-hidden">
                        <button
                          className="w-full px-4 py-3 bg-gray-800/70 hover:bg-gray-800 text-left font-medium text-emerald-200 flex justify-between items-center transition-colors cursor-pointer text-sm gap-3"
                          onClick={() => toggleCategory(idx)}
                        >
                          <span>{item.Question}</span>
                          <span className="text-lg text-gray-500 flex-shrink-0">
                            {expandedCategory === idx ? "−" : "+"}
                          </span>
                        </button>
                        {expandedCategory === idx && (
                          <div className="p-4 bg-gray-800/40">
                            <div className="flex items-start gap-3 p-3 rounded-md bg-gray-800/50">
                              <span className="font-bold text-emerald-400 min-w-5 text-sm">A.</span>
                              <p className="text-sm text-gray-200 leading-relaxed">{item.Answer}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeScreening;