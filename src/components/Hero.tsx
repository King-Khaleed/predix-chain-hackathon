import React from 'react';

const Hero = () => {
  return (
    <section className="hero bg-purple-600 text-white text-center py-20">
      <h1 className="text-5xl font-bold mb-4">Welcome to PrediX - Chain</h1>
      <p className="text-xl mb-8">Create and participate in predictions on any topic.</p>
      <button className="bg-white text-purple-600 font-bold py-2 px-4 rounded-full hover:bg-gray-200">
        Start Predictions
      </button>
    </section>
  );
};

export default Hero;
