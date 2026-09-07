import React from "react";

const Logo = () => {
  return (
    <div className="flex items-center gap-3 w-fit shrink-0">
      <svg
        width="64"
        height="64"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Balance Beam logo"
      >
        <defs>
          <linearGradient id="logoGradient" x1="7" y1="6" x2="41" y2="43">
            <stop stopColor="#F59E0B" />
            <stop offset="1" stopColor="#EA580C" />
          </linearGradient>

          <linearGradient id="boltGradient" x1="19" y1="12" x2="30" y2="36">
            <stop stopColor="#FDE047" />
            <stop offset="1" stopColor="#F97316" />
          </linearGradient>
        </defs>

        <path d="M7 18H41" stroke="url(#logoGradient)" strokeWidth="3" strokeLinecap="round" />

        <path d="M13 18L8 28H18L13 18Z" fill="url(#logoGradient)" opacity="0.9" />

        <path d="M35 18L30 28H40L35 18Z" fill="url(#logoGradient)" opacity="0.9" />

        <path d="M24 18V37" stroke="url(#logoGradient)" strokeWidth="3" strokeLinecap="round" />

        <path d="M15 38H33" stroke="url(#logoGradient)" strokeWidth="3" strokeLinecap="round" />

        <path
          d="M27 9L18 25H24L21 36L31 19H25L27 9Z"
          fill="url(#boltGradient)"
          stroke="#EA580C"
          strokeWidth="1"
          strokeLinejoin="round"
        />
      </svg>

      <div className="flex items-baseline gap-2 whitespace-nowrap">
        <h1 className="text-2xl font-extrabold tracking-tight text-orange-600">
          BALANCE
        </h1>

        <p className="text-xs font-semibold tracking-[0.22em] text-orange-400">
          BEAM
        </p>
        
      </div>
    </div>
  );
};

export default Logo;