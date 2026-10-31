import https from 'https';

https.get('https://sunpower-one.netlify.app/', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Response headers:');
    console.log(res.headers);
    console.log('\nHTML snippet:');
    console.log(data.slice(0, 500));
    console.log('...\n' + data.slice(-500));
  });
});
