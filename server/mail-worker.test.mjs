import test from 'node:test';
import assert from 'node:assert/strict';
import worker from './mail-worker.mjs';
import {monthlyLetter} from './monthly-letter.mjs';
const env={ALLOWED_ORIGIN:'https://kawase-creative.github.io',RESEND_API_KEY:'test-only',MAIL_FROM:'LUNA <test@example.com>',TURNSTILE_SECRET:'test-only',MAIL_LIMITER:{limit:async()=>({success:true})}};
const data={name:'はるか',birthDate:'2000-02-29',email:'reader@example.com',token:'test-token',consent:true};
const req=(body=data,origin=env.ALLOWED_ORIGIN)=>new Request('https://test.invalid/letter',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json','CF-Connecting-IP':'192.0.2.1'},body:JSON.stringify(body)});
test('mail endpoint validations, provider handling and escaped template',async()=>{
 const original=globalThis.fetch;let mails=0;let mode='success';
 globalThis.fetch=async(url,options)=>{
  if(url.includes('siteverify'))return Response.json({success:mode!=='captcha',hostname:'kawase-creative.github.io',action:'luna-letter'});
  assert.equal(url,'https://api.resend.com/emails');mails++;const payload=JSON.parse(options.body);assert.equal(payload.to[0],data.email);assert.match(payload.text,/ラッキーアイテム/);assert.match(payload.text,/はるか/);assert.match(payload.text,/サンプル鑑定/);assert.match(options.headers['Idempotency-Key'],/^luna-[a-f0-9]{64}$/);return Response.json(mode==='provider'?{message:'failed'}:{id:'test-id'},{status:mode==='provider'?500:200});
 };
 try{
  assert.equal((await worker.fetch(req(data,'https://other.example'),env)).status,403);
  assert.equal((await worker.fetch(req(),{...env,RESEND_API_KEY:''})).status,503);
  for(const change of [{birthDate:'2001-02-29'},{consent:false},{email:'bad'},{name:'\n'},{token:''}])assert.equal((await worker.fetch(req({...data,...change}),env)).status,400);
  assert.equal(mails,0);
  mode='captcha';assert.equal((await worker.fetch(req(),env)).status,400);assert.equal(mails,0);
  assert.equal((await worker.fetch(req(),{...env,MAIL_LIMITER:{limit:async()=>({success:false})}})).status,429);
  mode='provider';assert.equal((await worker.fetch(req(),env)).status,502);
  mode='success';const response=await worker.fetch(req(),env);assert.equal(response.status,200);assert.equal((await response.json()).ok,true);
  const letter=monthlyLetter({name:'<img src=x>',birthDate:'2000-01-01'});assert(!letter.html.includes('<img src=x>'));assert(letter.html.includes('&lt;img src=x&gt;'));
 }finally{globalThis.fetch=original;}
});
