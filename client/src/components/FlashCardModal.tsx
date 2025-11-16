import React, { useState } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { motion } from 'motion/react'

type FlashCard = {
    question: string
    answer: string
}

type FlashCardModalProps = {
    flashcards: FlashCard[]
    title?: string
    onClose: () => void
}

const FlashCardModal: React.FC<FlashCardModalProps> = ({ flashcards, title, onClose }) => {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isFlipped, setIsFlipped] = useState(false)

    const currentCard = flashcards[currentIndex]

    const handleNext = () => {
        if (currentIndex < flashcards.length - 1) {
            setCurrentIndex(currentIndex + 1)
            setIsFlipped(false)
        }
    }

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1)
            setIsFlipped(false)
        }
    }

    const handleFlip = () => {
        setIsFlipped(!isFlipped)
    }

    return (
        <div className="fixed inset-0 z-modal flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
            <motion.div 
                className="bg-surface border border-border rounded-md p-4 px-3 relative"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={(e) => e.stopPropagation()}
            >
                <button 
                    onClick={onClose}
                    className="absolute top-1 right-1 text-text-muted hover:text-text transition-colors"
                >
                    <X className="h-2 w-2" />
                </button>

                <h2 className="text-2xl font-bold text-text mb-1">Flash Cards</h2>
                <h3 className="text-sm text-text-muted mb-2">{title || 'Study Session'}</h3>

                <div className="mb-2 flex justify-between items-center text-sm text-text-muted">
                    Card {currentIndex + 1} of {flashcards.length}
                </div>

                <div 
                    className="relative h-20 w-40 cursor-pointer mb-1"
                    onClick={handleFlip}
                    style={{ perspective: '1000px' }}
                >
                    <motion.div
                        className="absolute inset-0"
                        initial={false}
                        animate={{ rotateY: isFlipped ? 180 : 0 }}
                        transition={{ duration: 0.6 }}
                        style={{ transformStyle: 'preserve-3d' }}
                    >
                        {/* Front of card */}
                        <div
                            className="absolute inset-0 flex items-center justify-center bg-card-bg border border-card-border rounded-md p-4"
                            style={{ backfaceVisibility: 'hidden' }}
                        >
                            <div className="text-center">
                                <p className="text-xs text-text-subtle mb-2">QUESTION</p>
                                <p className="text-lg text-text">{currentCard.question}</p>
                            </div>
                        </div>
                        
                        {/* Back of card */}
                        <div
                            className="absolute inset-0 flex items-center justify-center bg-card-bg border border-card-border rounded-md p-4"
                            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                        >
                            <div className="text-center">
                                <p className="text-xs text-text-subtle mb-2">ANSWER</p>
                                <p className="text-lg text-text">{currentCard.answer}</p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                <div className="text-sm text-text-subtle text-center mb-2">
                    Click card to flip
                </div>

                <div className="flex justify-center gap-2">
                    <motion.button
                        onClick={handlePrev}
                        disabled={currentIndex === 0}
                        className="flex items-center justify-center px-3 py-1 bg-primary hover:bg-btn-primary-hover text-btn-primary-text rounded-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-10"
                        whileHover="hover"
                        initial="rest"
                        animate="rest"
                    >
                        <motion.div
                            className="inline-block"
                            variants={{
                                rest: { x: 0 },
                                hover: {
                                    x: -6,
                                    transition: {
                                        type: "spring",
                                        stiffness: 300,
                                        damping: 15
                                    }
                                }
                            }}
                        >
                            <ChevronLeft className="h-3 w-3" />
                        </motion.div>
                        Previous
                    </motion.button>

                    <motion.button
                        onClick={handleNext}
                        disabled={currentIndex === flashcards.length - 1}
                        className="flex items-center justify-center px-3 py-1 bg-primary hover:bg-btn-primary-hover text-btn-primary-text rounded-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-10"
                        whileHover="hover"
                        initial="rest"
                        animate="rest"
                    >
                        Next
                        <motion.div
                            className="inline-block"
                            variants={{
                                rest: { x: 0 },
                                hover: {
                                    x: 6,
                                    transition: {
                                        type: "spring",
                                        stiffness: 300,
                                        damping: 15
                                    }
                                }
                            }}
                        >
                            <ChevronRight className="h-3 w-3" />
                        </motion.div>
                    </motion.button>
                </div>
            </motion.div>
        </div>
    )
}

export default FlashCardModal
