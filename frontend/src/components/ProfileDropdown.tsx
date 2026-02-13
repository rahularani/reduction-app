import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Mail, UserCircle, LogOut, ChevronDown } from 'lucide-react'
import { useAuthStore } from '../store/authStore'

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const getRoleBadgeColor = (role: string) => {
    return role === 'donor' 
      ? 'bg-blue-500/10 text-blue-500 border-blue-500/30' 
      : 'bg-green-500/10 text-green-500 border-green-500/30'
  }

  const getRoleLabel = (role: string) => {
    return role === 'donor' ? 'Donor' : 'Volunteer'
  }

  if (!user) return null

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 p-2 hover:bg-dark-800 rounded-lg transition-colors"
      >
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-semibold shadow-lg">
          {getInitials(user.name)}
        </div>
        
        {/* User Info (hidden on mobile) */}
        <div className="hidden md:block text-left">
          <div className="text-sm font-medium text-white">{user.name}</div>
          <div className="text-xs text-gray-400">{getRoleLabel(user.role)}</div>
        </div>
        
        {/* Dropdown Icon */}
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-dark-900 border border-dark-800 rounded-xl shadow-2xl z-50">
          {/* Profile Header */}
          <div className="p-4 border-b border-dark-800">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                {getInitials(user.name)}
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold">{user.name}</h3>
                <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium border ${getRoleBadgeColor(user.role)}`}>
                  {getRoleLabel(user.role)}
                </span>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="p-4 space-y-3">
            <div className="flex items-start gap-3 text-sm">
              <Mail className="w-4 h-4 text-gray-500 mt-0.5" />
              <div>
                <div className="text-gray-500 text-xs">Email</div>
                <div className="text-white">{user.email}</div>
              </div>
            </div>

            <div className="flex items-start gap-3 text-sm">
              <UserCircle className="w-4 h-4 text-gray-500 mt-0.5" />
              <div>
                <div className="text-gray-500 text-xs">Account Type</div>
                <div className="text-white capitalize">{user.role}</div>
              </div>
            </div>

            <div className="flex items-start gap-3 text-sm">
              <User className="w-4 h-4 text-gray-500 mt-0.5" />
              <div>
                <div className="text-gray-500 text-xs">User ID</div>
                <div className="text-white font-mono text-xs">#{user.id}</div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="p-2 border-t border-dark-800">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProfileDropdown
