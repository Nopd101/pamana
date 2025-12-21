import React from "react";
import SignUpForm from "../components/SignInForm.jsx";
import leftSideImage from "../assets/login-form-left.png";
import leftSide2Image from "../assets/login-form-right.png";
import bgImage from "../assets/login-form-bg.png";

function SignUpPage() {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
    
      <div
        className="absolute inset-0 z-0 bg-gray-200 bg-cover bg-center"
        style={{
          backgroundImage: `url(${bgImage})`,
        }}
      >
        <div className="absolute inset-0 bg-white/30 backdrop-blur-[2px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-4xl h-[600px] md:h-[650px] bg-[#3E2b26] rounded-[40px] shadow-2xl flex overflow-hidden mx-4">
        
        <div
          className="hidden md:block w-1/2 relative overflow-hidden"
          style={{
            background: "linear-gradient(95deg, #4D351C 0%, #0C0603 100%)",
          }}
        >
          <img
            src={leftSideImage}
            alt="Left Pattern"
            className="absolute top-50 right-25 w-[80%] object-contain opacity-50 grayscale"
          />

          <img
            src={leftSide2Image}
            alt="Right Pattern"
            className="absolute bottom-55 right-0 w-[80%] object-contain opacity-50 grayscale translate-x-4 translate-y-4"
          />
        </div>

        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-[#52392F]">
          <SignUpForm />
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;