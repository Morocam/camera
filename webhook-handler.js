// Webhook-based form handler using multiple services
class WebhookFormHandler {
    constructor() {
        // Multiple webhook services for reliability
        this.webhooks = [
            'https://hook.eu1.make.com/YOUR_WEBHOOK_ID', // Make.com
            'https://hooks.zapier.com/hooks/catch/YOUR_WEBHOOK_ID', // Zapier
            'https://formspree.io/f/YOUR_FORM_ID' // Formspree
        ];
    }

    async submitOrder(formData) {
        const orderData = {
            name: formData.name,
            phone: formData.phone,
            city: formData.city,
            product: formData.cameraType === '1149' ? 'الكاميرة المتطورة' : 'الكاميرة العادية',
            price: formData.cameraType === '1149' ? 1149 : 999,
            timestamp: new Date().toISOString(),
            whatsapp: `https://wa.me/212664345640?text=طلب جديد من ${formData.name}`
        };

        // Try each webhook service
        for (const webhook of this.webhooks) {
            try {
                const response = await fetch(webhook, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(orderData)
                });
                
                if (response.ok) {
                    console.log('Order submitted successfully via webhook');
                    return { success: true };
                }
            } catch (error) {
                console.log('Webhook failed, trying next...');
                continue;
            }
        }

        // All webhooks failed, save to localStorage
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        orders.unshift({
            id: Date.now(),
            ...orderData,
            status: 'new'
        });
        localStorage.setItem('orders', JSON.stringify(orders));
        
        return { success: true, fallback: true };
    }
}

const webhookForm = new WebhookFormHandler();