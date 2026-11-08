import https from 'node:https'

const TARGET_URL = 'https://sunpower-one.netlify.app'

function fetchHeaders(url) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, { method: 'HEAD' }, (res) => {
      resolve({
        statusCode: res.statusCode,
        headers: res.headers,
      })
    })
    req.on('error', reject)
    req.end()
  })
}

function fetchBody(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => resolve({ statusCode: res.statusCode, headers: res.headers, body: data }))
    }).on('error', reject)
  })
}

async function main() {
  console.log('--- Inspecting Netlify Headers for:', TARGET_URL)
  const rootRes = await fetchHeaders(TARGET_URL)
  console.log('Status:', rootRes.statusCode)
  console.log('Server:', rootRes.headers['server'])
  console.log('Cache-Control:', rootRes.headers['cache-control'])
  console.log('Strict-Transport-Security:', rootRes.headers['strict-transport-security'])
  console.log('X-Content-Type-Options:', rootRes.headers['x-content-type-options'])
  console.log('X-Frame-Options:', rootRes.headers['x-frame-options'])
  console.log('ETag:', rootRes.headers['etag'])
  console.log('Age:', rootRes.headers['age'])
  console.log('X-Nf-Request-Id:', rootRes.headers['x-nf-request-id'])

  console.log('\n--- Fetching Root HTML to parse asset references ---')
  const htmlRes = await fetchBody(TARGET_URL)
  const scriptRegex = /src="(\/assets\/[^"]+)"/g
  const cssRegex = /href="(\/assets\/[^"]+)"/g

  const scripts = []
  const stylesheets = []
  let match
  while ((match = scriptRegex.exec(htmlRes.body)) !== null) {
    scripts.push(match[1])
  }
  while ((match = cssRegex.exec(htmlRes.body)) !== null) {
    stylesheets.push(match[1])
  }

  console.log('Scripts found:', scripts)
  console.log('Stylesheets found:', stylesheets)

  console.log('\n--- Measuring Asset Sizes & Compression ---')
  for (const assetPath of [...scripts, ...stylesheets]) {
    const assetUrl = `${TARGET_URL}${assetPath}`
    const assetHeaders = await fetchHeaders(assetUrl)
    console.log(`Asset: ${assetPath}`)
    console.log(`  Content-Type: ${assetHeaders.headers['content-type']}`)
    console.log(`  Content-Length: ${assetHeaders.headers['content-length']} bytes`)
    console.log(`  Cache-Control: ${assetHeaders.headers['cache-control']}`)
    console.log(`  ETag: ${assetHeaders.headers['etag']}`)
  }
}

main().catch(console.error)

