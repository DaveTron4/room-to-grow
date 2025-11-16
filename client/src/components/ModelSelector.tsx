import React, { useState } from 'react'
import { ChevronDown, Eye } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'

export type AIModel = {
  id: string
  name: string
  provider: string
  description: string
  pricing: 'free' | 'low' | 'medium' | 'high'
  speed: 'fast' | 'medium' | 'slow'
  quality: 'good' | 'great' | 'excellent'
  supportsVision?: boolean
}

export const AVAILABLE_MODELS: AIModel[] = [
  {
    id: 'google/gemini-2.0-flash-exp:free',
    name: 'Gemini Flash (Free)',
    provider: 'Google',
    description: 'Fast, free responses. Great for quick questions.',
    pricing: 'free',
    speed: 'fast',
    quality: 'great',
    supportsVision: true
  },
  {
    id: 'meta-llama/llama-3.2-3b-instruct:free',
    name: 'Llama 3.2 (Free)',
    provider: 'Meta',
    description: 'Open-source model, good for general learning.',
    pricing: 'free',
    speed: 'fast',
    quality: 'good',
    supportsVision: false
  },
  {
    id: 'openai/gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    provider: 'OpenAI',
    description: 'Balanced quality and speed. Good all-rounder.',
    pricing: 'low',
    speed: 'fast',
    quality: 'great',
    supportsVision: false
  },
  {
    id: 'openai/gpt-4-turbo',
    name: 'GPT-4 Turbo',
    provider: 'OpenAI',
    description: 'Advanced reasoning, best for complex topics.',
    pricing: 'medium',
    speed: 'medium',
    quality: 'excellent',
    supportsVision: true
  },
  {
    id: 'anthropic/claude-3.5-sonnet',
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    description: 'Excellent for detailed explanations and writing.',
    pricing: 'medium',
    speed: 'medium',
    quality: 'excellent',
    supportsVision: true
  },
  {
    id: 'google/gemini-pro-1.5',
    name: 'Gemini Pro',
    provider: 'Google',
    description: 'Premium Gemini with advanced capabilities.',
    pricing: 'low',
    speed: 'fast',
    quality: 'excellent',
    supportsVision: true
  }
]

type ModelSelectorProps = {
  selectedModel: string
  onModelChange: (modelId: string) => void
}

const ModelSelector: React.FC<ModelSelectorProps> = ({ selectedModel, onModelChange }) => {
  const [isOpen, setIsOpen] = useState(false)
  
  const currentModel = AVAILABLE_MODELS.find(m => m.id === selectedModel) || AVAILABLE_MODELS[0]

  const getPricingColor = (pricing: string) => {
    switch (pricing) {
      case 'free': return 'text-green-500'
      case 'low': return 'text-blue-500'
      case 'medium': return 'text-yellow-500'
      case 'high': return 'text-red-500'
      default: return 'text-text-muted'
    }
  }

  const getPricingLabel = (pricing: string) => {
    switch (pricing) {
      case 'free': return 'Free'
      case 'low': return '$'
      case 'medium': return '$$'
      case 'high': return '$$$'
      default: return ''
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-2 py-1 rounded-sm border border-border bg-surface hover:bg-surface-hover transition-colors text-sm"
      >
        <div className="flex items-center gap-1">
          <span className="font-medium">{currentModel.name}</span>
          <span className={`text-xs ${getPricingColor(currentModel.pricing)}`}>
            {getPricingLabel(currentModel.pricing)}
          </span>
        </div>
        <ChevronDown className={`w-1 h-1 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full mt-2 left-0 w-50 bg-surface border border-border rounded-sm shadow-lg z-50 overflow-hidden"
            >
              <div className="p-1 space-y-1 overflow-y-auto">
                {AVAILABLE_MODELS.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => {
                      onModelChange(model.id)
                      setIsOpen(false)
                    }}
                    className={`w-full text-left p-1 rounded-sm transition-colors ${
                      model.id === selectedModel
                        ? 'bg-primary/10 border border-primary'
                        : 'hover:bg-surface-hover border border-transparent'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start flex-1">
                        <div className="flex-1">
                          <div className="flex items-center gap-1">
                            <span className="font-medium text-sm">{model.name}</span>
                            <span className={`text-xs ${getPricingColor(model.pricing)}`}>
                              {getPricingLabel(model.pricing)}
                            </span>
                            {model.supportsVision && (
                              <span className="text-xs text-primary flex items-center gap-0.5" title="Supports image analysis">
                                <Eye className="w-1 h-1" />
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-text-muted">{model.description}</p>
                          <div className="flex gap-1 mt-1 text-xs text-text-muted">
                            <span>Speed: {model.speed}</span>
                            <span>•</span>
                            <span>Quality: {model.quality}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              
              <div className="p-1 border-t border-border bg-surface-hover">
                <p className="text-xs text-text-muted">
                  💡 Free models are great for most tasks. Premium models offer better reasoning for complex topics.
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ModelSelector
