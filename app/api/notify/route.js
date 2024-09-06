import { NextResponse } from "next/server"; // นำเข้า NextResponse จาก Next.js เพื่อจัดการการตอบกลับ (response)

// ฟังก์ชันสำหรับการส่งการแจ้งเตือนผ่าน Line Notify
async function sendLineNotify(message) {
  const lineNotifyToken = process.env.LINE_NOTIFY_TOKEN; // นำค่า token จากไฟล์ .env เพื่อความปลอดภัยในการจัดการข้อมูล
  const url = "https://notify-api.line.me/api/notify"; // URL ของ Line Notify API

  // ส่งคำขอ (request) ไปยัง Line Notify API เพื่อส่งข้อความแจ้งเตือน
  const response = await fetch(url, {
    method: "POST", // ใช้วิธี POST เพื่อส่งข้อมูล
    headers: {
      "Content-Type": "application/x-www-form-urlencoded", // กำหนดประเภทเนื้อหาที่ส่ง
      Authorization: `Bearer ${lineNotifyToken}`, // ส่ง token เพื่อยืนยันตัวตน
    },
    body: new URLSearchParams({ message }), // กำหนดข้อความที่ต้องการส่งในรูปแบบ URLSearchParams
  });

  return response.json(); // คืนค่าผลลัพธ์ในรูปแบบ JSON
}

// ฟังก์ชันที่ทำงานเมื่อมีคำขอแบบ POST มาที่ API
export async function POST(request) {
  // ดึงข้อมูล message และ notifyTime จากคำขอ (request)
  const { message, notifyTime } = await request.json();

  // กรณีที่ไม่ได้กำหนดเวลาแจ้งเตือน ส่งข้อความทันที
  if (!notifyTime) {
    const result = await sendLineNotify(message); // เรียกฟังก์ชัน sendLineNotify เพื่อส่งข้อความ
    return NextResponse.json(result); // ส่งกลับผลลัพธ์ที่ได้จาก Line Notify API
  }

  // คำนวณเวลาที่เหลือก่อนถึงเวลาที่ต้องแจ้งเตือน
  const delay = new Date(notifyTime).getTime() - new Date().getTime(); // คำนวณเวลาที่จะหน่วงการแจ้งเตือน
  if (delay > 0) {
    // ถ้าเวลาที่ตั้งไว้อยู่ในอนาคต
    setTimeout(async () => {
      await sendLineNotify(message); // ส่งข้อความเมื่อถึงเวลาที่ตั้งไว้
    }, delay);
    // ส่งกลับผลลัพธ์ว่าได้บันทึกรายการแล้ว และแจ้งเวลาที่ตั้งไว้
    return NextResponse.json({ status: "บันทึกรายการแล้ว รอคิว", notifyTime });
  }

  // กรณีที่เวลาที่ตั้งไว้เป็นอดีต ส่งกลับสถานะว่าข้อความเลยเวลาที่กำหนดมาแล้ว
  return NextResponse.json({ status: "เลยเวลามาแล้ว", notifyTime });
}
