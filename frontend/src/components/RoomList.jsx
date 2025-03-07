import React from 'react';
import { motion } from 'framer-motion';
import { FaUsers, FaLock, FaPlay } from 'react-icons/fa';

const RoomList = ({ rooms, onJoinRoom, onCreateRoom }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Available Rooms</h2>
        <button
          onClick={onCreateRoom}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          Create Room
        </button>
      </div>
      
      <div className="space-y-4">
        {rooms.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400 text-center py-4">
            No active rooms. Create one to get started!
          </p>
        ) : (
          rooms.map((room) => (
            <motion.div
              key={room.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-white">{room.name}</h3>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                    <span className="flex items-center">
                      <FaUsers className="mr-1" />
                      {room.players.length}/4
                    </span>
                    {room.isPrivate && (
                      <span className="flex items-center">
                        <FaLock className="mr-1" />
                        Private
                      </span>
                    )}
                    <span className="flex items-center">
                      <FaPlay className="mr-1" />
                      {room.status}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => onJoinRoom(room.id)}
                  disabled={room.players.length >= 4 || room.status === 'playing'}
                  className={`px-4 py-2 rounded-md ${
                    room.players.length >= 4 || room.status === 'playing'
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-700'
                  } text-white transition-colors`}
                >
                  Join
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default RoomList;