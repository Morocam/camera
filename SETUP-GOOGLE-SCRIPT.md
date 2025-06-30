# Google Apps Script Setup Instructions

## Step 1: Create Google Apps Script
1. Go to [script.google.com](https://script.google.com)
2. Click **"New project"**
3. Delete the default code
4. Copy and paste the code from `Code.gs`
5. Save the project (name it "Camera Orders API")

## Step 2: Deploy as Web App
1. Click **"Deploy"** → **"New deployment"**
2. Choose type: **"Web app"**
3. Description: "Camera Orders Submission"
4. Execute as: **"Me"**
5. Who has access: **"Anyone"**
6. Click **"Deploy"**
7. **Copy the Web App URL** (looks like: https://script.google.com/macros/s/XXXXX/exec)

## Step 3: Update Your Website
1. Open `form-handler.js`
2. Replace `YOUR_SCRIPT_ID` with your Web App URL:
   ```javascript
   this.serverEndpoint = 'https://script.google.com/macros/s/YOUR_ACTUAL_URL/exec';
   ```

## Step 4: Set Up Your Google Sheet
Make sure your Google Sheet has these headers in row 1:
- A1: التاريخ (Date)
- B1: الاسم (Name)
- C1: رقم الهاتف (Phone)
- D1: المدينة (City)
- E1: المنتج (Product)
- F1: السعر (Price)
- G1: الحالة (Status)
- H1: واتساب (WhatsApp)

## Step 5: Test
1. Submit a test order on your website
2. Check if it appears in your Google Sheet
3. Orders should now go directly to your sheet securely!

## Security Benefits
✅ Sheet ID stays private on server
✅ No API keys exposed in public code
✅ Secure server-side processing
✅ Direct integration with Google Sheets