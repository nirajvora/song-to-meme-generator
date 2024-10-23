import React, { useState } from 'react';
import { X } from 'lucide-react';

interface HashtagInputProps {
  onHashtagsChange: (hashtags: string[]) => void;
}

export const HashtagInput: React.FC<HashtagInputProps> = ({ onHashtagsChange }) => {
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [input, setInput] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addHashtag();
    }
  };

  const addHashtag = () => {
    const tag = input.trim().replace(/^#/, '');
    if (tag && !hashtags.includes(tag)) {
      const newHashtags = [...hashtags, tag];
      setHashtags(newHashtags);
      onHashtagsChange(newHashtags);
      setInput('');
    }
  };

  const removeHashtag = (tagToRemove: string) => {
    const newHashtags = hashtags.filter(tag => tag !== tagToRemove);
    setHashtags(newHashtags);
    onHashtagsChange(newHashtags);
  };

  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-2 mb-2">
        {hashtags.map(tag => (
          <span
            key={tag}
            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-indigo-100 text-indigo-800"
          >
            #{tag}
            <button
              onClick={() => removeHashtag(tag)}
              className="ml-2 text-indigo-600 hover:text-indigo-800"
            >
              <X size={14} />
            </button>
          </span>
        ))}
      </div>
      
      <div className="relative">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={addHashtag}
          placeholder="Add hashtags (press Enter or comma to add)"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
    </div>
  );
};