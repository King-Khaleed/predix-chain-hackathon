import React from 'react';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Footer from '../components/Footer';

const LandingPage = () => {
  return (
    <div>
      <main>
        <Hero />
        <Features />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
