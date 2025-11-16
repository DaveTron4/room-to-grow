import { motion } from "motion/react"
import { useNavigate } from "react-router-dom"

const Hero = () => {
  const navigate = useNavigate()

  const handleStartLearning = () => {
    navigate('/chat')
  }

  const handleLearnMore = () => {
    const aboutSection = document.getElementById('about')
    aboutSection?.scrollIntoView({ behavior: 'smooth' })
  }

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
        <motion.span 
          className="text-sm text-primary font-medium px-3 py-0.5 bg-primary/10 rounded-full border border-primary/30 relative z-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          AI-Powered Learning Platform
        </motion.span>
        <motion.h1 
          className="text-6xl flex-wrap md:text-7xl font-medium bg-linear-to-r from-white via-text-muted to-accent-1 bg-clip-text text-transparent relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          Unlock Your Potential. Learn with AI.
        </motion.h1>
        <motion.p 
          className="text-2xl text-text-muted relative z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Your personal AI tutor, generating custom study tools just for you.
        </motion.p>
        <motion.div 
          className="flex flex-row gap-2 relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
            <motion.button 
              onClick={handleStartLearning}
              className="px-3 py-1 bg-primary hover:bg-btn-primary-hover text-white rounded-sm font-medium transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Learning Now
            </motion.button>
            <motion.button 
              onClick={handleLearnMore}
              className="px-3 py-1 bg-white hover:bg-white/0 hover:border-accent-1 border text-primary rounded-sm font-medium transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Learn More
            </motion.button>
        </motion.div>
    </section>
  )
}

export default Hero