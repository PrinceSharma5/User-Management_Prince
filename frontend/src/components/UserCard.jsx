import { Edit2, Trash2 } from 'lucide-react';
const UserCard = ({ user, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition border border-gray-100 transform hover:scale-105">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center text-white font-bold text-lg">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-800">{user.name}</h3>
            <p className="text-sm text-gray-500">Age: {user.age}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(user)}
            className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => onDelete(user._id)}
            className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <span className="font-medium">📧</span>
        <span>{user.email}</span>
      </div>
    </div>
  );
};
export default UserCard;