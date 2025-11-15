import React from 'react'
import { Sparkles, Brain, BookOpen, Target } from 'lucide-react'

const About = () => {
  return (
    <section id="about" className='min-h-screen flex flex-row justify-center items-center gap-2 relative overflow-hidden'>
        <div className='max-w-7xl mx-auto w-full'>
            <div className='flex flex-col lg:flex-row gap-5 items-center'>
            {/* Left Side - Content */}
                <div className='flex-1 text-left'>
                    <h2 className='text-4xl md:text-5xl font-medium text-text mb-1'>
                        Transform Your Learning Experience
                    </h2>
                    
                    <p className='text-lg text-text-muted leading-relaxed mb-3'>
                        Room To Grow is your intelligent companion for mastering any subject. 
                        Powered by advanced AI, we create personalized study materials that adapt 
                        to your learning style and help you achieve your goals faster.
                    </p>
                    
                    {/* Features List */}
                    <ul className='flex flex-col gap-1 ml-2'>
                        <li className='flex items-start gap-1'>
                            <div className='shrink-0 w-3 h-3 rounded-full bg-primary/20 flex items-center justify-center'>
                                <Brain className='w-2 h-2 text-primary' />
                            </div>
                            <div className='text-left'>
                                <h3 className='font-semibold text-text mb-0.5 font-medium'>AI-Powered Tutoring</h3>
                                <p className='text-sm text-text-muted font-mono'>
                                    Interactive conversations that help you understand complex topics through personalized explanations.
                                </p>
                            </div>
                        </li>
                    
                        <li className='flex items-start gap-1'>
                            <div className='shrink-0 w-3 h-3 rounded-full bg-secondary/20 flex items-center justify-center'>
                                <BookOpen className='w-2 h-2 text-secondary' />
                            </div>
                            <div className='text-left'>
                                <h3 className='font-semibold text-text mb-0.5'>Custom Study Materials</h3>
                                <p className='text-sm text-text-muted font-mono'>
                                    Automatically generate flashcards, practice tests, and study guides tailored to your needs.
                                </p>
                            </div>
                        </li>
                    
                        <li className='flex items-start gap-1'>
                            <div className='shrink-0 w-3 h-3 rounded-full bg-accent-1/20 flex items-center justify-center'>
                                <Target className='w-2 h-2 text-accent-1' />
                            </div>
                                <div className='text-left'>
                                <h3 className='font-semibold text-text mb-0.5'>Track Your Progress</h3>
                                <p className='text-sm text-text-muted font-mono'>
                                    Save your learning history and review past conversations to reinforce your knowledge.
                                </p>
                            </div>
                        </li>
                    </ul>
                </div>
                
                {/* Right Side - Image Placeholder */}
                <div className='flex-1 relative'>
                    <div className='aspect-square rounded-md bg-surface border border-border flex items-center justify-center overflow-hidden'>
                        <div className='text-center'>
                            <Sparkles className='w-10 h-10 text-primary mx-auto mb-4' />
                            <p className='text-text-muted font-light'>Image Placeholder</p>
                        </div>
                    </div>
                    
                    {/* Decorative gradient blur */}
                    <div className='absolute -bottom-10 -right-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl -z-10' />
                </div>
            </div>
         </div>
    </section>
  )
}

export default About