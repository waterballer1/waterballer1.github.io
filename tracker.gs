function doGet(e) {
  return ContentService
    .createTextOutput("Tracker is running.")
    .setMimeType(ContentService.MimeType.TEXT);
}

function doPost(e) {
  const sheet =
    SpreadsheetApp
      .getActiveSpreadsheet()
      .getActiveSheet();

  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "Timestamp",
      "Session ID",
      "Event",
      "Field",
      "Value"
    ]);
  }

  const p =
    (e && e.parameter)
      ? e.parameter
      : {};

  sheet.appendRow([
    new Date(),
    p.session_id || "",
    p.event || "",
    p.field || "",
    p.value || ""
  ]);

  return ContentService
    .createTextOutput("Success")
    .setMimeType(ContentService.MimeType.TEXT);
}