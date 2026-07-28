import { invoke } from '@tauri-apps/api';

export async function fetchLedgers() {
  return await invoke('get_ledgers');
}
