import https from 'https';

const urls = [
  '/',
  '/login',
  '/solar-calculator',
  '/calculator',
  '/request-survey',
  '/app/dashboard',
  '/app/leads',
  '/app/inventory',
  '/app/installations',
  '/technician/jobs',
  '/portal',
  '/portal/orders'
];

async function check(path) {
  return new Promise((resolve) => {
    const req = https.get('https://sunpower-one.netlify.app' + path, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const isHtml = (res.headers['content-type'] || '').includes('text/html');
        const isAppIndex = data.includes('id="root"') || data.includes('src="/assets/');
        const isNetlify404 = res.statusCode === 404 || data.includes('Page Not Found');
        resolve({
          path,
          statusCode: res.statusCode,
          contentType: res.headers['content-type'],
          isAppIndex,
          isNetlify404,
          title: data.match(/<title>([^<]*)<\/title>/i)?.[1] || 'No title'
        });
      });
    });
    req.on('error', err => resolve({ path, error: err.message }));
  });
}

async function run() {
  console.log('Testing live Netlify deployment endpoints:');
  for (const u of urls) {
    const res = await check(u);
    console.log(JSON.stringify(res));
  }
}

run();
