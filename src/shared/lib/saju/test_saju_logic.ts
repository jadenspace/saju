import { SajuCalculator } from './SajuCalculator';
import { calculateNewYearFortune } from './NewYearFortune';
import { JIJANGGAN_MAP } from './JijangganData';
import { calculateSipsin } from './TenGod';

async function runTests() {
  console.log('--- Saju Logic & New Year Fortune Verification Start ---');

  // 1. Jijanggan Test
  console.log('\n[1] Testing Jijanggan Standardization:');
  const jaJijanggan = JIJANGGAN_MAP['子'];
  const ohJijanggan = JIJANGGAN_MAP['午'];
  console.log(`子: ${JSON.stringify(jaJijanggan)} (Expected: ["癸"])`);
  console.log(`午: ${JSON.stringify(ohJijanggan)} (Expected: ["己","丁"])`);

  if (JSON.stringify(jaJijanggan) !== '["癸"]') console.error('FAILED: jaJijanggan');
  if (JSON.stringify(ohJijanggan) !== '["己","丁"]') console.error('FAILED: ohJijanggan');

  // 2. New Year Fortune Structure Test
  console.log('\n[2] Testing New Year Fortune (Expert Multi-Axis Edition):');
  const birth = { year: 1990, month: 5, day: 15, hour: 12, minute: 0 };
  const saju = SajuCalculator.calculate(birth.year, birth.month, birth.day, birth.hour, birth.minute, 'male');
  const fortune = calculateNewYearFortune(saju);

  console.log(`Year: ${fortune.year} ${fortune.gan}${fortune.ji}`);
  console.log(`Dominant: ${fortune.analysisTags.dominantTengod}, Support: ${fortune.analysisTags.supportTengod}`);
  console.log(`Event: ${fortune.analysisTags.event || 'None'}, Palace: ${fortune.analysisTags.palace || 'N/A'}`);
  console.log(`Year Nature: ${fortune.yearNature}`);
  console.log(`Summary: ${fortune.yearSummary.summaryText}`);
  
  console.log('\n[Fortune Areas]:');
  console.log(`Money Score: ${fortune.fortuneAreas.money.score}`);
  console.log(`Career Strategy: ${fortune.fortuneAreas.career.strategy}`);
  
  console.log('\n[Fortune Guide]:');
  console.log(`Do: ${fortune.fortuneGuide.do.join(', ')}`);
  console.log(`Keywords: ${fortune.fortuneGuide.keywords.join(', ')}`);

  if (!fortune.analysisTags || !fortune.analysisTags.dominantTengod) {
    console.error('FAILED: New Year Fortune tags are missing');
  }

  // 3. Daeun Precision Test
  console.log('\n[3] Testing Daeun Precision (1990.05.15 12:00 male):');
  console.log(`Daeun Start Age: ${saju.daeun[0].startAge} (Expected: 7)`);

  console.log('\n--- Verification Finished ---');
}

runTests().catch(console.error);
