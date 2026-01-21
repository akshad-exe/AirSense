# AirSense – Offline-First Real-Time AQI Monitoring Platform (SQLite)

## 1\. Project Overview

**AirSense** is an offline-first, real-time IoT-based Air Quality Index (AQI) monitoring platform designed specifically for environments with unreliable or no internet connectivity, such as college campuses.

The system measures particulate matter (PM2.5 and PM10), computes AQI values in real time, provides health-based air quality suggestions, and visualizes data through a web and PWA dashboard. A local backend with an **SQLite database** ensures low-latency real-time operation without cloud dependency.

|  |
| :---- |

## 2\. Problem Statement

Air pollution monitoring systems often depend heavily on cloud infrastructure and stable internet connectivity. In campus environments with frequent Wi-Fi disruptions, such systems fail to provide real-time data, reducing their effectiveness.

There is a need for a **robust, offline-capable, real-time AQI monitoring system** that:

* Works without internet  
* Provides immediate data visibility  
* Supports historical analysis  
* Delivers actionable health insights

|  |
| :---- |

## 3\. Goals & Objectives

### Primary Objectives

* Measure PM2.5 and PM10 concentrations in real time  
* Calculate AQI values accurately (0–500 range)  
* Display air quality status with health suggestions  
* Ensure uninterrupted operation without internet

### Secondary Objectives

* Support multiple IoT devices  
* Enable real-time dashboards using WebSockets  
* Store historical AQI data locally  
* Provide offline-first web and PWA access

|  |
| :---- |

## 4\. Target Users

* Students and faculty  
* Educational institutions (smart campus initiatives)  
* Environmental research groups  
* Academic IoT demonstrations

|  |
| :---- |

## 5\. System Architecture Overview

### High-Level Architecture

| ESP32 Sensor Nodes         ↓ (Local Wi-Fi / Hotspot) Local Backend Server (Laptop / Raspberry Pi)         ↓      SQLite Database         ↓ Web Dashboard / PWA         ↓ IndexedDB (UI Cache) |
| :---- |

### Architectural Principles

* Offline-first design  
* Low-latency local processing  
* Backend-mediated data flow  
* Clear separation of IoT, backend, and frontend layers

|  |
| :---- |

## 6\. IoT Layer (Device Side)

### Hardware Components

* ESP32 microcontroller (Wi-Fi enabled)  
* PM2.5 / PM10 sensor (PMS5003 or SDS011)  
* DHT11/DHT22 (optional – temperature & humidity)  
* OLED/LCD display (local AQI display)  
* Power supply and enclosure

### Device Responsibilities

* Periodically read sensor data (5–10 seconds)  
* Send PM values to backend via HTTP REST API  
* Display AQI locally  
* Handle Wi-Fi disconnections gracefully

### Device Identity & Security

* Unique device\_id per device  
* API key-based authentication  
* Backend validation of incoming data

|  |
| :---- |

## 7\. Backend Layer (Offline Local Server)

### Technology Stack

* Node.js \+ Express  
* **SQLite (local embedded database)**  
* REST APIs for device communication  
* WebSockets for real-time dashboard updates

### Core Backend Features

* IoT device authentication  
* Sensor data validation and normalization  
* AQI calculation and classification  
* Real-time data broadcasting via WebSockets  
* Local data persistence using SQLite  
* Device status and heartbeat tracking

### Backend APIs (Indicative)

| Method | Endpoint | Description |
| :---- | :---- | :---- |
| POST | /api/air-data | Receive sensor data from ESP32 |
| GET | /api/latest | Fetch latest AQI reading |
| GET | /api/history | Fetch historical AQI data |
| GET | /api/devices | Fetch device status |

|  |
| :---- |

## 8\. Database Design (SQLite)

### air\_readings Table

| id INTEGER PRIMARY KEY AUTOINCREMENT device\_id TEXT pm25 REAL pm10 REAL aqi INTEGER air\_quality\_level TEXT timestamp DATETIME DEFAULT CURRENT\_TIMESTAMP |
| :---- |

### devices Table

| device\_id TEXT PRIMARY KEY api\_key TEXT location TEXT status TEXT last\_seen DATETIME |
| :---- |

### Database Characteristics

* Fully offline operation  
* Low-latency writes and reads  
* ACID-compliant  
* Suitable for edge and campus deployments

|  |
| :---- |

## 9\. Frontend Layer (Web Dashboard \+ PWA)

### Web Dashboard Features

* Live AQI display  
* PM2.5 and PM10 values  
* AQI category indicator  
* Real-time charts  
* Device online/offline status  
* Historical AQI visualization

### PWA Features

* Installable on mobile and desktop  
* Offline access using IndexedDB  
* Last-known AQI display during refresh or disconnect  
* Automatic data refresh on reconnect

|  |
| :---- |

## 10\. Offline-First Strategy

### Backend Offline Handling

* Backend runs locally on laptop or Raspberry Pi  
* SQLite acts as the primary data source  
* No internet dependency for core functionality

### Frontend Offline Handling

* Real-time data via WebSockets when connected  
* IndexedDB used as UI fallback cache  
* Displays last-updated timestamp

### Future Scope

* Optional cloud synchronization when internet becomes available

|  |
| :---- |

## 11\. AQI Calculation & Health Suggestions (0–500)

AQI is calculated based on PM2.5 and PM10 concentration values. Health suggestions follow standard air quality guidelines.

| AQI Range | Category | Health Suggestion |
| :---- | :---- | :---- |
| 0–50 | Good | Air quality is satisfactory; enjoy outdoor activities |
| 51–100 | Moderate | Sensitive individuals should limit prolonged outdoor exertion |
| 101–200 | Poor | Reduce prolonged outdoor exposure; consider protective masks |
| 201–300 | Very Poor | Avoid outdoor activities; sensitive groups stay indoors |
| 301–500 | Severe | Health emergency conditions; everyone should remain indoors |

AQI computation and suggestion mapping are handled centrally by the backend.

|  |
| :---- |

## 12\. Non-Functional Requirements

* High availability during local operation  
* Secure API access  
* Low-latency updates (–3 seconds)  
* Easy deployment and maintenance

|  |
| :---- |

## 13\. Future Enhancements

* Multi-location AQI mapping  
* Additional gas sensors (CO₂, NO₂)  
* Predictive AQI trends  
* Optional cloud analytics dashboard

|  |
| :---- |

## 14\. Academic Relevance

* Demonstrates real-time IoT integration  
* Implements offline-first system design  
* Applies DBMS concepts using SQLite  
* Uses WebSockets for real-time systems  
* Addresses real-world campus constraints

|  |
| :---- |

## 15\. Conclusion

AirSense is a robust, offline-first, real-time AQI monitoring platform designed for practical deployment in environments with unreliable internet connectivity. By combining IoT sensor nodes, a local backend with SQLite, and modern web/PWA dashboards, the system delivers reliable, low-latency air quality insights suitable for both academic evaluation and real-world use.  
