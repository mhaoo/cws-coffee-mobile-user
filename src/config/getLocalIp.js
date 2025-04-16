// //#!/usr/bin/env node

// const os = require("os");
// const fs = require("fs");
// const path = require("path");

// //* Hàm lấy địa chỉ IP v4 của máy đang chạy
// function getLocalIpAddress() {
//   const networkInterfaces = os.networkInterfaces();
//   for (const interfaceName in networkInterfaces) {
//     const netInterface = networkInterfaces[interfaceName];
//     for (const addressInfo of netInterface) {
//       //! Chỉ lấy IPv4 và không phải địa chỉ nội bộ (127.0.0.1)
//       if (addressInfo.family === "IPv4" && !addressInfo.internal) {
//         return addressInfo.address;
//       }
//     }
//   }
//   //! Nếu không tìm thấy, fallback về localhost
//   return "127.0.0.1";
// }

// // Lấy IP cục bộ
// const localIp = getLocalIpAddress();

// // Đường dẫn tới file .env trong project
// const envFilePath = path.resolve(__dirname, "../../.env");

// //* Đọc nội dung cũ của `.env`
// let envContent = "";
// if (fs.existsSync(envFilePath)) {
//   envContent = fs.readFileSync(envFilePath, "utf-8");
// }

// //* Cập nhật API_URL mà không ảnh hưởng đến các biến khác
// let newEnvContent = envContent;

// //* Kiểm tra xem API_URL đã tồn tại chưa
// if (/^API_URL=.*/m.test(newEnvContent)) {
//   //TODO Nếu tồn tại, thay thế API_URL bằng giá trị mới
//   newEnvContent = newEnvContent.replace(
//     /^API_URL=.*/m,
//     `API_URL=http://${localIp}:3000`
//   );
// } else {
//   //TODO Nếu chưa có, thêm mới vào cuối file
//   newEnvContent += `\nAPI_URL=http://${localIp}:3000\n`;
// }

// //* Ghi lại file `.env` mà không làm mất các biến env khác
// fs.writeFileSync(envFilePath, newEnvContent, "utf-8");

// console.log(
//   `\n[getLocalIp.js] Đã cập nhật API_URL: http://${localIp}:3000 vào file .env tại: ${envFilePath}\n`
// );
