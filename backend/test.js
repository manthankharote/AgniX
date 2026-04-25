async function test() {
    try {
        const res = await fetch('http://localhost:5000/api/recommend', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                soil: { N: 90, P: 42, K: 43, type: 'Black', pH: 6.5, moisture: 'Medium' },
                weather: { temperature: 28, humidity: 70, rainfall: 150 },
                water: { availability: 'Medium', pH: 7.0 },
                season: 'Kharif'
            })
        });
        const data = await res.json();
        console.log("RESPONSE:", data);
    } catch (e) {
        console.error('FAILED!', e);
    }
}
test();
