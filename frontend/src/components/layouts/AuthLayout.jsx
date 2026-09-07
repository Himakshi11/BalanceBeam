import React from 'react'
import {LuTrendingUpDown} from 'react-icons/lu'
import { FaBolt } from 'react-icons/fa'
import Logo from './Logo'
import { MdAccountBalanceWallet } from "react-icons/md";

const AuthLayout=({children})=>{
  return (
    <div className='flex'>
    <div className='w-screen h-screen md:w-[60vw] px-12 pt-8 pb-12'>
    <Logo/>
     {children}
    </div>
    <div className="w-1/2 bg-orange-50 flex flex-col items-center justify-center p-12 relative overflow-hidden">
  {/* decorative circles */}
  <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-yellow-200 opacity-30" />
  <div className="absolute -bottom-16 -left-16 w-60 h-60 rounded-full bg-orange-400 opacity-10" />

  <div className="relative z-10 text-center max-w-sm">
    <div className="w-16 h-16 bg-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
      {/* your icon here */}
      <MdAccountBalanceWallet className="text-4xl text-white" />
    </div>
    <h2 className="text-2xl font-black text-gray-900 mb-3">
      Take control of your <span className="text-orange-600">finances</span> today.
    </h2>
    <p className="text-sm text-gray-400 mb-8">
      Track every rupee, plan every goal. Balance Beam gives you a clear picture of where your money goes.
    </p>
    {[
      { icon: '📈', title: 'Real-time tracking', sub: 'Income & expenses, always up to date' },
      { icon: '🎯', title: 'Smart goal setting', sub: 'Plan savings targets & hit them' },
      { icon: '📄', title: 'Instant reports', sub: 'Monthly summaries at a glance' },
    ].map((f, i) => (
      <div key={i} className="flex items-center gap-4 bg-white border border-orange-100 rounded-xl p-3 mb-3 text-left">
        <span className="text-xl">{f.icon}</span>
        <div>
          <div className="text-sm font-bold text-gray-800">{f.title}</div>
          <div className="text-xs text-gray-400">{f.sub}</div>
        </div>
      </div>
    ))}
  </div>
</div>
</div>
  )
}

export default AuthLayout

const StatsInfoCard = ({icon, label, value, color}) => {
  return (
    <div className='flex gap-6 bg-white p-4 rounded-xl shadow-md shadow-amber-600/10 border border-gray-200/50 z-10'>
      <div className={`w-12 h-12 flex items-center justify-center text-[26px] text-white ${color} rounded-full drop-shadow-xl`}>
        {icon}
      </div>
      <div>
        <h6 className='text-xs text-gray-500 mb-1'>{label}</h6>
        <span className='text-[20px]'>₹{value}</span>
      </div>
    </div>
  )
}
