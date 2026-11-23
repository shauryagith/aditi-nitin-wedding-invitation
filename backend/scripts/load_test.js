import http from 'http';
import app from '../dist/server.js';

// Benchmark helper for simulated concurrent virtual users
async function runConcurrencyTier(tierUsers, totalRequestsPerUser, baseUrl) {
  console.log(`\n========================================`);
  console.log(`Starting Load Tier: ${tierUsers} Concurrent Virtual Users`);
  console.log(`Total Requests: ${tierUsers * totalRequestsPerUser}`);
  console.log(`========================================`);

  const endpoints = ['/api/health', '/api/wedding', '/api/events', '/api/gallery', '/api/music'];
  const latencies = [];
  let successfulRequests = 0;
  let failedRequests = 0;

  const startTime = Date.now();

  const worker = async (userId) => {
    for (let i = 0; i < totalRequestsPerUser; i++) {
      const endpoint = endpoints[Math.floor(Math.random() * endpoints.length)];
      const reqStart = performance.now();
      try {
        const res = await fetch(`${baseUrl}${endpoint}`);
        const reqEnd = performance.now();
        latencies.push(reqEnd - reqStart);
        if (res.ok) {
          successfulRequests++;
        } else {
          failedRequests++;
        }
      } catch (err) {
        failedRequests++;
      }
    }
  };

  // Launch parallel virtual users
  const workers = Array.from({ length: tierUsers }, (_, idx) => worker(idx + 1));
  await Promise.all(workers);

  const totalDurationMs = Date.now() - startTime;
  const durationSec = totalDurationMs / 1000;
  const totalRequests = successfulRequests + failedRequests;
  const rps = (totalRequests / durationSec).toFixed(2);

  latencies.sort((a, b) => a - b);
  const avgLatency = (latencies.reduce((a, b) => a + b, 0) / latencies.length).toFixed(2);
  const p50 = latencies[Math.floor(latencies.length * 0.5)]?.toFixed(2) || '0';
  const p90 = latencies[Math.floor(latencies.length * 0.9)]?.toFixed(2) || '0';
  const p95 = latencies[Math.floor(latencies.length * 0.95)]?.toFixed(2) || '0';
  const p99 = latencies[Math.floor(latencies.length * 0.99)]?.toFixed(2) || '0';
  const successRate = ((successfulRequests / totalRequests) * 100).toFixed(1);

  console.log(`Results for ${tierUsers} VUs:`);
  console.log(`  Duration:         ${durationSec.toFixed(2)}s`);
  console.log(`  Total Requests:   ${totalRequests}`);
  console.log(`  Successful (200): ${successfulRequests} (${successRate}%)`);
  console.log(`  Failed / Errors:  ${failedRequests}`);
  console.log(`  Throughput (RPS): ${rps} req/sec`);
  console.log(`  Average Latency:  ${avgLatency} ms`);
  console.log(`  P50 Latency:      ${p50} ms`);
  console.log(`  P90 Latency:      ${p90} ms`);
  console.log(`  P95 Latency:      ${p95} ms`);
  console.log(`  P99 Latency:      ${p99} ms`);

  return {
    tierUsers,
    totalRequests,
    rps,
    avgLatency,
    p50,
    p90,
    p95,
    p99,
    successRate,
  };
}

async function runAllBenchmarks() {
  const PORT = 5544;
  const server = app.listen(PORT);
  const baseUrl = `http://127.0.0.1:${PORT}`;

  try {
    const results = [];
    results.push(await runConcurrencyTier(10, 20, baseUrl));
    results.push(await runConcurrencyTier(25, 20, baseUrl));
    results.push(await runConcurrencyTier(50, 20, baseUrl));

    console.log('\n\n================ LOAD TEST SUMMARY ================');
    console.table(results);
  } finally {
    server.close();
  }
}

runAllBenchmarks().catch(console.error);
