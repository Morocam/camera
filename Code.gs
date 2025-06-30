function doPost(e) {
  try {
    // Your Google Sheet ID (keep this private on server side)
    const SHEET_ID = '1y0Lf12GqjuhaLbI9n0JCi3C1u1LK036IV1XyZpTKoVg';
    const SHEET_NAME = 'Orders';
    
    // Parse the incoming data
    const data = JSON.parse(e.postData.contents);
    
    // Open the spreadsheet
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
    
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
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({success: true}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  // Handle GET requests (optional)
  return ContentService
    .createTextOutput(JSON.stringify({message: 'Camera Orders API'}))
    .setMimeType(ContentService.MimeType.JSON);
}