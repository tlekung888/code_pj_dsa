function setBudget() {
  var budget = 1000000;
  return budget;
}
function doGet(e) {
  var x = HtmlService.createTemplateFromFile("index");
  var y = x.evaluate();
  var z = y.setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  return z;
}

function include(fileName) {
  return HtmlService.createHtmlOutputFromFile(fileName).getContent();
}

function checkLogin(username, password) {
  var url = 'https://docs.google.com/spreadsheets/d/1VdSqXYPfAFTdDsxrbh1kEdWaPkd-j6qJcBKTKzhQask/edit?gid=0#gid=0';
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
  var url = 'https://docs.google.com/spreadsheets/d/1VdSqXYPfAFTdDsxrbh1kEdWaPkd-j6qJcBKTKzhQask/edit?gid=0#gid=0';
  var ss = SpreadsheetApp.openByUrl(url);
  var webAppSheet = ss.getSheetByName("DATA");
  var group = '';
  var value = ''
  var usernameExists = checkUsernameExists(usernamee, userId, webAppSheet);

  if (usernameExists) {
    return usernameExists;  // ถ้าซ้ำ, return ข้อความว่าชื่อผู้ใช้นี้มีอยู่แล้ว
  }

  if (income === 'มากกว่า 70,000') {
    group = 'rich';
    value = '0';
  } else if (income === 'น้อยกว่า 20,000') {//piority #1
    group = 'low-income';
    value = '100';
  } else if (age >= '60') {//piority #2
    group = 'older';
    value = '90';
  } else if (job === 'เกษตรกร') {//piority #3
    group = 'farmer';
    value = '80'
  } else if (job === 'นักศึกษา') {//piority #4
    group = 'student';
    value = '70';
  } else {
    group = 'normal';//piority #5
    value = '50';
  }

  webAppSheet.appendRow([usernamee, passwordd, title, firstname, lastname, age, job, income, userId, phone, 'user', group, value, 'wait']);
  return 'Account created successfully';
}

// ฟังก์ชันตรวจสอบว่า username ซ้ำใน Google Sheets หรือไม่
function checkUsernameExists(username, userId, sheet) {
  var getLastRow = sheet.getLastRow();

  for (var i = 1; i <= getLastRow; i++) {
    var sheetUsername = sheet.getRange(i, 1).getValue().toString().trim();
    if (sheetUsername === username) {
      return 'Username already exists';  // ถ้าพบว่า username ซ้ำ
    }
  }

  for (var i = 1; i < getLastRow; i++) {
    var sheetUserId = sheet.getRange(i, 9).getValue().toString().trim();
    if (sheetUserId === userId) {  // สมมติว่า userId อยู่ในคอลัมน์ที่ 9 (ดัชนี 8)
      return 'UserId already exists';  // ถ้าเจอ userId ซ้ำ ให้ส่งกลับข้อความ
    }
  }
  return false;  // ถ้าไม่พบ username ซ้ำ
}

function updateUserData(usernameee, passworddd, titlee, firstnamee, lastnamee, agee, jobb, incomee, userIdd, phonee, rolee) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("DATA"); // Replace with your actual sheet name
  var usersData = sheet.getDataRange().getValues();
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


function generateUsers(count) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("DATA");
  var data = [];

  for (var i = 0; i < count; i++) {
    var username = "user" + (sheet.getLastRow() + i + 1) + "@gmail.com";
    var password = "pass" + (Math.floor(Math.random() * 10000));
    var title = ["นาย", "นาง", "นางสาว"][Math.floor(Math.random() * 3)];
    var firstname = "ชื่อ" + (i + 1);
    var lastname = "นามสกุล" + (i + 1);
    var age = Math.floor(Math.random() * 70) + 15;
    var job = ["พนักงานบริษัท", "เกษตรกร", "นักศึกษา", "ฟรีแลนซ์", "อื่นๆ"][Math.floor(Math.random() * 5)];
    var income = ["น้อยกว่า 20,000", "20,000 - 50,000", "50,000 - 70,000", "มากกว่า 70,000"][Math.floor(Math.random() * 4)];
    var userId = Math.floor(1110000 + Math.random() * 1119999);
    var phone = "08" + Math.floor(10000000 + Math.random() * 90000000);
    var role = "user";
    var group = ''
    var value = ''
    if (income === 'มากกว่า 70,000') {
      group = 'rich';
      value = '0';
    } else if (income === 'น้อยกว่า 20,000') {//piority #1
      group = 'low-income';
      value = '100';
    } else if (age >= '60') {//piority #2
      group = 'older';
      value = '90';
    } else if (job === 'เกษตรกร') {//piority #3
      group = 'farmer';
      value = '80'
    } else if (job === 'นักศึกษา') {//piority #4
      group = 'student';
      value = '70';
    } else {
      group = 'normal';//piority #5
      value = '50';
    }
    data.push([username, password, title, firstname, lastname, age, job, income, userId, phone, role, group, value, 'wait']);
  }

  sheet.getRange(sheet.getLastRow() + 1, 1, data.length, data[0].length).setValues(data);
  return count + " users generated successfully";
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
  var result = updateUserData(usernameee, passworddd, titlee, firstnamee, lastnamee, agee, jobb, incomee, userIdd, phonee, rolee, group);
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

function testGen() {
  var x = 10;
  var result = generateUsers(x);
  Logger.log(result);
}

// function onEdit(e) {
//   if (!e || !e.source) return; // ตรวจสอบว่า e และ e.source มีค่าหรือไม่

//   var sheet = e.source.getActiveSheet();
//   var maxRows = 50; // กำหนดจำนวนแถวสูงสุดที่ต้องการ

//   var totalRows = sheet.getMaxRows(); // จำนวนแถวทั้งหมดของชีต
//   var lastRow = sheet.getLastRow(); // แถวสุดท้ายที่มีข้อมูล

//   if (totalRows > maxRows) {
//     sheet.deleteRows(maxRows + 1, totalRows - maxRows); // ลบแถวที่เกินจาก maxRows
//     SpreadsheetApp.getUi().alert("จำกัดจำนวนแถวสูงสุดที่ " + maxRows + " แถว");
//   }
// }

function updatePhaseByGroup(group, phase, persen) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = sheet.getDataRange().getValues();
  var statusColumn = 13;
  var groupColumn = 11; // คอลัมน์ L
  var phaseColumn = 14; // คอลัมน์ O
  var persenColumn = 15; // คอลัมน์ P
  var setBudget = sheet.getRange(1, 17).getValue(); // 🔥 ดึงงบประมาณจาก Q2
  var budget = sheet.getRange(2, 17).getValue();
  var count = 0;
  var fullPersen = sheet.getRange(2, 16).getValue();
  var totalPAY = sheet.getRange(2, 18).getValue();
  if (budget === '') {
    budget = setBudget;
  }
  if (persen > fullPersen) {
    return `ไม่สามารถใช้สัดส่วนนี้ได้ เนื่องจากสัดส่วนเงินทุนเหลือเพียงแค่ ${fullPersen}% จากยอดทุนเดิม`;
  }
  for (var i = 1; i < data.length; i++) {
    if (data[i][groupColumn] === group && data[i][statusColumn] === 'wait') {
      sheet.getRange(i + 1, phaseColumn + 1).setValue(phase);
      sheet.getRange(i + 1, persenColumn + 1).setValue(persen);
      sheet.getRange(i + 1, 17).setValue(Math.round((persen / 100) * setBudget));
      sheet.getRange(i + 1, 14).setValue('Verified');
      count++;
    }
  }

  if (count > 0) {
    var pay = (persen / 100) * setBudget / count;
    var totalPay = 0;

    for (var j = 1; j < data.length; j++) {
      if (data[j][groupColumn] === group) {
        sheet.getRange(j + 1, 18).setValue(Math.round(pay));
        totalPay += pay;
      }
    }
    fullPersen -= persen;
    sheet.getRange(2, 16).setValue(Math.round(fullPersen));

    budget -= totalPay
    sheet.getRange(2, 17).setValue(Math.round(budget));
    sheet.getRange(2, 18).setValue(Math.round(totalPay) + Number(totalPAY));
    var showTotalpay = sheet.getRange(2, 18).getValue();

    return `อัปเดตสำเร็จ: ${count} รายการ | ใช้ไป ${Math.round(showTotalpay)} | งบคงเหลือ ${Math.round(budget)}`;
  } else {
    return `ไม่พบข้อมูลกลุ่ม ${group} หรือกลุ่ม ${group} อาจมีกำหนดแจกเงินแล้ว`;
  }

}

function testUpdatePhase() {
  updatePhaseByGroup("rich", "เฟส1");
}

