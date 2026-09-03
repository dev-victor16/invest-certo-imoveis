const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, '..', 'live_invest_certo.html'), 'latin1');

console.log('=== HEADER MENU DETAILS ===');
const headerMatch = html.match(/<header[\s\S]*?<\/header>/i);
if (headerMatch) {
  const headerText = headerMatch[0];
  const links = [];
  const linkRegex = /<a\s+[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let m;
  while ((m = linkRegex.exec(headerText)) !== null) {
    const text = m[2].replace(/<[^>]+>/g, '').trim();
    if (text) links.push({ text, href: m[1] });
  }
  console.log('Header links:', links);
}

console.log('\n=== MAIN SECTION TITLES ===');
const h1s = html.match(/<h1[^>]*>[\s\S]*?<\/h1>/gi) || [];
console.log('H1:', h1s.map(h => h.replace(/<[^>]+>/g, '').trim()));

const h2s = html.match(/<h2[^>]*>[\s\S]*?<\/h2>/gi) || [];
console.log('H2:', h2s.map(h => h.replace(/<[^>]+>/g, '').trim()));

const h3s = html.match(/<h3[^>]*>[\s\S]*?<\/h3>/gi) || [];
console.log('H3 count:', h3s.length, 'Sample:', h3s.slice(0, 10).map(h => h.replace(/<[^>]+>/g, '').trim()));

console.log('\n=== FOOTER DETAILS ===');
const footerMatch = html.match(/<footer[\s\S]*?<\/footer>/i);
if (footerMatch) {
  console.log('Footer text sample:');
  console.log(footerMatch[0].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').slice(0, 500));
}

console.log('\n=== SEARCH FORM FIELDS ===');
const selectMatches = html.match(/<select[^>]*name=["']([^"']+)["']/gi) || [];
console.log('Select filters:', selectMatches.map(s => s.replace(/<select[^>]*name=["']([^"']+)["']/i, '$1')));

const inputMatches = html.match(/<input[^>]*name=["']([^"']+)["']/gi) || [];
console.log('Input filters:', inputMatches.map(s => s.replace(/<input[^>]*name=["']([^"']+)["']/i, '$1')));
