import React, { useState } from "react";

const Auth = () => {
  const [isRegistering, setIsRegistering] = useState(false);

  return (
    <>
      <div className="login-card justify-center inset-0 z-50">

        {/* LOGIN CARD */}
        {!isRegistering && (
          <div className="rounded-xl border mt-20 ml-20 w-lg border-[#c5a059]/10 bg-gradient-to-b from-[#0b0b0b] to-[#040404] transition-all duration-500 flex flex-col hover:border-[#c5a059]/40 hover:-translate-y-1.5 hover:shadow-[0_15px_35px_rgba(0,0,0,0.85)]">

            <h2 className="text-2xl font-serif font-bold text-center text-white mt-10 mb-3 tracking-wide">
              Lawra Login
            </h2>

            <p className="text-center text-gray-500 text-xs font-light mb-2 px-25">
              Welcome back! Please enter your credentials to access your account.
            </p>

            <form className="flex mt-5 h-full flex-col gap-6">

              <div className="flex flex-col h-full gap-4 px-10">

                {/* EMAIL */}
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-gray-500 mb-1.5 font-semibold">
                    Enter Email
                  </label>

                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full bg-black border border-zinc-800 text-white text-xs font-serif tracking-normal p-3 rounded focus:outline-none focus:border-[#c5a059] transition-all placeholder:text-gray-700 font-light"
                  />
                </div>

                {/* PASSWORD */}
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-gray-500 mb-1.5 font-semibold">
                    Enter Password
                  </label>

                  <input
                    type="password"
                    placeholder="Enter your password"
                    className="w-full bg-black border border-zinc-800 text-white text-xs font-serif tracking-normal p-3 rounded focus:outline-none focus:border-[#c5a059] transition-all placeholder:text-gray-700 font-light"
                  />
                </div>

                {/* REMEMBER / FORGOT */}
                <div className="flex items-center justify-between">
                  <span className="font-light text-xs text-gray-400">
                    Remember me
                  </span>

                  <span className="font-light text-xs text-gray-400 cursor-pointer hover:text-white transition-all">
                    Forgot password?
                  </span>
                </div>

                {/* BUTTON */}
                <button
                  type="submit"
                  className="px-8 mt-3 py-3 bg-[#c5a059] text-black hover:bg-[#d6b570] text-xs tracking-widest font-bold uppercase rounded transition-all active:scale-[0.98] shadow-[0_0_20px_rgba(197,160,89,0.3)] flex items-center justify-center gap-2 cursor-pointer"
                >
                  Login
                </button>

                {/* SWITCH */}
                <div className="flex items-center justify-center mt-4 mb-10">
                  <span className="text-xs font-light text-gray-500">
                    Don't have an account?
                  </span>

                  <button
                    type="button"
                    onClick={() => setIsRegistering(true)}
                    className="text-xs font-light ml-1 text-[#c5a059] hover:text-[#d6b570] transition-all cursor-pointer"
                  >
                    Sign up
                  </button>
                </div>

              </div>
            </form>
          </div>
        )}

        {/* REGISTER CARD */}
        {isRegistering && (
          <div className="rounded-xl border mt-20 ml-20 w-lg border-[#c5a059]/10 bg-gradient-to-b from-[#0b0b0b] to-[#040404] transition-all duration-500 flex flex-col hover:border-[#c5a059]/40 hover:-translate-y-1.5 hover:shadow-[0_15px_35px_rgba(0,0,0,0.85)]">

            <h2 className="text-2xl font-serif font-bold text-center text-white mt-10 mb-3 tracking-wide">
              Create Account
            </h2>

            <p className="text-center text-gray-500 text-xs font-light mb-2 px-20">
              Create your account to access AI-powered legal intelligence.
            </p>

            <form className="flex mt-5 h-full flex-col gap-6">

              <div className="flex flex-col h-full gap-4 px-10">

                {/* NAME */}
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-gray-500 mb-1.5 font-semibold">
                    Full Name
                  </label>

                  <input
                    type="text"
                    placeholder="Enter your name"
                    className="w-full bg-black border border-zinc-800 text-white text-xs font-serif tracking-normal p-3 rounded focus:outline-none focus:border-[#c5a059] transition-all placeholder:text-gray-700 font-light"
                  />
                </div>

                {/* EMAIL */}
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-gray-500 mb-1.5 font-semibold">
                    Enter Email
                  </label>

                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full bg-black border border-zinc-800 text-white text-xs font-serif tracking-normal p-3 rounded focus:outline-none focus:border-[#c5a059] transition-all placeholder:text-gray-700 font-light"
                  />
                </div>

                {/* PASSWORD */}
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-gray-500 mb-1.5 font-semibold">
                    Create Password
                  </label>

                  <input
                    type="password"
                    placeholder="Create password"
                    className="w-full bg-black border border-zinc-800 text-white text-xs font-serif tracking-normal p-3 rounded focus:outline-none focus:border-[#c5a059] transition-all placeholder:text-gray-700 font-light"
                  />
                </div>

                {/* CONFIRM PASSWORD */}
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-gray-500 mb-1.5 font-semibold">
                    Confirm Password
                  </label>

                  <input
                    type="password"
                    placeholder="Confirm password"
                    className="w-full bg-black border border-zinc-800 text-white text-xs font-serif tracking-normal p-3 rounded focus:outline-none focus:border-[#c5a059] transition-all placeholder:text-gray-700 font-light"
                  />
                </div>

                {/* BUTTON */}
                <button
                  type="submit"
                  className="px-8 mt-3 py-3 bg-[#c5a059] text-black hover:bg-[#d6b570] text-xs tracking-widest font-bold uppercase rounded transition-all active:scale-[0.98] shadow-[0_0_20px_rgba(197,160,89,0.3)] flex items-center justify-center gap-2 cursor-pointer"
                >
                  Create Account
                </button>

                {/* SWITCH */}
                <div className="flex items-center justify-center mt-4 mb-10">
                  <span className="text-xs font-light text-gray-500">
                    Already have an account?
                  </span>

                  <button
                    type="button"
                    onClick={() => setIsRegistering(false)}
                    className="text-xs font-light ml-1 text-[#c5a059] hover:text-[#d6b570] transition-all cursor-pointer"
                  >
                    Login
                  </button>
                </div>

              </div>
            </form>
          </div>
        )}

      </div>
    </>
  );
};

export default Auth;