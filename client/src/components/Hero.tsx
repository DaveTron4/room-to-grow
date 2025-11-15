import React from 'react'
import { motion } from "motion/react"

const Hero = () => {
  return (
    <section className="hero min-h-screen flex flex-col justify-center items-center text-center gap-2 relative overflow-hidden">
        {/* Conic Gradient Background */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none ">
          <motion.div 
            className="w-[500px] h-[500px] rounded-full  bg-accent-1/30 blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
        
        {/* Content */}
        <span className="text-sm text-primary font-medium px-3 py-0.5 bg-primary/10 rounded-full border border-primary/30 relative z-10">
          AI-Powered Learning Platform
        </span>
        <h1 className="text-6xl flex-wrap md:text-7xl font-medium bg-linear-to-r from-white via-text-muted to-accent-1 bg-clip-text text-transparent relative z-10">
          Unlock Your Potential. Learn with AI.
        </h1>
        <p className="text-2xl text-text-muted relative z-10">
          Your personal AI tutor, generating custom study tools just for you.
        </p>
        <div className="flex flex-row gap-2 relative z-10">
            <button className="px-3 py-1 bg-primary hover:bg-btn-primary-hover text-white rounded-sm font-medium transition-colors">
              Start Learning Now
            </button>
            <button className="px-3 py-1 bg-white hover:bg-white/0 hover:border-accent-1 border text-primary rounded-sm font-medium transition-colors">
              Learn More
            </button>
        </div>
    </section>
  )
}

export default Hero