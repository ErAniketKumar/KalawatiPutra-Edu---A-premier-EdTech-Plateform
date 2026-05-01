import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import ReactMarkdown from 'react-markdown';
import { getProblem, runCode, runWithSamples, submitSolution, getUserSubmissions } from '../../api/problems';
import { Play, Send, RotateCcw, CheckCircle, XCircle, AlertTriangle, Terminal, ArrowLeft, Clock, Cpu, History, Lightbulb, Database, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';

const DSA_LANGUAGES = [
    { id: 71, name: 'Python', value: 'python', defaultCode: `class Solution:
    def solve(self):
        # Write your code here
        pass` },
    { id: 63, name: 'JavaScript', value: 'javascript', defaultCode: `/**
 * @return {any}
 */
var solve = function() {
    // Write your code here
};` },
    { id: 54, name: 'C++', value: 'cpp', defaultCode: `#include <vector>
using namespace std;

class Solution {
public:
    // Write your code here
};` },
    { id: 62, name: 'Java', value: 'java', defaultCode: `class Solution {
    // Write your code here
}` },
    { id: 50, name: 'C', value: 'c', defaultCode: `#include <stdlib.h>

// Write your code here` }
];

const SQL_LANGUAGES = [
    { id: 82, name: 'SQL', value: 'sql', defaultCode: '-- Write your SQL query here\nSELECT * FROM table_name;' }
];

const ProblemDetail = () => {
    const { slug } = useParams();
    const [problem, setProblem] = useState(null);
    const [loading, setLoading] = useState(true);

    // Editor State
    const [language, setLanguage] = useState(DSA_LANGUAGES[0]);
    const [code, setCode] = useState(DSA_LANGUAGES[0].defaultCode);
    const [customInput, setCustomInput] = useState('');
    const [useCustomInput, setUseCustomInput] = useState(false);

    // Execution State
    const [isRunning, setIsRunning] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [output, setOutput] = useState(null);
    const [activeTab, setActiveTab] = useState('description');
    const [submissions, setSubmissions] = useState([]);
    const [showHints, setShowHints] = useState(false);

    // Panel sizes
    const [leftPanelWidth, setLeftPanelWidth] = useState(50);

    useEffect(() => {
        fetchProblem();
    }, [slug]);

    const fetchProblem = async () => {
        try {
            const res = await getProblem(slug);
            setProblem(res.data);

            // Set appropriate language list based on problem type
            const languages = res.data.problemType === 'SQL' ? SQL_LANGUAGES : DSA_LANGUAGES;
            const defaultLang = languages[0];
            setLanguage(defaultLang);

            // Try to find default code for current language from DB
            if (res.data.defaultCode && res.data.defaultCode.length > 0) {
                const dbTemplate = res.data.defaultCode.find(dc => dc.language === defaultLang.value);
                if (dbTemplate) {
                    setCode(dbTemplate.code);
                } else {
                    setCode(defaultLang.defaultCode);
                }
            } else {
                setCode(defaultLang.defaultCode);
            }

            // Set first sample case as custom input
            if (res.data.sampleCases?.[0]?.input) {
                setCustomInput(res.data.sampleCases[0].input);
            }

            // Fetch submissions
            fetchSubmissions(res.data._id);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load problem");
        } finally {
            setLoading(false);
        }
    };

    const fetchSubmissions = async (problemId) => {
        try {
            const res = await getUserSubmissions(problemId);
            setSubmissions(res.data);
        } catch (err) {
            console.error("Failed to fetch submissions:", err);
        }
    };

    const getLanguages = () => {
        return problem?.problemType === 'SQL' ? SQL_LANGUAGES : DSA_LANGUAGES;
    };

    const handleLanguageChange = (e) => {
        const languages = getLanguages();
        const selectedLang = languages.find(l => l.value === e.target.value);
        setLanguage(selectedLang);

        if (problem && problem.defaultCode) {
            const dbTemplate = problem.defaultCode.find(dc => dc.language === selectedLang.value);
            if (dbTemplate) {
                setCode(dbTemplate.code);
                return;
            }
        }
        setCode(selectedLang.defaultCode);
    };

    const handleReset = () => {
        if (problem && problem.defaultCode) {
            const dbTemplate = problem.defaultCode.find(dc => dc.language === language.value);
            if (dbTemplate) {
                setCode(dbTemplate.code);
                toast.success("Code reset to template");
                return;
            }
        }
        setCode(language.defaultCode);
        toast.success("Code reset to default");
    };

    const handleRun = async () => {
        setIsRunning(true);
        setActiveTab('testcase');
        setOutput(null);
        
        try {
            if (useCustomInput) {
                // Run with custom input
                const res = await runCode({
                    code,
                    languageId: language.id,
                    input: customInput,
                    slug
                });
                setOutput({
                    type: 'custom',
                    result: res.data
                });
            } else {
                // Run against all sample test cases
                const res = await runWithSamples({
                    code,
                    languageId: language.id,
                    slug
                });
                setOutput({
                    type: 'samples',
                    result: res.data
                });
            }
        } catch (err) {
            console.error("Run failed:", err);
            const msg = err.response?.data?.error || err.response?.data?.msg || "Execution failed";
            toast.error(msg);
            setOutput({
                type: 'error',
                result: { error: msg }
            });
        } finally {
            setIsRunning(false);
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setActiveTab('testcase');
        setOutput(null);
        
        try {
            const res = await submitSolution({
                code,
                languageId: language.id,
                problemId: problem._id
            });
            
            setOutput({
                type: 'submit',
                result: res.data
            });
            
            if (res.data.status === 'Accepted') {
                toast.success("Solution Accepted!", { icon: '🎉' });
            } else {
                toast.error(`Verdict: ${res.data.status}`);
            }

            // Refresh submissions
            fetchSubmissions(problem._id);
        } catch (err) {
            console.error("Submit failed:", err);
            const msg = err.response?.data?.error || err.response?.data?.msg || "Submission failed";
            toast.error(msg);
            setOutput({
                type: 'error',
                result: { error: msg }
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatTime = (date) => {
        return new Date(date).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Accepted': return 'text-emerald-400';
            case 'Wrong Answer': return 'text-rose-400';
            case 'Time Limit Exceeded': return 'text-amber-400';
            case 'Compilation Error': return 'text-orange-400';
            case 'Runtime Error': return 'text-red-400';
            default: return 'text-gray-400';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
                <div className="flex items-center gap-3">
                    <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                    <span>Loading Problem...</span>
                </div>
            </div>
        );
    }

    if (!problem) {
        return (
            <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center gap-4">
                <XCircle size={48} className="text-rose-400" />
                <p className="text-xl">Problem not found</p>
                <Link to="/labs" className="text-emerald-400 hover:underline">Back to Problems</Link>
            </div>
        );
    }

    return (
        <div className="h-screen bg-gray-950 text-gray-200 flex flex-col overflow-hidden">
            {/* Header */}
            <header className="h-14 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-4 flex-shrink-0">
                <div className="flex items-center gap-3">
                    <Link to="/labs" className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-white">
                        <ArrowLeft size={20} />
                    </Link>
                    <div className="flex items-center gap-3">
                        <h1 className="font-semibold text-lg truncate max-w-xs md:max-w-md">{problem.title}</h1>
                        <span className={`px-2.5 py-0.5 rounded text-xs font-medium border ${
                            problem.difficulty === 'Easy' ? 'border-emerald-500/50 text-emerald-400 bg-emerald-500/10' :
                            problem.difficulty === 'Medium' ? 'border-amber-500/50 text-amber-400 bg-amber-500/10' :
                            'border-rose-500/50 text-rose-400 bg-rose-500/10'
                        }`}>{problem.difficulty}</span>
                        {problem.problemType === 'SQL' && (
                            <span className="flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-purple-500/10 text-purple-400 border border-purple-500/30">
                                <Database size={12} /> SQL
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <select
                        value={language.value}
                        onChange={handleLanguageChange}
                        className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm focus:ring-emerald-500 focus:border-emerald-500"
                    >
                        {getLanguages().map(lang => (
                            <option key={lang.id} value={lang.value}>{lang.name}</option>
                        ))}
                    </select>

                    <button
                        onClick={handleReset}
                        className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors text-gray-400 hover:text-white"
                        title="Reset Code"
                    >
                        <RotateCcw size={16} />
                    </button>

                    <button
                        onClick={handleRun}
                        disabled={isRunning || isSubmitting}
                        className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors text-sm font-medium disabled:opacity-50"
                    >
                        {isRunning ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <Play size={14} />
                        )}
                        Run
                    </button>
                    
                    <button
                        onClick={handleSubmit}
                        disabled={isRunning || isSubmitting}
                        className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 transition-colors text-white text-sm font-medium disabled:opacity-50"
                    >
                        {isSubmitting ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <Send size={14} />
                        )}
                        Submit
                    </button>
                </div>
            </header>

            {/* Main Content - Split View */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left Panel - Description/Console */}
                <div className="w-1/2 flex flex-col border-r border-gray-800 bg-gray-900/30">
                    {/* Tabs */}
                    <div className="flex border-b border-gray-800 bg-gray-900/50">
                        {['description', 'testcase', 'submissions'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors capitalize ${
                                    activeTab === tab 
                                        ? 'border-emerald-500 text-emerald-400' 
                                        : 'border-transparent text-gray-400 hover:text-gray-200'
                                }`}
                            >
                                {tab === 'testcase' ? 'Test Results' : tab}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <div className="flex-1 overflow-y-auto">
                        {activeTab === 'description' && (
                            <div className="p-6">
                                {/* Problem Description */}
                                <div className="prose prose-invert max-w-none prose-pre:bg-gray-800 prose-code:text-emerald-400">
                                    <ReactMarkdown>{problem.description}</ReactMarkdown>
                                </div>

                                {/* Examples */}
                                <div className="mt-8">
                                    <h3 className="text-lg font-semibold mb-4 text-white">Examples</h3>
                                    {problem.sampleCases?.map((example, idx) => (
                                        <div key={idx} className="mb-4 bg-gray-800/50 rounded-xl border border-gray-700/50 overflow-hidden">
                                            <div className="px-4 py-2 bg-gray-800 border-b border-gray-700/50 text-sm text-gray-400">
                                                Example {idx + 1}
                                            </div>
                                            <div className="p-4 space-y-3">
                                                <div>
                                                    <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">Input</p>
                                                    <pre className="bg-gray-900 p-3 rounded-lg text-sm font-mono text-gray-300 whitespace-pre-wrap">{example.input}</pre>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">Output</p>
                                                    <pre className="bg-gray-900 p-3 rounded-lg text-sm font-mono text-gray-300 whitespace-pre-wrap">{example.output}</pre>
                                                </div>
                                                {example.explanation && (
                                                    <div>
                                                        <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">Explanation</p>
                                                        <p className="text-sm text-gray-400">{example.explanation}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Constraints */}
                                <div className="mt-8">
                                    <h3 className="text-lg font-semibold mb-3 text-white">Constraints</h3>
                                    <ul className="space-y-1.5">
                                        {problem.constraints?.map((constraint, idx) => (
                                            <li key={idx} className="flex items-start gap-2 text-gray-300 text-sm">
                                                <span className="text-emerald-400 mt-1">•</span>
                                                <code className="bg-gray-800 px-1.5 py-0.5 rounded text-gray-300">{constraint}</code>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Hints */}
                                {problem.hints?.length > 0 && (
                                    <div className="mt-8">
                                        <button
                                            onClick={() => setShowHints(!showHints)}
                                            className="flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors"
                                        >
                                            <Lightbulb size={18} />
                                            <span className="font-medium">Hints ({problem.hints.length})</span>
                                            {showHints ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                        </button>
                                        {showHints && (
                                            <div className="mt-3 space-y-2">
                                                {problem.hints.map((hint, idx) => (
                                                    <div key={idx} className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 text-sm text-amber-200">
                                                        <span className="font-medium text-amber-400">Hint {idx + 1}:</span> {hint}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Tags */}
                                {problem.tags?.length > 0 && (
                                    <div className="mt-8">
                                        <h3 className="text-sm font-medium text-gray-500 mb-2">Related Topics</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {problem.tags.map(tag => (
                                                <span key={tag} className="bg-gray-800 text-gray-400 text-xs px-2.5 py-1 rounded-full border border-gray-700">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'testcase' && (
                            <div className="p-4 space-y-4">
                                {/* Custom Input Toggle */}
                                <div className="flex items-center gap-4 p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={useCustomInput}
                                            onChange={(e) => setUseCustomInput(e.target.checked)}
                                            className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-emerald-500 focus:ring-emerald-500"
                                        />
                                        <span className="text-sm text-gray-300">Use Custom Input</span>
                                    </label>
                                </div>

                                {/* Custom Input Area */}
                                {useCustomInput && (
                                    <div>
                                        <label className="text-xs text-gray-500 uppercase tracking-wide mb-1 block">Custom Input</label>
                                        <textarea
                                            value={customInput}
                                            onChange={(e) => setCustomInput(e.target.value)}
                                            className="w-full h-32 bg-gray-800 border border-gray-700 rounded-lg p-3 font-mono text-sm text-gray-300 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
                                            placeholder="Enter your custom input here..."
                                        />
                                    </div>
                                )}

                                {/* Output Display */}
                                {!output && !isRunning && !isSubmitting && (
                                    <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                                        <Terminal size={48} className="mb-3 opacity-50" />
                                        <p>Run or Submit code to see results</p>
                                    </div>
                                )}

                                {(isRunning || isSubmitting) && (
                                    <div className="flex items-center justify-center py-12">
                                        <div className="flex items-center gap-3 text-emerald-400">
                                            <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                                            <span>{isSubmitting ? 'Submitting...' : 'Running...'}</span>
                                        </div>
                                    </div>
                                )}

                                {output && (
                                    <div className="space-y-4">
                                        {output.type === 'custom' && (
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-lg font-semibold ${output.result.status?.id === 3 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                                        {output.result.status?.description}
                                                    </span>
                                                </div>
                                                
                                                {output.result.stdout && (
                                                    <div>
                                                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Output</p>
                                                        <pre className="bg-gray-800 p-3 rounded-lg text-sm font-mono text-white whitespace-pre-wrap">{output.result.stdout}</pre>
                                                    </div>
                                                )}
                                                
                                                {output.result.stderr && (
                                                    <div>
                                                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Error</p>
                                                        <pre className="bg-rose-900/20 border border-rose-900/50 p-3 rounded-lg text-sm font-mono text-rose-300 whitespace-pre-wrap">{output.result.stderr}</pre>
                                                    </div>
                                                )}
                                                
                                                {output.result.compile_output && (
                                                    <div>
                                                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Compilation Output</p>
                                                        <pre className="bg-amber-900/20 border border-amber-900/50 p-3 rounded-lg text-sm font-mono text-amber-300 whitespace-pre-wrap">{output.result.compile_output}</pre>
                                                    </div>
                                                )}

                                                <div className="flex gap-4 text-xs text-gray-500">
                                                    <span className="flex items-center gap-1"><Clock size={12} /> {output.result.time || 0}s</span>
                                                    <span className="flex items-center gap-1"><Cpu size={12} /> {output.result.memory || 0} KB</span>
                                                </div>
                                            </div>
                                        )}

                                        {output.type === 'samples' && (
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <span className={`text-lg font-semibold ${output.result.allPassed ? 'text-emerald-400' : 'text-rose-400'}`}>
                                                        {output.result.allPassed ? 'All Samples Passed' : 'Some Tests Failed'}
                                                    </span>
                                                    <span className="text-sm text-gray-400">
                                                        {output.result.totalPassed} / {output.result.totalCases} passed
                                                    </span>
                                                </div>

                                                {output.result.results?.map((r, idx) => (
                                                    <div key={idx} className={`p-4 rounded-lg border ${r.passed ? 'bg-emerald-900/10 border-emerald-900/30' : 'bg-rose-900/10 border-rose-900/30'}`}>
                                                        <div className="flex items-center justify-between mb-2">
                                                            <span className="font-medium">Test Case {idx + 1}</span>
                                                            {r.passed ? (
                                                                <CheckCircle size={18} className="text-emerald-400" />
                                                            ) : (
                                                                <XCircle size={18} className="text-rose-400" />
                                                            )}
                                                        </div>
                                                        
                                                        <div className="grid grid-cols-2 gap-3 text-sm">
                                                            <div>
                                                                <p className="text-xs text-gray-500 mb-1">Expected</p>
                                                                <pre className="bg-gray-800/50 p-2 rounded text-gray-300 font-mono text-xs">{r.expectedOutput}</pre>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-gray-500 mb-1">Your Output</p>
                                                                <pre className={`bg-gray-800/50 p-2 rounded font-mono text-xs ${r.passed ? 'text-emerald-300' : 'text-rose-300'}`}>{r.actualOutput || '(empty)'}</pre>
                                                            </div>
                                                        </div>

                                                        {r.stderr && (
                                                            <div className="mt-2">
                                                                <p className="text-xs text-gray-500 mb-1">Error</p>
                                                                <pre className="bg-rose-900/20 p-2 rounded text-rose-300 font-mono text-xs">{r.stderr}</pre>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {output.type === 'submit' && (
                                            <div className="space-y-4">
                                                <div className={`text-center py-6 rounded-xl ${output.result.status === 'Accepted' ? 'bg-emerald-900/20 border border-emerald-900/30' : 'bg-rose-900/20 border border-rose-900/30'}`}>
                                                    <div className={`text-2xl font-bold mb-2 ${getStatusColor(output.result.status)}`}>
                                                        {output.result.status}
                                                    </div>
                                                    <div className="text-gray-400 text-sm">
                                                        {output.result.passedTestCases} / {output.result.totalTestCases} test cases passed
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50">
                                                        <div className="flex items-center gap-2 text-gray-400 text-xs uppercase mb-1">
                                                            <Clock size={14} />
                                                            Runtime
                                                        </div>
                                                        <div className="text-xl font-semibold text-white">{output.result.executionTime}s</div>
                                                    </div>
                                                    <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50">
                                                        <div className="flex items-center gap-2 text-gray-400 text-xs uppercase mb-1">
                                                            <Cpu size={14} />
                                                            Memory
                                                        </div>
                                                        <div className="text-xl font-semibold text-white">{(output.result.memoryUsed / 1024).toFixed(2)} MB</div>
                                                    </div>
                                                </div>

                                                {output.result.errorDetails && (
                                                    <div>
                                                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Error Details</p>
                                                        <pre className="bg-rose-900/20 border border-rose-900/50 p-4 rounded-lg text-sm font-mono text-rose-300 whitespace-pre-wrap overflow-x-auto">{output.result.errorDetails}</pre>
                                                    </div>
                                                )}

                                                {output.result.failedTestCase && (
                                                    <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50">
                                                        <p className="text-sm font-medium text-gray-300 mb-3">Failed Test Case</p>
                                                        <div className="space-y-2 text-sm">
                                                            <div>
                                                                <p className="text-xs text-gray-500 mb-1">Input</p>
                                                                <pre className="bg-gray-900 p-2 rounded text-gray-300 font-mono text-xs">{output.result.failedTestCase.input}</pre>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-gray-500 mb-1">Expected</p>
                                                                <pre className="bg-gray-900 p-2 rounded text-emerald-300 font-mono text-xs">{output.result.failedTestCase.expectedOutput}</pre>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-gray-500 mb-1">Your Output</p>
                                                                <pre className="bg-gray-900 p-2 rounded text-rose-300 font-mono text-xs">{output.result.failedTestCase.actualOutput || '(empty)'}</pre>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {output.type === 'error' && (
                                            <div className="bg-rose-900/20 border border-rose-900/50 p-4 rounded-lg">
                                                <div className="flex items-center gap-2 text-rose-400 mb-2">
                                                    <AlertTriangle size={18} />
                                                    <span className="font-medium">Execution Error</span>
                                                </div>
                                                <p className="text-rose-300 text-sm">{output.result.error}</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'submissions' && (
                            <div className="p-4">
                                {submissions.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                                        <History size={48} className="mb-3 opacity-50" />
                                        <p>No submissions yet</p>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {submissions.map((sub, idx) => (
                                            <div key={sub._id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700/50 hover:bg-gray-800 transition-colors">
                                                <div className="flex items-center gap-4">
                                                    <span className={`font-medium ${getStatusColor(sub.status)}`}>
                                                        {sub.status}
                                                    </span>
                                                    <span className="text-gray-500 text-sm">{sub.language}</span>
                                                </div>
                                                <div className="flex items-center gap-4 text-sm text-gray-400">
                                                    <span>{sub.executionTime}s</span>
                                                    <span>{formatTime(sub.createdAt)}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Panel - Editor */}
                <div className="w-1/2 flex flex-col bg-gray-900">
                    <Editor
                        height="100%"
                        language={language.value}
                        value={code}
                        onChange={(value) => setCode(value || '')}
                        theme="vs-dark"
                        options={{
                            minimap: { enabled: false },
                            fontSize: 14,
                            lineNumbers: 'on',
                            automaticLayout: true,
                            padding: { top: 16, bottom: 16 },
                            scrollBeyondLastLine: false,
                            wordWrap: 'on',
                            tabSize: 4,
                            insertSpaces: true,
                            folding: true,
                            renderLineHighlight: 'line',
                            cursorBlinking: 'smooth',
                            smoothScrolling: true
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default ProblemDetail;
