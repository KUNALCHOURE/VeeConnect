import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authecontext';
import { motion } from 'framer-motion';
import { FaVideo, FaDesktop, FaComments, FaShieldAlt, FaUserFriends, FaClock } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const LandingPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  const features = [
    {
      icon: <FaVideo className="w-8 h-8" />,
      title: "HD Video Calls",
      description: "Crystal clear video quality for seamless communication"
    },
    {
      icon: <FaDesktop className="w-8 h-8" />,
      title: "Screen Sharing",
      description: "Share your screen instantly with other participants"
    },
    {
      icon: <FaComments className="w-8 h-8" />,
      title: "Real-time Chat",
      description: "Built-in messaging for quick communication"
    },
    {
      icon: <FaShieldAlt className="w-8 h-8" />,
      title: "Secure Calls",
      description: "End-to-end encryption for your privacy"
    },
    {
      icon: <FaUserFriends className="w-8 h-8" />,
      title: "Group Calls",
      description: "Connect with multiple participants simultaneously"
    },
    {
      icon: <FaClock className="w-8 h-8" />,
      title: "24/7 Available",
      description: "Access your meetings anytime, anywhere"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* Navbar */}
      <nav className="fixed w-full bg-gray-900/80 backdrop-blur-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0">
              <Link to="/" className="text-2xl font-bold text-blue-500">ZoomClone</Link>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <Link to="/dashboard" className="text-gray-300 hover:text-white px-3 py-2 rounded-md">
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-gray-300 hover:text-white px-3 py-2 rounded-md">
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl sm:text-6xl font-bold text-white mb-6"
          >
            Connect Anywhere, Anytime
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto"
          >
            Experience seamless video conferencing with crystal-clear quality and powerful features
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {!user && (
              <Link
                to="/register"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-semibold inline-block"
              >
                Get Started Free
              </Link>
            )}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-900 p-6 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <div className="text-blue-500 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "Remote Worker",
                text: "The best video conferencing platform I've used. Crystal clear quality and reliable connection."
              },
              {
                name: "Mike Chen",
                role: "Business Owner",
                text: "Perfect for our team meetings. The screen sharing feature is incredibly useful."
              },
              {
                name: "Emma Davis",
                role: "Teacher",
                text: "Great for online classes. The chat feature helps keep students engaged."
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-900 p-6 rounded-lg"
              >
                <p className="text-gray-300 mb-4">"{testimonial.text}"</p>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-gray-400 text-sm">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Simple, Transparent Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Free",
                price: "$0",
                features: ["40-minute meetings", "Up to 100 participants", "Basic features"],
                cta: "Get Started"
              },
              {
                name: "Pro",
                price: "$14.99",
                features: ["Unlimited meetings", "Up to 300 participants", "Advanced features", "Priority support"],
                cta: "Upgrade to Pro",
                popular: true
              },
              {
                name: "Enterprise",
                price: "Custom",
                features: ["Custom solutions", "Unlimited participants", "All features", "24/7 support", "Custom branding"],
                cta: "Contact Sales"
              }
            ].map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`bg-gray-900 p-8 rounded-lg ${plan.popular ? 'border-2 border-blue-500' : ''}`}
              >
                {plan.popular && (
                  <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm mb-4 inline-block">
                    Most Popular
                  </span>
                )}
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-4xl font-bold mb-6">{plan.price}</p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg">
                  {plan.cta}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {[
              {
                question: "How do I start a meeting?",
                answer: "Simply log in to your account, click 'New Meeting', and share the meeting link with your participants."
              },
              {
                question: "Is there a time limit for meetings?",
                answer: "Free users have a 40-minute limit per meeting. Pro and Enterprise users have unlimited meeting duration."
              },
              {
                question: "Can I record meetings?",
                answer: "Yes, Pro and Enterprise users can record meetings and save them to their account."
              },
              {
                question: "What devices can I use?",
                answer: "Our platform works on desktop browsers, mobile browsers, and we offer native apps for iOS and Android."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-900 p-6 rounded-lg"
              >
                <h3 className="text-xl font-semibold mb-2">{faq.question}</h3>
                <p className="text-gray-400">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">ZoomClone</h3>
              <p className="text-gray-400">Connect anywhere, anytime with our powerful video conferencing platform.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><Link to="#" className="text-gray-400 hover:text-white">Features</Link></li>
                <li><Link to="#" className="text-gray-400 hover:text-white">Pricing</Link></li>
                <li><Link to="#" className="text-gray-400 hover:text-white">Security</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><Link to="#" className="text-gray-400 hover:text-white">About</Link></li>
                <li><Link to="#" className="text-gray-400 hover:text-white">Careers</Link></li>
                <li><Link to="#" className="text-gray-400 hover:text-white">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><Link to="#" className="text-gray-400 hover:text-white">Privacy</Link></li>
                <li><Link to="#" className="text-gray-400 hover:text-white">Terms</Link></li>
                <li><Link to="#" className="text-gray-400 hover:text-white">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; 2024 ZoomClone. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage; 