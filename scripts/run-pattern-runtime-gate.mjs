import { spawn } from 'node:child_process';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const root = new URL('../', import.meta.url);
const baseUrl = process.argv[2] || 'http://127.0.0.1:4173/';
const chrome = process.env.SIAL_CHROME_PATH || [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].find(existsSync);
if (!chrome) throw new Error('No se encontró Chrome/Edge. Define SIAL_CHROME_PATH.');
const config = JSON.parse(await readFile(new URL('docs/pattern-runtime-pilots.web.json', root), 'utf8'));
const profile = await mkdtemp(join(tmpdir(), 'sial-pattern-gate-'));
const child = spawn(chrome, [
  '--headless=new', '--no-first-run', '--no-default-browser-check', '--disable-extensions',
  '--remote-debugging-port=0', `--user-data-dir=${profile}`, 'about:blank',
], { windowsHide: true, stdio: 'ignore' });

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
let socket;
try {
  let port;
  for (let attempt = 0; attempt < 100; attempt += 1) {
    try { port = Number((await readFile(join(profile, 'DevToolsActivePort'), 'utf8')).split('\n')[0]); break; }
    catch { await delay(100); }
  }
  if (!port) throw new Error('Chrome no abrió DevToolsActivePort');
  const target = await (await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: 'PUT' })).json();
  socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    socket.addEventListener('open', resolve, { once: true });
    socket.addEventListener('error', reject, { once: true });
  });
  let id = 0;
  const pending = new Map();
  socket.addEventListener('message', ({ data }) => {
    const message = JSON.parse(data);
    if (!message.id || !pending.has(message.id)) return;
    const { resolve, reject } = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) reject(new Error(message.error.message)); else resolve(message.result);
  });
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const nextId = ++id;
    pending.set(nextId, { resolve, reject });
    socket.send(JSON.stringify({ id: nextId, method, params }));
  });
  await send('Page.enable');
  await send('Runtime.enable');
  const evaluate = async (expression) => {
    const result = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
    return result.result.value;
  };
  const reports = [];
  for (const redirect of config.redirects || []) {
    const url = new URL(redirect.route.split('/').map(encodeURIComponent).join('/'), baseUrl).href;
    await send('Page.navigate', { url });
    let result;
    for (let attempt = 0; attempt < 100; attempt += 1) {
      await delay(100);
      result = await evaluate(`(() => {
        const target = new URL(${JSON.stringify(redirect.target.split('/').map(encodeURIComponent).join('/'))}, ${JSON.stringify(baseUrl)});
        const moduleLink = [...document.querySelectorAll('.nav-module-link')]
          .find((link) => link.textContent.trim() === ${JSON.stringify(redirect.moduleLabel)});
        return {
          current: decodeURIComponent(location.pathname),
          target: decodeURIComponent(target.pathname),
          moduleHref: moduleLink ? decodeURIComponent(new URL(moduleLink.href).pathname) : null,
          ready: document.readyState === 'complete'
        };
      })()`).catch(() => null);
      if (result?.ready && result.current === result.target && result.moduleHref) break;
    }
    const passed = Boolean(result?.ready && result.current === result.target && result.moduleHref === result.target);
    reports.push({ route: redirect.route, pattern_id: 'legacy-route-redirect', ...result,
      issues: passed ? [] : ['la URL antigua o el enlace principal del módulo no abre Gestión de pedidos'], passed });
  }
  for (const view of config.views) {
    const url = new URL(view.route.split('/').map(encodeURIComponent).join('/'), baseUrl).href;
    await send('Page.navigate', { url });
    for (const viewport of config.viewports) {
      await send('Emulation.setDeviceMetricsOverride', { ...viewport, deviceScaleFactor: 1, mobile: false });
      let report;
      for (let attempt = 0; attempt < 100; attempt += 1) {
        await delay(100);
        const ready = await evaluate('document.readyState').catch(() => null);
        if (ready !== 'complete') continue;
        report = await evaluate(`(async () => {
          const { auditPatternRuntime } = await import('/scripts/pattern-runtime-gate.mjs');
          return auditPatternRuntime(${JSON.stringify({ expected: view.expected, requireNavigation: (view.route.startsWith('Materiales y Suministros/') && !view.route.endsWith('/ajustar-pedido-sugerido.html')) || view.requireNavigation, checkRecordCount: view.checkRecordCount, localExpandedTable: view.localExpandedTable })});
        })()`).catch(() => null);
        if (report?.components && Object.values(report.components).every((item) => item.mounted > 0)) break;
      }
      reports.push({ route: view.route, pattern_id: view.pattern_id, ...report });
    }
  }
  const passed = reports.every((report) => report.passed);
  process.stdout.write(`${JSON.stringify({ passed, checked_at: new Date().toISOString(), reports }, null, 2)}\n`);
  if (!passed) process.exitCode = 1;
} finally {
  if (socket?.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ id: 999999, method: 'Browser.close' }));
    await delay(250);
  }
  socket?.close();
  child.kill();
  if (profile.startsWith(tmpdir()) && profile.includes('sial-pattern-gate-')) {
    await delay(1000);
    await rm(profile, { recursive: true, force: true, maxRetries: 30, retryDelay: 200 }).catch((error) => {
      if (error.code !== 'EBUSY' && error.code !== 'EPERM') throw error;
      process.stderr.write(`No se pudo limpiar el perfil temporal de Chrome: ${error.code}\n`);
    });
  }
}
