"use client"; // ใช้เฉพาะในฝั่ง client ของ Next.js

import { useState } from "react"; // นำเข้า useState จาก React เพื่อจัดการสถานะ (state)

export default function Home() {
  // สร้าง state เพื่อเก็บค่าของข้อความ, เวลาแจ้งเตือน และรายการ response
  const [message, setMessage] = useState("");
  const [notifyTime, setNotifyTime] = useState("");
  const [responses, setResponses] = useState([]);

  // ฟังก์ชันที่ทำงานเมื่อกดปุ่ม "Add Notification"
  const handleSubmit = async (e) => {
    e.preventDefault(); // ป้องกันไม่ให้หน้าเว็บโหลดซ้ำเมื่อส่งฟอร์ม

    try {
      // ส่งคำขอ (request) ไปที่ API เพื่อเพิ่มการแจ้งเตือน
      const res = await fetch("/api/notify", {
        method: "POST", // ใช้ POST เพื่อส่งข้อมูล
        headers: {
          "Content-Type": "application/json", // กำหนดว่าเนื้อหาที่ส่งเป็น JSON
        },
        body: JSON.stringify({ message, notifyTime }), // ส่งข้อมูล message และ notifyTime ในรูปแบบ JSON
      });

      const data = await res.json(); // แปลงผลลัพธ์ที่ได้รับเป็น JSON
      setResponses((prevResponses) => [...prevResponses, data]); // เพิ่ม response ใหม่ในรายการ responses
    } catch (error) {
      console.error("Error sending notification:", error); // แสดงข้อความผิดพลาดใน console หากเกิดข้อผิดพลาด
    }
  };

  return (
    <div className="pt-14 min-h-screen bg-gray-50">
      {" "}
      {/* จัดการ layout พื้นฐานของหน้า */}
      <h1 className="text-4xl font-bold text-center mb-12 text-gray-800">
        Add Event Line Notify {/* หัวข้อหลักของหน้า */}
      </h1>
      <form
        onSubmit={handleSubmit} // กำหนดให้ฟังก์ชัน handleSubmit ทำงานเมื่อส่งฟอร์ม
        className="max-w-lg mx-auto bg-white p-10 rounded-xl shadow-xl space-y-6"
      >
        {/* ช่องกรอกข้อความ */}
        <div className="flex flex-col">
          <label
            htmlFor="message"
            className="text-lg font-medium text-gray-700 mb-2"
          >
            Message: {/* ป้ายชื่อ (Label) ของช่องกรอกข้อความ */}
          </label>
          <input
            type="text"
            id="message"
            value={message} // ค่าของข้อความที่ถูกกรอกในช่อง input
            onChange={(e) => setMessage(e.target.value)} // ฟังก์ชันเปลี่ยนค่า message เมื่อมีการกรอกข้อมูล
            required
            className="p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow duration-300 shadow-sm"
            placeholder="Enter your message" // ข้อความตัวอย่างในช่อง input
          />
        </div>

        {/* ช่องกรอกเวลาแจ้งเตือน */}
        <div className="flex flex-col">
          <label
            htmlFor="notifyTime"
            className="text-lg font-medium text-gray-700 mb-2"
          >
            Notify Time (optional): {/* ป้ายชื่อของช่องกรอกเวลาแจ้งเตือน */}
          </label>
          <input
            type="datetime-local" // กำหนดประเภทของ input เป็นวันที่และเวลา
            id="notifyTime"
            value={notifyTime} // ค่าของเวลาแจ้งเตือนที่ถูกกรอก
            onChange={(e) => setNotifyTime(e.target.value)} // ฟังก์ชันเปลี่ยนค่า notifyTime เมื่อมีการกรอกข้อมูล
            className="p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow duration-300 shadow-sm"
          />
        </div>

        {/* ปุ่มเพิ่มการแจ้งเตือน */}
        <button
          type="submit" // กำหนดประเภทของปุ่มเป็น submit
          className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition duration-300"
        >
          Add Notification {/* ข้อความบนปุ่ม */}
        </button>
      </form>
      {/* แสดงรายการของ responses ทั้งหมด */}
      {responses.length > 0 && (
        <div className="mt-12 max-w-lg mx-auto bg-gray-100 p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Responses: {/* หัวข้อแสดงผล responses */}
          </h2>
          <ul className="space-y-6">
            {responses.map((response, index) => (
              <li
                key={index} // กำหนด key สำหรับแต่ละรายการ response
                className="bg-white p-6 rounded-lg shadow-md border border-gray-200"
              >
                {/* แสดงสถานะและเวลาที่แจ้งเตือน */}
                <pre className="text-base text-gray-800">
                  <strong>สถานะ:</strong> {response.status}
                </pre>
                <pre className="text-base text-gray-800">
                  <strong>เวลาที่แจ้งเตือน:</strong> {response.notifyTime}
                </pre>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
