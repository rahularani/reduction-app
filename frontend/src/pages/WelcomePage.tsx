import { useNavigate } from 'react-router-dom'
import { Leaf, Heart, Users, ArrowRight, HandHeart } from 'lucide-react'

const WelcomePage = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl w-full text-center space-y-6 sm:space-y-8">
        {/* Logo/Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-primary-500 blur-3xl opacity-20 rounded-full"></div>
            <div className="relative bg-gradient-to-br from-primary-400 to-primary-600 p-4 sm:p-6 rounded-3xl">
              <Leaf className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
            </div>
          </div>
        </div>

        {/* Main Heading */}
        <div className="space-y-3 sm:space-y-4 px-4">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 bg-clip-text text-transparent">
            FeedForward
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto">
            Connecting surplus food with those who need it most
          </p>
        </div>

        {/* Quotes/Thoughts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mt-8 sm:mt-12 px-4">
          <div className="card hover:scale-105 transition-transform">
            <Heart className="w-8 h-8 sm:w-10 sm:h-10 text-primary-500 mx-auto mb-3" />
            <p className="text-gray-300 text-xs sm:text-sm">
              "Every meal saved is a step towards a sustainable future"
            </p>
          </div>
          <div className="card hover:scale-105 transition-transform">
            <Users className="w-8 h-8 sm:w-10 sm:h-10 text-primary-500 mx-auto mb-3" />
            <p className="text-gray-300 text-xs sm:text-sm">
              "Together we can end hunger and reduce waste"
            </p>
          </div>
          <div className="card hover:scale-105 transition-transform sm:col-span-2 md:col-span-1">
            <Leaf className="w-8 h-8 sm:w-10 sm:h-10 text-primary-500 mx-auto mb-3" />
            <p className="text-gray-300 text-xs sm:text-sm">
              "Don't waste food, share it with love"
            </p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4">
          <button
            onClick={() => navigate('/login')}
            className="btn-primary group inline-flex items-center gap-2 text-base sm:text-lg w-full sm:w-auto justify-center"
          >
            Get Started
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <button
            onClick={() => navigate('/donate')}
            className="btn-secondary group inline-flex items-center gap-2 text-base sm:text-lg w-full sm:w-auto justify-center"
          >
            <HandHeart className="w-5 h-5" />
            Support Our Cause
          </button>
        </div>

        <p className="text-xs sm:text-sm text-gray-500 mt-4 px-4">
          Help us fight food waste and hunger. Every contribution makes a difference.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 sm:gap-8 pt-8 sm:pt-12 max-w-2xl mx-auto px-4">
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-primary-500">1.3B</div>
            <div className="text-xs sm:text-sm text-gray-500">Tons wasted yearly</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-primary-500">828M</div>
            <div className="text-xs sm:text-sm text-gray-500">People hungry</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-primary-500">30%</div>
            <div className="text-xs sm:text-sm text-gray-500">Food produced wasted</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WelcomePage
