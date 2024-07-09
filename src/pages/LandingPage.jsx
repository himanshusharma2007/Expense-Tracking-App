import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { getUserData } from "../utils/firebaseUtils";
import { gsap } from "gsap";
const LandingPage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const checkExistingUser = async () => {
      const userId = localStorage.getItem("trackexUserId");
      if (userId) {
        const userData = await getUserData(userId);
        if (userData) {
          navigate("/dashboard");
        }
      }
    };

    checkExistingUser();
  }, [navigate]);
  const features = [
    {
      title: "Personal & Group Expense Tracking",
      description:
        "Easily log and manage both individual and shared expenses in one place. TrackEx seamlessly organizes your financial activities, whether personal or with groups.",
      color: "bg-gradient-to-br from-green-500 to-teal-500",
    },
    {
      title: "Smart Expense Splitting & Settlement",
      description:
        "Easily divide costs within groups and settle debts effortlessly. TrackEx calculates shared expenses, showing who owes what, and streamlines group repayments.",
      color: "bg-gradient-to-br from-purple-600 to-indigo-600",
    },
    {
      title: "Intuitive Budgeting Tools",
      description:
        "Set group or personal budgets, track spending categories, and visualize your financial health with interactive charts and insights.",
      color: "bg-gradient-to-br from-orange-500 to-yellow-500",
    },
    {
      title: "Secure & Private",
      description:
        "Your financial data is encrypted and protected. TrackEx uses bank-level security measures to ensure your information stays private and secure.",
      color: "bg-gradient-to-br from-red-500 to-pink-500",
    },
  ];
  useEffect(() => {
    const cards = gsap.utils.toArray(".phone-card");
    let currentIndex = 0;

    gsap.set(cards[0], { opacity: 1, scale: 1 });

    const rotateCards = () => {
      gsap.to(cards[currentIndex], {
        opacity: 0,
        scale: 0.8,
        x: "-100%",
        duration: 0.5,
        onComplete: () => {
          gsap.set(cards[currentIndex], { x: "100%" });
        },
      });

      currentIndex = (currentIndex + 1) % cards.length;

      gsap.fromTo(
        cards[currentIndex],
        { opacity: 0, scale: 0.8, x: "100%" },
        { opacity: 1, scale: 1, x: "0%", duration: 0.5 }
      );
    };

    const interval = setInterval(rotateCards, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-[550px]  overflow-y-auto  md:mb-0 h-screen pattern flex flex-col  md:px-4">
      <div className="h-[12vh] px-4 flex items-end mb-10 mt-5 md:mt-3 md:mb-0 ">
        <h1 className="text-5xl font-bold ">TrackEx</h1>
      </div>
      <div className="flex flex-col md:flex-row   w-full rounded-lg px-6 ">
        <div className="left h-auto min-h-[88vh]  w-full md:w-[60%]  lg:w-[50] flex flex-col  justify-center md:justify-end pb-10 md:pb-4 ">
          <div className="wraper lg:w-[80%]   space-y-5 md:space-y-3">
            <h2 className="text-2xl text-center md:text-left md:text-3xl font-serif font-bold text-[#34495E] leading-relaxed md:mb-10 ">
              Simplify your shared expenses. Stay balanced and in control.
            </h2>
            <p className="text-lg text-center md:text-left text-[#34495E] mx-auto lg:leading-8">
              With TrackEx, effortlessly manage shared expenses and balances
              with housemates, trips, groups, friends, and family. Track every
              expense, set budgets, and visualize your spending habits in one
              secure, intuitive platform.
            </p>

            <div className="wraper w-full  flex justify-center md:justify-start">
              <Link to="/userinfo">
                <button className="bg-[#27AE60] hover:bg-[#2ECC71] text-white font-bold py-4 px-8 rounded-full text-lg transition duration-300 ease-in-out transform hover:scale-105 my-3">
                  Get Started
                </button>
              </Link>
            </div>
            <p className="text-[#3498DB] font-medium text-center md:text-left">
              No credit card or login required to start!
            </p>
          </div>
        </div>
        <div className="right w-full md:w-[40%] lg:w-[50%]  flex items-center justify-center md:justify-end md:items-end pb-4 ">
          <div className="iphone-mockup  relative w-[320px] h-[500px] md:h-[530px]  bg-zinc-800 flex justify-center py-3 px-3 rounded-[3rem] shadow-2xl md:mr-8">
            <div className="relative w-full h-full bg-white flex justify-center rounded-[2.5rem] overflow-hidden">
              <div className="absolute top-2 bg-zinc-800 w-[34%] h-[26px] rounded-full z-10"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className={`phone-card absolute w-[90%] h-[70%]  ${feature.color} text-white p-6 rounded-2xl shadow-xl transform transition-all duration-500 ease-in-out`}
                    style={{ opacity: 0, scale: 0.8 }}
                  >
                    <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                    <p className="text-md">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
