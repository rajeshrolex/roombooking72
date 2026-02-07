import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { userAPI } from '../../services/api';
import { Save, User, Lock, Bell, Globe, Loader2 } from 'lucide-react';

const Settings = () => {
    const { user, updateUser } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ text: '', type: '' });

    const [profileData, setProfileData] = useState({
        name: '',
        email: '',
        phone: ''
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [notificationSettings, setNotificationSettings] = useState({
        emailBookings: true,
        emailUpdates: false,
        smsBookings: true
    });

    // Fetch user profile on mount
    useEffect(() => {
        const fetchProfile = async () => {
            if (user?._id) {
                try {
                    const response = await userAPI.getProfile(user._id);
                    if (response.success && response.user) {
                        setProfileData({
                            name: response.user.name || '',
                            email: response.user.email || '',
                            phone: response.user.phone || ''
                        });
                    }
                } catch (error) {
                    console.error('Error fetching profile:', error);
                }
            }
            setLoading(false);
        };
        fetchProfile();
    }, [user?._id]);

    const showMessage = (text, type) => {
        setMessage({ text, type });
        setTimeout(() => setMessage({ text: '', type: '' }), 4000);
    };

    const handleProfileSave = async (e) => {
        e.preventDefault();
        if (!user?._id) return;

        setSaving(true);
        try {
            const response = await userAPI.updateProfile(user._id, profileData);
            if (response.success) {
                showMessage('Profile updated successfully!', 'success');
                // Update the user in AuthContext
                if (updateUser && response.user) {
                    updateUser(response.user);
                }
            } else {
                showMessage(response.message || 'Failed to update profile', 'error');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            showMessage('Error updating profile. Please try again.', 'error');
        } finally {
            setSaving(false);
        }
    };

    const handlePasswordSave = async (e) => {
        e.preventDefault();
        if (!user?._id) return;

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            showMessage('New passwords do not match!', 'error');
            return;
        }

        if (passwordData.newPassword.length < 6) {
            showMessage('Password must be at least 6 characters', 'error');
            return;
        }

        setSaving(true);
        try {
            const response = await userAPI.updatePassword(user._id, {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            if (response.success) {
                showMessage('Password updated successfully!', 'success');
                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            } else {
                showMessage(response.message || 'Failed to update password', 'error');
            }
        } catch (error) {
            console.error('Error updating password:', error);
            showMessage('Error updating password. Please try again.', 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleNotificationSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        // For now, just show success - notification settings can be expanded later
        await new Promise(resolve => setTimeout(resolve, 500));
        showMessage('Notification preferences saved!', 'success');
        setSaving(false);
    };

    const tabs = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'password', label: 'Password', icon: Lock },
        { id: 'notifications', label: 'Notifications', icon: Bell }
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
                <p className="text-gray-500">Manage your account settings and preferences.</p>
            </div>

            {message.text && (
                <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                    {message.text}
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                {/* Tabs */}
                <div className="flex border-b">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors ${activeTab === tab.id
                                    ? 'text-indigo-600 border-b-2 border-indigo-600'
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <tab.icon size={18} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="p-6">
                    {/* Profile Tab */}
                    {activeTab === 'profile' && (
                        <form onSubmit={handleProfileSave} className="space-y-6 max-w-lg">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                <input
                                    type="text"
                                    value={profileData.name}
                                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                    required
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                <input
                                    type="email"
                                    value={profileData.email}
                                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                    required
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                <input
                                    type="tel"
                                    value={profileData.phone}
                                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                    placeholder="+91 XXXXX XXXXX"
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                />
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
                                <Globe size={16} />
                                <span>Role: <strong>{user?.role === 'super_admin' ? 'Super Admin' : 'Lodge Admin'}</strong></span>
                            </div>
                            <button
                                type="submit"
                                disabled={saving}
                                className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                            >
                                {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                Save Changes
                            </button>
                        </form>
                    )}

                    {/* Password Tab */}
                    {activeTab === 'password' && (
                        <form onSubmit={handlePasswordSave} className="space-y-6 max-w-lg">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                                <input
                                    type="password"
                                    value={passwordData.currentPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                    required
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                                <input
                                    type="password"
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                    required
                                    minLength={6}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                />
                                <p className="text-xs text-gray-400 mt-1">Minimum 6 characters</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                                <input
                                    type="password"
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                    required
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={saving}
                                className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                            >
                                {saving ? <Loader2 size={18} className="animate-spin" /> : <Lock size={18} />}
                                Update Password
                            </button>
                        </form>
                    )}

                    {/* Notifications Tab */}
                    {activeTab === 'notifications' && (
                        <form onSubmit={handleNotificationSave} className="space-y-6 max-w-lg">
                            <div className="space-y-4">
                                <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer">
                                    <div>
                                        <p className="font-medium text-gray-700">Email - New Bookings</p>
                                        <p className="text-sm text-gray-500">Receive email notifications for new bookings</p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={notificationSettings.emailBookings}
                                        onChange={(e) => setNotificationSettings({ ...notificationSettings, emailBookings: e.target.checked })}
                                        className="w-5 h-5 text-indigo-600 rounded"
                                    />
                                </label>
                                <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer">
                                    <div>
                                        <p className="font-medium text-gray-700">Email - System Updates</p>
                                        <p className="text-sm text-gray-500">Receive email about system updates and features</p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={notificationSettings.emailUpdates}
                                        onChange={(e) => setNotificationSettings({ ...notificationSettings, emailUpdates: e.target.checked })}
                                        className="w-5 h-5 text-indigo-600 rounded"
                                    />
                                </label>
                                <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer">
                                    <div>
                                        <p className="font-medium text-gray-700">SMS - New Bookings</p>
                                        <p className="text-sm text-gray-500">Receive SMS alerts for new bookings</p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={notificationSettings.smsBookings}
                                        onChange={(e) => setNotificationSettings({ ...notificationSettings, smsBookings: e.target.checked })}
                                        className="w-5 h-5 text-indigo-600 rounded"
                                    />
                                </label>
                            </div>
                            <button
                                type="submit"
                                disabled={saving}
                                className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                            >
                                {saving ? <Loader2 size={18} className="animate-spin" /> : <Bell size={18} />}
                                Save Preferences
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Settings;
