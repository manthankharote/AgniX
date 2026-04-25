const net = require('net');

function checkPort(port) {
    return new Promise((resolve) => {
        const client = new net.Socket();
        client.setTimeout(1000);
        
        client.connect(port, '127.0.0.1', () => {
            console.log(`Port ${port} is OPEN (Service is running).`);
            client.destroy();
            resolve(true);
        });
        
        client.on('error', () => {
            console.log(`Port ${port} is CLOSED (Service is NOT running).`);
            resolve(false);
        });
        
        client.on('timeout', () => {
            console.log(`Port ${port} TIMED OUT.`);
            client.destroy();
            resolve(false);
        });
    });
}

async function run() {
    await checkPort(8000); // ML Service
    await checkPort(27017); // MongoDB
}
run();
