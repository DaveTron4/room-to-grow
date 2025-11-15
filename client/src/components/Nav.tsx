import React from 'react'
import { Link } from 'react-router-dom'

const Nav = () => {
  return (
    <div className="nav py-1 h-16 flex flex-row items-center gap-4">
        {/* take home */}
        <Link to="/" className="text-2xl font-mono text-text cursor-pointer">
          Room to Grow
        </Link>
        {/* Buttons */}
        <div className="ml-auto flex flex-row justify-center gap-4 items-center">
            <a href="/#about" className="text-sm text-text-muted hover:text-primary transition-colors">
                About
            </a>
            <Link to="/chat" className="text-sm text-text-muted hover:text-primary transition-colors">
                Chat
            </Link>
            <button className="px-2 py-0.5 bg-primary hover:bg-btn-primary-hover text-btn-primary-text rounded-sm transition-colors font-medium">
                Sign In
            </button>
        </div>
    </div>
  )
}

export default Nav