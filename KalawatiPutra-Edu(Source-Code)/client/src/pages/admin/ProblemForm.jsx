import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createProblem, getProblem, updateProblem } from '../../api/problems';
import { toast } from 'sonner';
import { Plus, Trash, X, Save, ArrowLeft } from 'lucide-react';
import Editor from '@monaco-editor/react';

const ProblemForm = () => {
    const { slug } = useParams(); // If editing
    const navigate = useNavigate();
    const isEditing = !!slug;

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(isEditing);

    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        description: '',
        difficulty: 'Easy',
        problemType: 'DSA',
        tags: '',
        constraints: [''],
        inputFormat: '',
        outputFormat: '',
        hints: [''],
        companies: '',
        isPublic: false,
        sampleCases: [{ input: '', output: '', explanation: '' }],
        testCases: [{ input: '', output: '', isHidden: false }],
        defaultCode: [
            { language: 'python', code: '# Write your code here', driverCode: '' },
            { language: 'javascript', code: '// Write your code here', driverCode: '' }
        ]
    });

    useEffect(() => {
        if (isEditing) {
            fetchProblemData();
        }
    }, [slug]);

    const fetchProblemData = async () => {
        try {
            const res = await getProblem(slug);
            const data = res.data;
            // Format data for form
            setFormData({
                ...data,
                tags: data.tags ? data.tags.join(', ') : '',
                companies: data.companies ? data.companies.join(', ') : '',
                constraints: data.constraints && data.constraints.length > 0 ? data.constraints : [''],
                hints: data.hints && data.hints.length > 0 ? data.hints : [''],
                sampleCases: data.sampleCases && data.sampleCases.length > 0 ? data.sampleCases : [{ input: '', output: '', explanation: '' }],
                testCases: data.testCases && data.testCases.length > 0 ? data.testCases : [{ input: '', output: '', isHidden: false }],
                defaultCode: data.defaultCode && data.defaultCode.length > 0 ? data.defaultCode : [
                    { language: 'python', code: '# Write your code here', driverCode: '' },
                    { language: 'javascript', code: '// Write your code here', driverCode: '' }
                ]
            });
        } catch (err) {
            console.error(err);
            toast.error("Failed to load problem data");
        } finally {
            setFetching(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleConstraintChange = (index, value) => {
        const newConstraints = [...formData.constraints];
        newConstraints[index] = value;
        setFormData({ ...formData, constraints: newConstraints });
    };

    const addConstraint = () => {
        setFormData({ ...formData, constraints: [...formData.constraints, ''] });
    };

    const removeConstraint = (index) => {
        const newConstraints = formData.constraints.filter((_, i) => i !== index);
        setFormData({ ...formData, constraints: newConstraints });
    };

    // --- Handling Arrays of Objects (Sample Cases, Test Cases, Code) ---

    // Generic handler for array of objects (e.g. sampleCases)
    const handleArrayChange = (field, index, key, value) => {
        const newArray = [...formData[field]];
        newArray[index] = { ...newArray[index], [key]: value };
        setFormData({ ...formData, [field]: newArray });
    };

    const addItem = (field, initialItem) => {
        setFormData({ ...formData, [field]: [...formData[field], initialItem] });
    };

    const removeItem = (field, index) => {
        const newArray = formData[field].filter((_, i) => i !== index);
        setFormData({ ...formData, [field]: newArray });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                ...formData,
                tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
                companies: formData.companies ? formData.companies.split(',').map(t => t.trim()).filter(Boolean) : [],
                constraints: formData.constraints.filter(Boolean),
                hints: formData.hints ? formData.hints.filter(Boolean) : [],
                sampleCases: formData.sampleCases.filter(c => c.input || c.output),
                testCases: formData.testCases.filter(c => c.input || c.output)
            };

            // Clean up: Delete _id if present (from edit fetch) to avoid mongo error on update/create if strict
            delete payload._id;
            delete payload.createdAt;
            delete payload.updatedAt;
            delete payload.__v;

            if (isEditing) {
                // We need ID for update, fetch stored ID or use slug if API supports it. 
                // Problem: getProblem returns object with _id. Let's store _id in state?
                // Actually my update API uses ID. formData._id should exist if loaded.

                // Oops, I deleted _id above. Let's retrieve it from state first or don't put it in payload but use it for URL.
                // Re-fetch logic:
                const id = formData._id;
                await updateProblem(id, payload);
                toast.success("Problem updated successfully!");
            } else {
                await createProblem(payload);
                toast.success("Problem created successfully!");
                navigate('/admin/dashboard');
            }
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.msg || "Operation failed");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <div className="p-8 text-white">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-950 text-white p-6 pb-20">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <button onClick={() => navigate('/admin/dashboard')} className="p-2 bg-gray-800 rounded-full hover:bg-gray-700">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-500">
                        {isEditing ? 'Edit Problem' : 'Create New Problem'}
                    </h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Basic Info */}
                    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
                        <h2 className="text-xl font-semibold text-emerald-400 border-b border-gray-800 pb-2">Basic Info</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Title</label>
                                <input required type="text" name="title" value={formData.title} onChange={handleChange} className="w-full bg-gray-800 border-gray-700 rounded-lg p-2.5 focus:ring-emerald-500 focus:border-emerald-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Slug (URL)</label>
                                <input required type="text" name="slug" value={formData.slug} onChange={handleChange} className="w-full bg-gray-800 border-gray-700 rounded-lg p-2.5 focus:ring-emerald-500 focus:border-emerald-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Difficulty</label>
                                <select name="difficulty" value={formData.difficulty} onChange={handleChange} className="w-full bg-gray-800 border-gray-700 rounded-lg p-2.5 focus:ring-emerald-500 focus:border-emerald-500">
                                    <option>Easy</option>
                                    <option>Medium</option>
                                    <option>Hard</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Problem Type</label>
                                <select name="problemType" value={formData.problemType} onChange={handleChange} className="w-full bg-gray-800 border-gray-700 rounded-lg p-2.5 focus:ring-emerald-500 focus:border-emerald-500">
                                    <option value="DSA">DSA</option>
                                    <option value="SQL">SQL</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Tags (comma separated)</label>
                                <input type="text" name="tags" value={formData.tags} onChange={handleChange} className="w-full bg-gray-800 border-gray-700 rounded-lg p-2.5 focus:ring-emerald-500 focus:border-emerald-500" placeholder="Array, String, DP" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Companies (comma separated)</label>
                                <input type="text" name="companies" value={formData.companies} onChange={handleChange} className="w-full bg-gray-800 border-gray-700 rounded-lg p-2.5 focus:ring-emerald-500 focus:border-emerald-500" placeholder="Google, Amazon, Microsoft" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Description (Markdown)</label>
                            <Editor
                                height="300px"
                                defaultLanguage="markdown"
                                theme="vs-dark"
                                value={formData.description}
                                onChange={(val) => setFormData({ ...formData, description: val })}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Input Format</label>
                                <textarea name="inputFormat" value={formData.inputFormat} onChange={handleChange} rows="2" className="w-full bg-gray-800 border-gray-700 rounded-lg p-2.5 focus:ring-emerald-500 focus:border-emerald-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Output Format</label>
                                <textarea name="outputFormat" value={formData.outputFormat} onChange={handleChange} rows="2" className="w-full bg-gray-800 border-gray-700 rounded-lg p-2.5 focus:ring-emerald-500 focus:border-emerald-500" />
                            </div>
                        </div>

                        {/* Constraints */}
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Constraints</label>
                            {formData.constraints.map((c, i) => (
                                <div key={i} className="flex gap-2 mb-2">
                                    <input type="text" value={c} onChange={(e) => handleConstraintChange(i, e.target.value)} className="flex-1 bg-gray-800 border-gray-700 rounded-lg p-2 focus:ring-emerald-500" placeholder="e.g. 1 <= n <= 100" />
                                    <button type="button" onClick={() => removeConstraint(i)} className="text-rose-500 hover:text-rose-400"><Trash size={18} /></button>
                                </div>
                            ))}
                            <button type="button" onClick={addConstraint} className="text-sm text-emerald-400 hover:text-emerald-300 flex items-center gap-1"><Plus size={16} /> Add Constraint</button>
                        </div>

                        <div className="flex items-center gap-2">
                            <input type="checkbox" id="public" checked={formData.isPublic} onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })} className="w-4 h-4 text-emerald-600 bg-gray-700 border-gray-600 rounded" />
                            <label htmlFor="public" className="text-sm font-medium text-gray-300">Make Problem Public</label>
                        </div>
                    </div>

                    {/* Default Code */}
                    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
                        <div className="flex justify-between items-center border-b border-gray-800 pb-2">
                            <h2 className="text-xl font-semibold text-emerald-400">Code Templates</h2>
                            <button type="button" onClick={() => addItem('defaultCode', { language: 'python', code: '' })} className="text-sm bg-gray-800 px-3 py-1 rounded hover:bg-gray-700">Add Language</button>
                        </div>

                        {formData.defaultCode.map((dc, i) => (
                            <div key={i} className="mb-6 p-4 border border-gray-800 rounded-lg bg-gray-950/50">
                                <div className="flex justify-between items-center mb-2">
                                    <select value={dc.language} onChange={(e) => handleArrayChange('defaultCode', i, 'language', e.target.value)} className="bg-gray-800 border-gray-700 rounded p-1 text-sm">
                                        <option value="python">Python</option>
                                        <option value="javascript">JavaScript</option>
                                        <option value="cpp">C++</option>
                                        <option value="java">Java</option>
                                        <option value="c">C</option>
                                        <option value="sql">SQL</option>
                                    </select>
                                    <button type="button" onClick={() => removeItem('defaultCode', i)} className="text-rose-400 hover:text-rose-300"><X size={16} /></button>
                                </div>
                                <div className="h-40 border border-gray-700 rounded overflow-hidden mb-2">
                                    <Editor
                                        height="100%"
                                        language={dc.language === 'cpp' || dc.language === 'c' ? 'cpp' : dc.language}
                                        value={dc.code}
                                        theme="vs-dark"
                                        onChange={(val) => handleArrayChange('defaultCode', i, 'code', val)}
                                        options={{ minimap: { enabled: false }, lineNumbers: 'off' }}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs text-gray-500 font-medium">Driver Code (Hidden & Appended)</label>
                                    <div className="h-32 border border-gray-700 rounded overflow-hidden">
                                        <Editor
                                            height="100%"
                                            language={dc.language === 'cpp' || dc.language === 'c' ? 'cpp' : dc.language}
                                            value={dc.driverCode || ''}
                                            theme="vs-dark"
                                            onChange={(val) => handleArrayChange('defaultCode', i, 'driverCode', val)}
                                            options={{
                                                minimap: { enabled: false },
                                                lineNumbers: 'off',
                                                readOnly: false
                                            }}
                                        />
                                    </div>
                                    <p className="text-[10px] text-gray-600">This code is appended to the user's solution during execution. Use it to call the user's function and print output.</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Sample Cases */}
                    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
                        <div className="flex justify-between items-center border-b border-gray-800 pb-2">
                            <h2 className="text-xl font-semibold text-emerald-400">Sample Cases (Visible)</h2>
                            <button type="button" onClick={() => addItem('sampleCases', { input: '', output: '', explanation: '' })} className="text-sm bg-gray-800 px-3 py-1 rounded hover:bg-gray-700">Add Case</button>
                        </div>
                        {formData.sampleCases.map((sc, i) => (
                            <div key={i} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 border border-gray-800 rounded-lg bg-gray-950/50 relative">
                                <button type="button" onClick={() => removeItem('sampleCases', i)} className="absolute top-2 right-2 text-rose-400"><X size={16} /></button>
                                <div>
                                    <label className="text-xs text-gray-500">Input</label>
                                    <textarea value={sc.input} onChange={(e) => handleArrayChange('sampleCases', i, 'input', e.target.value)} className="w-full bg-gray-800 border-gray-700 rounded p-2 text-sm font-mono h-20" />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500">Output</label>
                                    <textarea value={sc.output} onChange={(e) => handleArrayChange('sampleCases', i, 'output', e.target.value)} className="w-full bg-gray-800 border-gray-700 rounded p-2 text-sm font-mono h-20" />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500">Explanation</label>
                                    <textarea value={sc.explanation} onChange={(e) => handleArrayChange('sampleCases', i, 'explanation', e.target.value)} className="w-full bg-gray-800 border-gray-700 rounded p-2 text-sm h-20" />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Test Cases */}
                    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
                        <div className="flex justify-between items-center border-b border-gray-800 pb-2">
                            <h2 className="text-xl font-semibold text-emerald-400">Test Cases (Judged)</h2>
                            <button type="button" onClick={() => addItem('testCases', { input: '', output: '', isHidden: false })} className="text-sm bg-gray-800 px-3 py-1 rounded hover:bg-gray-700">Add Case</button>
                        </div>
                        {formData.testCases.map((tc, i) => (
                            <div key={i} className="flex gap-4 mb-4 p-4 border border-gray-800 rounded-lg bg-gray-950/50 relative">
                                <button type="button" onClick={() => removeItem('testCases', i)} className="absolute top-2 right-2 text-rose-400"><X size={16} /></button>
                                <div className="flex-1 space-y-2">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs text-gray-500">Input</label>
                                            <textarea value={tc.input} onChange={(e) => handleArrayChange('testCases', i, 'input', e.target.value)} className="w-full bg-gray-800 border-gray-700 rounded p-2 text-sm font-mono h-20" />
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-500">Output</label>
                                            <textarea value={tc.output} onChange={(e) => handleArrayChange('testCases', i, 'output', e.target.value)} className="w-full bg-gray-800 border-gray-700 rounded p-2 text-sm font-mono h-20" />
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <input type="checkbox" checked={tc.isHidden} onChange={(e) => handleArrayChange('testCases', i, 'isHidden', e.target.checked)} className="rounded bg-gray-700 border-gray-600 text-emerald-500" />
                                        <label className="text-sm text-gray-400">Hidden Test Case (Not shown to user)</label>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-end pt-6">
                        <button type="submit" disabled={loading} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-all shadow-glow-sm disabled:opacity-50">
                            {loading ? 'Saving...' : <><Save size={20} /> Save Problem</>}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default ProblemForm;
