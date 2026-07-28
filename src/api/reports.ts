import { invoke } from '@tauri-apps/api';

export async function fetchTrialBalance() {
  return await invoke('get_trial_balance');
}

export async function fetchBalanceSheet() {
  return await invoke('get_balance_sheet');
}
