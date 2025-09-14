import React from 'react';

type Props = {
  title: string;
  description: string;
  skills: string[];
  location?: string;
  onApply?: () => void;
}

export default function JobCard({ title, description, skills, location, onApply }: Props) {
  return (
    <div className="bg-white border border-gray-200 p-4 rounded-xl hover:shadow-md transition-all">
      <h3 className="font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{description}</p>
      <div className="flex flex-wrap gap-2 mb-3">
        {skills.map(s => <span key={s} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">{s}</span>)}
      </div>
      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-500">📍 {location || 'Remote'}</span>
        {onApply && <button className="btn-secondary text-sm py-2 px-4" onClick={onApply}>Apply Now</button>}
      </div>
    </div>
  );
}