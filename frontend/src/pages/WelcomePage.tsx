import { useNavigate } from 'react-router-dom'
import { Leaf, Heart, Users, ArrowRight, HandHeart } from 'lucide-react'

const WelcomePage = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full text-center space-y-8">
        {/* Logo/Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-primary-500 blur-3xl opacity-20 rounded-full"></div>
            <div className="relative bg-gradient-to-br from-primary-400 to-primary-600 p-6 rounded-3xl">
              <Leaf className="w-16 h-16 text-white" />
            </div>
          </div>
        </div>

        {/* Main Heading */}
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
            Food Waste Reduction
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto">
            Connecting surplus food with those who need it most
          </p>
        </div>

        {/* Quotes/Thoughts */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <div className="card hover:scale-105 transition-transform">
            <Heart className="w-10 h-10 text-primary-500 mx-auto mb-3" />
            <p className="text-gray-300 text-sm">
              "Every meal saved is a step towards a sustainable future"
            </p>
          </div>
          <div className="card hover:scale-105 transition-transform">
            <Users className="w-10 h-10 text-primary-500 mx-auto mb-3" />
            <p className="text-gray-300 text-sm">
              "Together we can end hunger and reduce waste"
            </p>
          </div>
          <div className="card hover:scale-105 transition-transform">
            <Leaf className="w-10 h-10 text-primary-500 mx-auto mb-3" />
            <p className="text-gray-300 text-sm">
              "Don't waste food, share it with love"
            </p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => navigate('/login')}
            className="btn-primary group inline-flex items-center gap-2 text-lg"
          >
            Get Started
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <button
            onClick={() => navigate('/donate')}
            className="btn-secondary group inline-flex items-center gap-2 text-lg"
          >
            <HandHeart className="w-5 h-5" />
            Support Our Cause
          </button>
        </div>

        <p className="text-sm text-gray-500 mt-4">
          Help us fight food waste and hunger. Every contribution makes a difference.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 pt-12 max-w-2xl mx-auto">
          <div>
            <div className="text-3xl font-bold text-primary-500">1.3B</div>
            <div className="text-sm text-gray-500">Tons wasted yearly</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary-500">828M</div>
            <div className="text-sm text-gray-500">People hungry</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary-500">30%</div>
            <div className="text-sm text-gray-500">Food produced wasted</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WelcomePage
