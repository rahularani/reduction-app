import { useState, useEffect } from 'react'
import { Plus, Package, MapPin, Navigation, DollarSign, CheckCircle, Image as ImageIcon } from 'lucide-react'
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
  buyer?: {
    id: number
    name: string
    email: string
  }
  createdAt: string
}

const WasteFoodMarketplace = () => {
  const { user } = useAuthStore()
  const [showModal, setShowModal] = useState(false)
  const [posts, setPosts] = useState<WasteFoodPost[]>([])
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [loadingLocation, setLoadingLocation] = useState(false)
  const [formData, setFormData] = useState({
    foodType: '',
    quantity: '',
    price: '',
    description: '',
    pickupLocation: '',
    latitude: '',
    longitude: ''
  })

  useEffect(() => {
    fetchPosts()

    const socket = getSocket()

    socket.on('wasteFoodReserved', ({ wasteFoodId, buyer, status }: any) => {
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === wasteFoodId
            ? { ...post, status, buyer: buyer }
            : post
        )
      )
      toast.success(`${buyer.name} reserved your waste food!`)
    })

    socket.on('wasteFoodSold', ({ wasteFoodId }: any) => {
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === wasteFoodId
            ? { ...post, status: 'sold' }
            : post
        )
      )
    })

    return () => {
      socket.off('wasteFoodReserved')
      socket.off('wasteFoodSold')
    }
  }, [])

  const fetchPosts = async () => {
    try {
      const { data } = await api.get('/waste-food/my-listings')
      setPosts(data)
    } catch (error) {
      toast.error('Failed to fetch listings')
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
          
          setFormData(prev => ({
            ...prev,
            latitude: lat.toString(),
            longitude: lng.toString()
          }))
          
          fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`, {
            headers: {
              'User-Agent': 'FoodWasteApp/1.0'
            }
          })
            .then(res => res.json())
            .then(data => {
              setFormData(prev => ({
                ...prev,
                pickupLocation: data.display_name || `${lat}, ${lng}`,
                latitude: lat.toString(),
                longitude: lng.toString()
              }))
              toast.success('Location captured!')
            })
            .catch(() => {
              setFormData(prev => ({
                ...prev,
                pickupLocation: `${lat}, ${lng}`,
                latitude: lat.toString(),
                longitude: lng.toString()
              }))
              toast.success('Location captured!')
            })
            .finally(() => setLoadingLocation(false))
        },
        () => {
          toast.error('Unable to get location')
          setLoadingLocation(false)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
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
    formDataToSend.append('price', formData.price)
    formDataToSend.append('description', formData.description)
    formDataToSend.append('pickupLocation', formData.pickupLocation)
    if (formData.latitude) formDataToSend.append('latitude', formData.latitude)
    if (formData.longitude) formDataToSend.append('longitude', formData.longitude)
    if (selectedImage) formDataToSend.append('image', selectedImage)

    try {
      await api.post('/waste-food/create', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      toast.success('Waste food listed successfully!')
      setShowModal(false)
      setFormData({ foodType: '', quantity: '', price: '', description: '', pickupLocation: '', latitude: '', longitude: '' })
      setImagePreview(null)
      setSelectedImage(null)
      fetchPosts()
    } catch (error) {
      toast.error('Failed to list waste food')
    }
  }

  const handleComplete = async (postId: number) => {
    try {
      await api.post(`/waste-food/complete/${postId}`)
      toast.success('Transaction completed!')
      fetchPosts()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to complete')
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
            <h1 className="text-2xl font-bold text-white">Waste Food Marketplace</h1>
            <p className="text-gray-400 text-sm">Sell expired food to farmers for animal feed</p>
          </div>
          <ProfileDropdown />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
            <Plus className="w-5 h-5" />
            List Waste Food
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
                />
              )}
              <div className="flex items-start justify-between mb-4">
                <div className="bg-primary-500/10 p-3 rounded-xl">
                  <Package className="w-6 h-6 text-primary-500" />
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    post.status === 'available' ? 'bg-green-500/10 text-green-500' :
                    post.status === 'reserved' ? 'bg-yellow-500/10 text-yellow-500' :
                    'bg-blue-500/10 text-blue-500'
                  }`}>
                    {post.status}
                  </span>
                </div>
              </div>
              
              <h3 className="text-lg font-semibold text-white mb-2">{post.foodType}</h3>
              
              {post.buyer && (
                <div className="mb-3 p-2 bg-dark-800 rounded-lg">
                  <p className="text-xs text-gray-500">Buyer</p>
                  <p className="text-sm text-primary-500 font-medium">{post.buyer.name}</p>
                  <p className="text-xs text-gray-400">{post.buyer.email}</p>
                </div>
              )}

              <div className="space-y-2 text-sm text-gray-400 mb-4">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  <span>{post.quantity}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  <span className="font-semibold text-primary-500">₹{post.price}</span>
                </div>
                {post.status !== 'sold' && (
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
              </div>

              {post.status === 'reserved' && (
                <button
                  onClick={() => handleComplete(post.id)}
                  className="btn-primary w-full"
                >
                  Mark as Sold
                </button>
              )}

              {post.status === 'sold' && (
                <div className="flex items-center justify-center gap-2 text-green-500 py-2">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Sold</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No listings yet. Start by listing waste food!</p>
          </div>
        )}
      </main>

      {/* Create Listing Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="card max-w-md w-full my-8">
            <h2 className="text-2xl font-bold text-white mb-6">List Waste Food</h2>
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
                  placeholder="e.g., Vegetable waste, Fruit peels"
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
                  placeholder="e.g., 50kg, 100kg"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Price (₹)</label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  className="input-field"
                  placeholder="e.g., 500"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description (Optional)</label>
                <textarea
                  className="input-field"
                  rows={3}
                  placeholder="Additional details about the waste food"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                  List Food
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default WasteFoodMarketplace
