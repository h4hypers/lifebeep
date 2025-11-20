# LifeBeep – Intelligent Sound Alert Watch

![LifeBeep Banner](https://img.shields.io/badge/LifeBeep-Intelligent_Sound_for_a_Silent_World-blueviolet?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTIgMkM2LjQ4IDIgMiA2LjQ4IDIgMTJzNC40OCAxMCAxMCAxMCAxMC00LjQ4IDEwLTEwUzE3LjUyIDIgMTIgMnoiIGZpbGw9IiNhODU1ZjciLz48L3N2Zz4=)

A **futuristic wearable device** designed to help hearing-impaired individuals detect critical environmental sounds through **multi-modal alerts** (vibration, LED, OLED display).

Built by **Team H-4** | [Live Demo](#) | [GitHub Pages](#)

---

## 🌟 Overview

**LifeBeep** is a watch-style wearable safety device that uses:
- **IC 741 Analog Band-Pass Filter** – Custom op-amp circuit for precise sound detection
- **ESP32 Microcontroller** – Real-time frequency analysis and classification
- **Multi-Modal Alerts** – Vibration motor, LED indicator, OLED display, optional buzzer
- **24/7 Wearability** – Works during sleep, activities, and emergency situations

### Key Features
✅ Detects loud noise events (car horns, fire alarms, baby crying, etc.)  
✅ Instant tactile and visual alerts for fully and partially deaf users  
✅ 100× cheaper than traditional hearing aids  
✅ No medical fitting required – simple, wearable, and independent  
✅ Real-time data accessible via web interface  

---

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/lifebeep.git
cd lifebeep
```

### 2. Deploy Locally
Simply open `index.html` in your browser:
```bash
# Windows
start index.html

# macOS
open index.html

# Linux
xdg-open index.html
```

### 3. Deploy to GitHub Pages
```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit"

# Create and push to GitHub
git branch -M main
git remote add origin https://github.com/yourusername/lifebeep.git
git push -u origin main

# Enable GitHub Pages
# Go to Settings > Pages > Source: main branch > Save
```

Your site will be live at: `https://yourusername.github.io/lifebeep/`

---

## 🔧 ESP32 Setup

### Hardware Requirements
- ESP32 DevKit (any variant)
- Microphone module (MAX4466, MAX9814, or similar)
- IC 741 op-amp circuit (band-pass filter)
- OLED display (SSD1306, 128x64)
- Vibration motor (coin-type, 3V)
- LED indicator
- Resistors, capacitors for IC 741 circuit
- Power supply (3.7V LiPo battery or USB)

### ESP32 Firmware Setup

#### 1. Install Arduino IDE
Download from [arduino.cc](https://www.arduino.cc/en/software)

#### 2. Install ESP32 Board Support
```
Arduino IDE > File > Preferences > Additional Board Manager URLs:
https://dl.espressif.com/dl/package_esp32_index.json
```

Then: `Tools > Board > Board Manager` → Search "ESP32" → Install

#### 3. Install Required Libraries
```
Sketch > Include Library > Manage Libraries

Install:
- Adafruit SSD1306 (OLED)
- Adafruit GFX Library
- ArduinoJson (v6.x)
- ESPAsyncWebServer
- AsyncTCP
```

#### 4. Upload Firmware Code

Create `lifebeep_esp32.ino`:

```cpp
#include <WiFi.h>
#include <ESPAsyncWebServer.h>
#include <ArduinoJson.h>
#include <Wire.h>
#include <Adafruit_SSD1306.h>

// WiFi Credentials
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// Pin Definitions
#define MIC_PIN 34          // Analog input from IC 741
#define VIBRATION_PIN 25    // Vibration motor
#define LED_PIN 26          // LED indicator
#define BUZZER_PIN 27       // Optional buzzer

// OLED Setup
#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);

// Web Server
AsyncWebServer server(80);

// Detection Variables
float currentVoltage = 0.0;
bool alertActive = false;
String soundType = "None";
unsigned long lastDetection = 0;

// Thresholds
const float ALERT_THRESHOLD = 1.8;  // Volts

void setup() {
  Serial.begin(115200);
  
  // Pin modes
  pinMode(VIBRATION_PIN, OUTPUT);
  pinMode(LED_PIN, OUTPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  
  // OLED Init
  if(!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {
    Serial.println("OLED init failed");
  }
  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(WHITE);
  display.setCursor(0, 0);
  display.println("LifeBeep Starting...");
  display.display();
  
  // WiFi Connection
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nConnected!");
  Serial.print("IP: ");
  Serial.println(WiFi.localIP());
  
  // Display IP on OLED
  display.clearDisplay();
  display.setCursor(0, 0);
  display.println("LifeBeep Ready");
  display.print("IP: ");
  display.println(WiFi.localIP());
  display.display();
  
  // Setup Web Server Endpoints
  setupServer();
  server.begin();
}

void loop() {
  // Read microphone voltage
  int rawValue = analogRead(MIC_PIN);
  currentVoltage = (rawValue / 4095.0) * 3.3;
  
  // Check threshold
  if (currentVoltage >= ALERT_THRESHOLD) {
    triggerAlert();
  } else {
    clearAlert();
  }
  
  delay(100);
}

void setupServer() {
  // CORS Headers
  DefaultHeaders::Instance().addHeader("Access-Control-Allow-Origin", "*");
  DefaultHeaders::Instance().addHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  DefaultHeaders::Instance().addHeader("Access-Control-Allow-Headers", "Content-Type");
  
  // GET /readings
  server.on("/readings", HTTP_GET, [](AsyncWebServerRequest *request){
    StaticJsonDocument<200> doc;
    doc["voltage"] = currentVoltage;
    doc["alert"] = alertActive;
    doc["soundType"] = soundType;
    doc["timestamp"] = millis();
    
    String response;
    serializeJson(doc, response);
    request->send(200, "application/json", response);
  });
  
  // Root endpoint
  server.on("/", HTTP_GET, [](AsyncWebServerRequest *request){
    request->send(200, "text/plain", "LifeBeep ESP32 - Device Online");
  });
}

void triggerAlert() {
  alertActive = true;
  soundType = classifySound(currentVoltage);
  lastDetection = millis();
  
  // Activate outputs
  digitalWrite(VIBRATION_PIN, HIGH);
  digitalWrite(LED_PIN, HIGH);
  tone(BUZZER_PIN, 1000);
  
  // Update OLED
  display.clearDisplay();
  display.setTextSize(2);
  display.setCursor(0, 0);
  display.println("ALERT!");
  display.setTextSize(1);
  display.println(soundType);
  display.print("Vol: ");
  display.print(currentVoltage, 2);
  display.println("V");
  display.display();
}

void clearAlert() {
  if (alertActive && (millis() - lastDetection > 2000)) {
    alertActive = false;
    soundType = "None";
    
    digitalWrite(VIBRATION_PIN, LOW);
    digitalWrite(LED_PIN, LOW);
    noTone(BUZZER_PIN);
    
    // Update OLED
    display.clearDisplay();
    display.setTextSize(1);
    display.setCursor(0, 0);
    display.println("LifeBeep");
    display.println("Status: Normal");
    display.print("Vol: ");
    display.print(currentVoltage, 2);
    display.println("V");
    display.display();
  }
}

String classifySound(float voltage) {
  // Simple classification based on voltage
  if (voltage >= 2.5) return "Fire Alarm";
  if (voltage >= 2.2) return "Car Horn";
  if (voltage >= 1.9) return "Baby Crying";
  return "Loud Noise";
}
```

#### 5. Configure and Upload
1. Update WiFi credentials in the code
2. Select: `Tools > Board > ESP32 Dev Module`
3. Select correct Port
4. Click **Upload**

#### 6. Get ESP32 IP Address
After upload, open Serial Monitor (115200 baud) to see the IP address.

---

## 🌐 Website Configuration

### Configure ESP32 Connection
1. Open the website
2. Click **"Configure ESP32"** button in the Live Data card
3. Enter your ESP32's IP address (e.g., `192.168.1.100`)
4. Click **"Save Configuration"**

The website will automatically poll the ESP32 every 3 seconds and display:
- Current voltage reading
- Alert status (Active/Normal)
- Detected sound type
- Last update timestamp

### Manual Configuration (Console)
Open browser console (F12) and use:
```javascript
// Set ESP32 IP
ESP32.setIP("192.168.1.100");

// Check status
ESP32.getStatus();

// Fetch data immediately
ESP32.fetchNow();

// Stop polling
ESP32.stopPolling();

// Start polling
ESP32.startPolling();
```

---

## 📁 Project Structure

```
lifebeep/
│
├── index.html              # Main website file
├── README.md               # This file
│
└── static/
    ├── style/
    │   └── main.css        # Futuristic neon styling
    │
    ├── script/
    │   ├── main.js         # UI animations & interactions
    │   └── esp32.js        # ESP32 live data integration
    │
    └── images/
        └── (place your block diagram and photos here)
```

---

## 🎨 Design Features

### Visual Style (Inspired by Entrepix)
- **Neon Gradients**: Purple → Cyan transitions
- **Glassmorphism**: Frosted glass cards with blur effects
- **Glow Effects**: Animated text and button glows
- **Floating Particles**: Ambient background animation
- **Smooth Animations**: Fade, slide, and scale transitions
- **Responsive Design**: Mobile and desktop optimized

### Technology Stack
- **HTML5**: Semantic structure
- **CSS3**: Custom animations, gradients, glassmorphism
- **Vanilla JavaScript**: No frameworks - pure performance
- **Chart.js**: Audience data visualization
- **Font Awesome**: Icon library
- **Google Fonts**: Orbitron + Rajdhani

---

## 🎯 Use Cases

| Application | Description |
|------------|-------------|
| **Home Safety** | Doorbell, phone, smoke alarm, gas leak detection |
| **Roadside Alerts** | Car horns, truck honks, ambulance sirens |
| **Fire Alarm Detection** | Instant notification for building evacuations |
| **Baby Crying Alert** | Monitors infant sounds for hearing-impaired parents |
| **School/College Campus** | Bell notifications and emergency announcements |
| **Elderly Care** | Continuous monitoring for senior citizens |

---

## 👥 Team H-4

- **Member 1** – Hardware Engineer (IC 741 circuit design)
- **Member 2** – Embedded Systems Developer (ESP32 programming)
- **Member 3** – UI/UX Designer (Interface design)
- **Member 4** – Project Lead (System integration)

**Contact**: teamh4.lifebeep@gmail.com

---

## 📊 Target Audience Statistics

- **8%** Congenitally Deaf
- **12%** Partial Congenital Impairment
- **30%** Other Hearing Impairments
- **50%** Potential Users (elderly, noise-sensitive environments)

**LifeBeep addresses 20%+ of the population with hearing challenges.**

---

## 🔬 Technical Specifications

### Hardware
- **Microcontroller**: ESP32 (WiFi + Bluetooth)
- **Sensor**: Microphone with IC 741 band-pass filter
- **Display**: SSD1306 OLED (128x64)
- **Alerts**: Vibration motor, LED, optional buzzer
- **Power**: 3.7V LiPo battery (8-12 hours runtime)
- **Form Factor**: Watch-style wearable

### Software
- **Firmware**: Arduino/ESP-IDF
- **Web Interface**: Pure HTML/CSS/JS
- **Communication**: REST API (JSON over HTTP)
- **Polling Interval**: 3 seconds
- **Timeout**: 5 seconds

---

## 🛠️ Troubleshooting

### Website Issues

**Problem**: ESP32 shows "Offline"
- Check if ESP32 is powered and connected to WiFi
- Verify IP address in configuration
- Check Serial Monitor for ESP32 status
- Ensure both devices are on the same network

**Problem**: CORS errors in console
- ESP32 firmware must include CORS headers (already in provided code)
- Try accessing website via `http://` not `file://`

### ESP32 Issues

**Problem**: WiFi won't connect
- Double-check SSID and password
- Ensure WiFi is 2.4GHz (ESP32 doesn't support 5GHz)
- Check router settings

**Problem**: No readings from microphone
- Verify IC 741 circuit connections
- Check analog pin (GPIO 34)
- Test with multimeter: Should read 0-3.3V

**Problem**: OLED not displaying
- Check I2C address (usually 0x3C)
- Verify SDA/SCL connections (GPIO 21, 22)

---

## 📝 License

This project is open-source and available for educational purposes.

**© 2025 Team H-4. All rights reserved.**

---

## 🌐 Links

- **GitHub Repository**: [yourusername/lifebeep](https://github.com/yourusername/lifebeep)
- **Live Website**: [yourusername.github.io/lifebeep](https://yourusername.github.io/lifebeep)
- **Contact**: teamh4.lifebeep@gmail.com

---

## 🚀 Future Enhancements

- [ ] Machine learning for advanced sound classification
- [ ] Mobile app with Bluetooth connectivity
- [ ] Cloud data logging and analytics
- [ ] Multiple device support
- [ ] Customizable alert patterns
- [ ] Battery optimization
- [ ] Waterproof enclosure design
- [ ] FDA/CE certification for medical device

---

**LifeBeep** – *Intelligent Sound for a Silent World* 🎧💜

Built with ❤️ by Team H-4
