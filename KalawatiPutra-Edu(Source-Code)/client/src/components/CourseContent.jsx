import React, { useState } from 'react';
import { FaYoutube, FaFilePdf } from 'react-icons/fa';
import { markTopicComplete, getDownloadUrl as generateDownloadUrl } from '../api/academy';

const CourseContent = ({ modules, courseId, completedTopics, setCompletedTopics }) => {
  const [openModule, setOpenModule] = useState(null);

  const toggleModule = (index) => {
    setOpenModule(openModule === index ? null : index);
  };

  const handleMarkComplete = async (topicId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in to mark topics as complete');
        return;
      }
      await markTopicComplete(courseId, topicId);
      setCompletedTopics([...completedTopics, topicId]);
    } catch (err) {
      console.error('Failed to mark topic as complete:', err);
      alert('Failed to mark topic as complete');
    }
  };

  // Debug: Log modules to verify notesUrl
  console.log('Modules:', modules);

  // Helper function to get the correct download URL
  const getDownloadUrl = (notesUrl) => {
    if (notesUrl.startsWith('http')) {
      // Cloudinary URL, use directly
      return notesUrl;
    }
    // Local path, use download endpoint
    return generateDownloadUrl(notesUrl.split('/').pop());
  };

  return (
    <div className="bg-[#1E1E1E] rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-semibold mb-6 text-[#4CAF50]">Course Content</h2>
      {modules.length > 0 ? (
        <div className="space-y-4">
          {modules.map((module, index) => (
            <div key={index} className="border-b border-gray-700">
              <button
                onClick={() => toggleModule(index)}
                className="w-full text-left py-4 flex justify-between items-center"
              >
                <span className="text-lg font-medium text-white">{module.title}</span>
                <span className="text-gray-400">{openModule === index ? '−' : '+'}</span>
              </button>
              {openModule === index && (
                <div className="pl-6 pb-4 space-y-4">
                  {module.topics.map((topic) => (
                    <div
                      key={topic._id}
                      className="flex items-start space-x-4 p-4 bg-[#2A2A2A] rounded-lg"
                    >
                      <input
                        type="checkbox"
                        checked={completedTopics.includes(topic._id)}
                        onChange={() => handleMarkComplete(topic._id)}
                        disabled={completedTopics.includes(topic._id)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <h3 className="text-md font-semibold text-white">{topic.title}</h3>
                        <p className="text-gray-400 text-sm mb-2">{topic.description}</p>
                        <div className="flex space-x-4">
                          {topic.youtubeUrl && (
                            <a
                              href={topic.youtubeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-red-500 hover:text-red-400 flex items-center space-x-1"
                              title="Watch on YouTube"
                            >
                              <FaYoutube className="text-lg" />
                              <span>Watch Video</span>
                            </a>
                          )}
                          {topic.notesUrl && (
                            <a
                              href={getDownloadUrl(topic.notesUrl)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:text-blue-400 flex items-center space-x-1"
                              title="Download PDF Notes"
                            >
                              <FaFilePdf className="text-lg" />
                              <span>Download Notes</span>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400">No content available for this course.</p>
      )}
    </div>
  );
};

export default CourseContent;