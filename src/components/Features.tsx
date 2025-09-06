import React from 'react';

const Features = () => {
  return (
    <section className="features py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="feature text-center">
            <h3 className="text-xl font-bold mb-2">Create Polls</h3>
            <p>Easily create polls on any topic you can imagine.</p>
          </div>
          <div className="feature text-center">
            <h3 className="text-xl font-bold mb-2">Vote on Polls</h3>
            <p>Participate in polls and make your voice heard.</p>
          </div>
          <div className="feature text-center">
            <h3 className="text-xl font-bold mb-2">See Results</h3>
            <p>View real-time results for all polls.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
