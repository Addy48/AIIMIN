try {
  const XLSX = require('xlsx');
  console.log('XLSX version:', XLSX.version);
} catch (e) {
  console.error('XLSX not found');
  process.exit(1);
}
