import React from 'react';

type Worker = { name?: string; skills?: string[]; location?: string };

type Props = {
  worker: Worker;
  score?: number;
  onAccept?: () => void;
}

export default function WorkerCard({ worker, score, onAccept }: Props) {
  return (
    <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 p-6 rounded-xl hover:shadow-lg transition-all">
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-semibold text-gray-800 text-lg">{worker.name}</h3>
        {typeof score === 'number' && (
          <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-medium">
            {(score * 100).toFixed(0)}% Match
          </span>
        )}
      </div>
      <div className="space-y-3 mb-4">
        <div>
          <p className="text-xs text-gray-500 mb-1">Skills</p>
          <div className="flex flex-wrap gap-1">
            {(worker.skills||[]).slice(0, 3).map(skill => (
              <span key={skill} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">{skill}</span>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs text-gray-500">Location</p>
          <p className="text-sm text-gray-700">{worker.location || 'Not specified'}</p>
        </div>
      </div>
      {onAccept && <button className="btn-primary text-sm py-3" onClick={onAccept}>Accept Candidate</button>}
    </div>
  );
}