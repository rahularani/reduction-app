import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Package, Clock, MapPin, LogOut, Image as ImageIcon, Navigation, CheckCircle, Truck } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuthStore } from '../store/authStore'
import { useNotificationStore } from '../store/notificationStore'
import api from '../utils/api'
import { getSocket } from '../utils/socket'
import NotificationDropdown from '../components/NotificationDropdown'

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
  claimedBy?: {
    id: number
    name: string
    email: string
  }
  createdAt: string
}

const DonorDashboard = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const { addNotification } = useNotificationStore()
  const [showModal, setShowModal] = useState(false)
  const [showOtpModal, setShowOtpModal] = useState(false)
  const [selectedPost, setSelectedPost] = useState<FoodPost | null>(null)
  const [otpInput, setOtpInput] = useState('')
  const [posts, setPosts] = useState<FoodPost[]>([])
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [loadingLocation, setLoadingLocation] = useState(false)
  const [verifyingOtp, setVerifyingOtp] = useState(false)
  const [formData, setFormData] = useState({
    foodType: '',
    quantity: '',
    freshnessDuration: '',
    pickupLocation: '',
    latitude: '',
    longitude: ''
  })

  useEffect(() => {
    fetchPosts()

    // Initialize socket connection
    const socket = getSocket()

    // Listen for food claimed events
    socket.on('foodClaimed', ({ foodId, volunteer, status }: any) => {
      console.log('Food claimed:', foodId)
      
      // Find the food post to get its details
      const claimedPost = posts.find(p => p.id === foodId)
      
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === foodId
            ? { ...post, status, claimedBy: volunteer }
            : post
        )
      )
      
      // Add notification
      addNotification({
        message: `${volunteer.name} claimed your food!`,
        type: 'claim',
        foodId,
        foodType: claimedPost?.foodType,
        volunteerName: volunteer.name
      })
      
      toast.success(`${volunteer.name} claimed your food!`, {
        duration: 4000,
        icon: '✅'
      })
    })

    // Listen for food completed events
    socket.on('foodCompleted', ({ foodId }: any) => {
      console.log('Food completed:', foodId)
      
      const completedPost = posts.find(p => p.id === foodId)
      
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === foodId
            ? { ...post, status: 'completed' }
            : post
        )
      )
      
      // Add notification
      if (completedPost) {
        addNotification({
          message: `Delivery completed for ${completedPost.foodType}`,
          type: 'complete',
          foodId,
          foodType: completedPost.foodType
        })
      }
    })

    return () => {
      socket.off('foodClaimed')
      socket.off('foodCompleted')
    }
  }, [posts, addNotification])

  const fetchPosts = async () => {
    try {
      const { data } = await api.get('/food/my-posts')
      setPosts(data)
    } catch (error) {
      toast.error('Failed to fetch posts')
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB')
        return
      }
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const getCurrentLocation = () => {
    setLoadingLocation(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude
          const lng = position.coords.longitude
          setFormData({
            ...formData,
            latitude: lat.toString(),
            longitude: lng.toString()
          })
          
          fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
            .then(res => res.json())
            .then(data => {
              setFormData(prev => ({
                ...prev,
                pickupLocation: data.display_name || `${lat}, ${lng}`
              }))
              toast.success('Location captured!')
            })
            .catch(() => {
              setFormData(prev => ({
                ...prev,
                pickupLocation: `${lat}, ${lng}`
              }))
              toast.success('Location captured!')
            })
            .finally(() => setLoadingLocation(false))
        },
        (error) => {
          toast.error('Unable to get location')
          setLoadingLocation(false)
        }
      )
    } else {
      toast.error('Geolocation not supported')
      setLoadingLocation(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const formDataToSend = new FormData()
    formDataToSend.append('foodType', formData.foodType)
    formDataToSend.append('quantity', formData.quantity)
    formDataToSend.append('freshnessDuration', formData.freshnessDuration)
    formDataToSend.append('pickupLocation', formData.pickupLocation)
    if (formData.latitude) formDataToSend.append('latitude', formData.latitude)
    if (formData.longitude) formDataToSend.append('longitude', formData.longitude)
    if (selectedImage) formDataToSend.append('image', selectedImage)

    try {
      await api.post('/food/create', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      toast.success('Food posted successfully!')
      
      // Add notification for successful post
      addNotification({
        message: `Successfully posted: ${formData.foodType}`,
        type: 'post',
        foodId: Date.now(), // Temporary ID
        foodType: formData.foodType
      })
      
      setShowModal(false)
      setFormData({ foodType: '', quantity: '', freshnessDuration: '', pickupLocation: '', latitude: '', longitude: '' })
      setImagePreview(null)
      setSelectedImage(null)
      fetchPosts()
    } catch (error) {
      toast.error('Failed to post food')
    }
  }

  const handleDeliverClick = (post: FoodPost) => {
    setSelectedPost(post)
    setOtpInput('')
    setShowOtpModal(true)
  }

  const handleVerifyOtp = async () => {
    if (!selectedPost || !otpInput) {
      toast.error('Please enter OTP')
      return
    }

    if (otpInput.length !== 6) {
      toast.error('OTP must be 6 digits')
      return
    }

    setVerifyingOtp(true)

    try {
      const { data } = await api.post(`/food/verify-otp/${selectedPost.id}`, {
        otp: otpInput
      })
      toast.success('Delivery completed successfully! 🎉')
      setShowOtpModal(false)
      setSelectedPost(null)
      setOtpInput('')
      fetchPosts()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Invalid OTP')
    } finally {
      setVerifyingOtp(false)
    }
  }

  const openInGoogleMaps = (lat: number, lng: number) => {
    window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank')
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-dark-950">
      <header className="bg-dark-900 border-b border-dark-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Donor Dashboard</h1>
            <p className="text-gray-400 text-sm">Welcome back, {user?.name}</p>
          </div>
          <div className="flex items-center gap-4">
            <NotificationDropdown />
            <button onClick={handleLogout} className="btn-secondary flex items-center gap-2">
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Post Surplus Food
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div key={post.id} className="card hover:scale-105 transition-transform">
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
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  post.status === 'available' ? 'bg-green-500/10 text-green-500' :
                  post.status === 'claimed' ? 'bg-yellow-500/10 text-yellow-500' :
                  'bg-blue-500/10 text-blue-500'
                }`}>
                  {post.status}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{post.foodType}</h3>
              
              {post.claimedBy && (
                <div className="mb-3 p-2 bg-dark-800 rounded-lg">
                  <p className="text-xs text-gray-500">Claimed by</p>
                  <p className="text-sm text-primary-500 font-medium">{post.claimedBy.name}</p>
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

              {post.status === 'claimed' && (
                <button
                  onClick={() => handleDeliverClick(post)}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  <Truck className="w-4 h-4" />
                  Complete Delivery
                </button>
              )}

              {post.status === 'completed' && (
                <div className="flex items-center justify-center gap-2 text-green-500 py-2">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Delivered</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No posts yet. Start by posting surplus food!</p>
          </div>
        )}
      </main>

      {/* Post Food Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="card max-w-md w-full my-8">
            <h2 className="text-2xl font-bold text-white mb-6">Post Surplus Food</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Food Image</label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="food-image"
                  />
                  <label
                    htmlFor="food-image"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-dark-700 rounded-xl cursor-pointer hover:border-primary-500 transition-colors"
                  >
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-xl" />
                    ) : (
                      <>
                        <ImageIcon className="w-8 h-8 text-gray-500 mb-2" />
                        <span className="text-sm text-gray-400">Click to upload image</span>
                      </>
                    )}
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Food Type</label>
                <input
                  type="text"
                  required
                  className="input-field"
                  placeholder="e.g., Rice, Curry, Bread"
                  value={formData.foodType}
                  onChange={(e) => setFormData({ ...formData, foodType: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Quantity</label>
                <input
                  type="text"
                  required
                  className="input-field"
                  placeholder="e.g., 50 servings, 10kg"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Freshness Duration</label>
                <input
                  type="text"
                  required
                  className="input-field"
                  placeholder="e.g., 2 hours, 4 hours"
                  value={formData.freshnessDuration}
                  onChange={(e) => setFormData({ ...formData, freshnessDuration: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Pickup Location</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    className="input-field flex-1"
                    placeholder="Full address"
                    value={formData.pickupLocation}
                    onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={getCurrentLocation}
                    disabled={loadingLocation}
                    className="btn-secondary px-3"
                    title="Get current location"
                  >
                    <Navigation className={`w-5 h-5 ${loadingLocation ? 'animate-spin' : ''}`} />
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">Click the icon to use your current location</p>
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => {
                    setShowModal(false)
                    setImagePreview(null)
                    setSelectedImage(null)
                  }} 
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary flex-1">
                  Post Food
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* OTP Verification Modal */}
      {showOtpModal && selectedPost && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="card max-w-md w-full text-center">
            <div className="bg-yellow-500/10 p-4 rounded-full w-fit mx-auto mb-4">
              <Truck className="w-12 h-12 text-yellow-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Complete Delivery</h2>
            <p className="text-gray-400 mb-6">
              Ask the volunteer for their OTP to confirm delivery
            </p>

            <div className="mb-6">
              <p className="text-sm text-gray-500 mb-2">Volunteer: {selectedPost.claimedBy?.name}</p>
              <input
                type="text"
                maxLength={6}
                placeholder="Enter 6-digit OTP"
                className="input-field text-center text-2xl tracking-widest"
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                autoFocus
              />
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => {
                  setShowOtpModal(false)
                  setOtpInput('')
                }} 
                className="btn-secondary flex-1"
                disabled={verifyingOtp}
              >
                Cancel
              </button>
              <button 
                onClick={handleVerifyOtp} 
                className="btn-primary flex-1"
                disabled={verifyingOtp || otpInput.length !== 6}
              >
                {verifyingOtp ? 'Verifying...' : 'Verify & Complete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DonorDashboard
