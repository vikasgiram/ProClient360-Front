import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "././login.css";
import toast from "react-hot-toast";
import { forgetPassword } from "../../hooks/useAuth";


export const ForgotPassword = () => {
  const navigation = useNavigate();


  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handelEmailSubmit = async (e) => {
    e.preventDefault();
    if (email === "") {
      return toast.error("Email is Required...  ");
    }
    setLoading(true);
    try {
      const data = await forgetPassword(email);
      if (data.error) {
        return toast.error(data.error);
      }
      navigation('/Mailsentsuccessfully');
      setEmail('');
    } catch (error) {
      toast.error("An error occurred while sending the email.");
    } finally {
      setLoading(false); // Set loading to false after email submission is complete
    }
  }


  useEffect(() => {
    const elements = document.querySelectorAll('.slide-in');
    elements.forEach((el, index) => {
      setTimeout(() => {
        el.style.animationPlayState = 'running';
      }, index * 100);
    });
  }, []);




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






  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 overflow-hidden relative font-[Inter] loginbody_text">
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
              <h1 className="text-4xl font-bold text-gray-800 slide-in" style={{ animationDelay: '0.2s' }}>
                Manage Password <span className="text-blue-600">Securly</span>
              </h1>
              <p className="text-xl text-gray-600 slide-in" style={{ animationDelay: '0.4s' }}>
                Manage your passwords securely with encryption and smart storage practices.
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
                <h2 className="text-3xl font-bold text-gray-800">Forgot</h2>
                <p className="text-gray-600 mt-2">Forgot Your Password</p>
              </div>
              <form className="space-y-6" onSubmit={handelEmailSubmit}>

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
                    name='email'
                    placeholder='Enter your email...'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="input-focus w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-gray-50/50"
                  />
                </div>




                <div className="flex my-4 items-center justify-between">
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
                    " Send"
                  )}

                </button>


              </form>

               <a onClick={() => navigation('/')}> <i className="fa-solid fa-angle-left mt-5 text-center"></i>  Back to Login page</a>

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