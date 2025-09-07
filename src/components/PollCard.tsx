import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Poll, PollStatus } from '../types/poll';
import { ethers } from 'ethers';

interface PollCardProps {
    poll: Poll;
    linkTo?: string;
}

const PollCard: React.FC<PollCardProps> = ({ poll, linkTo }) => {

    const getStatusInfo = (status: PollStatus) => {
        switch (status) {
            case PollStatus.Open:
                return <span className="font-semibold text-green-400">Open</span>;
            case PollStatus.Pending:
                return <span className="font-semibold text-yellow-400">Pending</span>;
            case PollStatus.Resolved:
                return <span className="font-semibold text-red-400">Resolved</span>;
            default:
                return <span className="font-semibold text-gray-400">Unknown</span>;
        }
    };

    const totalStaked = poll.yesStaked && poll.noStaked ? 
    ethers.formatEther(BigInt(poll.yesStaked.toString()) + BigInt(poll.noStaked.toString())) : '0';

    const cardContent = (
        <div className="block p-6 bg-gray-800 rounded-lg shadow-lg hover:bg-gray-700 transition-colors duration-200 h-full">
            <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold mb-2 text-white break-words w-10/12">{poll.question}</h3>
                {getStatusInfo(poll.status)}
            </div>
            <div className="text-sm text-gray-400 mb-4">
                <p>Ends: {poll.deadline.toLocaleString()}</p>
                <p>Resolves: {poll.resolveTime.toLocaleString()}</p>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-4 dark:bg-gray-700 my-2 flex">
                <div className="bg-green-500 h-4 rounded-l-full" style={{ width: `${poll.totalStaked > 0 ? (Number(poll.yesStaked) / Number(poll.totalStaked)) * 100 : 50}%` }}></div>
                <div className="bg-red-500 h-4 rounded-r-full" style={{ width: `${poll.totalStaked > 0 ? (Number(poll.noStaked) / Number(poll.totalStaked)) * 100 : 50}%` }}></div>
            </div>
            <div className="text-center mt-2 font-semibold">
                Total Staked: {totalStaked} ETH
            </div>
        </div>
    );

    return linkTo ? <Link to={linkTo}>{cardContent}</Link> : cardContent;
};

export default PollCard;
