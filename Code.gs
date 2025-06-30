function doPost(e) {
  try {
    const SHEET_ID = '1y0Lf12GqjuhaLbI9n0JCi3C1u1LK036IV1XyZpTKoVg';
    
    let data = {};
    
    // Handle form data
    if (e && e.parameter) {
      data = e.parameter;
    } else if (e && e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else {
      // Default test data if no parameters
      data = {
        name: 'Test User',
        phone: '0612345678',
        city: 'Test City',
        product: 'Test Product',
        price: '999'
      };
    }
    
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    const sheet = spreadsheet.getSheets()[0];
    
    // Add headers if empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['التاريخ', 'الاسم', 'رقم الهاتف', 'المدينة', 'المنتج', 'السعر', 'الحالة', 'واتساب']);
    }
    
    // Add the order data
    sheet.appendRow([
      new Date().toISOString(),
      data.name || 'No Name',
      data.phone || 'No Phone', 
      data.city || 'No City',
      data.product || 'No Product',
      data.price || '0',
      'new',
      `https://wa.me/212664345640?text=طلب جديد من ${data.name}`
    ]);
    
    return HtmlService.createHtmlOutput('Order submitted successfully!');
    
  } catch (error) {
    return HtmlService.createHtmlOutput('Error: ' + error.toString());
  }
}

function doGet(e) {
  return HtmlService.createHtmlOutput('Camera Orders API is working');
}