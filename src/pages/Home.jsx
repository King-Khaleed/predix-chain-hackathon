import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="text-white text-center p-10">
      <h1 className="text-5xl font-bold mb-4">Welcome to PredictionPolls</h1>
      <p className="text-xl mb-8">Your decentralized platform for creating and participating in prediction markets on the BlockDAG network.</p>
      <div className="space-x-4">
        <Link to="/create" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg text-lg">
          Create a Poll
        </Link>
        <Link to="/polls" className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg text-lg">
          View All Polls
        </Link>
      </div>
    </div>
  );
};

export default Home;
