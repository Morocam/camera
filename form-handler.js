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
            // Create iframe to submit form without page redirect
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.name = 'hidden_iframe';
            document.body.appendChild(iframe);
            
            // Create form that targets the iframe
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = this.serverEndpoint;
            form.target = 'hidden_iframe';
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
            
            console.log('Submitting to Google Apps Script:', fields);
            
            Object.keys(fields).forEach(key => {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = key;
                input.value = fields[key];
                form.appendChild(input);
            });
            
            // Submit form to iframe
            document.body.appendChild(form);
            form.submit();
            
            // Clean up after 2 seconds
            setTimeout(() => {
                if (document.body.contains(form)) document.body.removeChild(form);
                if (document.body.contains(iframe)) document.body.removeChild(iframe);
            }, 2000);
            
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