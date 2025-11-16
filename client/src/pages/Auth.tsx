import { Github } from 'lucide-react'
import { motion } from 'motion/react'

const Auth = () => {
  const handleGithubLogin = () => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'
    window.location.href = `${apiUrl}/auth/github`
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 relative overflow-hidden">
      {/* Animated background blobs */}
      <motion.div
        className="absolute top-10 left-50 w-30 h-30 bg-primary/50 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-10 right-50 w-30 h-30 bg-btn-generative/50 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.25, 0.2],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <motion.div 
        className="glass-subtle rounded-sm px-3 py-2 text-center relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Attention Getter */}
        <motion.h2 
          className="text-3xl font-medium text-text mb-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Learn Smarter, Not Harder
        </motion.h2>

        {/* Call to Action */}
        <motion.p 
          className="text-lg text-text-muted mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Your AI-powered learning companion that creates personalized flash cards and quizzes 
          from your conversations. Start your journey to better learning today.
        </motion.p>

        {/* Login Button */}
        <motion.button
          onClick={handleGithubLogin}
          className="mx-auto flex items-center justify-center gap-1 px-4 py-1 bg-surface hover:bg-surface-hover border border-border rounded-sm text-text font-semibold transition-all hover:scale-105 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          <Github className="w-3 h-3" />
          Continue with GitHub
        </motion.button>

        {/* Disclaimer */}
        <motion.p 
          className="text-sm text-text-muted mt-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          By continuing, you agree to our Terms of Service and Privacy Policy. 
          We'll never post to GitHub without your permission.
        </motion.p>

        {/* Additional Info */}
        <motion.div 
          className="mt-6 pt-4 border-t border-border"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p className="text-sm text-text-muted">
            ✨ AI-powered tutoring • 📚 Auto-generated study materials • 🎯 Personalized learning
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Auth;