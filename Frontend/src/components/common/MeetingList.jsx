import React from 'react';
import { motion } from 'framer-motion';
import { FaCalendarAlt } from 'react-icons/fa';
import MeetingCard from './MeetingCard';

const MeetingList = ({ 
  title, 
  meetings, 
  isUpcoming = true,
  onScheduleClick,
  onJoinMeeting,
  onRejoinMeeting 
}) => {
  return (
    <section className="mt-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
        {isUpcoming && (
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <button
              onClick={onScheduleClick}
              className="inline-flex items-center px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FaCalendarAlt className="mr-2" />
              Schedule Meeting
            </button>
          </motion.div>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {meetings.map((meeting) => (
          <MeetingCard
            key={meeting.id}
            {...meeting}
            isUpcoming={isUpcoming}
            onJoin={onJoinMeeting}
            onRejoin={onRejoinMeeting}
          />
        ))}
      </div>
    </section>
  );
};

export default MeetingList; 