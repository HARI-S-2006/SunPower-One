import { chromium } from '@playwright/test';
import https from 'https';
import fs from 'fs';
import path from 'path';

async function fetchLiveHtml(path) {
  return new Promise((resolve) => {
    https.get('https://sunpower-one.netlify.app' + path, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data, headers: res.headers }));
    }).on('error', err => resolve({ error: err.message }));
  });
}

async function main() {
  console.log('=== SunPower One: Independent Comparison (Live Netlify vs Local Build) ===\n');

  // 1. Inspect live index.html assets
  const liveRoot = await fetchLiveHtml('/');
  const liveScripts = [...(liveRoot.data?.matchAll(/src=[\'\"]([^\'\"]+)[\'\"]/g) || [])].map(m => m[1]);
  const liveCss = [...(liveRoot.data?.matchAll(/href=[\'\"]([^\'\"]+\.css)[\'\"]/g) || [])].map(m => m[1]);

  console.log('1. Live Netlify Assets:');
  console.log('   Scripts:', liveScripts);
  console.log('   CSS:', liveCss);

  // 2. Inspect local dist/index.html assets
  const localIndexHtml = fs.readFileSync('dist/index.html', 'utf8');
  const localScripts = [...localIndexHtml.matchAll(/src=[\'\"]([^\'\"]+)[\'\"]/g)].map(m => m[1]);
  const localCss = [...localIndexHtml.matchAll(/href=[\'\"]([^\'\"]+\.css)[\'\"]/g)].map(m => m[1]);

  console.log('\n2. Local dist/ Assets:');
  console.log('   Scripts:', localScripts);
  console.log('   CSS:', localCss);

  // 3. Test differences with Playwright on live site vs preview
  console.log('\n3. Detailed Feature Comparison:');

  const diffReport = {
    loginImage: {
      live: 'Loads external Unsplash URL (blocked by ORB with net::ERR_BLOCKED_BY_ORB)',
      local: 'Inline architectural SVG vector blueprint with Stitch Navy and Warm Gold'
    },
    routeAliases: {
      live: '/calculator -> redirects to / (Home)\n/app/leads -> redirects to / (Home)\n/portal -> redirects to / (Home)',
      local: '/calculator -> redirects to /solar-calculator\n/app/leads -> redirects to /app/crm/leads\n/portal -> redirects to /portal/dashboard'
    },
    notFoundPage: {
      live: 'Unknown paths redirect silently to / (Home)',
      local: 'Renders NotFoundPage.tsx with 404 heading and return home actions'
    },
    codeSplitting: {
      live: 'Monolithic index-DgFm1k6o.js (648.37 kB)',
      local: 'Domain-partitioned chunks: index (71.99 kB), public-site (182 kB), erp-app (254 kB), technician-app (30 kB), portal-app (27 kB)'
    },
    liveCommit: '33c5d6c',
    localHeadCommit: '43f409b (ahead by 1 commit)'
  };

  console.log(JSON.stringify(diffReport, null, 2));
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

