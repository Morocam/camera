function doPost(e) {
  try {
    // Log the incoming request for debugging
    console.log('Received POST request');
    console.log('Parameters:', e.parameter);
    
    // Your Google Sheet ID
    const SHEET_ID = '1y0Lf12GqjuhaLbI9n0JCi3C1u1LK036IV1XyZpTKoVg';
    
    // Get the data from form submission
    const data = e.parameter;
    
    // Open the spreadsheet
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    const sheet = spreadsheet.getSheets()[0]; // Get first sheet
    
    console.log('Sheet name:', sheet.getName());
    console.log('Current rows:', sheet.getLastRow());
    
    // Add headers if this is the first row
    if (sheet.getLastRow() === 0) {
      const headers = ['التاريخ', 'الاسم', 'رقم الهاتف', 'المدينة', 'المنتج', 'السعر', 'الحالة', 'واتساب'];
      sheet.appendRow(headers);
      console.log('Headers added');
    }
    
    // Prepare the row data
    const rowData = [
      data.timestamp || new Date().toISOString(),
      data.name || 'No Name',
      data.phone || 'No Phone',
      data.city || 'No City',
      data.product || 'No Product',
      data.price || '0',
      'new',
      `https://wa.me/212664345640?text=طلب جديد من ${data.name || 'عميل'}`
    ];
    
    console.log('Adding row:', rowData);
    
    // Add the data to the sheet
    sheet.appendRow(rowData);
    
    console.log('Row added successfully');
    console.log('New row count:', sheet.getLastRow());
    
    // Return success page
    return HtmlService.createHtmlOutput(`
      <html>
        <body>
          <h2>Success!</h2>
          <p>Data added to sheet successfully!</p>
          <p>Row added: ${JSON.stringify(rowData)}</p>
          <script>
            setTimeout(function() {
              window.close();
            }, 3000);
          </script>
        </body>
      </html>
    `);
      
  } catch (error) {
    console.error('Error:', error);
    
    // Return error page
    return HtmlService.createHtmlOutput(`
      <html>
        <body>
          <h2>Error!</h2>
          <p>Error: ${error.toString()}</p>
          <script>
            setTimeout(function() {
              window.close();
            }, 5000);
          </script>
        </body>
      </html>
    `);
  }
}

function doGet(e) {
  return HtmlService.createHtmlOutput(`
    <html>
      <body>
        <h2>Camera Orders API</h2>
        <p>API is working!</p>
        <p>Sheet ID: 1y0Lf12GqjuhaLbI9n0JCi3C1u1LK036IV1XyZpTKoVg</p>
      </body>
    </html>
  `);
}