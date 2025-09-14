import fs from 'fs';
import path from 'path';

export interface WageRuleEntry {
  jobType: string;
  city: string;
  min: number;
  max: number;
}

const rulesPath = process.env.WAGE_RULES_PATH || path.join(__dirname, '../../wageRules.json');

let rules: WageRuleEntry[] | null = null;

function loadRules(): WageRuleEntry[] {
  if (!rules) {
    if (!fs.existsSync(rulesPath)) return [];
    const data = JSON.parse(fs.readFileSync(rulesPath, 'utf8')) as WageRuleEntry[];
    rules = data;
  }
  return rules;
}

export function suggestFairWage(jobType: string, city: string, offered?: number) {
  const r = loadRules();
  const found = r.find(x => x.jobType.toLowerCase() === jobType.toLowerCase() && x.city.toLowerCase() === city.toLowerCase());
  if (!found) return { fair: offered ?? 0, source: 'fallback' };
  // average within range
  const fair = Math.round((found.min + found.max) / 2);
  return { fair, source: 'rule' };
}