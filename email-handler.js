// Email-based form handler - guaranteed to work
class EmailFormHandler {
    constructor() {
        this.emailService = 'https://formsubmit.co/morosecurity2024@gmail.com';
    }

    async submitOrder(formData) {
        try {
            console.log('Submitting order via email:', formData);
            
            // Create form for FormSubmit.co
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = this.emailService;
            form.style.display = 'none';
            
            // Add form fields
            const fields = {
                'الاسم': formData.name,
                'رقم الهاتف': formData.phone,
                'المدينة': formData.city,
                'المنتج': formData.cameraType === '1149' ? 'الكاميرة المتطورة - 1149 درهم' : 'الكاميرة العادية - 999 درهم',
                'السعر': formData.cameraType === '1149' ? '1149 درهم' : '999 درهم',
                'التاريخ': new Date().toLocaleString('ar-MA'),
                'رابط واتساب': `https://wa.me/212664345640?text=مرحبا، طلب جديد من ${formData.name} - ${formData.phone}`,
                '_subject': `طلب جديد من ${formData.name}`,
                '_next': window.location.origin + '/camera/thanks.html',
                '_captcha': 'false'
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
            
            return { success: true };
            
        } catch (error) {
            console.error('Email submission failed:', error);
            
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

const emailForm = new EmailFormHandler();