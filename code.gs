function doGet(e) {
  var x = HtmlService.createTemplateFromFile("login");
  var y = x.evaluate();
  var z = y.setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  return z;
}

function checkLogin(username, password) {
  var url = 'https://docs.google.com/spreadsheets/d/1KOENVd2tB2PClouMMOd1Ym1NnpvhWZND9BVuwoLjdTU/edit?usp=sharing';
  var ss = SpreadsheetApp.openByUrl(url);
  var webAppSheet = ss.getSheetByName("DATA");
  var getLastRow = webAppSheet.getLastRow();

  for (var i = 1; i <= getLastRow; i++) {
    var sheetUsername = webAppSheet.getRange(i, 1).getValue().toString().trim();
    var sheetPassword = webAppSheet.getRange(i, 2).getValue().toString().trim();
    var sheetRole = webAppSheet.getRange(i, 11).getValue().toString().trim();
    if (sheetUsername === username && sheetPassword === password) {
    if (sheetRole === 'admin') {
        return 'admin';  // Return 'admin' role
      } else{
        return 'user';  // Return 'user' role
      }
    }
  }
  return 'FALSE';
}

function AddRecord(usernamee, passwordd, title, firstname, lastname, age, job, income, address, phone) {
  var url = 'https://docs.google.com/spreadsheets/d/1KOENVd2tB2PClouMMOd1Ym1NnpvhWZND9BVuwoLjdTU/edit?usp=sharing';
  var ss = SpreadsheetApp.openByUrl(url);
  var webAppSheet = ss.getSheetByName("DATA");
  
  // ตรวจสอบว่า username ซ้ำหรือไม่
  var usernameExists = checkUsernameExists(usernamee, webAppSheet);
  
  if (usernameExists) {
    return 'Username already exists';  // ถ้าซ้ำ, return ข้อความว่าชื่อผู้ใช้นี้มีอยู่แล้ว
  }

  // ถ้าไม่ซ้ำ ก็เพิ่มข้อมูลใหม่
  webAppSheet.appendRow([usernamee, passwordd, title, firstname, lastname, age, job, income, address, phone, 'user']);
  return 'Account created successfully';
}

// ฟังก์ชันตรวจสอบว่า username ซ้ำใน Google Sheets หรือไม่
function checkUsernameExists(username, sheet) {
  var getLastRow = sheet.getLastRow();
  
  for (var i = 1; i <= getLastRow; i++) {
    var sheetUsername = sheet.getRange(i, 1).getValue().toString().trim();
    if (sheetUsername === username) {
      return true;  // ถ้าพบว่า username ซ้ำ
    }
  }
  return false;  // ถ้าไม่พบ username ซ้ำ
}
