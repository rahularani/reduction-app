import { useNavigate } from 'react-router-dom'
import { Heart, TrendingUp, Users, Globe, ArrowLeft, ExternalLink } from 'lucide-react'

const DonatePage = () => {
  const navigate = useNavigate()

  const handleDonate = () => {
    window.open('https://www.who.foundation/donate?form=FUNMMKGBSLF', '_blank')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950">
      {/* Header */}
      <header className="bg-dark-900/50 border-b border-dark-800 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-block bg-red-500/10 p-4 rounded-full mb-6">
            <Heart className="w-16 h-16 text-red-500" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            The Global Food Crisis
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            While millions go hungry, billions of tons of food are wasted. Together, we can make a difference.
          </p>
        </div>

        {/* Statistics Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="card text-center hover:scale-105 transition-transform">
            <div className="bg-red-500/10 p-3 rounded-xl w-fit mx-auto mb-4">
              <Users className="w-8 h-8 text-red-500" />
            </div>
            <div className="text-3xl font-bold text-red-500 mb-2">828M</div>
            <p className="text-gray-400 text-sm">People facing chronic hunger worldwide</p>
          </div>

          <div className="card text-center hover:scale-105 transition-transform">
            <div className="bg-orange-500/10 p-3 rounded-xl w-fit mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-orange-500" />
            </div>
            <div className="text-3xl font-bold text-orange-500 mb-2">1.3B</div>
            <p className="text-gray-400 text-sm">Tons of food wasted every year</p>
          </div>

          <div className="card text-center hover:scale-105 transition-transform">
            <div className="bg-yellow-500/10 p-3 rounded-xl w-fit mx-auto mb-4">
              <Globe className="w-8 h-8 text-yellow-500" />
            </div>
            <div className="text-3xl font-bold text-yellow-500 mb-2">30%</div>
            <p className="text-gray-400 text-sm">Of all food produced is wasted globally</p>
          </div>

          <div className="card text-center hover:scale-105 transition-transform">
            <div className="bg-purple-500/10 p-3 rounded-xl w-fit mx-auto mb-4">
              <Heart className="w-8 h-8 text-purple-500" />
            </div>
            <div className="text-3xl font-bold text-purple-500 mb-2">45M</div>
            <p className="text-gray-400 text-sm">Children under 5 suffering from acute malnutrition</p>
          </div>
        </div>

        {/* Crisis Details */}
        <div className="space-y-8 mb-16">
          <div className="card">
            <h2 className="text-2xl font-bold text-white mb-4">The Paradox We Face</h2>
            <div className="space-y-4 text-gray-300">
              <p>
                Our world produces enough food to feed everyone, yet millions go to bed hungry every night. 
                This isn't just a distribution problem—it's a crisis of waste, inequality, and lack of coordination.
              </p>
              <p>
                <span className="text-red-400 font-semibold">828 million people</span> are facing chronic hunger, 
                while <span className="text-orange-400 font-semibold">1.3 billion tons of food</span> are wasted 
                annually. That's enough to feed the hungry population multiple times over.
              </p>
            </div>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-white mb-4">The Impact of Food Waste</h2>
            <div className="grid md:grid-cols-2 gap-6 text-gray-300">
              <div>
                <h3 className="text-lg font-semibold text-primary-500 mb-2">Environmental Cost</h3>
                <ul className="space-y-2 text-sm">
                  <li>• Food waste generates 8-10% of global greenhouse gas emissions</li>
                  <li>• Wasted food uses 1.4 billion hectares of agricultural land</li>
                  <li>• Consumes 250 cubic kilometers of water annually</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-primary-500 mb-2">Human Cost</h3>
                <ul className="space-y-2 text-sm">
                  <li>• 45 million children under 5 face acute malnutrition</li>
                  <li>• 149 million children are stunted due to chronic hunger</li>
                  <li>• Food insecurity affects 2.3 billion people globally</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-white mb-4">Why Your Support Matters</h2>
            <div className="space-y-4 text-gray-300">
              <p>
                The World Health Organization (WHO) works tirelessly to combat malnutrition, improve food security, 
                and ensure that vulnerable populations have access to nutritious food. Your donation helps:
              </p>
              <ul className="space-y-2 ml-4">
                <li>• Provide emergency food assistance to crisis-affected populations</li>
                <li>• Support nutrition programs for mothers and children</li>
                <li>• Fund research and initiatives to reduce food waste</li>
                <li>• Build sustainable food systems in developing countries</li>
                <li>• Train healthcare workers in nutrition and food security</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="card text-center bg-gradient-to-br from-primary-500/10 to-red-500/10 border-primary-500/20">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-4">Make a Difference Today</h2>
            <p className="text-gray-300 mb-8">
              Every contribution, no matter how small, helps save lives and reduce food waste. 
              Join us in the fight against hunger and support the World Health Organization's mission 
              to create a healthier, more sustainable world.
            </p>
            <button
              onClick={handleDonate}
              className="btn-primary group inline-flex items-center gap-2 text-lg px-8 py-4"
            >
              <Heart className="w-6 h-6" />
              Donate to WHO Foundation
              <ExternalLink className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="text-sm text-gray-500 mt-4">
              You will be redirected to the official WHO Foundation donation page
            </p>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm mb-4">Trusted by millions worldwide</p>
          <div className="flex flex-wrap justify-center gap-8 text-gray-600">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              <span className="text-sm">Official WHO Foundation</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5" />
              <span className="text-sm">100% Secure Donations</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <span className="text-sm">Global Impact</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default DonatePage
