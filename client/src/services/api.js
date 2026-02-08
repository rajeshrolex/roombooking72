export const BASE_URL = 'https://mintcream-pigeon-160210.hostingersite.com';
export const API_BASE_URL = `${BASE_URL}/api`;

// Lodge API
export const lodgeAPI = {
    getAll: async () => {
        const response = await fetch(`${API_BASE_URL}/lodges`);
        return response.json();
    },

    getBySlug: async (slug) => {
        const response = await fetch(`${API_BASE_URL}/lodges/${slug}`);
        return response.json();
    },

    create: async (lodgeData) => {
        const response = await fetch(`${API_BASE_URL}/lodges`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(lodgeData)
        });
        return response.json();
    },

    update: async (id, lodgeData) => {
        const response = await fetch(`${API_BASE_URL}/lodges/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(lodgeData)
        });
        return response.json();
    },

    delete: async (id) => {
        const response = await fetch(`${API_BASE_URL}/lodges/${id}`, {
            method: 'DELETE'
        });
        return response.json();
    }
};

// Booking API
export const bookingAPI = {
    getAll: async (filters = {}) => {
        const params = new URLSearchParams(filters);
        const response = await fetch(`${API_BASE_URL}/bookings?${params}`);
        return response.json();
    },

    getById: async (bookingId) => {
        const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}`);
        return response.json();
    },

    create: async (bookingData) => {
        const response = await fetch(`${API_BASE_URL}/bookings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookingData)
        });
        return response.json();
    },

    updateStatus: async (bookingId, status) => {
        const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });
        return response.json();
    },

    updatePaymentStatus: async (bookingId, paymentData) => {
        const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}/payment`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(paymentData)
        });
        return response.json();
    }
};

// Dashboard API
export const dashboardAPI = {
    getStats: async (lodgeId = null) => {
        const params = lodgeId ? `?lodgeId=${lodgeId}` : '';
        const response = await fetch(`${API_BASE_URL}/dashboard/stats${params}`);
        return response.json();
    }
};

// Auth API
export const authAPI = {
    login: async (email, password) => {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        return response.json();
    }
};

// User API
export const userAPI = {
    getProfile: async (userId) => {
        const response = await fetch(`${API_BASE_URL}/users/profile/${userId}`);
        return response.json();
    },

    updateProfile: async (userId, profileData) => {
        const response = await fetch(`${API_BASE_URL}/users/profile/${userId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(profileData)
        });
        return response.json();
    },

    updatePassword: async (userId, passwordData) => {
        const response = await fetch(`${API_BASE_URL}/users/password/${userId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(passwordData)
        });
        return response.json();
    }
};

// Payment API (Razorpay)
export const paymentAPI = {
    createOrder: async (bookingData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/payment/create-order`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bookingData)
            });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Server error: ${response.status}`);
            }
            return response.json();
        } catch (error) {
            console.error('Payment create order error:', error);
            throw error;
        }
    },

    verifyPayment: async (paymentData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/payment/verify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(paymentData)
            });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Server error: ${response.status}`);
            }
            return response.json();
        } catch (error) {
            console.error('Payment verification error:', error);
            throw error;
        }
    }
};

// Upload API
export const uploadAPI = {
    uploadImage: async (file) => {
        const formData = new FormData();
        formData.append('image', file);

        const response = await fetch(`${API_BASE_URL}/upload`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Failed to upload image');
        }

        return response.json();
    }
};

export default { lodgeAPI, bookingAPI, dashboardAPI, authAPI, userAPI, paymentAPI, uploadAPI };
