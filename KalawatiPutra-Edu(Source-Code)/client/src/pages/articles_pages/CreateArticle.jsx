import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Toaster, toast } from 'sonner';
import {
  Upload, X, Code, Tag, FileText, Image,
  PlusCircle, Check, ChevronLeft, ChevronRight,
  Sparkles
} from 'lucide-react';

function CreateArticle() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [tagList, setTagList] = useState([]);
  const [codeSnippets, setCodeSnippets] = useState(['']);
  const [files, setFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const fileInputRef = useRef(null);

  const VITE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  // Process tags when input changes
  useEffect(() => {
    if (tags.trim() !== '' && tags.endsWith(',')) {
      const newTag = tags.slice(0, -1).trim();
      if (newTag && !tagList.includes(newTag)) {
        setTagList([...tagList, newTag]);
      }
      setTags('');
    }
  }, [tags, tagList]);

  // Remove tag from list
  const removeTag = (index) => {
    const newTags = [...tagList];
    newTags.splice(index, 1);
    setTagList(newTags);
  };

  // Handle file selection with previews
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    processFiles(selectedFiles);
  };

  const processFiles = (selectedFiles) => {
    // Check file sizes
    const validFiles = selectedFiles.filter(file => file.size <= 10 * 1024 * 1024); // 10MB limit

    if (validFiles.length < selectedFiles.length) {
      toast.error('Some files exceed the 10MB size limit and were not added');
    }

    setFiles([...files, ...validFiles]);

    // Generate preview URLs for images
    const newPreviewUrls = validFiles.map(file => {
      if (file.type.startsWith('image/')) {
        return URL.createObjectURL(file);
      }
      return null;
    });

    setPreviewUrls([...previewUrls, ...newPreviewUrls]);

    if (validFiles.length > 0) {
      toast.success(`${validFiles.length} file${validFiles.length > 1 ? 's' : ''} added`);
    }
  };

  // Remove file from selection
  const removeFile = (index) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);

    const newPreviewUrls = [...previewUrls];
    if (newPreviewUrls[index]) {
      URL.revokeObjectURL(newPreviewUrls[index]);
    }
    newPreviewUrls.splice(index, 1);
    setPreviewUrls(newPreviewUrls);

    toast.info('File removed');
  };

  // Handle drag and drop
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(Array.from(e.dataTransfer.files));
    }
  };

  // Add new code snippet field
  const addCodeSnippet = () => {
    setCodeSnippets([...codeSnippets, '']);
    toast.info('Code snippet added');
  };

  // Update code snippet at specific index
  const updateCodeSnippet = (index, value) => {
    const newSnippets = [...codeSnippets];
    newSnippets[index] = value;
    setCodeSnippets(newSnippets);
  };

  // Remove code snippet at specific index
  const removeCodeSnippet = (index) => {
    const newSnippets = [...codeSnippets];
    newSnippets.splice(index, 1);
    setCodeSnippets(newSnippets);

    toast.info('Code snippet removed');
  };

  // Progress to next step
  const nextStep = () => {
    // Validate current step
    if (currentStep === 1 && !title.trim()) {
      toast.error('Please enter a title before continuing');
      return;
    }

    if (currentStep === 2 && !content.trim()) {
      toast.error('Please add some content before continuing');
      return;
    }

    setCurrentStep(currentStep + 1);

    // Show step-specific success message
    if (currentStep === 1) {
      toast.success('Basic information saved!');
    } else if (currentStep === 2) {
      toast.success('Content looks great!');
    }
  };

  // Go back to previous step
  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  // Toggle preview mode
  const togglePreview = () => {
    setPreviewOpen(!previewOpen);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('tags', JSON.stringify([...tagList, ...(tags.trim() ? [tags.trim()] : [])]));
    formData.append('codeSnippets', JSON.stringify(codeSnippets.filter(snippet => snippet.trim() !== '')));
    files.forEach((file) => formData.append('files', file));

    try {
      toast.promise(
        axios.post(`${VITE_API_URL}/articles`, formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data',
          },
        }),
        {
          loading: 'Publishing your article...',
          success: () => {
            // Reset form
            setTitle('');
            setContent('');
            setTags('');
            setTagList([]);
            setCodeSnippets(['']);
            setFiles([]);
            setPreviewUrls([]);
            setCurrentStep(1);
            setIsLoading(false);

            return 'Article published successfully!';
          },
          error: 'Failed to publish article. Please try again.',
        }
      );
    } catch (err) {
      console.error('Error creating article:', err);
      setIsLoading(false);
      toast.error('Error publishing article');
    }
  };

  // Render step indicators
  const renderStepIndicators = () => {
    return (
      <div className="flex justify-center mb-8">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex flex-col items-center mx-4 relative">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${currentStep === step
                  ? 'bg-emerald-500 border-emerald-600 text-white shadow-lg shadow-emerald-500/30 scale-110'
                  : currentStep > step
                    ? 'bg-gray-700 border-emerald-500 text-emerald-500'
                    : 'bg-gray-800 border-gray-700 text-gray-500'
                }`}
            >
              {currentStep > step ? <Check size={18} /> : step}
            </div>
            <span
              className={`mt-2 text-xs transition-colors duration-300 ${currentStep === step
                  ? 'text-emerald-500 font-medium'
                  : currentStep > step
                    ? 'text-gray-400'
                    : 'text-gray-500'
                }`}
            >
              {step === 1 ? 'Basics' : step === 2 ? 'Content' : 'Extras'}
            </span>

            {step < 3 && (
              <div className="absolute top-6 left-full w-16 h-0.5 -ml-2 bg-gray-700">
                <div
                  className={`h-full bg-emerald-500 transition-all duration-700 ${currentStep > step ? 'w-full' : 'w-0'
                    }`}
                ></div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  // Step 1: Basic Info
  const renderStep1 = () => {
    return (
      <>
        <div className="space-y-6">
          <div className="group">
            <label className="block text-gray-300 text-sm font-medium mb-2 group-focus-within:text-emerald-400 transition-colors">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-gray-800/60 backdrop-blur-sm text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              placeholder="Enter a compelling title for your article"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              <div className="flex items-center">
                <Tag size={16} className="mr-2" />
                <span>Tags</span>
              </div>
            </label>

            <div className="flex flex-wrap gap-2 mb-2">
              {tagList.map((tag, index) => (
                <div
                  key={index}
                  className="bg-emerald-900/60 text-emerald-300 px-3 py-1 rounded-full text-sm flex items-center group hover:bg-emerald-800/60 transition-colors"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(index)}
                    className="ml-2 text-emerald-400 hover:text-white transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>

            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full bg-gray-800/60 backdrop-blur-sm text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
              placeholder="Type tag and press comma to add"
            />
            <p className="text-gray-400 text-xs mt-2">Add relevant tags to help readers find your article</p>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="button"
            onClick={nextStep}
            className="group px-6 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:bg-gray-700 disabled:text-gray-500 disabled:transform-none flex items-center"
          >
            <span>Continue</span>
            <ChevronRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </>
    );
  };

  // Step 2: Content
  const renderStep2 = () => {
    return (
      <>
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-gray-300 text-sm font-medium">
              <div className="flex items-center">
                <FileText size={16} className="mr-2" />
                <span>Article Content</span>
              </div>
            </label>

            <button
              type="button"
              onClick={togglePreview}
              className="text-xs text-emerald-500 hover:text-emerald-400 flex items-center px-2 py-1 rounded-md bg-emerald-900/30 hover:bg-emerald-900/50 transition-colors"
            >
              <Sparkles size={14} className="mr-1" />
              {previewOpen ? 'Hide Preview' : 'Preview'}
            </button>
          </div>

          {previewOpen ? (
            <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700 rounded-lg p-6 prose prose-invert max-w-none prose-headings:text-emerald-400 prose-a:text-emerald-400 prose-code:text-emerald-300 prose-code:bg-emerald-900/20 prose-code:rounded prose-code:px-1">
              <div dangerouslySetInnerHTML={{ __html: content }} />
              {!content && (
                <p className="text-gray-400 italic">Your preview will appear here...</p>
              )}
            </div>
          ) : (
            <div className="mb-1 bg-gray-900/50 backdrop-blur-sm rounded-t-lg">
              <ReactQuill
                value={content}
                onChange={setContent}
                theme="snow"
                className="bg-gray-800/60 text-white border border-gray-700 rounded-lg text-gray-100"
                modules={{
                  toolbar: [
                    [{ 'header': [1, 2, 3, false] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                    ['link', 'blockquote', 'code-block'],
                    [{ 'color': [] }, { 'background': [] }],
                  ]
                }}
              />
            </div>
          )}

          <p className="text-gray-400 text-xs mt-6">Rich text editor supports formatting options for a professional article</p>
        </div>

        <div className="mt-8 flex justify-between">
          <button
            type="button"
            onClick={prevStep}
            className="group px-6 py-2.5 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900 flex items-center"
          >
            <ChevronLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            <span>Back</span>
          </button>
          <button
            type="button"
            onClick={nextStep}
            className="group px-6 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:bg-gray-700 disabled:text-gray-500 disabled:transform-none flex items-center"
          >
            <span>Continue</span>
            <ChevronRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </>
    );
  };

  // Step 3: Extras (Code Snippets & Files)
  const renderStep3 = () => {
    return (
      <>
        <div className="space-y-8">
          {/* Code Snippets Section */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-3">
              <div className="flex items-center">
                <Code size={16} className="mr-2" />
                <span>Code Snippets</span>
              </div>
            </label>

            {codeSnippets.map((snippet, index) => (
              <div key={index} className="mb-4 relative group">
                <textarea
                  value={snippet}
                  onChange={(e) => updateCodeSnippet(index, e.target.value)}
                  className="w-full bg-gray-800/60 backdrop-blur-sm font-mono text-emerald-300 px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                  placeholder="// Your code here"
                  rows="4"
                />
                {codeSnippets.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeCodeSnippet(index)}
                    className="absolute top-2 right-2 p-1 opacity-0 group-hover:opacity-100 rounded-full bg-gray-700 hover:bg-red-700 text-gray-300 hover:text-white transition-all"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={addCodeSnippet}
              className="flex items-center text-sm text-emerald-500 hover:text-emerald-400 mt-2 group"
            >
              <PlusCircle size={16} className="mr-1 group-hover:rotate-90 transition-transform duration-300" />
              Add another code snippet
            </button>
          </div>

          {/* File Upload Section */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-3">
              <div className="flex items-center">
                <Image size={16} className="mr-2" />
                <span>Upload Images/PDFs</span>
              </div>
            </label>

            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${isDragging
                  ? 'border-emerald-500 bg-emerald-900/20'
                  : 'border-gray-700 hover:border-emerald-500 bg-gray-800/60 backdrop-blur-sm'
                }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                type="file"
                id="file-upload"
                ref={fileInputRef}
                multiple
                onChange={handleFileChange}
                className="hidden"
                accept="image/*,application/pdf"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className={`mx-auto h-12 w-12 ${isDragging ? 'text-emerald-500' : 'text-gray-500'} transition-colors`} />
                <p className="mt-2 text-sm text-gray-400">
                  Drag and drop files, or <span className="text-emerald-500">browse</span>
                </p>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF, PDF up to 10MB each
                </p>
              </label>
            </div>

            {/* File Previews */}
            {files.length > 0 && (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                {files.map((file, index) => (
                  <div key={index} className="relative group">
                    {previewUrls[index] ? (
                      <div className="h-24 rounded-lg overflow-hidden bg-gray-800/60 backdrop-blur-sm border border-gray-700 group-hover:border-emerald-500 transition-colors">
                        <img
                          src={previewUrls[index]}
                          alt={`Preview ${index}`}
                          className="h-full w-full object-cover transition-transform group-hover:scale-110 duration-300"
                        />
                      </div>
                    ) : (
                      <div className="h-24 rounded-lg flex items-center justify-center bg-gray-800/60 backdrop-blur-sm border border-gray-700 group-hover:border-emerald-500 transition-colors">
                        <FileText className="h-8 w-8 text-gray-500 group-hover:text-emerald-500 transition-colors" />
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="absolute -top-2 -right-2 bg-gray-900 rounded-full p-1 border border-gray-700 text-gray-400 hover:text-red-500 hover:border-red-500 transition-colors transform hover:scale-110"
                    >
                      <X size={14} />
                    </button>
                    <div className="text-xs text-gray-400 group-hover:text-emerald-400 truncate mt-1 px-1 transition-colors">
                      {file.name}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 flex justify-between">
          <button
            type="button"
            onClick={prevStep}
            className="group px-6 py-2.5 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900 flex items-center"
          >
            <ChevronLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            <span>Back</span>
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="group px-8 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-900 flex items-center space-x-2 disabled:bg-gray-700 disabled:text-gray-500 disabled:transform-none"
          >
            {isLoading ? (
              <>
                <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></span>
                <span>Publishing...</span>
              </>
            ) : (
              <>
                <span>Publish Article</span>
                <span className="group-hover:rotate-12 transition-transform">✨</span>
              </>
            )}
          </button>
        </div>
      </>
    );
  };

  const backgroundStyle = {
    backgroundImage: `linear-gradient(to bottom, rgba(17, 24, 39, 0.9), rgba(17, 24, 39, 0.95)), url('/Images/newOne.png')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed'
  };

  return (
    <div className="min-h-screen py-12 px-4 text-white" style={backgroundStyle}>
      {/* Toaster component for notifications */}
      <Toaster position="top-right" richColors closeButton />

      <div className="container mx-auto max-w-3xl">
        <div className="backdrop-blur-sm bg-gray-900/80 rounded-2xl shadow-2xl py-10 px-8 md:px-12 border border-gray-800">
          <h1 className="text-3xl font-bold text-center mb-2">Create New Article</h1>
          <p className="text-gray-400 text-center mb-8">Share your knowledge with the community</p>

          {renderStepIndicators()}

          <form onSubmit={handleSubmit} className="mt-6">
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateArticle;