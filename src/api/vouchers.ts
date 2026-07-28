import { invoke } from '@tauri-apps/api';

export async function createVoucher(voucherData: any) {
  return await invoke('create_voucher', { voucher: voucherData });
}
