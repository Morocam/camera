// Secure order submission without exposed API keys
class OrderSubmission {
    constructor() {
        // No API keys exposed - using localStorage only
    }

    // Submit order securely
    async submitOrder(orderData) {
        // Save to localStorage
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        const orderId = Date.now();
        
        const newOrder = {
            id: orderId,
            name: orderData.name,
            phone: orderData.phone,
            city: orderData.city,
            camera_type: orderData.cameraType,
            price: orderData.cameraType === '1149' ? 1149 : 999,
            status: 'new',
            created_at: new Date().toISOString()
        };
        
        orders.unshift(newOrder);
        localStorage.setItem('orders', JSON.stringify(orders));
        
        // Notify admin panel if open
        try {
            if (window.opener) {
                window.opener.postMessage({
                    type: 'newOrder',
                    order: newOrder
                }, '*');
            }
        } catch (err) {
            console.log('Admin panel not open');
        }
        
        return { success: true, orderId: orderId };
    }

    // Get orders from localStorage
    async getOrders() {
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        return orders;
    }
}

// Create global instance
const orderSystem = new OrderSubmission();