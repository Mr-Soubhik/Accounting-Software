import { invoke } from '@tauri-apps/api';

export async function submitInvoice(invoicePayload: any) {
  return await invoke('create_invoice', { invoiceData: invoicePayload });
}
