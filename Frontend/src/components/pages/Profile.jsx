import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaCalendarAlt, FaClock, FaUsers, FaVideo } from 'react-icons/fa';
import axios from 'axios';
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
        console.log(user);
        if (!user) {
          navigate('/auth');
          return;
        }


        // Fetch meeting history
        const meetingsResponse = await api.get('/user/meetinghistory');
        console.log("meeting response",meetingsResponse.data);
        setMeetings(meetingsResponse.data);
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
      console.log("meeting  details",response);
      setSelectedMeeting(response.data);
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
          className="bg-gray-800/50 rounded-xl p-6 mb-8"
        >
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 rounded-full bg-orange-500 flex items-center justify-center">
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
          className="bg-gray-800/50 rounded-xl p-6"
        >
          <h2 className="text-xl font-bold mb-6">Meeting History</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {meetings.map((meeting) => (
              <motion.div
                key={meeting._id}
                whileHover={{ scale: 1.02 }}
                className="bg-gray-700/50 rounded-lg p-4 cursor-pointer"
                onClick={() => fetchMeetingDetails(meeting._id)}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <FaVideo className="text-orange-500" />
                  <h3 className="font-semibold">{meeting.title}</h3>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <FaCalendarAlt />
                  <span>{new Date(meeting.date).toLocaleDateString()}</span>
                  <FaClock className="ml-4" />
                  <span>{new Date(meeting.date).toLocaleTimeString()}</span>
                </div>
                <div className="flex items-center space-x-2 mt-2 text-sm text-gray-400">
                  <FaUsers />
                  <span>{meeting.participants?.length || 0} participants</span>
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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedMeeting(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-gray-800 rounded-xl p-6 max-w-2xl w-full"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-white">Meeting Details</h3>
                <button
                  onClick={() => setSelectedMeeting(null)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-gray-400">Meeting ID</p>
                  <p className="text-white">{selectedMeeting.meetingId}</p>
                </div>
                <div>
                  <p className="text-gray-400">Date & Time</p>
                  <p className="text-white">
                    {new Date(selectedMeeting.date).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">Participants</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedMeeting.participants?.map((participant, index) => (
                      <span
                        key={index}
                        className="bg-gray-700 text-white px-3 py-1 rounded-full text-sm"
                      >
                        {participant}
                      </span>
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