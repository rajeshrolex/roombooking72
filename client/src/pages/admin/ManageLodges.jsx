import React, { useState, useEffect } from 'react';
import { lodgeAPI } from '../../services/api';
import { MapPin, Star, Edit, Trash2, Plus, Loader2 } from 'lucide-react';
import LodgeForm from '../../components/admin/LodgeForm';

const ManageLodges = () => {
    const [lodges, setLodges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingLodge, setEditingLodge] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchLodges();
    }, []);

    const fetchLodges = async () => {
        try {
            setLoading(true);
            const data = await lodgeAPI.getAll();
            setLodges(data);
        } catch (error) {
            console.error('Error fetching lodges:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this lodge?')) {
            try {
                await lodgeAPI.delete(id);
                setLodges(lodges.filter(l => l._id !== id));
            } catch (error) {
                console.error('Error deleting lodge:', error);
                alert('Failed to delete lodge. Please try again.');
            }
        }
    };

    const handleAddNew = () => {
        setEditingLodge(null);
        setShowForm(true);
    };

    const handleEdit = (lodge) => {
        setEditingLodge(lodge);
        setShowForm(true);
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setEditingLodge(null);
    };

    const handleSave = async (lodgeData) => {
        setIsSubmitting(true);
        try {
            console.log('Saving lodge data:', lodgeData);
            if (editingLodge) {
                // Update existing lodge
                const updated = await lodgeAPI.update(editingLodge._id, lodgeData);
                setLodges(lodges.map(l => l._id === editingLodge._id ? updated : l));
            } else {
                // Create new lodge
                const created = await lodgeAPI.create(lodgeData);
                setLodges([...lodges, created]);
            }
            handleCloseForm();
        } catch (error) {
            console.error('Error saving lodge:', error);
            console.error('Error details:', error.response?.data || error.message);
            alert(`Failed to save lodge: ${error.response?.data?.message || error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Filter lodges based on search
    const filteredLodges = lodges.filter(lodge =>
        lodge.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lodge.address?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Manage Lodges</h2>
                    <p className="text-gray-500">View and manage all partner lodges.</p>
                </div>
                <button
                    onClick={handleAddNew}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    <Plus size={18} />
                    Add New Lodge
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b">
                    <input
                        type="text"
                        placeholder="Search lodges..."
                        className="w-full md:w-64 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-600 font-medium text-sm">
                            <tr>
                                <th className="px-6 py-4">Lodge Name</th>
                                <th className="px-6 py-4">Location</th>
                                <th className="px-6 py-4">Rating</th>
                                <th className="px-6 py-4">Rooms</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredLodges.length > 0 ? (
                                filteredLodges.map((lodge) => (
                                    <tr key={lodge._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-gray-900">{lodge.name}</div>
                                            <div className="text-xs text-gray-400">Slug: {lodge.slug}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1 text-gray-500">
                                                <MapPin size={14} />
                                                <span className="text-sm truncate max-w-[150px]">{lodge.address}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1 text-orange-400 font-medium">
                                                <Star size={14} fill="currentColor" />
                                                {lodge.rating || 'N/A'}
                                            </div>
                                            <div className="text-xs text-gray-400">({lodge.reviewCount || 0} reviews)</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {lodge.rooms?.length || 0} room types
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${lodge.availability === 'available' ? 'bg-green-100 text-green-700' :
                                                lodge.availability === 'limited' ? 'bg-orange-100 text-orange-700' :
                                                    'bg-red-100 text-red-700'
                                                }`}>
                                                {lodge.availability === 'available' ? 'Active' : lodge.availability}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleEdit(lodge)}
                                                    className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg"
                                                    title="Edit"
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                <button
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                                    title="Delete"
                                                    onClick={() => handleDelete(lodge._id)}
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                        {searchTerm ? 'No lodges found matching your search.' : 'No lodges available. Click "Add New Lodge" to create one.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Lodge Form Modal */}
            {showForm && (
                <LodgeForm
                    lodge={editingLodge}
                    onSave={handleSave}
                    onClose={handleCloseForm}
                    isSubmitting={isSubmitting}
                />
            )}
        </div>
    );
};

export default ManageLodges;

