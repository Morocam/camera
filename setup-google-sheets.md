# Google Sheets Setup Instructions

## Step 1: Create Google Sheet
1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it "Camera Orders"
4. In the first sheet, rename it to "Orders"

## Step 2: Set Up Headers
Add these headers in row 1:
- A1: التاريخ (Date)
- B1: الاسم (Name)  
- C1: رقم الهاتف (Phone)
- D1: المدينة (City)
- E1: المنتج (Product)
- F1: السعر (Price)
- G1: الحالة (Status)
- H1: واتساب (WhatsApp Link)

## Step 3: Get Spreadsheet ID
1. Copy the spreadsheet URL
2. Extract the ID from the URL (between `/d/` and `/edit`)
3. Replace the spreadsheet ID in `google-sheets.js`:
   ```javascript
   this.spreadsheetId = 'YOUR_SPREADSHEET_ID_HERE';
   ```

## Step 4: Enable Google Sheets API
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable Google Sheets API
4. Create API credentials (API Key)
5. Restrict the API key to Google Sheets API only

## Step 5: Make Sheet Public (Read Access)
1. Click "Share" button in your Google Sheet
2. Change access to "Anyone with the link can view"
3. This allows the API to read the data

## Current Configuration
- **API Key**: AIzaSyA_4o6Xrbnty-DmEsTyGFGUNJxJIxQyv9Q
- **Spreadsheet ID**: Update in google-sheets.js file
- **Sheet Name**: Orders
- **Range**: A:H (columns A through H)

## Testing
1. Submit a test order on the website
2. Check if it appears in your Google Sheet
3. Check browser console for any errors

## Troubleshooting
- If orders don't appear, check the spreadsheet ID
- Ensure the sheet is named "Orders" exactly
- Verify API key permissions in Google Cloud Console
- Check browser console for error messages