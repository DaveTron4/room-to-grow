import React from 'react'

const CallToAction = () => {
  return (
    <section className='py-5 flex flex-col justify-center items-center text-center gap-2 relative overflow-hidden'>
      <div className='max-w-10/12'>
        <div className='flex flex-col items-center text-center px-4 py-3 rounded-sm border border-border bg-linear-to-br from-primary/10 via-surface to-secondary/10'>
          {/* Call to Action Statement */}
          <h2 className='text-3xl md:text-5xl font-medium text-text mb-1'>
            Ready to Transform Your Learning?
          </h2>
          
          {/* Sentence */}
          <p className='max-w-9/12 text-lg text-text-muted mb-2'>
            Join thousands of students who are already achieving their academic goals with AI-powered tutoring and personalized study materials.
          </p>
          
          {/* Button */}
          <button className='px-3 py-1 bg-primary hover:bg-btn-primary-hover text-btn-primary-text rounded-sm transition-colors font-medium text-lg'>
            Get Started Free
          </button>
        </div>
      </div>
    </section>
  )
}

export default CallToAction