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
            // Create a hidden form to bypass CORS
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = this.serverEndpoint;
            form.style.display = 'none';
            
            // Add form fields
            const fields = {
                name: formData.name,
                phone: formData.phone,
                city: formData.city,
                product: formData.cameraType === '1149' ? 'الكاميرة المتطورة' : 'الكاميرة العادية',
                price: formData.cameraType === '1149' ? 1149 : 999,
                timestamp: new Date().toISOString()
            };
            
            Object.keys(fields).forEach(key => {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = key;
                input.value = fields[key];
                form.appendChild(input);
            });
            
            // Submit form
            document.body.appendChild(form);
            form.submit();
            
            // Clean up
            setTimeout(() => {
                document.body.removeChild(form);
            }, 1000);
            
            return { success: true };
        } catch (error) {
            console.error('SecureFormHandler: Error occurred:', error);
            
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