import React, { useState } from 'react'
import { X, ChevronRight, CheckCircle, XCircle } from 'lucide-react'
import { motion } from 'motion/react'

type QuizQuestion = {
    question: string
    options: string[]
    correctAnswer: number
    explanation: string
}

type QuizModalProps = {
    quiz: QuizQuestion[]
    onClose: () => void
}

const QuizModal: React.FC<QuizModalProps> = ({ quiz, onClose }) => {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
    const [showExplanation, setShowExplanation] = useState(false)
    const [score, setScore] = useState(0)
    const [answers, setAnswers] = useState<boolean[]>([])

    const currentQuestion = quiz[currentIndex]
    const isLastQuestion = currentIndex === quiz.length - 1

    const handleSelectAnswer = (optionIndex: number) => {
        if (selectedAnswer !== null) return // Already answered
        
        setSelectedAnswer(optionIndex)
        setShowExplanation(true)
        
        const isCorrect = optionIndex === currentQuestion.correctAnswer
        setAnswers([...answers, isCorrect])
        if (isCorrect) {
        setScore(score + 1)
        }
    }

    const handleNext = () => {
        if (currentIndex < quiz.length - 1) {
        setCurrentIndex(currentIndex + 1)
        setSelectedAnswer(null)
        setShowExplanation(false)
        }
    }

    const handleRestart = () => {
        setCurrentIndex(0)
        setSelectedAnswer(null)
        setShowExplanation(false)
        setScore(0)
        setAnswers([])
    }

    const isFinished = isLastQuestion && selectedAnswer !== null

    return (
        <div className="fixed inset-0 z-modal flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
            <motion.div 
                className="bg-surface border border-border rounded-md mt-4 py-2 px-3 max-w-1/2 relative"
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

                <h2 className="text-2xl font-bold text-text mb-1">Quiz</h2>

                {!isFinished ? (
                <>
                    <div className="mb-2 flex justify-between items-center text-sm text-text-muted">
                        <span>Question {currentIndex + 1} of {quiz.length}</span>
                        <span>Score: {score}/{answers.length}</span>
                    </div>

                    <div className="mb-2">
                        <p className="text-lg text-text mb-2">{currentQuestion.question}</p>

                        <div className="space-y-2">
                            {currentQuestion.options.map((option, index) => {
                                const isSelected = selectedAnswer === index
                                const isCorrect = index === currentQuestion.correctAnswer
                                const showResult = selectedAnswer !== null

                                let buttonClass = "w-full text-left px-2 py-1 rounded-sm border transition-colors "
                                
                                if (showResult) {
                                    if (isCorrect) {
                                        buttonClass += "border-success bg-success/10 text-success"
                                    } else if (isSelected && !isCorrect) {
                                        buttonClass += "border-error bg-error/10 text-error"
                                    } else {
                                        buttonClass += "border-border bg-surface text-text-muted"
                                    }
                                } else {
                                    buttonClass += "border-border hover:border-primary hover:bg-primary/5 text-text cursor-pointer"
                                }

                                return (
                                    <button
                                        key={index}
                                        onClick={() => handleSelectAnswer(index)}
                                        disabled={selectedAnswer !== null}
                                        className={buttonClass}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span>{option}</span>
                                            {showResult && isCorrect && <CheckCircle className="h-2 w-2" />}
                                            {showResult && isSelected && !isCorrect && <XCircle className="h-2 w-2" />}
                                        </div>
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    {showExplanation && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-3 px-2 py-2 bg-info/10 border border-info/30 rounded-sm"
                    >
                        <p className="text-sm text-text">
                            <strong className="text-info">Explanation:</strong> {currentQuestion.explanation}
                        </p>
                    </motion.div>
                    )}

                    {selectedAnswer !== null && !isLastQuestion && (
                    <motion.button
                        onClick={handleNext}
                        className="w-full flex items-center justify-center px-3 py-1 bg-primary hover:bg-btn-primary-hover text-btn-primary-text rounded-sm transition-colors group"
                        whileHover="hover"
                        initial="rest"
                        animate="rest"
                    >
                        Next Question
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
                    )}
                </>
                ) : (
                <div className="text-center py-2">
                    <h3 className="text-3xl font-bold text-text mb-4">Quiz Complete!</h3>
                    <p className="text-xl text-text-muted mb-2">
                        Your Score: {score} / {quiz.length}
                    </p>
                    <p className="text-lg text-text-muted mb-6">
                        {score === quiz.length ? '🎉 Perfect score!' : 
                        score >= quiz.length * 0.7 ? '👍 Great job!' : 
                        '💪 Keep practicing!'}
                    </p>
                    <div className="flex gap-2 justify-center">
                        <button
                            onClick={handleRestart}
                            className="px-4 py-1 bg-primary hover:bg-btn-primary-hover text-btn-primary-text rounded-sm transition-colors"
                        >
                            Restart Quiz
                        </button>
                        <button
                            onClick={onClose}
                            className="px-4 py-1 bg-surface border border-border hover:bg-surface-hover text-text rounded-sm transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
                )}
            </motion.div>
        </div>
    )
}

export default QuizModal
