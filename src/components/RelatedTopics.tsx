
import React from 'react';
import { Tag } from 'lucide-react';

interface RelatedTopicsProps {
  topics: string[];
}

const RelatedTopics: React.FC<RelatedTopicsProps> = ({ topics }) => {
  return (
    <div className="bg-gray-50 rounded-lg p-6 h-full">
      <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
        <Tag className="mr-2 h-4 w-4" />
        Related Topics
      </h3>
      <div className="space-y-2">
        {topics.length > 0 ? (
          topics.slice(0, 8).map((topic, index) => (
            <a
              key={index}
              href={`https://en.wikipedia.org/wiki/${encodeURIComponent(topic.replace(/ /g, '_'))}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-green-600 hover:text-green-700 hover:bg-white px-3 py-2 rounded transition-colors text-sm border border-transparent hover:border-green-200"
            >
              {topic}
            </a>
          ))
        ) : (
          <p className="text-gray-500 text-sm italic px-3 py-2">
            Generating related topics...
          </p>
        )}
      </div>
    </div>
  );
};

export default RelatedTopics;
