import { SajuCalculator } from './SajuCalculator';
import { calculateNewYearFortune } from './NewYearFortune';
import { JIJANGGAN_MAP } from './JijangganData';
import { calculateSipsin } from './TenGod';

async function runTests() {
  console.log('--- Saju Logic Verification Start ---');

  // 1. Jijanggan Test
  console.log('\n[1] Testing Jijanggan Standardization:');
  const jaJijanggan = JIJANGGAN_MAP['子'];
  const ohJijanggan = JIJANGGAN_MAP['午'];
  console.log(`子: ${JSON.stringify(jaJijanggan)} (Expected: ["癸"])`);
  console.log(`午: ${JSON.stringify(ohJijanggan)} (Expected: ["己","丁"])`);

  if (JSON.stringify(jaJijanggan) !== '["癸"]') console.error('FAILED: jaJijanggan');
  if (JSON.stringify(ohJijanggan) !== '["己","丁"]') console.error('FAILED: ohJijanggan');

  // 2. Ten God Consistency Test
  console.log('\n[2] Testing Ten God Consistency:');
  const birth = { year: 1990, month: 5, day: 15, hour: 12, minute: 0 };
  const saju = SajuCalculator.calculate(birth.year, birth.month, birth.day, birth.hour, birth.minute, 'male');
  const fortune = calculateNewYearFortune(saju);

  // NewYearFortune uses YEAR_GAN = '丙', YEAR_JI = '午' (Constant in code)
  // Day Master of 1990-05-15 12:00 (Solar)
  // Let's see what SajuCalculator says for DM
  const dm = saju.day.ganHan;
  console.log(`Day Master: ${dm} (${saju.day.gan})`);
  
  const expectedGanSipsin = calculateSipsin(dm, '丙');
  const expectedJiSipsin = calculateSipsin(dm, '午');
  
  console.log(`Fortune Year Gan Sipsin: ${fortune.overall.details[0]} (Expected: ... ${expectedGanSipsin})`);
  console.log(`Fortune Year Ji Sipsin: ${fortune.overall.details[1]} (Expected: ... ${expectedJiSipsin})`);

  // 3. Daeun Precision Test
  console.log('\n[3] Testing Daeun Precision (1990.05.15 12:00 male):');
  console.log(`Daeun Direction: ${saju.daeunDirection} (Expected: forward)`);
  console.log(`Daeun Start Age: ${saju.daeun[0].startAge} (Expected: 7)`);
  
  const saju2 = SajuCalculator.calculate(2000, 1, 1, 0, 1, 'male');
  console.log(`\n[4] Testing Daeun Precision (2000.01.01 00:01 male):`);
  console.log(`Daeun Start Age: ${saju2.daeun[0].startAge} (Expected: 8)`);

  // 4. Ohaeng Weighted Distribution
  console.log('\n[5] Testing Ohaeng Distribution (Surface only vs Weighted):');
  const pillars = [saju.year, saju.month, saju.day, saju.hour];
  // Internal method check (since it's private, we check the return value of calculate if we can, 
  // but calculate() doesn't expose the option yet. Let's check the result in साजु object)
  console.log('Surface Distribution:', saju.ohaengDistribution);
  
  console.log('\n--- Verification Finished ---');
}

runTests().catch(console.error);
