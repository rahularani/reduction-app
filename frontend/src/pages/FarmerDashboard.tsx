import { useState, useEffect } from 'react'
import { ShoppingCart, Package, MapPin, Navigation, DollarSign, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuthStore } from '../store/authStore'
import api from '../utils/api'
import { getSocket } from '../utils/socket'
import ProfileDropdown from '../components/ProfileDropdown'

interface WasteFoodPost {
  id: number
  foodType: string
  quantity: string
  price: number
  description?: string
  pickupLocation: string
  latitude?: number
  longitude?: number
  imageUrl?: string
  status: 'available' | 'reserved' | 'sold'
  seller?: {
    id: number
    name: string
    email: string
  }
  createdAt: string
}

const FarmerDashboard = () => {
  const { user } = useAuthStore()
  const [availablePosts, setAvailablePosts] = useState<WasteFoodPost[]>([])
  const [myPurchases, setMyPurchases] = useState<WasteFoodPost[]>([])
  const [activeTab, setActiveTab] = useState<'available' | 'purchases'>('available')

  useEffect(() => {
    fetchAvailablePosts()
    fetchMyPurchases()

    const socket = getSocket()

    socket.on('newWasteFoodPost', (post: WasteFoodPost) => {
      setAvailablePosts((prev) => [post, ...prev])
      toast.success(`New waste food available: ${post.foodType}`)
    })

    socket.on('wasteFoodReserved', ({ wasteFoodId, status }: any) => {
      setAvailablePosts((prev) =>
        prev.filter((post) => post.id !== wasteFoodId)
      )
    })

    return () => {
      socket.off('newWasteFoodPost')
      socket.off('wasteFoodReserved')
    }
  }, [])

  const fetchAvailablePosts = async () => {
    try {
      const { data } = await api.get('/waste-food/available')
      setAvailablePosts(data)
    } catch (error) {
      toast.error('Failed to fetch available posts')
    }
  }

  const fetchMyPurchases = async () => {
    try {
      const { data } = await api.get('/waste-food/my-purchases')
      setMyPurchases(data)
    } catch (error) {
      toast.error('Failed to fetch purchases')
    }
  }

  const handleBuy = async (postId: number) => {
    try {
      await api.post(`/waste-food/buy/${postId}`)
      toast.success('Successfully reserved! Contact seller for pickup.')
      fetchAvailablePosts()
      fetchMyPurchases()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to reserve')
    }
  }

  const openInGoogleMaps = (lat: number, lng: number) => {
    window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank')
  }

  return (
    <div className="min-h-screen bg-dark-950">
      <header className="bg-dark-900 border-b border-dark-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Farmer Dashboard</h1>
            <p className="text-gray-400 text-sm">Welcome, {user?.name}</p>
          </div>
          <ProfileDropdown />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8 flex gap-4">
          <button
            onClick={() => setActiveTab('available')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'available'
                ? 'bg-primary-500 text-white'
                : 'bg-dark-800 text-gray-400 hover:bg-dark-700'
            }`}
          >
            Available Waste Food
          </button>
          <button
            onClick={() => setActiveTab('purchases')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'purchases'
                ? 'bg-primary-500 text-white'
                : 'bg-dark-800 text-gray-400 hover:bg-dark-700'
            }`}
          >
            My Purchases
          </button>
        </div>

        {activeTab === 'available' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availablePosts.map((post) => (
              <div key={post.id} className="card hover:scale-105 transition-transform">
                {post.imageUrl && (
                  <img 
                    src={`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5001'}${post.imageUrl}`} 
                    alt={post.foodType}
                    className="w-full h-48 object-cover rounded-xl mb-4"
                  />
                )}
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-primary-500/10 p-3 rounded-xl">
                    <Package className="w-6 h-6 text-primary-500" />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary-500">₹{post.price}</div>
                    <div className="text-xs text-gray-500">per unit</div>
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-white mb-2">{post.foodType}</h3>
                
                {post.description && (
                  <p className="text-sm text-gray-400 mb-3">{post.description}</p>
                )}

                <div className="space-y-2 text-sm text-gray-400 mb-4">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    <span>{post.quantity}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span className="flex-1 truncate">{post.pickupLocation}</span>
                    {post.latitude && post.longitude && (
                      <button
                        onClick={() => openInGoogleMaps(post.latitude!, post.longitude!)}
                        className="text-primary-500 hover:text-primary-400"
                      >
                        <Navigation className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  {post.seller && (
                    <div className="text-xs text-gray-500">
                      Seller: {post.seller.name}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleBuy(post.id)}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Buy Now
                </button>
              </div>
            ))}
            {availablePosts.length === 0 && (
              <div className="col-span-full text-center py-12">
                <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No waste food available at the moment</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'purchases' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myPurchases.map((post) => (
              <div key={post.id} className="card">
                {post.imageUrl && (
                  <img 
                    src={`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5001'}${post.imageUrl}`} 
                    alt={post.foodType}
                    className="w-full h-48 object-cover rounded-xl mb-4"
                  />
                )}
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-primary-500/10 p-3 rounded-xl">
                    <Package className="w-6 h-6 text-primary-500" />
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    post.status === 'reserved' ? 'bg-yellow-500/10 text-yellow-500' :
                    'bg-green-500/10 text-green-500'
                  }`}>
                    {post.status}
                  </span>
                </div>
                
                <h3 className="text-lg font-semibold text-white mb-2">{post.foodType}</h3>
                
                <div className="mb-3 p-2 bg-dark-800 rounded-lg">
                  <p className="text-xs text-gray-500">Seller</p>
                  <p className="text-sm text-primary-500 font-medium">{post.seller?.name}</p>
                  <p className="text-xs text-gray-400">{post.seller?.email}</p>
                </div>

                <div className="space-y-2 text-sm text-gray-400 mb-4">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    <span>{post.quantity}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    <span className="font-semibold text-primary-500">₹{post.price}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span className="flex-1 truncate">{post.pickupLocation}</span>
                    {post.latitude && post.longitude && (
                      <button
                        onClick={() => openInGoogleMaps(post.latitude!, post.longitude!)}
                        className="text-primary-500 hover:text-primary-400"
                      >
                        <Navigation className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {post.status === 'sold' && (
                  <div className="flex items-center justify-center gap-2 text-green-500 py-2">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">Completed</span>
                  </div>
                )}
              </div>
            ))}
            {myPurchases.length === 0 && (
              <div className="col-span-full text-center py-12">
                <ShoppingCart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No purchases yet</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

export default FarmerDashboard
