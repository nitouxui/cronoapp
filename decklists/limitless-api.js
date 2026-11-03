// Limitless tournament API adapter (documented public endpoints only).
// This API provides tournament decklists and results, NOT a general card catalog.
// Reference: https://docs.limitlesstcg.com/developer
const BASE = 'https://play.limitlesstcg.com/api';
export async function getLimitlessGames({signal}={}) {
  const response = await fetch(BASE+'/games',{signal,headers:{Accept:'application/json'}});
  if(!response.ok) throw new Error('Limitless API HTTP '+response.status);
  return response.json();
}
export function normalizeLimitlessDecklist(entries=[]) {
  if(!Array.isArray(entries)) return [];
  return entries.filter(c=>c&&typeof c.name==='string').map(c=>({
    name:c.name.trim(),set:String(c.set||''),number:String(c.number||''),
    quantity:Number(c.count??c.quantity??1)
  })).filter(c=>Number.isInteger(c.quantity)&&c.quantity>0);
}
// Do not use undocumented Limitless card database endpoints or scrape card images.
// Keep TCGdex as the card source until a licensed, documented alternative exists.
