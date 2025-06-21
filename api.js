// Frontend API client for camera landing page
class CameraAPI {
    constructor(baseURL = '') {
        this.baseURL = baseURL;
        this.token = localStorage.getItem('admin_token');
    }

    // Set authentication token
    setToken(token) {
        this.token = token;
        localStorage.setItem('admin_token', token);
    }

    // Remove authentication token
    removeToken() {
        this.token = null;
        localStorage.removeItem('admin_token');
    }

    // Make HTTP request
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}/api${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        if (this.token) {
            config.headers.Authorization = `Bearer ${this.token}`;
        }

        if (config.body && typeof config.body === 'object') {
            config.body = JSON.stringify(config.body);
        }

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || `HTTP error! status: ${response.status}`);
            }

            return data;
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    // Admin authentication
    async adminLogin(username, password) {
        const data = await this.request('/admin/login', {
            method: 'POST',
            body: { username, password }
        });
        
        if (data.token) {
            this.setToken(data.token);
        }
        
        return data;
    }

    // Admin logout
    adminLogout() {
        this.removeToken();
    }

    // Create new order
    async createOrder(orderData) {
        return await this.request('/orders', {
            method: 'POST',
            body: orderData
        });
    }

    // Get all orders (admin only)
    async getOrders(filters = {}) {
        const params = new URLSearchParams();
        
        Object.keys(filters).forEach(key => {
            if (filters[key]) {
                params.append(key, filters[key]);
            }
        });

        const queryString = params.toString();
        const endpoint = queryString ? `/orders?${queryString}` : '/orders';
        
        return await this.request(endpoint);
    }

    // Get order by ID (admin only)
    async getOrder(id) {
        return await this.request(`/orders/${id}`);
    }

    // Update order status (admin only)
    async updateOrderStatus(id, status) {
        return await this.request(`/orders/${id}`, {
            method: 'PUT',
            body: { status }
        });
    }

    // Delete order (admin only)
    async deleteOrder(id) {
        return await this.request(`/orders/${id}`, {
            method: 'DELETE'
        });
    }

    // Get dashboard statistics (admin only)
    async getDashboardStats() {
        return await this.request('/dashboard/stats');
    }

    // Check if user is authenticated
    isAuthenticated() {
        return !!this.token;
    }

    // Validate order data on frontend
    validateOrder(orderData) {
        const errors = [];
        
        if (!orderData.name || orderData.name.trim().length < 2) {
            errors.push('الاسم مطلوب ويجب أن يكون أكثر من حرفين');
        }
        
        if (!orderData.phone || !/^[0-9]{10}$/.test(orderData.phone)) {
            errors.push('رقم الهاتف يجب أن يكون 10 أرقام');
        }
        
        if (!orderData.city || orderData.city.trim().length < 2) {
            errors.push('المدينة مطلوبة');
        }
        
        if (!orderData.cameraType || !['999', '1149'].includes(orderData.cameraType)) {
            errors.push('نوع الكاميرا غير صحيح');
        }
        
        return errors;
    }

    // Format date for display
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('ar-MA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // Get status text in Arabic
    getStatusText(status) {
        const statusMap = {
            'new': 'جديد',
            'processing': 'قيد المعالجة',
            'shipped': 'تم الشحن',
            'delivered': 'تم التوصيل',
            'cancelled': 'ملغي'
        };
        return statusMap[status] || status;
    }

    // Get product name in Arabic
    getProductName(cameraType) {
        return cameraType === '1149' ? 'الكاميرة المتطورة' : 'الكاميرة العادية';
    }

    // Get product description
    getProductDescription(cameraType) {
        return cameraType === '1149' 
            ? '3 عدسات و2 ألواح شمسية + كارت ميموار هدية'
            : '3 عدسات ولوح شمسي واحد';
    }

    // Format price
    formatPrice(price) {
        return `${price} درهم`;
    }
}

// Create global API instance
const api = new CameraAPI();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CameraAPI;
}