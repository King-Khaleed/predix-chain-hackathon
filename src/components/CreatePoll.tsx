import React, { useState } from 'react';
import useContract from '../hooks/useContract';

const CreatePoll = () => {
  const [question, setQuestion] = useState('');
  const [deadline, setDeadline] = useState('');
  const [resolveTime, setResolveTime] = useState('');
  const { createPoll } = useContract();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const deadlineTimestamp = Math.floor(new Date(deadline).getTime() / 1000);
      const resolveTimestamp = Math.floor(new Date(resolveTime).getTime() / 1000);
      await createPoll(question, deadlineTimestamp, resolveTimestamp);
      alert('Poll created successfully!');
    } catch (error) {
      alert(`Failed to create poll: ${error.message}`);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-gray-800 text-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Create a New Poll</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="question" className="block text-sm font-medium">Question</label>
          <input
            id="question"
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 mt-1"
            required
          />
        </div>
        <div>
          <label htmlFor="deadline" className="block text-sm font-medium">Prediction Deadline</label>
          <input
            id="deadline"
            type="datetime-local"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 mt-1"
            required
          />
        </div>
        <div>
          <label htmlFor="resolveTime" className="block text-sm font-medium">Resolution Time</label>
          <input
            id="resolveTime"
            type="datetime-local"
            value={resolveTime}
            onChange={(e) => setResolveTime(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 mt-1"
            required
          />
        </div>
        <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
          Create Poll
        </button>
      </form>
    </div>
  );
};

export default CreatePoll;
