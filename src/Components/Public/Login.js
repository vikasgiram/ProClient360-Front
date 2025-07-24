import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "././login.css";
import toast from "react-hot-toast";
import { loginUser } from "../../hooks/useAuth";
import { UserContext } from "../../context/UserContext";
import { requestForToken } from '../../firebase';

export const LogIn = () => {
  const navigation = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { setUser } = useContext(UserContext);

  const requestNotificationPermission = async () => {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      console.log("Notification permission granted.");
    } else {
      console.warn("Notification permission denied.");
    }
  };

  useEffect(() => {
    requestNotificationPermission();
  })

  const getFcmToken = async () => {
    await requestForToken();
  }

  useEffect(() => {
    console.log("Requesting FCM token...");
    getFcmToken();

  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("login details: " + username + " " + password);
    const fcmToken = localStorage.getItem("fcmToken");
    setLoading(true);
    try {
      const data = await loginUser(username, password, fcmToken);
      // console.log(username,password);
      setUser(data);
      if (data.newUser === true) {
        toast.success("Please complete your profile to continue.");
        navigation("/ChangePassword");
        console.log("New user, redirecting to ChangePassword");
      }
      else if (data.user === "employee" || data.user === "company") {
        navigation("/MainDashboard");
      } else if (data.user === "admin") {
        navigation("/AdminMainDashboard");
      }


    } catch (error) {
      console.error(error);
      toast.error("Something Went Wrong...");
    }
    finally {
      setLoading(false);
    }
  };


  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    const elements = document.querySelectorAll('.slide-in');
    elements.forEach((el, index) => {
      setTimeout(() => {
        el.style.animationPlayState = 'running';
      }, index * 100);
    });
  }, []);



  const showForgotPassword = () => {
    alert('Demo: Forgot Password\n\nIn a real application, this would redirect to a password reset page.');
  };

  const showSignUp = () => {
    alert('Demo: Sign Up\n\nIn a real application, this would redirect to a registration page.');
  };





  const InputField = ({ type, name, placeholder, Icon }) => (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Icon />
      </div>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        required
        className="input-focus w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-gray-50/50"
      />
    </div>
  );

  const DashboardIcon = () => (
    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
      <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
    </svg>
  );

  const CalendarIcon = () => (
    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
    </svg>
  );

  const TasksIcon = () => (
    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z" clipRule="evenodd" />
    </svg>
  );

  const ChartIcon = () => (
    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
      <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
    </svg>
  );

  const TeamIcon = () => (
    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
    </svg>
  );

  const EmailIcon = () => (
    <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
    </svg>
  );

  const PasswordIcon = () => (
    <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
    </svg>
  );




  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 overflow-hidden relative font-[Inter]">
      <div className="absolute inset-0 wave"></div>
      {[...Array(9)].map((_, i) => (
        <div
          key={i}
          className="particle"
          style={{ left: `${10 * (i + 1)}%`, animationDelay: `${(i * 2) % 12}s` }}
        ></div>
      ))}

      <div className="min-h-screen flex items-center justify-center px-4 relative z-10">
        <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side */}
          <div className="hidden lg:block relative">
            <div className="text-center space-y-8">
              <h1 className="text-5xl font-bold text-gray-800 slide-in" style={{ animationDelay: '0.2s' }}>
                Manage Projects <span className="text-blue-600">Smartly</span>
              </h1>
              <p className="text-xl text-gray-600 slide-in" style={{ animationDelay: '0.4s' }}>
                Streamline your workflow, boost productivity, and deliver projects on time.
              </p>
              <div className="relative h-96 slide-in" style={{ animationDelay: '0.6s' }}>
                {/* Icons */}
                <div className="floating-icon absolute top-10 left-10 bg-blue-500 p-4 rounded-2xl shadow-lg">
                  <DashboardIcon />
                </div>
                <div className="floating-icon absolute top-20 right-16 bg-purple-500 p-4 rounded-2xl shadow-lg">
                  <CalendarIcon />
                </div>
                <div className="floating-icon absolute bottom-16 left-20 bg-green-500 p-4 rounded-2xl shadow-lg">
                  <TasksIcon />
                </div>
                <div className="floating-icon absolute bottom-8 right-8 bg-orange-500 p-4 rounded-2xl shadow-lg">
                  <ChartIcon />
                </div>
                <div className="floating-icon absolute top-32 left-1/2 transform -translate-x-1/2 bg-indigo-500 p-4 rounded-2xl shadow-lg">
                  <TeamIcon />
                </div>
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div className="w-full max-w-md mx-auto">
            <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 slide-in" style={{ animationDelay: '0.3s' }}>
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
                  <DashboardIcon />
                </div>
                <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
                <p className="text-gray-600 mt-2">Sign in to your ProjectFlow account</p>
              </div>
              <form className="space-y-6" onSubmit={handleLogin}>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    {/* <Icon /> */}
                    <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>

                  </div>
                  <input
                    type='email'
                    name='username'
                    placeholder='Enter your email...'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="input-focus w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-gray-50/50"
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    {/* <Icon /> */}
                    <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>


                  </div>
                  <input
                    type='password'
                    name='password'
                    placeholder="Enter your Password..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="input-focus w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-gray-50/50"
                  />
                </div>



                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                  </label>
                  <button type="button" className="text-sm text-blue-600 hover:text-blue-800" onClick={showForgotPassword}>Forgot password?</button>
                </div>

                <button type="submit" className="btn-hover w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-2xl font-semibold text-lg shadow-lg d-flex align-items-center justify-content-center">
                  {loading ? (
                    <span className="loader"
                      style={{
                        height: "5px",
                        width: "5px",
                        position: 'relative', // Make button position relative to position loader
                        margin: "10px 0px 5px -225px"
                      }}
                    ></span> // Use your existing loader styles
                  ) : (
                    " Sign In"
                  )}

                </button>

                <div className="text-center">
                  <span className="text-gray-600 cursor-pointer">
                    Privacy policy
                  </span>
                  <span className="mx-2">|</span>
                  <span className="text-gray-600 cursor-pointer">
                    Tearms & Conditions
                  </span>
                </div>
              </form>
            </div>
            <div className="lg:hidden text-center mt-8 slide-in" style={{ animationDelay: '0.5s' }}>
              <h1 className="text-3xl font-bold text-gray-800">
                Manage Projects <span className="text-blue-600">Smartly</span>
              </h1>
              <p className="text-gray-600 mt-2">Streamline your workflow and boost productivity</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

};