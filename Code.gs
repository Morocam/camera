function doPost(e) {
  try {
    console.log('Received POST request');
    console.log('Full event object:', JSON.stringify(e));
    
    // Your Google Sheet ID
    const SHEET_ID = '1y0Lf12GqjuhaLbI9n0JCi3C1u1LK036IV1XyZpTKoVg';
    
    let data = {};
    
    // Handle different types of POST data
    if (e.parameter) {
      // Form data
      data = e.parameter;
      console.log('Using form parameter data:', data);
    } else if (e.postData && e.postData.contents) {
      // JSON data
      data = JSON.parse(e.postData.contents);
      console.log('Using JSON data:', data);
    } else {
      throw new Error('No data received');
    }
    
    // Open the spreadsheet
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    const sheet = spreadsheet.getSheets()[0];
    
    console.log('Sheet name:', sheet.getName());
    
    // Add headers if empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['التاريخ', 'الاسم', 'رقم الهاتف', 'المدينة', 'المنتج', 'السعر', 'الحالة', 'واتساب']);
    }
    
    // Prepare row data
    const rowData = [
      new Date().toISOString(),
      data.name || 'Test Name',
      data.phone || '0600000000',
      data.city || 'Test City',
      data.product || 'Test Product',
      data.price || '999',
      'new',
      `https://wa.me/212664345640?text=طلب جديد`
    ];
    
    console.log('Adding row:', rowData);
    sheet.appendRow(rowData);
    console.log('Success! Row added');
    
    return HtmlService.createHtmlOutput('Success! Data added to sheet.');
      
  } catch (error) {
    console.error('Error:', error.toString());
    return HtmlService.createHtmlOutput('Error: ' + error.toString());
  }
}

function doGet(e) {
  return HtmlService.createHtmlOutput('API Working - Sheet ID: 1y0Lf12GqjuhaLbI9n0JCi3C1u1LK036IV1XyZpTKoVg');
}

function testFunction() {
  // Test function to add a row manually
  try {
    const SHEET_ID = '1y0Lf12GqjuhaLbI9n0JCi3C1u1LK036IV1XyZpTKoVg';
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    const sheet = spreadsheet.getSheets()[0];
    
    sheet.appendRow([
      new Date().toISOString(),
      'Test User',
      '0612345678',
      'Rabat',
      'Test Camera',
      '999',
      'new',
      'https://wa.me/212664345640'
    ]);
    
    console.log('Test row added successfully');
    return 'Success';
  } catch (error) {
    console.error('Test failed:', error);
    return 'Error: ' + error.toString();
  }
}