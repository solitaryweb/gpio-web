// ตั้งค่า URL ของ Raspberry Pi
const RASPBERRY_PI_URL = 'http://your-raspberry-pi-ip:5000';

// รายการ GPIO ที่ใช้ได้
const VALID_PINS = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27];

// สร้าง GPIO cards
function createGPIOCards() {
    const container = document.getElementById('gpio-container');
    VALID_PINS.forEach(pin => {
        container.innerHTML += `
            <div class="gpio-card">
                <h3>GPIO ${pin}</h3>
                <div>
                    Status: <span id="status-text-${pin}">OFF</span>
                    <span class="status-indicator" id="status-indicator-${pin}"></span>
                </div>
                <button 
                    class="gpio-button off" 
                    id="button-${pin}" 
                    onclick="togglePin(${pin})"
                    type="button"
                >
                    Turn ON
                </button>
            </div>
        `;
    });
}

// ฟังก์ชันควบคุม GPIO
function togglePin(pin) {
    fetch(`${RASPBERRY_PI_URL}/toggle/${pin}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            updatePinStatus(pin, data.state);
        }
    })
    .catch(error => console.error('Error:', error));
}

// อัพเดทสถานะ
function updatePinStatus(pin, state) {
    const button = document.getElementById(`button-${pin}`);
    const statusText = document.getElementById(`status-text-${pin}`);
    const statusIndicator = document.getElementById(`status-indicator-${pin}`);

    if (state) {
        button.textContent = 'Turn OFF';
        button.className = 'gpio-button on';
        statusText.textContent = 'ON';
        statusIndicator.className = 'status-indicator status-on';
    } else {
        button.textContent = 'Turn ON';
        button.className = 'gpio-button off';
        statusText.textContent = 'OFF';
        statusIndicator.className = 'status-indicator status-off';
    }
}

// เช็คสถานะทุก 1 วินาที
function checkStatus() {
    fetch(`${RASPBERRY_PI_URL}/status`)
        .then(response => response.json())
        .then(states => {
            for (const [pin, state] of Object.entries(states)) {
                updatePinStatus(parseInt(pin), state);
            }
        })
        .catch(error => console.error('Error:', error));
}

// เริ่มต้นการทำงาน
document.addEventListener('DOMContentLoaded', () => {
    createGPIOCards();
    checkStatus();
    setInterval(checkStatus, 1000);
}); 