import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { getUserData } from "../utils/firebaseUtils";
const LandingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkExistingUser = async () => {
      const userId = localStorage.getItem("trackexUserId");
      if (userId) {
        const userData = await getUserData(userId);
        if (userData) {
          // navigate("/dashboard");
        }
      }
    };

    checkExistingUser();
  }, [navigate]);
  return (
    <div className="min-h-screen pattern flex flex-col justify-between px-4">
      <div className="h-[12vh] px-4 flex items-end mb-10 md:mb-0">
        <h1 className="text-5xl font-bold ">TrackEx</h1>
      </div>
      <div className="flex flex-col md:flex-row h-full md:h-[88vh] w-full rounded-lg px-6">
        <div className="left w-full md:w-[60%]  lg:w-[50%]  flex flex-col justify-end  pb-4">
          <div className="wraper lg:w-[80%] space-y-3">
            <h2 className="text-xl md:text-3xl font-serif font-bold text-[#34495E] leading-relaxed mb-10 ">
              Simplify your shared expenses. Stay balanced and in control.
            </h2>
            <p className="text-lg text-[#34495E] mx-auto lg:leading-8">
              With TrackEx, effortlessly manage shared expenses and balances
              with housemates, trips, groups, friends, and family. Track every
              expense, set budgets, and visualize your spending habits in one
              secure, intuitive platform.
            </p>
            <Link to="/userinfo">
              <button className="bg-[#27AE60] hover:bg-[#2ECC71] text-white font-bold py-4 px-8 rounded-full text-lg transition duration-300 ease-in-out transform hover:scale-105 my-3">
                Get Started
              </button>
            </Link>
            <p className="text-[#3498DB] font-medium">
              No credit card or login required to start!
            </p>
          </div>
        </div>
        <div className="right w-full md:w-[40%] lg:w-[50%]  flex justify-center items-center md:justify-end md:items-end pb-4">
          <div className="iphone-mockup relative w-[80%] sm:w-[60%] md:w-[90%] lg:w-[50%] h-[80vh] sm:h-[85vh] bg-zinc-800 flex justify-center py-3 px-3 rounded-2xl">
            <div className="relative w-full h-full bg-white flex justify-center rounded-2xl">
              <div className="absolute top-2 bg-zinc-800 w-[34%] h-[26px] rounded-full"></div>
              {[
                {
                  title: "Easy to Use",
                  description:
                    "TrackEx offers a user-friendly interface that makes managing your finances a breeze.",
                },
                {
                  title: "Real-time Insights",
                  description:
                    "Get up-to-date insights on your spending patterns and financial health instantly with TrackEx.",
                },
                {
                  title: "Secure & Private",
                  description:
                    "Your data is safe with TrackEx, thanks to our robust security measures and privacy protections.",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="phone-card first-letter:absolute-center bg-zinc-800 text-white p-4 rounded-lg w-[90%] h-[80%] mt-4 md:mt-6"
                >
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm">{feature.
                  description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
