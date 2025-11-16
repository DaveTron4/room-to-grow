
import { motion } from 'motion/react'

const CallToAction = () => {
  return (
    <section className='py-5 flex flex-col justify-center items-center text-center gap-2 relative overflow-hidden'>
      <div className='max-w-10/12'>
        <motion.div 
          className='flex flex-col items-center text-center px-4 py-3 rounded-sm border border-border bg-linear-to-br from-primary/10 via-surface to-secondary/10'
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Call to Action Statement */}
          <motion.h2 
            className='text-3xl md:text-5xl font-medium text-text mb-1'
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Ready to Transform Your Learning?
          </motion.h2>
          
          {/* Sentence */}
          <motion.p 
            className='max-w-9/12 text-lg text-text-muted mb-2'
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Join thousands of students who are already achieving their academic goals with AI-powered tutoring and personalized study materials.
          </motion.p>
          
          {/* Button */}
          <motion.button 
            className='px-3 py-1 bg-primary hover:bg-btn-primary-hover text-btn-primary-text rounded-sm transition-colors font-medium text-lg'
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get Started Free
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}

export default CallToAction