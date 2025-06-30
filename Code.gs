function doPost(e) {
  try {
    // Your Google Sheet ID
    const SHEET_ID = '1y0Lf12GqjuhaLbI9n0JCi3C1u1LK036IV1XyZpTKoVg';
    
    // Parse the incoming data (from form submission)
    const data = e.parameter; // Use e.parameter for form data, not JSON
    
    // Open the spreadsheet and get the first sheet
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    const sheet = spreadsheet.getSheets()[0];
    
    // Add headers if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['التاريخ', 'الاسم', 'رقم الهاتف', 'المدينة', 'المنتج', 'السعر', 'الحالة', 'واتساب']);
    }
    
    // Prepare the row data
    const rowData = [
      data.timestamp || new Date().toISOString(),
      data.name || '',
      data.phone || '',
      data.city || '',
      data.product || '',
      data.price || 0,
      'new',
      `https://wa.me/212664345640?text=مرحبا، طلب جديد من ${data.name} - ${data.phone}`
    ];
    
    // Add the data to the sheet
    sheet.appendRow(rowData);
    
    // Return success response (redirect back to thank you page)
    return HtmlService.createHtmlOutput('<script>window.close();</script>');
      
  } catch (error) {
    // Return error response
    return HtmlService.createHtmlOutput('<script>alert("Error: ' + error.toString() + '"); window.close();</script>');
  }
}

function doGet(e) {
  return HtmlService.createHtmlOutput('Camera Orders API Working');
}