import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, Package, TrendingUp, Activity, Trash2, UserCheck, UserX, Tractor, Store } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuthStore } from '../store/authStore'
import api from '../utils/api'
import ProfileDropdown from '../components/ProfileDropdown'

interface User {
  id: number
  name: string
  email: string
  role: 'donor' | 'volunteer' | 'farmer'
  createdAt: string
}

interface FoodPost {
  id: number
  foodType: string
  quantity: string
  status: 'available' | 'claimed' | 'completed'
  donor: { name: string; email: string }
  claimedBy?: { name: string; email: string }
  createdAt: string
}

interface WasteFoodPost {
  id: number
  foodType: string
  quantity: string
  price: number
  status: 'available' | 'reserved' | 'sold'
  seller: { name: string; email: string }
  buyer?: { name: string; email: string }
  createdAt: string
}

interface Stats {
  totalUsers: number
  totalDonors: number
  totalVolunteers: number
  totalFarmers: number
  totalFoodPosts: number
  availableFood: number
  claimedFood: number
  completedFood: number
  totalWasteFoodPosts: number
  availableWasteFood: number
  reservedWasteFood: number
  soldWasteFood: number
}

const AdminDashboard = () => {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'food' | 'waste-food'>('overview')
  const [stats, setStats] = useState<Stats | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [foodPosts, setFoodPosts] = useState<FoodPost[]>([])
  const [wasteFoodPosts, setWasteFoodPosts] = useState<WasteFoodPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/login')
      return
    }
    fetchStats()
    fetchUsers()
    fetchFoodPosts()
    fetchWasteFoodPosts()
  }, [user, navigate])

  const fetchStats = async () => {
    try {
      const { data } = await api.get('/admin/stats')
      setStats(data)
    } catch (error) {
      toast.error('Failed to fetch statistics')
    } finally {
      setLoading(false)
    }
  }

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/admin/users')
      setUsers(data)
    } catch (error) {
      toast.error('Failed to fetch users')
    }
  }

  const fetchFoodPosts = async () => {
    try {
      const { data } = await api.get('/admin/food-posts')
      setFoodPosts(data)
    } catch (error) {
      toast.error('Failed to fetch food posts')
    }
  }

  const fetchWasteFoodPosts = async () => {
    try {
      const { data } = await api.get('/admin/waste-food-posts')
      setWasteFoodPosts(data)
    } catch (error) {
      toast.error('Failed to fetch waste food posts')
    }
  }

  const handleDeleteUser = async (userId: number) => {
    if (!confirm('Are you sure you want to delete this user?')) return

    try {
      await api.delete(`/admin/users/${userId}`)
      toast.success('User deleted successfully')
      fetchUsers()
      fetchStats()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete user')
    }
  }

  const handleDeleteFoodPost = async (postId: number) => {
    if (!confirm('Are you sure you want to delete this food post?')) return

    try {
      await api.delete(`/admin/food-posts/${postId}`)
      toast.success('Food post deleted successfully')
      fetchFoodPosts()
      fetchStats()
    } catch (error) {
      toast.error('Failed to delete food post')
    }
  }

  const handleDeleteWasteFoodPost = async (postId: number) => {
    if (!confirm('Are you sure you want to delete this waste food post?')) return

    try {
      await api.delete(`/admin/waste-food-posts/${postId}`)
      toast.success('Waste food post deleted successfully')
      fetchWasteFoodPosts()
      fetchStats()
    } catch (error) {
      toast.error('Failed to delete waste food post')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-950">
      {/* Header */}
      <header className="bg-dark-900 border-b border-dark-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-gray-400 text-sm">Manage users and food posts</p>
          </div>
          <ProfileDropdown />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-dark-800 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 px-4 font-medium transition-colors relative whitespace-nowrap ${
              activeTab === 'overview' ? 'text-primary-500' : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Overview
            {activeTab === 'overview' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`pb-3 px-4 font-medium transition-colors relative whitespace-nowrap ${
              activeTab === 'users' ? 'text-primary-500' : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Users ({stats?.totalUsers || 0})
            {activeTab === 'users' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab('food')}
            className={`pb-3 px-4 font-medium transition-colors relative whitespace-nowrap ${
              activeTab === 'food' ? 'text-primary-500' : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Food Posts ({stats?.totalFoodPosts || 0})
            {activeTab === 'food' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab('waste-food')}
            className={`pb-3 px-4 font-medium transition-colors relative whitespace-nowrap ${
              activeTab === 'waste-food' ? 'text-primary-500' : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Waste Food ({stats?.totalWasteFoodPosts || 0})
            {activeTab === 'waste-food' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500"></div>
            )}
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && stats && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-blue-500/10 p-3 rounded-xl">
                    <Users className="w-6 h-6 text-blue-500" />
                  </div>
                  <TrendingUp className="w-5 h-5 text-green-500" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">{stats.totalUsers}</h3>
                <p className="text-gray-400 text-sm">Total Users</p>
              </div>

              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-purple-500/10 p-3 rounded-xl">
                    <UserCheck className="w-6 h-6 text-purple-500" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">{stats.totalDonors}</h3>
                <p className="text-gray-400 text-sm">Donors</p>
              </div>

              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-green-500/10 p-3 rounded-xl">
                    <UserX className="w-6 h-6 text-green-500" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">{stats.totalVolunteers}</h3>
                <p className="text-gray-400 text-sm">Volunteers</p>
              </div>

              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-yellow-500/10 p-3 rounded-xl">
                    <Tractor className="w-6 h-6 text-yellow-500" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">{stats.totalFarmers}</h3>
                <p className="text-gray-400 text-sm">Farmers</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="card">
                <div className="flex items-center gap-3 mb-4">
                  <Package className="w-6 h-6 text-primary-500" />
                  <h3 className="text-lg font-semibold text-white">Food Donations</h3>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-2xl font-bold text-green-500">{stats.availableFood}</p>
                    <p className="text-xs text-gray-400">Available</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-yellow-500">{stats.claimedFood}</p>
                    <p className="text-xs text-gray-400">Claimed</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-500">{stats.completedFood}</p>
                    <p className="text-xs text-gray-400">Completed</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-dark-700">
                  <p className="text-sm text-gray-400">Total Posts: <span className="text-white font-semibold">{stats.totalFoodPosts}</span></p>
                </div>
              </div>

              <div className="card">
                <div className="flex items-center gap-3 mb-4">
                  <Store className="w-6 h-6 text-yellow-500" />
                  <h3 className="text-lg font-semibold text-white">Waste Food Marketplace</h3>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-2xl font-bold text-green-500">{stats.availableWasteFood}</p>
                    <p className="text-xs text-gray-400">Available</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-yellow-500">{stats.reservedWasteFood}</p>
                    <p className="text-xs text-gray-400">Reserved</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-500">{stats.soldWasteFood}</p>
                    <p className="text-xs text-gray-400">Sold</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-dark-700">
                  <p className="text-sm text-gray-400">Total Posts: <span className="text-white font-semibold">{stats.totalWasteFoodPosts}</span></p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="card">
            <h2 className="text-xl font-semibold text-white mb-4">All Users</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-dark-800">
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Name</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Email</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Role</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Joined</th>
                    <th className="text-right py-3 px-4 text-gray-400 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-dark-800 hover:bg-dark-800/50">
                      <td className="py-3 px-4 text-white">{user.name}</td>
                      <td className="py-3 px-4 text-gray-400">{user.email}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.role === 'donor' 
                            ? 'bg-blue-500/10 text-blue-500' 
                            : user.role === 'volunteer'
                            ? 'bg-green-500/10 text-green-500'
                            : 'bg-yellow-500/10 text-yellow-500'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-400">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-500 hover:text-red-400 p-2"
                          title="Delete user"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Food Posts Tab */}
        {activeTab === 'food' && (
          <div className="card">
            <h2 className="text-xl font-semibold text-white mb-4">All Food Posts</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-dark-800">
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Food Type</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Quantity</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Donor</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Claimed By</th>
                    <th className="text-right py-3 px-4 text-gray-400 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {foodPosts.map((post) => (
                    <tr key={post.id} className="border-b border-dark-800 hover:bg-dark-800/50">
                      <td className="py-3 px-4 text-white">{post.foodType}</td>
                      <td className="py-3 px-4 text-gray-400">{post.quantity}</td>
                      <td className="py-3 px-4 text-gray-400">{post.donor.name}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          post.status === 'available' ? 'bg-green-500/10 text-green-500' :
                          post.status === 'claimed' ? 'bg-yellow-500/10 text-yellow-500' :
                          'bg-blue-500/10 text-blue-500'
                        }`}>
                          {post.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-400">
                        {post.claimedBy?.name || '-'}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleDeleteFoodPost(post.id)}
                          className="text-red-500 hover:text-red-400 p-2"
                          title="Delete post"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Waste Food Posts Tab */}
        {activeTab === 'waste-food' && (
          <div className="card">
            <h2 className="text-xl font-semibold text-white mb-4">All Waste Food Posts</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-dark-800">
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Food Type</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Quantity</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Price</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Seller</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Buyer</th>
                    <th className="text-right py-3 px-4 text-gray-400 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {wasteFoodPosts.map((post) => (
                    <tr key={post.id} className="border-b border-dark-800 hover:bg-dark-800/50">
                      <td className="py-3 px-4 text-white">{post.foodType}</td>
                      <td className="py-3 px-4 text-gray-400">{post.quantity}</td>
                      <td className="py-3 px-4 text-primary-500 font-semibold">₹{post.price}</td>
                      <td className="py-3 px-4 text-gray-400">{post.seller.name}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          post.status === 'available' ? 'bg-green-500/10 text-green-500' :
                          post.status === 'reserved' ? 'bg-yellow-500/10 text-yellow-500' :
                          'bg-blue-500/10 text-blue-500'
                        }`}>
                          {post.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-400">
                        {post.buyer?.name || '-'}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleDeleteWasteFoodPost(post.id)}
                          className="text-red-500 hover:text-red-400 p-2"
                          title="Delete post"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default AdminDashboard
