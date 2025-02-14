function doGet(e) {
  var x = HtmlService.createTemplateFromFile("login");
  var y = x.evaluate();
  var z = y.setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  return z;
}

function include(fileName) {
  return HtmlService.createHtmlOutputFromFile(fileName).getContent();
}

function checkLogin(username, password) {
  var url = 'https://docs.google.com/spreadsheets/d/1y_NT1dou2PbJuIFnT2mxgXqZIF2djEUocCvWL78WUuY/edit?gid=0#gid=0';
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
      } else {
        return 'user';  // Return 'user' role
      }
    }
  }
  return 'FALSE';
}

function AddRecord(usernamee, passwordd, title, firstname, lastname, age, job, income, userId, phone) {
  var url = 'https://docs.google.com/spreadsheets/d/1y_NT1dou2PbJuIFnT2mxgXqZIF2djEUocCvWL78WUuY/edit?gid=0#gid=0';
  var ss = SpreadsheetApp.openByUrl(url);
  var webAppSheet = ss.getSheetByName("DATA");

  // ตรวจสอบว่า username ซ้ำหรือไม่
  var usernameExists = checkUsernameExists(usernamee, webAppSheet);

  if (usernameExists) {
    return 'Username already exists';  // ถ้าซ้ำ, return ข้อความว่าชื่อผู้ใช้นี้มีอยู่แล้ว
  }

  // ถ้าไม่ซ้ำ ก็เพิ่มข้อมูลใหม่
  webAppSheet.appendRow([usernamee, passwordd, title, firstname, lastname, age, job, income, userId, phone, 'user']);
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

function updateUserData(usernameee, passworddd, titlee, firstnamee, lastnamee, agee, jobb, incomee, userIdd, phonee,rolee) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("DATA"); // Replace with your actual sheet name
  var usersData = sheet.getDataRange().getValues();
  if (!usernameee || !passworddd || !titlee || !firstnamee || !lastnamee || !agee || !jobb || !incomee || userIdd || !phonee || !rolee) {
  for (var i = 1; i < usersData.length; i++) {
    if (String(usersData[i][8]) === String(userIdd)) { // Assuming the user ID is in column 10 (index 9)
      // Update the user data (column starts from 1, not 0)
      sheet.getRange(i + 1, 1).setValue(usernameee); // Username in column 1
      sheet.getRange(i + 1, 2).setValue(passworddd); // Password in column 2
      sheet.getRange(i + 1, 3).setValue(titlee); // Title in column 3
      sheet.getRange(i + 1, 4).setValue(firstnamee); // First Name in column 4
      sheet.getRange(i + 1, 5).setValue(lastnamee); // Last Name in column 5
      sheet.getRange(i + 1, 6).setValue(agee); // Age in column 6
      sheet.getRange(i + 1, 7).setValue(jobb); // Job in column 7
      sheet.getRange(i + 1, 8).setValue(incomee); // Income in column 8
      sheet.getRange(i + 1, 9).setValue(userIdd); // ID in column 9
      sheet.getRange(i + 1, 10).setValue(phonee); // Phone in column 10
      sheet.getRange(i + 1, 11).setValue(rolee); // Role in column 11

      return 'Update successful';
    }
  }
        return usernameee+ passworddd+ titlee+ firstnamee+ lastnamee+ agee+ jobb+ incomee+ userIdd+ phonee+ rolee;
    }
  
  return 'Not found' // Return if user is not found
}



function getUserDataById(userId) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("DATA"); // ให้แน่ใจว่าใช่ชื่อชีตที่ถูกต้อง
  var usersData = sheet.getDataRange().getValues();

  for (var i = 1; i < usersData.length; i++) {
    // แปลง userId และค่าจากคอลัมน์ 8 เป็น string ก่อนเปรียบเทียบ
    if (String(usersData[i][8]) === String(userId)) {
      return {
        username: usersData[i][0], // คอลัมน์ A
        password: usersData[i][1], // คอลัมน์ A
        title: usersData[i][2], // คอลัมน์ A
        firstname: usersData[i][3], // คอลัมน์ E
        lastname: usersData[i][4], // คอลัมน์ F
        age: usersData[i][5], // คอลัมน์ F
        job: usersData[i][6], // คอลัมน์ H
        income: usersData[i][7], // คอลัมน์ I
        userId: usersData[i][8], // คอลัมน์ I
        phone: usersData[i][9], // คอลัมน์ K
        role: usersData[i][10] // คอลัมน์ K
      };
    }
  }
  return null; // หากไม่เจอ user
}
function testUpdateUserData() {
  // Sample data for testing
  var usernameee = 'testUser';
  var passworddd = 'testPassword';
  var titlee = 'นาย';
  var firstnamee = 'ฌาาน';
  var lastnamee = 'นาบบบ';
  var agee = 30;
  var jobb = 'พนักงานบริษัท';
  var incomee = '30,000 - 50,000';
  var userIdd = 22222;  // ID of the user to be updated
  var phonee = '0123456789';
  var rolee = 'admin';

  // Call the function to update user data
  var result = updateUserData(usernameee, passworddd, titlee, firstnamee, lastnamee, agee, jobb, incomee, userIdd, phonee,rolee);
  // Log the result to the console
  Logger.log(result);

  // Optionally, you can verify the result by checking the updated value in the sheet manually
}




function testGetUserDataById() {
  var userId = "2222"; // ใส่ userId ที่ต้องการทดสอบ
  var result = getUserDataById(userId);
  if (result) {
    Logger.log("User found: " + JSON.stringify(result)); // แสดงผลลัพธ์ที่ได้
  } else {
    Logger.log("User not found"); // ถ้าไม่พบ user
  }
}



