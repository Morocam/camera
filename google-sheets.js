// Google Sheets API integration for camera orders
class GoogleSheetsAPI {
    constructor() {
        this.apiKey = 'AIzaSyA_4o6Xrbnty-DmEsTyGFGUNJxJIxQyv9Q';
        this.spreadsheetId = '1BQXew0u2s2hs-FuBdWr7HbBkT7_MmhMekluGB7wUxaA'; // You need to create this
        this.range = 'Orders!A:H'; // Sheet name and range
    }

    // Submit order to Google Sheets
    async submitOrder(orderData) {
        const values = [[
            new Date().toISOString(),
            orderData.name,
            orderData.phone,
            orderData.city,
            orderData.cameraType === '1149' ? 'الكاميرة المتطورة' : 'الكاميرة العادية',
            orderData.cameraType === '1149' ? 1149 : 999,
            'new',
            `https://wa.me/212664345640?text=مرحبا، طلب جديد من ${orderData.name} - ${orderData.phone}`
        ]];

        const body = {
            values: values
        };

        try {
            const response = await fetch(
                `https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetId}/values/${this.range}:append?valueInputOption=RAW&key=${this.apiKey}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(body)
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            return { success: true, data: result };
        } catch (error) {
            console.error('Error submitting to Google Sheets:', error);
            throw error;
        }
    }

    // Get orders from Google Sheets (for admin panel)
    async getOrders() {
        try {
            const response = await fetch(
                `https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetId}/values/${this.range}?key=${this.apiKey}`
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            const rows = result.values || [];
            
            // Skip header row and convert to order objects
            const orders = rows.slice(1).map((row, index) => ({
                id: index + 1,
                created_at: row[0] || '',
                name: row[1] || '',
                phone: row[2] || '',
                city: row[3] || '',
                camera_type: row[4] === 'الكاميرة المتطورة' ? '1149' : '999',
                price: parseInt(row[5]) || 999,
                status: row[6] || 'new',
                whatsapp_link: row[7] || ''
            }));

            return orders.reverse(); // Show newest first
        } catch (error) {
            console.error('Error fetching from Google Sheets:', error);
            throw error;
        }
    }
}

// Create global instance
const googleSheets = new GoogleSheetsAPI();