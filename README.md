# 🪧 IoT-Based Outdoor Digital Notice Board

A solar-powered, remotely managed **IoT notice board system** built for smart campuses and public infrastructure. Designed with React (frontend), ESP32 (hardware), and real-time WebSocket communication.

---

## 📌 Project Overview

This project enables institutions to:
- Display real-time notices on an outdoor LED display (e.g. P10 module)
- Control messages remotely through a secure web portal
- Power the entire system sustainably via solar energy
- Enable smart, autonomous, and interactive information delivery

---

## 🔧 Features

- 🛰️ **ESP32-based controller** for LED display
- ☀️ **Solar-powered** system for outdoor operation
- 🌐 **WebSocket** communication for real-time updates
- 🔒 **Secure admin portal** for authorized message updates
- 📡 Remote login & management panel (React UI)
- 🧠 Backend API (Node.js or Express) for communication handling

---

## 🖥️ Tech Stack

| Layer      | Technology              |
|------------|--------------------------|
| Frontend   | React + Tailwind CSS     |
| Backend    | Node.js + WebSocket (WSS)|
| Microcontroller | ESP32                |
| Display    | 16x32 P10 LED Module     |
| Power      | Solar Panel + Battery    |

---

## 📂 Project Structure


---

## 🚀 Getting Started

### Prerequisites
- Node.js & npm
- Arduino IDE
- ESP32 board with drivers
- React + Tailwind CSS (preconfigured)

### 1. Frontend (React)
```bash
cd client
npm install
npm run dev  # or npm run start
