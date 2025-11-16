import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

type User = {
    _id: string
    githubId: string
    username: string
    displayName: string
    email?: string
    avatarUrl?: string
}

const Nav = () => {
    const [user, setUser] = useState<User | null>(null)
    const [dropdownOpen, setDropdownOpen] = useState(false)

    useEffect(() => {
        // Check if user is logged in
        fetch('http://localhost:5000/auth/login/success', {
            credentials: 'include'
        })
            .then(res => res.json())
            .then(data => {
                if (data.success && data.user) {
                    setUser(data.user)
                }
            })
            .catch(err => console.error('Failed to check auth status:', err))
    }, [])

    const handleLogout = async () => {
        try {
            await fetch('http://localhost:5000/auth/logout', {
                credentials: 'include'
            })
            setUser(null)
            setDropdownOpen(false)
            window.location.href = '/'
        } catch (err) {
            console.error('Logout failed:', err)
        }
    }

    return (
        <>
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
                    
                    {user ? (
                        <div className="relative">
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                            >
                                <img 
                                    src={user.avatarUrl || `https://github.com/${user.username}.png`}
                                    alt={user.displayName}
                                    className="w-4 h-4 rounded-full"
                                />
                            </button>
                            
                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-auto bg-surface border border-border rounded-lg shadow-lg z-50">
                                    <div className="px-3 py-1 border-b border-border">
                                        <p className="text-sm font-medium text-text whitespace-nowrap">{user.displayName}</p>
                                        <p className="text-xs text-text-muted whitespace-nowrap">@{user.username}</p>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-3 py-1 text-sm text-text hover:bg-surface-hover transition-colors"
                                    >
                                        Sign Out
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link to="/login" className="px-2 py-0.5 bg-primary hover:bg-btn-primary-hover text-btn-primary-text rounded-sm transition-colors font-medium">
                            Sign In
                        </Link>
                    )}
                </div>
            </div>
            
            {/* Backdrop to close dropdown - outside nav container */}
            {dropdownOpen && (
                <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setDropdownOpen(false)}
                />
            )}
        </>
    )
}

export default Nav