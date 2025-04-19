import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaCalendarAlt, FaClock, FaUsers, FaVideo, FaComment, FaTimes, FaRegClock, FaChartBar } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/authecontext';
import api from '../../utils/api';

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [meetingStats, setMeetingStats] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!user) {
          navigate('/auth');
          return;
        }

        const meetingsResponse = await api.get('/meeting/history/user');
        console.log("Meetings response:", meetingsResponse.data);
        setMeetings(meetingsResponse.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate, user]);

  const fetchMeetingDetails = async (meetingId) => {
    try {
      const [meetingResponse, statsResponse] = await Promise.all([
        api.get(`/meeting/${meetingId}`),
        api.get(`/meeting/${meetingId}/stats`)
      ]);

      if (meetingResponse.data.success) {
        setSelectedMeeting(meetingResponse.data.data);
        setMeetingStats(statsResponse.data.data);
      } else {
        toast.error('Failed to load meeting details');
      }
    } catch (error) {
      console.error('Error fetching meeting details:', error);
      toast.error('Failed to load meeting details');
    }
  };

  const formatDuration = (minutes) => {
    if (!minutes) return 'Duration not available';
    const hrs = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    return `${hrs ? `${hrs}h ` : ''}${mins}m`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-gray-900 text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-gray-900 text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 rounded-xl p-6 mb-8 shadow-lg"
        >
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 rounded-full bg-orange-500 flex items-center justify-center shadow-lg">
              <FaUser className="text-3xl text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{user?.username}</h1>
              <p className="text-gray-400">{user?.email}</p>
              <p className="text-gray-400 mt-2">
                Total Meetings: {meetings.length}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Meeting History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800/50 rounded-xl p-6 shadow-lg"
        >
          <h2 className="text-xl font-bold mb-6">Meeting History</h2>
          {meetings.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <FaVideo className="mx-auto text-4xl mb-4" />
              <p>No meetings found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {meetings.map((meeting) => (
                <motion.div
                  key={meeting._id}
                  whileHover={{ scale: 1.02 }}
                  className="bg-gray-700/50 rounded-lg p-4 cursor-pointer shadow-md hover:shadow-lg transition-shadow"
                  onClick={() => {
                    console.log(meeting._id);
                    fetchMeetingDetails(meeting._id)
                  }
                  }
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <FaVideo className="text-orange-500" />
                    <h3 className="font-semibold">{meeting.meetingDetails.meeting_id}</h3>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <FaCalendarAlt />
                    <span>{new Date(meeting.meetingDetails.start_time).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-400 mt-2">
                    <FaRegClock />
                    <span>{formatDuration(meeting.meetingDetails.duration)}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-400 mt-2">
                    <FaUsers />
                    <span>{meeting.meetingDetails.totalParticipants} participants</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Meeting Details Modal */}
        {selectedMeeting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => {
              setSelectedMeeting(null);
              setMeetingStats(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-gray-800 rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-white">Meeting Details</h3>
                <button
                  onClick={() => {
                    setSelectedMeeting(null);
                    setMeetingStats(null);
                  }}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Meeting Stats */}
                {meetingStats && (
                  <div className="bg-gray-700/30 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center">
                      <FaChartBar className="mr-2" />
                      Meeting Statistics
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-400">Total Participants</p>
                        <p className="text-white">{meetingStats.totalParticipants}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Duration</p>
                        <p className="text-white">{formatDuration(meetingStats.duration)}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Registered Users</p>
                        <p className="text-white">{meetingStats.registeredUsers}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Guest Users</p>
                        <p className="text-white">{meetingStats.guestUsers}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Participants */}
                <div className="bg-gray-700/30 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Participants</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedMeeting.participants.map((participant, index) => (
                      <span
                        key={`participant-${index}`}
                        className={`px-3 py-1 rounded-full text-sm flex items-center space-x-1 
                          ${participant.isRegistered ? 'bg-orange-500/20' : 'bg-gray-700'}`}
                      >
                        <FaUser className={participant.isRegistered ? 'text-orange-500' : 'text-gray-400'} />
                        <span>{participant.username}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Chat History */}
                {selectedMeeting.chats?.length > 0 && (
                  <div className="bg-gray-700/30 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Chat History</h4>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {selectedMeeting.chats.map((chat, index) => (
                        <div 
                          key={`chat-${index}`}
                          className="flex items-start space-x-2 bg-gray-700/30 p-2 rounded-lg"
                        >
                          <FaComment className="text-orange-500 mt-1 flex-shrink-0" />
                          <div className="flex-grow">
                            <p className="text-white font-semibold">{chat.sender}</p>
                            <p className="text-gray-300 break-words">{chat.message}</p>
                            <p className="text-gray-500 text-xs">
                              {new Date(chat.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Profile;