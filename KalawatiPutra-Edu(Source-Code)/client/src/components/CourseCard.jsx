import React from 'react';
import { useNavigate } from 'react-router-dom';

function CourseCard({ course }) {
  const navigate = useNavigate();
  const fallbackImage = '/Images/placeholder-course.jpg'; // Ensure this exists in public/Images/

  return (
    <article
      className="bg-[#1E1E1E] rounded-lg shadow-lg overflow-hidden border border-gray-600 hover:border-[#4CAF50] transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-2"
      onClick={() => navigate(`/courses/${course._id}`)}
    >
      <img
        src={course.image || fallbackImage}
        alt={`${course.title} course thumbnail`}
        className="w-full h-48 object-cover"
        loading="lazy"
      />
      <div className="p-6">
        <h3 className="text-xl font-semibold text-white mb-2">{course.title}</h3>
        <p className="text-gray-300 mb-4 line-clamp-2">{course.description}</p>
        <span className="text-sm text-[#4CAF50]">{course.category}</span>
        <p className="text-sm text-gray-400 mt-2">
          By {course.author?.name || 'Unknown'}
        </p>
      </div>
    </article>
  );
}

export default CourseCard;