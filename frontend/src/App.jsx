
import React, { useState, useEffect } from 'react';
import { Users, Plus, Edit2, Trash2, X, Check, Search, UserPlus } from 'lucide-react';
import UserCard from './components/UserCard';
import UserForm from './components/UserForm';

const API_URL = 'http://localhost:3000/api/users';

// API Service
const api = {
  getUsers: async () => {
    const res = await fetch(API_URL);
    return res.json();
  },
  createUser: async (user) => {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    });
    return res.json();
  },
  updateUser: async (id, user) => {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    });
    return res.json();
  },
  deleteUser: async (id) => {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    });
    return res.json();
  }
};

// Main App Component
export default function App() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await api.getUsers();
      if (data.success) {
        setUsers(data.data);
      }
    } catch (error) {
      showMessage('Failed to fetch users', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleSave = async (userData) => {
    setLoading(true);
    try {
      let result;
      if (editingUser) {
        result = await api.updateUser(editingUser._id, userData);
      } else {
        result = await api.createUser(userData);
      }

      if (result.success) {
        showMessage(result.message);
        fetchUsers();
        setShowForm(false);
        setEditingUser(null);
      } else {
        showMessage(result.message, 'error');
      }
    } catch (error) {
      showMessage('Operation failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setLoading(true);
      try {
        const result = await api.deleteUser(id);
        if (result.success) {
          showMessage(result.message);
          fetchUsers();
        } else {
          showMessage(result.message, 'error');
        }
      } catch (error) {
        showMessage('Delete failed', 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingUser(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl">
                <Users className="text-white" size={28} />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  User Management
                </h1>
                <p className="text-gray-600 text-sm">MERN Stack CRUD Application</p>
              </div>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition flex items-center gap-2"
            >
              {showForm ? <X size={20} /> : <UserPlus size={20} />}
              {showForm ? 'Close' : 'Add User'}
            </button>
          </div>
        </div>
      </div>

      {/* Message Toast */}
      {message && (
        <div className="fixed top-20 right-4 z-50 animate-slide-in">
          <div className={`px-6 py-4 rounded-lg shadow-xl ${
            message.type === 'error' ? 'bg-red-500' : 'bg-green-500'
          } text-white font-semibold`}>
            {message.text}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Form Section */}
        {showForm && (
          <div className="mb-8 animate-fade-in">
            <UserForm
              user={editingUser}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none shadow-sm transition"
            />
          </div>
        </div>

        {/* Users Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600"></div>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
            <Users className="mx-auto text-gray-300 mb-4" size={64} />
            <p className="text-gray-500 text-lg font-semibold">No users found</p>
            <p className="text-gray-400 text-sm">Add your first user to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map(user => (
              <UserCard
                key={user._id}
                user={user}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        {/* Stats Footer */}
        <div className="mt-8 bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Users</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                {users.length}
              </p>
            </div>
            {searchTerm && (
              <div>
                <p className="text-gray-600 text-sm">Search Results</p>
                <p className="text-3xl font-bold text-blue-600">{filteredUsers.length}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-in {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style> */}
    </div>
  );
}
