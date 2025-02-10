import React, { useState } from 'react';
import { formatCurrency } from '../utils/formatCurrency';

function Challenges() {
  const [challenges] = useState([
    {
      id: 1,
      name: '52 Week Challenge',
      description: 'Save increasing amounts each week',
      target: 137800,
      saved: 45000,
      duration: '52 weeks',
      participants: 1234
    },
    // ...
  ]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Savings Challenges</h1>
      <div className="grid gap-6">
        {challenges.map(challenge => (
          <div key={challenge.id} className="bg-white p-6 rounded-lg">
            <h3 className="text-xl font-bold">{challenge.name}</h3>
            <p className="text-gray-600 mt-2">{challenge.description}</p>
            <div className="mt-4">
              <div className="h-2 bg-gray-100 rounded-full">
                <div 
                  className="h-full bg-green-500 rounded-full"
                  style={{ width: `${(challenge.saved/challenge.target) * 100}%` }}
                />
              </div>
              <div className="flex justify-between mt-2 text-sm">
                <span>{formatCurrency(challenge.saved)} saved</span>
                <span>{challenge.duration}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Challenges; 