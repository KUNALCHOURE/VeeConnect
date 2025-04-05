import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaCalendarAlt, FaClock, FaUsers, FaVideo, FaComment, FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/authecontext';
import api from '../../utils/api';

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMeeting, setSelectedMeeting] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!user) {
          navigate('/auth');
          return;
        }

        // Fetch meeting history
        const meetingsResponse = await api.get('/user/meetinghistory');
        console.log("meeting response", meetingsResponse.data);
        setMeetings(meetingsResponse.data.data); // Extract data from Apiresponse
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
      const response = await api.get(`/user/${meetingId}`);
      console.log("meeting details", response);
      setSelectedMeeting(response.data.data); // Extract data from Apiresponse
    } catch (error) {
      console.error('Error fetching meeting details:', error);
      toast.error('Failed to load meeting details');
    }
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {meetings.map((meeting) => (
              <motion.div
                key={meeting.meetingID._id}
                whileHover={{ scale: 1.02 }}
                className="bg-gray-700/50 rounded-lg p-4 cursor-pointer shadow-md hover:shadow-lg transition-shadow"
                onClick={() => fetchMeetingDetails(meeting.meetingID._id)}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <FaVideo className="text-orange-500" />
                  <h3 className="font-semibold">{meeting.meetingID.meeting_id}</h3>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <FaCalendarAlt />
                  <span>{new Date(meeting.meetingID.Date).toLocaleDateString()}</span>
                  <FaClock className="ml-4" />
                  <span>{new Date(meeting.meetingID.Date).toLocaleTimeString()}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Meeting Details Modal */}
        {selectedMeeting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedMeeting(null)}
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
                  onClick={() => setSelectedMeeting(null)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-400">Meeting ID</p>
                  <p className="text-white font-medium">{selectedMeeting.meeting_id}</p>
                </div>
                <div>
                  <p className="text-gray-400">Date & Time</p>
                  <p className="text-white font-medium">
                    {new Date(selectedMeeting.Date).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">Participants</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedMeeting.participants?.map((participant, index) => (
                      <span
                        key={index}
                        className="bg-gray-700 text-white px-3 py-1 rounded-full text-sm flex items-center space-x-1"
                      >
                        <FaUsers className="text-orange-500" />
                        <span>{participant.username}</span>
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-gray-400">Chats</p>
                  <div className="space-y-2 max-h-40 overflow-y-auto mt-2">
                    {selectedMeeting.chats?.map((chat, index) => (
                      <div key={index} className="flex items-start space-x-2 bg-gray-700/30 p-2 rounded-lg">
                        <FaComment className="text-orange-500 mt-1" />
                        <div>
                          <p className="text-white font-semibold">{chat.sender}</p>
                          <p className="text-gray-300">{chat.message}</p>
                          <p className="text-gray-500 text-xs">
                            {new Date(chat.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Profile;