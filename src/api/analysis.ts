import { invoke } from '@tauri-apps/api';

export async function fetchFinancialRatios() {
  return await invoke('calculate_financial_ratios');
}
