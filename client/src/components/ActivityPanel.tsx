import React from 'react'
import { BookOpen, Brain, Trash2 } from 'lucide-react'
import { motion } from 'motion/react'

type Activity = {
  id: string
  type: 'flashcard' | 'quiz'
  title: string
  count: number
  data: any
}

type ActivityPanelProps = {
  activities: Activity[]
  onActivityClick: (activity: Activity) => void
  onActivityDelete: (id: string) => void
}

const ActivityPanel: React.FC<ActivityPanelProps> = ({ activities, onActivityClick, onActivityDelete }) => {
    return (
        <>
            <h3 className="text-lg font-semibold text-text mb-2">Generated Activities</h3>
            
            {activities.length === 0 ? (
                <p className="text-sm text-text-muted">No activities yet. Generate flash cards or quizzes to get started!</p>
            ) : (
                <div className="space-y-2">
                    {activities.map((activity) => (
                        <motion.div
                            key={activity.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="group relative"
                        >
                            <button
                                onClick={() => onActivityClick(activity)}
                                className="w-full text-left p-1 rounded-sm border border-border hover:border-primary bg-card-bg hover:bg-card-bg-hover transition-colors"
                            >
                                <div className="flex items-start gap-1">
                                    {activity.type === 'flashcard' ? (
                                    <BookOpen className="h-2 w-2 text-btn-generative shrink-0" />
                                    ) : (
                                        <Brain className="h-2 w-2 text-btn-generative shrink-0" />
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-text truncate">{activity.title}</p>
                                        <p className="text-xs text-text-muted">
                                        {activity.count} {activity.type === 'flashcard' ? 'cards' : 'questions'}
                                        </p>
                                    </div>
                                </div>
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    onActivityDelete(activity.id)
                                }}
                                className="absolute top-1 right-1 text-text-muted hover:text-error transition-opacity"
                            >
                                <Trash2 className="h-1 w-1" />
                            </button>
                        </motion.div>
                    ))}
                </div>
            )}
        </>
    )
}

export default ActivityPanel
