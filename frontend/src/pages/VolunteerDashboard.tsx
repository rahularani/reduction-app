import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Package, Clock, MapPin, LogOut, CheckCircle, Navigation, Loader, Copy } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuthStore } from '../store/authStore'
import { useVolunteerNotificationStore } from '../store/volunteerNotificationStore'
import api from '../utils/api'
import { getSocket } from '../utils/socket'
import VolunteerNotificationDropdown from '../components/VolunteerNotificationDropdown'

interface FoodPost {
  id: number
  foodType: string
  quantity: string
  freshnessDuration: string
  pickupLocation: string
  latitude?: number
  longitude?: number
  imageUrl?: string
  status: 'available' | 'claimed' | 'completed'
  donor: { name: string; email: string }
  otp?: string
}

const VolunteerDashboard = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const { addNotification } = useVolunteerNotificationStore()
  const [availablePosts, setAvailablePosts] = useState<FoodPost[]>([])
  const [claimedPosts, setClaimedPosts] = useState<FoodPost[]>([])
  const [activeTab, setActiveTab] = useState<'available' | 'claimed'>('available')

  useEffect(() => {
    fetchAvailablePosts()
    fetchClaimedPosts()

    // Initialize socket connection
    const socket = getSocket()

    // Listen for new food posts
    socket.on('newFoodPost', (newPost: FoodPost) => {
      console.log('New food post received:', newPost)
      setAvailablePosts((prevPosts) => [newPost, ...prevPosts])
      
      // Add notification
      addNotification({
        message: `New food available: ${newPost.foodType}`,
        type: 'newFood',
        foodId: newPost.id,
        foodType: newPost.foodType,
        donorName: newPost.donor.name
      })
      
      toast.success(`New food available: ${newPost.foodType}`, {
        duration: 4000,
        icon: '🍽️'
      })
    })

    // Listen for claimed food updates (by other volunteers)
    socket.on('foodClaimed', ({ foodId }: { foodId: number }) => {
      console.log('Food claimed by someone:', foodId)
      setAvailablePosts((prevPosts) => prevPosts.filter((post) => post.id !== foodId))
    })

    // Listen for completed deliveries
    socket.on('foodCompleted', ({ foodId }: { foodId: number }) => {
      console.log('Food completed:', foodId)
      
      // Find the completed post to get its details
      const completedPost = claimedPosts.find(p => p.id === foodId)
      
      setClaimedPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === foodId ? { ...post, status: 'completed' } : post
        )
      )
      
      // Add notification
      if (completedPost) {
        addNotification({
          message: `Delivery completed for ${completedPost.foodType}!`,
          type: 'completed',
          foodId,
          foodType: completedPost.foodType,
          donorName: completedPost.donor.name
        })
      }
      
      toast.success('Delivery completed! 🎉', {
        duration: 4000
      })
    })

    // Cleanup on unmount
    return () => {
      socket.off('newFoodPost')
      socket.off('foodClaimed')
      socket.off('foodCompleted')
    }
  }, [claimedPosts, addNotification])

  const fetchAvailablePosts = async () => {
    try {
      const { data } = await api.get('/food/available')
      setAvailablePosts(data)
    } catch (error) {
      toast.error('Failed to fetch food posts')
    }
  }

  const fetchClaimedPosts = async () => {
    try {
      const { data } = await api.get('/food/my-claims')
      setClaimedPosts(data)
    } catch (error) {
      console.error('Failed to fetch claimed posts')
    }
  }

  const handleClaim = async (postId: number) => {
    try {
      const { data } = await api.post(`/food/claim/${postId}`)
      toast.success('Food claimed! Check "My Claims" tab for OTP.')
      
      // Remove from available and add to claimed
      setAvailablePosts((prevPosts) => prevPosts.filter((post) => post.id !== postId))
      fetchClaimedPosts()
      
      // Switch to claimed tab to show OTP
      setActiveTab('claimed')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to claim food')
    }
  }

  const copyOTP = (otp: string) => {
    navigator.clipboard.writeText(otp)
    toast.success('OTP copied to clipboard!')
  }

  const openInGoogleMaps = (lat: number, lng: number) => {
    window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank')
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const renderFoodCard = (post: FoodPost, isClaimed: boolean = false) => (
    <div key={post.id} className="card hover:scale-105 transition-transform animate-fadeIn">
      {post.imageUrl && (
        <img 
          src={`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5001'}${post.imageUrl}`} 
          alt={post.foodType}
          className="w-full h-48 object-cover rounded-xl mb-4"
          onError={(e) => {
            console.error('Image failed to load:', post.imageUrl)
            e.currentTarget.style.display = 'none'
          }}
        />
      )}
      
      <div className="flex items-start justify-between mb-4">
        <div className="bg-primary-500/10 p-3 rounded-xl">
          <Package className="w-6 h-6 text-primary-500" />
        </div>
        {isClaimed && (
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            post.status === 'claimed' 
              ? 'bg-yellow-500/10 text-yellow-500' 
              : 'bg-green-500/10 text-green-500'
          }`}>
            {post.status === 'claimed' ? 'In Progress' : 'Completed'}
          </span>
        )}
      </div>

      <h3 className="text-lg font-semibold text-white mb-2">{post.foodType}</h3>
      <p className="text-sm text-gray-500 mb-3">by {post.donor.name}</p>

      {/* Show OTP for claimed posts */}
      {isClaimed && post.status === 'claimed' && post.otp && (
        <div className="mb-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
          <p className="text-xs text-yellow-500 mb-2 font-medium">Your OTP (Show to donor)</p>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-yellow-500 tracking-widest">
              {post.otp}
            </div>
            <button
              onClick={() => copyOTP(post.otp!)}
              className="p-2 hover:bg-yellow-500/20 rounded-lg transition-colors"
              title="Copy OTP"
            >
              <Copy className="w-4 h-4 text-yellow-500" />
            </button>
          </div>
          <div className="flex items-center gap-2 mt-3 text-xs text-gray-400">
            <Loader className="w-3 h-3 animate-spin" />
            <span>Waiting for donor to confirm delivery...</span>
          </div>
        </div>
      )}

      {/* Show success message for completed */}
      {isClaimed && post.status === 'completed' && (
        <div className="mb-4 p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
          <div className="flex items-center gap-2 text-green-500">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">Delivery Completed Successfully!</span>
          </div>
          <p className="text-xs text-gray-400 mt-2">Thank you for helping reduce food waste! 🌱</p>
        </div>
      )}

      <div className="space-y-2 text-sm text-gray-400 mb-4">
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4" />
          <span>{post.quantity}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <span>Fresh for {post.freshnessDuration}</span>
        </div>
        {/* Hide location if delivery is completed */}
        {post.status !== 'completed' && (
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span className="flex-1 truncate">{post.pickupLocation}</span>
            {post.latitude && post.longitude && (
              <button
                onClick={() => openInGoogleMaps(post.latitude!, post.longitude!)}
                className="text-primary-500 hover:text-primary-400"
                title="Open in Google Maps"
              >
                <Navigation className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
        {post.status === 'completed' && (
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="w-4 h-4" />
            <span className="italic">Location hidden (delivery completed)</span>
          </div>
        )}
      </div>

      {!isClaimed && post.status === 'available' && (
        <button
          onClick={() => handleClaim(post.id)}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          <CheckCircle className="w-4 h-4" />
          Claim Food
        </button>
      )}

      {isClaimed && post.status === 'claimed' && post.latitude && post.longitude && (
        <button
          onClick={() => openInGoogleMaps(post.latitude!, post.longitude!)}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          <Navigation className="w-4 h-4" />
          Get Directions
        </button>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-dark-950">
      <header className="bg-dark-900 border-b border-dark-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Volunteer Dashboard</h1>
            <p className="text-gray-400 text-sm">Welcome, {user?.name}</p>
          </div>
          <div className="flex items-center gap-4">
            <VolunteerNotificationDropdown />
            <button onClick={handleLogout} className="btn-secondary flex items-center gap-2">
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-dark-800">
          <button
            onClick={() => setActiveTab('available')}
            className={`pb-3 px-4 font-medium transition-colors relative ${
              activeTab === 'available'
                ? 'text-primary-500'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Available Food
            {availablePosts.length > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-primary-500/20 text-primary-500 text-xs rounded-full">
                {availablePosts.length}
              </span>
            )}
            {activeTab === 'available' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab('claimed')}
            className={`pb-3 px-4 font-medium transition-colors relative ${
              activeTab === 'claimed'
                ? 'text-primary-500'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            My Claims
            {claimedPosts.length > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-yellow-500/20 text-yellow-500 text-xs rounded-full">
                {claimedPosts.length}
              </span>
            )}
            {activeTab === 'claimed' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500"></div>
            )}
          </button>
        </div>

        {/* Available Food Tab */}
        {activeTab === 'available' && (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Available Food</h2>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
                <span>Live Updates</span>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availablePosts.map((post) => renderFoodCard(post, false))}
            </div>

            {availablePosts.length === 0 && (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No available food at the moment</p>
                <p className="text-gray-500 text-sm mt-2">New posts will appear here automatically</p>
              </div>
            )}
          </>
        )}

        {/* My Claims Tab */}
        {activeTab === 'claimed' && (
          <>
            <h2 className="text-xl font-semibold text-white mb-6">My Claimed Food</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {claimedPosts.map((post) => renderFoodCard(post, true))}
            </div>

            {claimedPosts.length === 0 && (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">You haven't claimed any food yet</p>
                <p className="text-gray-500 text-sm mt-2">
                  Go to "Available Food" tab to claim food
                </p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}

export default VolunteerDashboard
