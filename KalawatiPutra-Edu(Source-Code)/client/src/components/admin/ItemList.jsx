
import React from 'react';

function ItemList({ items, displayField, onEdit, onDelete, onYouTubeClick, showYouTube = false, emptyMessage = "No items available." }) {
    return (
        <div className="mb-8">
            {items.length === 0 ? (
                <p className="text-gray-400">{emptyMessage}</p>
            ) : (
                <ul className="space-y-3">
                    {items.map((item) => (
                        <li
                            key={item._id}
                            className="flex justify-between items-center bg-[#252525] p-4 rounded-lg hover:bg-[#2A2A2A] transition-all duration-200"
                        >
                            <span className="text-white">{item[displayField]}</span>
                            <div className="flex gap-2">
                                {showYouTube && (
                                    <button
                                        onClick={() => onYouTubeClick(item.ytLink)}
                                        className={`px-3 py-1 rounded-lg text-white transition-all duration-200 ${item.ytLink
                                            ? 'bg-red-600 hover:bg-red-700'
                                            : 'bg-red-800 opacity-50 cursor-not-allowed'
                                            }`}
                                        disabled={!item.ytLink}
                                        title={item.ytLink ? 'Watch on YouTube' : 'No YouTube link available'}
                                    >
                                        YouTube
                                    </button>
                                )}
                                <button
                                    onClick={() => onEdit(item)}
                                    className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-all duration-200"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => onDelete(item._id)}
                                    className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition-all duration-200"
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default ItemList;