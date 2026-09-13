import {monthlyLetter} from './monthly-letter.mjs';
export default {
 async fetch(request, env) {
  const origin=request.headers.get('Origin');
  const headers={'Content-Type':'application/json;charset=utf-8','Cache-Control':'no-store','Vary':'Origin'};
  if(origin===env.ALLOWED_ORIGIN)Object.assign(headers,{'Access-Control-Allow-Origin':origin,'Access-Control-Allow-Methods':'POST, OPTIONS','Access-Control-Allow-Headers':'Content-Type'});
  const reply=(status,message)=>new Response(JSON.stringify({ok:status===200,message}),{status,headers});
  if(!env.ALLOWED_ORIGIN || origin!==env.ALLOWED_ORIGIN)return reply(403,'このページからは送信できません。');
  if(new URL(request.url).pathname!=='/letter')return reply(404,'ページが見つかりません。');
  if(request.method==='OPTIONS')return new Response(null,{status:204,headers});
  if(request.method!=='POST')return reply(405,'送信方法を確認してください。');
  if(!env.RESEND_API_KEY||!env.MAIL_FROM||!env.TURNSTILE_SECRET||!env.MAIL_LIMITER)return reply(503,'月の便りは、ただいま準備中です。');
  try{
   if(!request.headers.get('Content-Type')?.includes('application/json'))return reply(415,'入力形式を確認してください。');
   // Limit the streamed body even if Content-Length is absent or forged.
   const reader=request.body?.getReader();if(!reader)return reply(400,'入力内容を確認してください。');
   let size=0;const chunks=[];
   while(true){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>8192){await reader.cancel();return reply(413,'入力が長すぎます。');}chunks.push(value);}
   const bytes=new Uint8Array(size);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length;}
   let data;try{data=JSON.parse(new TextDecoder().decode(bytes));}catch{return reply(400,'入力内容を確認してください。');}
   if(!data || typeof data!=='object')return reply(400,'入力内容を確認してください。');
   const {email,name,birthDate,token,consent}=data;
   if(typeof email!=='string'||email.length>254||! /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email)||/[\r\n]/.test(email)||typeof name!=='string'||!name.trim()||name.length>30||/[\r\n]/.test(name)||typeof birthDate!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(birthDate)||consent!==true||typeof token!=='string'||token.length>2048||!token)return reply(400,'お名前・生年月日・メールアドレスと同意を確認してください。');
   const birth=new Date(birthDate+'T00:00:00Z');
   if(!Number.isFinite(birth.valueOf())||birth.toISOString().slice(0,10)!==birthDate||birthDate<'1900-01-01'||birth>new Date())return reply(400,'生年月日を確認してください。');
   const ip=request.headers.get('CF-Connecting-IP');if(!ip)return reply(403,'接続を確認してください。');
   if(!(await env.MAIL_LIMITER.limit({key:ip})).success)return reply(429,'少し時間を置いてから、もう一度お試しください。');
   const verification=await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify',{method:'POST',body:new URLSearchParams({secret:env.TURNSTILE_SECRET,response:token,remoteip:ip}),signal:AbortSignal.timeout(10000)});
   if(!verification.ok)return reply(503,'確認サービスに接続できません。もう一度お試しください。');
   const checked=await verification.json();
   if(!checked.success||checked.hostname!==new URL(env.ALLOWED_ORIGIN).hostname||checked.action!=='luna-letter')return reply(400,'送信確認をやり直してください。');
   const letter=monthlyLetter({name:name.trim(),birthDate});
   // Hash idempotency input; do not expose names, dates or addresses in a header.
   const hash=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(`${email.toLowerCase()}|${name.trim()}|${birthDate}|${new Date().toISOString().slice(0,10)}`));
   const key=Array.from(new Uint8Array(hash),n=>n.toString(16).padStart(2,'0')).join('');
   const sent=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${env.RESEND_API_KEY}`,'Content-Type':'application/json','Idempotency-Key':`luna-${key}`},body:JSON.stringify({from:env.MAIL_FROM,to:[email],...letter}),signal:AbortSignal.timeout(15000)});
   const result=await sent.json();if(!sent.ok||!result.id)return reply(502,'送信を完了できませんでした。時間を置いてお試しください。');
   return reply(200,'月の便りの送信を受け付けました。届くまで少しお待ちください。見当たらない場合は迷惑メールフォルダもご確認ください。');
  }catch{return reply(503,'送信を確認できませんでした。時間を置いてお試しください。');}
 }
};