function resetStatusAll() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = sheet.getDataRange().getValues();
  var statusColumn = 13;
  var fullPersen = sheet.getRange(2, 16).getValue();
  for (var i = 1; i < data.length; i++) {
    sheet.getRange(i + 1, statusColumn + 1).setValue('wait');
    sheet.getRange(i + 1, 15).setValue('');
    sheet.getRange(i + 1, 16).setValue('');
    sheet.getRange(i + 1, 17).setValue('');
    sheet.getRange(i + 1, 18).setValue('');
    sheet.getRange(2, 16).setValue('100');
    sheet.getRange(2, 17).setValue('');
    sheet.getRange(2, 18).setValue('0');
  }
  Logger.log(fullPersen);
}


function getBalance() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var balance = sheet.getRange(2, 17).getValue(); 
  return balance;
}
function getPayed() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var payed = sheet.getRange(2, 18).getValue(); 
  return payed;
}


function getTableData() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = sheet.getRange(1, 1, sheet.getLastRow(), 15).getValues(); // ดึงเฉพาะ A-O (1-15)
  var html = "<table border='1'><tr>";

  // ✅ สร้างส่วนหัวของตาราง (แถวแรกของชีต)
  for (var i = 0; i < data[0].length; i++) {
    html += "<th>" + data[0][i] + "</th>";
  }
  html += "</tr>";

  // ✅ ใส่ข้อมูลเฉพาะที่ต้องการ (A-O) และตรวจสอบสถานะที่คอลัมน์ N (คอลัมน์ 14)
  for (var i = 1; i < data.length; i++) {
    if (data[i][13] === 'Verified') {  // คอลัมน์ N = index 13
      html += "<tr>";
      for (var j = 0; j < data[i].length; j++) {
        html += "<td>" + data[i][j] + "</td>";
      }
      html += "</tr>";
    }
  }
  html += "</table>";

  return html;
}


function getVerifiedCount() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = sheet.getRange(1, 1, sheet.getLastRow(), 15).getValues(); // ดึงเฉพาะ A-O (1-15)

  var verifiedCount = 0;  // ตัวแปรสำหรับเก็บจำนวนคนที่มีสถานะ verified

  // ตรวจสอบสถานะที่คอลัมน์ N (คอลัมน์ 14)
  for (var i = 1; i < data.length; i++) {
    if (data[i][13] === 'Verified') {  // คอลัมน์ N = index 13
      verifiedCount++;  // เพิ่มจำนวนคนที่มีสถานะ verified
    }
  }

  return verifiedCount;
}


function showBalance(){

}

function getGroupsByPhase() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = sheet.getDataRange().getValues(); // ✅ ดึงข้อมูลทั้งหมด

  var phaseColumn = 14; // ✅ คอลัมน์ O (Phase) -> index 14 (เพราะเริ่มจาก 0)
  var groupColumn = 11; // ✅ คอลัมน์ L (Group) -> index 11

  var phaseGroups = {
    "phase1": new Set(),
    "phase2": new Set(),
    "phase3": new Set()
  };

  Logger.log("🔍 ตรวจสอบข้อมูลทั้งหมด: %s", JSON.stringify(data)); // 🛠 Debug ข้อมูลที่ดึงมา

  for (var i = 1; i < data.length; i++) { // ✅ เริ่มจากแถวที่ 2 (ข้าม Header)
    var phase = data[i][phaseColumn];
    var group = data[i][groupColumn];

    Logger.log("🔍 ตรวจสอบแถว %d -> Phase: %s | Group: %s", i + 1, phase, group); // 🛠 Debug แต่ละแถว

    if (!phase || !group) continue; // ✅ ข้ามแถวที่ว่าง

    phase = phase.toString().trim().toLowerCase(); // ✅ แปลงเป็นตัวพิมพ์เล็ก (ป้องกันสะกดผิด)
    group = group.toString().trim();

    if (phase === "phase1") {
      phaseGroups["phase1"].add(group);
    } else if (phase === "phase2") {
      phaseGroups["phase2"].add(group);
    } else if (phase === "phase3") {
      phaseGroups["phase3"].add(group);
    }
  }

  // ✅ แปลง Set เป็น Array ก่อนคืนค่า
  var result = {
    "phase1": Array.from(phaseGroups["phase1"]),
    "phase2": Array.from(phaseGroups["phase2"]),
    "phase3": Array.from(phaseGroups["phase3"])
  };

  Logger.log("✅ ข้อมูลที่ได้: %s", JSON.stringify(result)); // 🛠 Debug ข้อมูลสุดท้าย
  return result;
}








