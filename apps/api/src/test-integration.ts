import axios from 'axios';

const API_URL = 'http://localhost:3000';
const CHAOS_URL = `${API_URL}/chaos?failRate=0.6`;
const TOTAL_EVENTS = 50;

async function runTest() {
    console.log('--- STARTING INTEGRATION TEST ---');
    console.log(`Firing ${TOTAL_EVENTS} events at 60% failure rate...`);

    // 1. Register Chaos Endpoint
    const endpoint = await axios.post(`${API_URL}/endpoints`, {
        url: CHAOS_URL,
        secret: 'test-secret-key',
        label: 'Integration Test Chaos'
    });
    console.log(`Registered Chaos Endpoint: ${endpoint.data.id}`);

    // 2. Fire 50 events simultaneously
    const eventPromises = [];
    for (let i = 0; i < TOTAL_EVENTS; i++) {
        eventPromises.push(
            axios.post(`${API_URL}/events`, {
                payload: { testId: i, timestamp: new Date().toISOString() }
            })
        );
    }

    await Promise.all(eventPromises);
    console.log(`Successfully enqueued ${TOTAL_EVENTS} events!`);
    console.log('Waiting for workers to process... (this will take a minute due to retries)');

    // 3. Poll for results until all are settled (delivered or dead)
    let settled = false;
    while (!settled) {
        const deliveries = await axios.get(`${API_URL}/deliveries?limit=100`);
        const statuses = deliveries.data.map((d: any) => d.status);

        const processing = statuses.filter((s: string) => s === 'pending' || s === 'retrying').length;
        const delivered = statuses.filter((s: string) => s === 'delivered').length;
        const dead = statuses.filter((s: string) => s === 'dead').length;

        process.stdout.write(`\rProgress: ${delivered} delivered, ${dead} dead, ${processing} still processing...   `);

        if (processing === 0) {
            settled = true;
            console.log('\n--- TEST COMPLETE ---');
            console.log(`Total: ${TOTAL_EVENTS}`);
            console.log(`Delivered: ${delivered}`);
            console.log(`Dead: ${dead}`);
            console.log('All deliveries reached a terminal state!');
        } else {
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }
}

runTest().catch(err => console.error('Test Failed:', err.message));
