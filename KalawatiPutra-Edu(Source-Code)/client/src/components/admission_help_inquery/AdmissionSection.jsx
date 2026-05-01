import React, { useState, useEffect, useRef } from 'react';
import { Calendar, Award, CreditCard, Users, FileText, Globe, Check, AlertCircle, Construction, Code, Database, BrainCircuit, Workflow } from 'lucide-react';

const AdmissionSection = () => {
    const [activeProgram, setActiveProgram] = useState(0);
    const [visibleSection, setVisibleSection] = useState(null);
    const [showDevNotice, setShowDevNotice] = useState(false);
    const sectionRef = useRef(null);
    const timelineRef = useRef(null);
    const statsRef = useRef(null);

    const programs = [
        {
            id: 1,
            title: "Quantum Computing",
            description: "Master the fundamentals of quantum algorithms and circuit design for the next generation of computing systems.",
            icon: <Code className="w-6 h-6" />,
            deadline: "June 15, 2025",
            eligibility: "Computer Science background with strong mathematics foundation",
            benefits: ["Quantum Lab Access", "IBM Q System Access", "Quantum Hackathons"],
            applicationFee: "$75",
            studentsEnrolled: "285+",
            programDuration: "2 years"
        },
        {
            id: 2,
            title: "Neural Engineering",
            description: "Explore the frontier where biological neural systems meet advanced computational models and interfaces.",
            icon: <BrainCircuit className="w-6 h-6" />,
            deadline: "May 30, 2025",
            eligibility: "Neuroscience, Engineering or Computer Science background",
            benefits: ["Neural Lab Access", "Industry Partners", "Research Grants"],
            applicationFee: "$85",
            studentsEnrolled: "175+",
            programDuration: "3 years"
        },
        {
            id: 3,
            title: "Synthetic Biology",
            description: "Design and construct new biological entities for applications in medicine, energy and computing.",
            icon: <Database className="w-6 h-6" />,
            deadline: "July 10, 2025",
            eligibility: "Biochemistry, Biology or related fields",
            benefits: ["Biotech Lab Access", "Patent Support", "Industry Mentorship"],
            applicationFee: "$90",
            studentsEnrolled: "120+",
            programDuration: "4 years"
        },
        {
            id: 4,
            title: "AI Systems Architecture",
            description: "Develop the next generation of AI hardware and software systems optimized for emerging computational paradigms.",
            icon: <Workflow className="w-6 h-6" />,
            deadline: "June 5, 2025",
            eligibility: "Computer Engineering or Computer Science background",
            benefits: ["GPU Cluster Access", "Cloud Credits", "Industry Projects"],
            applicationFee: "$80",
            studentsEnrolled: "210+",
            programDuration: "2 years"
        }
    ];

    const stats = [
        {
            id: 1,
            label: "Research Impact",
            value: 92,
            unit: "%",
            description: "Papers published in top journals",
            icon: <Award className="w-6 h-6" />
        },
        {
            id: 2,
            label: "Industry Placement",
            value: 96,
            unit: "%",
            description: "Advanced tech sector placement",
            icon: <FileText className="w-6 h-6" />
        },
        {
            id: 3,
            label: "Patent Filings",
            value: 45,
            unit: "+",
            description: "Research patents filed annually",
            icon: <Award className="w-6 h-6" />
        },
        {
            id: 4,
            label: "Tech Partners",
            value: 73,
            unit: "",
            description: "Frontier tech industry partners",
            icon: <Globe className="w-6 h-6" />
        }
    ];

    const applicationSteps = [
        { id: 1, title: "Create Profile", description: "Set up your digital identity" },
        { id: 2, title: "Submit Application", description: "Complete all required fields" },
        { id: 3, title: "Project Proposal", description: "Submit your research direction" },
        { id: 4, title: "Technical Interview", description: "Demonstrate technical aptitude" },
        { id: 5, title: "Final Review", description: "Admissions committee decision" }
    ];

    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observerCallback = (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setVisibleSection(entry.target.id);
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);

        if (sectionRef.current) observer.observe(sectionRef.current);
        if (timelineRef.current) observer.observe(timelineRef.current);
        if (statsRef.current) observer.observe(statsRef.current);

        return () => {
            if (sectionRef.current) observer.unobserve(sectionRef.current);
            if (timelineRef.current) observer.unobserve(timelineRef.current);
            if (statsRef.current) observer.unobserve(statsRef.current);
        };
    }, []);

    // Show development notice
    const handleActionClick = () => {
        setShowDevNotice(true);
        setTimeout(() => setShowDevNotice(false), 3000);
    };

    // Animation for stats
    const Counter = ({ value, unit }) => {
        const [count, setCount] = useState(0);

        useEffect(() => {
            if (visibleSection !== 'stats-section') return;

            let start = 0;
            const end = parseInt(value);
            const duration = 2000;
            const increment = end / (duration / 16);

            const timer = setInterval(() => {
                start += increment;
                setCount(Math.min(Math.round(start), end));

                if (start >= end) clearInterval(timer);
            }, 16);

            return () => clearInterval(timer);
        }, [value, visibleSection]);

        return (
            <div className="flex items-baseline">
                <span className="text-3xl md:text-4xl font-bold text-emerald-400">{count}</span>
                <span className="text-gray-500 text-lg">{unit}</span>
            </div>
        );
    };

    // Program card component
    const ProgramCard = ({ program, active, onClick }) => {
        return (
            <div
                className={`group cursor-pointer relative bg-gray-950 rounded-xl border border-gray-800 hover:border-emerald-500/50 overflow-hidden transition-all duration-300 ${active ? 'ring-2 ring-emerald-500' : ''}`}
                onClick={onClick}
            >
                <div className={`absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-transparent to-emerald-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>

                {active && (
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-blue-600"></div>
                )}

                <div className="p-5 relative z-10">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center">
                            <div className="w-12 h-12 flex items-center justify-center bg-gray-800/80 rounded-lg text-emerald-400 mr-4">
                                {program.icon}
                            </div>
                            <h3 className={`font-bold text-lg ${active ? 'text-emerald-400' : 'text-gray-200'}`}>{program.title}</h3>
                        </div>
                    </div>

                    <p className="text-gray-400 text-sm line-clamp-2 mb-4">{program.description}</p>

                    <div className="flex justify-between items-center">
                        <div className="bg-gray-800/80 text-emerald-400 text-xs px-3 py-1 rounded-full">
                            {program.programDuration}
                        </div>
                        <div className="text-xs text-gray-500">{program.studentsEnrolled} Students</div>
                    </div>
                </div>
            </div>
        );
    };

    // Program details component
    const ProgramDetail = ({ program }) => {
        return (
            <div className="bg-gray-950 rounded-xl border border-gray-800 overflow-hidden h-full flex flex-col relative">
                {/* Top gradient border */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-blue-600 to-emerald-600"></div>

                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-900/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-900/10 rounded-full blur-3xl"></div>

                <div className="p-6 pb-0 relative z-10">
                    <div className="bg-gray-800/80 w-16 h-16 rounded-xl flex items-center justify-center text-emerald-400 mb-4">
                        {program.icon}
                    </div>

                    <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-blue-400 to-emerald-400 mb-2">
                        {program.title}
                    </h2>
                    <p className="text-gray-400 mb-6">{program.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-lg bg-gray-800/80 flex items-center justify-center text-emerald-400">
                                <Calendar className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-xs text-gray-500">Deadline</h4>
                                <p className="text-gray-300">{program.deadline}</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-lg bg-gray-800/80 flex items-center justify-center text-emerald-400">
                                <Award className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-xs text-gray-500">Eligibility</h4>
                                <p className="text-gray-300 text-sm">{program.eligibility}</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-lg bg-gray-800/80 flex items-center justify-center text-emerald-400">
                                <CreditCard className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-xs text-gray-500">Application Fee</h4>
                                <p className="text-gray-300">{program.applicationFee}</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-lg bg-gray-800/80 flex items-center justify-center text-emerald-400">
                                <Users className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-xs text-gray-500">Enrollment</h4>
                                <p className="text-gray-300">{program.studentsEnrolled}</p>
                            </div>
                        </div>
                    </div>

                    <div className="mb-6">
                        <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-2"></div>
                            Program Benefits
                        </h4>
                        <div className="grid grid-cols-1 gap-2">
                            {program.benefits.map((benefit, idx) => (
                                <div key={idx} className="flex items-center text-sm text-gray-400">
                                    <Check className="w-4 h-4 mr-2 text-emerald-500" />
                                    {benefit}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-auto p-6 pt-0">
                    <button
                        onClick={handleActionClick}
                        className="w-full py-3 px-4 bg-gradient-to-r from-emerald-600 to-blue-700 hover:from-emerald-700 hover:to-blue-800 flex items-center justify-center text-white font-medium rounded-lg transition-all duration-300 relative overflow-hidden group"
                    >
                        <span className="relative z-10 flex items-center">
                            Apply Now
                            <Construction className="ml-2 w-4 h-4" />
                        </span>
                        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-emerald-500 to-blue-600 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="w-full bg-gray-950 text-white overflow-hidden relative mt-16">
            {/* Development notice banner */}
            <div className={`fixed top-6 right-6 z-50 transition-all duration-300 transform ${showDevNotice ? 'translate-y-0 opacity-100' : '-translate-y-12 opacity-0'}`}>
                <div className="bg-gray-900 border border-red-500 text-red-400 px-4 py-3 rounded-lg shadow-lg flex items-center">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    <span>This section is under development</span>
                </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-48 right-0 w-96 h-96 bg-emerald-900/10 rounded-full blur-3xl"></div>
                <div className="absolute top-1/3 -left-48 w-96 h-96 bg-emerald-900/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-900/10 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.05)_0%,rgba(14,165,233,0)_50%)]"></div>

                {/* Grid pattern overlay */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDYwIEwgNjAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzFmMjkzNyIgc3Ryb2tlLXdpZHRoPSIwLjUiLz48cGF0aCBkPSJNIDYwIDAgTCAwIDYwIiBmaWxsPSJub25lIiBzdHJva2U9IiMxZjI5MzciIHN0cm9rZS13aWR0aD0iMC41Ii8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIiBvcGFjaXR5PSIwLjEiLz48L3N2Zz4=')] opacity-10"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-24 relative z-10">
                {/* Header Section */}
                <div
                    ref={sectionRef}
                    id="header-section"
                    className="text-center mb-16 relative"
                >
                    <div className="inline-block mb-2 px-4 py-1 bg-gray-800/50 rounded-full border border-emerald-500/20 backdrop-blur-sm">
                        <span className="text-emerald-400 font-medium text-sm flex items-center">
                            <span className="relative flex h-2 w-2 mr-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            System Status: Pre-Release
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-500 to-blue-500">
                        Frontier Research Initiative
                    </h1>

                    <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                        Enroll in our advanced research programs at the convergence of quantum computing, synthetic biology, and cognitive systems.
                    </p>

                    {/* "Under Development" tag */}
                    <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-900/20 text-yellow-500 border border-yellow-500/20">
                        <Construction className="w-3 h-3 mr-1" />
                        Platform Under Development — v0.8.7 Alpha
                    </div>
                </div>

                {/* Timeline Section */}
                <div
                    ref={timelineRef}
                    id="timeline-section"
                    className="mb-24"
                >
                    <div className="flex justify-between relative">
                        {/* Base Line */}
                        <div className="absolute top-10 left-0 w-full h-0.5 bg-gray-800"></div>

                        {/* Timeline Nodes */}
                        {applicationSteps.map((step, index) => (
                            <div key={step.id} className="relative z-10 flex flex-col items-center">
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center ${index <= activeProgram
                                        ? 'bg-gradient-to-r from-emerald-500 to-emerald-600'
                                        : 'bg-gray-800 border border-gray-700'
                                        }`}
                                >
                                    <span className={`text-sm font-bold ${index <= activeProgram ? 'text-white' : 'text-gray-400'}`}>{step.id}</span>
                                </div>

                                <div className="mt-3 text-center">
                                    <p className={`font-medium text-sm ${index <= activeProgram ? 'text-emerald-400' : 'text-gray-500'}`}>{step.title}</p>
                                    <p className="text-xs text-gray-600 mt-1">{step.description}</p>
                                </div>
                            </div>
                        ))}

                        {/* Progress Bar */}
                        <div
                            className="absolute top-10 left-0 h-0.5 bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700"
                            style={{ width: `${(activeProgram / (applicationSteps.length - 1)) * 100}%` }}
                        />
                    </div>

                    {/* Development tag */}
                    <div className="mt-8 text-center">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-900/20 text-yellow-500 border border-yellow-500/20">
                            <Code className="w-3 h-3 mr-1" />
                            Application System Integration In Progress
                        </span>
                    </div>
                </div>

                {/* Programs Section */}
                <div className="mb-24 relative">
                    {/* Section title */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400 inline-block">
                            Advanced Research Programs
                        </h2>
                        <div className="h-px w-full bg-gradient-to-r from-emerald-500/50 via-blue-500/50 to-transparent mt-2"></div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-1 space-y-4">
                            {programs.map((program, index) => (
                                <ProgramCard
                                    key={program.id}
                                    program={program}
                                    active={activeProgram === index}
                                    onClick={() => setActiveProgram(index)}
                                />
                            ))}
                        </div>

                        <div className="lg:col-span-2">
                            <ProgramDetail program={programs[activeProgram]} />
                        </div>
                    </div>
                </div>

                {/* Stats Section */}
                <div
                    ref={statsRef}
                    id="stats-section"
                    className="mb-24"
                >
                    {/* Section title */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400 inline-block">
                            Research Impact Metrics
                        </h2>
                        <div className="h-px w-full bg-gradient-to-r from-emerald-500/50 via-blue-500/50 to-transparent mt-2"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {stats.map((stat) => (
                            <div
                                key={stat.id}
                                className="bg-gray-950 border border-gray-800 rounded-xl p-6 hover:border-emerald-500/30 transition-all duration-300 relative overflow-hidden group"
                            >
                                {/* Hover effect gradient */}
                                <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/10 via-transparent to-emerald-900/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                <div className="relative z-10">
                                    <div className="flex items-center mb-4">
                                        <div className="w-12 h-12 rounded-lg bg-gray-800/80 flex items-center justify-center text-emerald-400 mr-4">
                                            {stat.icon}
                                        </div>
                                        <h3 className="font-medium text-gray-200">{stat.label}</h3>
                                    </div>

                                    <Counter value={stat.value} unit={stat.unit} />

                                    <p className="mt-2 text-sm text-gray-500">{stat.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 text-center">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-900/20 text-yellow-500 border border-yellow-500/20">
                            <Database className="w-3 h-3 mr-1" />
                            Live Data Integration Pending
                        </span>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="relative bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden p-8">
                    {/* Decorative gradient background */}
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-900/20 rounded-full blur-3xl"></div>
                        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-900/20 rounded-full blur-3xl"></div>
                    </div>

                    <div className="max-w-3xl mx-auto text-center relative z-10">
                        <h3 className="text-2xl md:text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-700">
                            Join the Technological Frontier
                        </h3>
                        <p className="text-gray-400 mb-8">
                            Take your place among the pioneers shaping the next technological revolution through breakthrough research and innovation.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button
                                onClick={handleActionClick}
                                className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-blue-700 hover:from-emerald-700 hover:to-blue-800 text-white font-medium rounded-lg transition-all duration-300 w-full sm:w-auto flex items-center justify-center relative overflow-hidden group"
                            >
                                <span className="relative z-10 flex items-center">
                                    <Construction className="w-5 h-5 mr-2" />
                                    Apply Now (System in Development)
                                </span>
                                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-emerald-500 to-blue-600 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
                            </button>
                            <button
                                onClick={handleActionClick}
                                className="px-8 py-3 bg-transparent border border-emerald-500/30 text-emerald-400 hover:bg-emerald-900/30 font-medium rounded-lg transition-all duration-300 w-full sm:w-auto flex items-center justify-center"
                            >
                                <AlertCircle className="w-5 h-5 mr-2" />
                                Join Waitlist
                            </button>
                        </div>

                        {/* Development notice */}
                        <div className="mt-6 p-3 bg-yellow-900/10 border border-yellow-500/30 rounded-lg inline-block">
                            <div className="flex items-center text-yellow-500 text-sm">
                                <Construction className="w-4 h-4 mr-2 animate-pulse" />
                                <span>Portal functionality in development - Expected launch: August 2025</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdmissionSection;