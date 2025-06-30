// Direct Google Sheets form handler
class SecureFormHandler {
    constructor() {
        this.serverEndpoint = 'https://script.google.com/macros/s/AKfycbyhL9Ah6OXiMPOaPQkZmYd9kB017vYFdwzGMAruhA99eLNeQKlSHHoKBalah3DKCbJr/exec';
        console.log('FormHandler initialized with endpoint:', this.serverEndpoint);
    }

    async submitOrder(formData) {
        console.log('SecureFormHandler: Starting submission to:', this.serverEndpoint);
        console.log('SecureFormHandler: Form data received:', formData);
        
        try {
            const payload = {
                name: formData.name,
                phone: formData.phone,
                city: formData.city,
                product: formData.cameraType === '1149' ? 'الكاميرة المتطورة' : 'الكاميرة العادية',
                price: formData.cameraType === '1149' ? 1149 : 999,
                timestamp: new Date().toISOString()
            };
            
            console.log('SecureFormHandler: Sending payload:', payload);
            
            // Submit to secure server endpoint
            const response = await fetch(this.serverEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });
            
            console.log('SecureFormHandler: Response status:', response.status);
            console.log('SecureFormHandler: Response ok:', response.ok);

            if (response.ok) {
                const result = await response.text();
                console.log('SecureFormHandler: Success response:', result);
                return { success: true };
            } else {
                const errorText = await response.text();
                console.error('SecureFormHandler: Server error response:', errorText);
                throw new Error('Server error: ' + response.status);
            }
        } catch (error) {
            console.error('SecureFormHandler: Error occurred:', error);
            alert('Error submitting to Google Sheets: ' + error.message);
            
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
            
            alert('Saved to localStorage as fallback');
            return { success: true, fallback: true };
        }
    }
}

const secureForm = new SecureFormHandler();