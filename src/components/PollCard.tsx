import { Poll, PollStatus, PollSide } from '../types/poll';
import { Link } from 'react-router-dom';
import { ClockIcon, CheckCircleIcon, CubeTransparentIcon } from '@heroicons/react/24/outline';

interface PollCardProps {
    poll: Poll;
}

const PollCard = ({ poll }: PollCardProps) => {
    const isResolved = poll.status === PollStatus.RESOLVED;

    const renderStatus = () => {
        if (isResolved) {
            return (
                <div className="flex items-center space-x-2 text-lg font-bold">
                    <CheckCircleIcon className="h-6 w-6 text-green-400" />
                    <span className="text-green-400">Resolved:</span>
                    <span className={poll.outcome === PollSide.YES ? 'text-green-400' : 'text-red-400'}>
                        {poll.outcome === PollSide.YES ? 'YES' : 'NO'}
                    </span>
                </div>
            );
        }
        return (
            <div className="flex items-center space-x-2 text-lg font-bold text-yellow-400">
                 <CubeTransparentIcon className="h-6 w-6" /><span>Open</span>
            </div>
        )
    }

    return (
        <Link to={`/poll/${poll.id}`} className="block bg-gray-800 border border-gray-700 rounded-2xl shadow-lg p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-indigo-500/30 hover:border-indigo-500">
            <div>
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-white pr-4" style={{ fontFamily: `'Orbitron', sans-serif` }}>{poll.question}</h3>
                    <div className="flex-shrink-0">{renderStatus()}</div>
                </div>

                <div className="text-sm text-gray-400 space-y-2 mb-6">
                     <div className="flex items-center"><ClockIcon className="h-4 w-4 mr-2" /><span>Ends: {poll.deadline.toLocaleString()}</span></div>
                     <div className="flex items-center"><CheckCircleIcon className="h-4 w-4 mr-2" /><span>Resolves: {poll.resolveTime.toLocaleString()}</span></div>
                </div>

                <div className="flex justify-between items-center mb-4 text-white">
                    <div className="text-center">
                        <p className="font-bold text-green-400 text-lg">YES</p>
                        <p>{poll.yesStaked} ETH</p>
                    </div>
                     <div className="text-center">
                        <p className="font-bold text-gray-400 text-lg">Total Staked</p>
                        <p>{poll.totalStaked} ETH</p>
                    </div>
                    <div className="text-center">
                        <p className="font-bold text-red-400 text-lg">NO</p>
                        <p>{poll.noStaked} ETH</p>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default PollCard;
