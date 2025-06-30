// Secure form handler that submits to Google Sheets via server
class SecureFormHandler {
    constructor() {
        // Using a secure server endpoint (you'll need to set this up)
        this.serverEndpoint = 'https://script.google.com/macros/s/AKfycbyhL9Ah6OXiMPOaPQkZmYd9kB017vYFdwzGMAruhA99eLNeQKlSHHoKBalah3DKCbJr/exec';
    }

    async submitOrder(formData) {
        try {
            // Submit to secure server endpoint
            const response = await fetch(this.serverEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    phone: formData.phone,
                    city: formData.city,
                    product: formData.cameraType === '1149' ? 'الكاميرة المتطورة' : 'الكاميرة العادية',
                    price: formData.cameraType === '1149' ? 1149 : 999,
                    timestamp: new Date().toISOString()
                })
            });

            if (response.ok) {
                return { success: true };
            } else {
                throw new Error('Server error');
            }
        } catch (error) {
            // Fallback to localStorage
            const orders = JSON.parse(localStorage.getItem('orders') || '[]');
            const newOrder = {
                id: Date.now(),
                name: formData.name,
                phone: formData.phone,
                city: formData.city,
                camera_type: formData.cameraType,
                price: formData.cameraType === '1149' ? 1149 : 999,
                status: 'new',
                created_at: new Date().toISOString()
            };
            
            orders.unshift(newOrder);
            localStorage.setItem('orders', JSON.stringify(orders));
            
            return { success: true, fallback: true };
        }
    }
}

const secureForm = new SecureFormHandler();