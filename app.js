import {mailConfig} from './mail-config.js?v=3';
import {generateFortune,localDate} from './fortune.js';
const $ = id => document.getElementById(id);
const today = new Date();
for(let year=today.getFullYear();year>=1900;year--) $('year').add(new Option(year,year));
for(let month=1;month<=12;month++) $('month').add(new Option(month,month));
function updateDays(){
 const selected=$('day').value;
 const year=Number($('year').value)||2000, month=Number($('month').value)||1;
 const count=new Date(year,month,0).getDate();
 $('day').replaceChildren(new Option('日',''));
 for(let day=1;day<=count;day++) $('day').add(new Option(day,day));
 if(Number(selected)<=count) $('day').value=selected;
}
$('year').addEventListener('change',updateDays);$('month').addEventListener('change',updateDays);updateDays();
$('copyright-year').textContent=today.getFullYear();
let readingInput=null;
let current={categories:[{label:'総合運',score:88,text:'ひらめきを大切にして、小さな一歩を踏み出してみましょう。'},{label:'恋愛運',score:85,text:'身近な人への感謝を、言葉にして届けてみて。'},{label:'仕事運',score:91,text:'温めていたアイデアを、まずはメモに書き出してみましょう。'},{label:'金運',score:82,text:'今あるものを見直すと、新しい使い道が見つかりそう。'}],action:'気になっていたことをひとつ、10分だけ試してみましょう。',luckyColor:'シャンパンゴールド'};
function renderDetails(){
 $('details').replaceChildren();
 for(const category of current.categories){const card=document.createElement('article');card.className='detail';const heading=document.createElement('h3');heading.textContent=category.label;const score=document.createElement('span');score.textContent=`${category.score}点`;heading.append(score);const body=document.createElement('p');body.textContent=category.text;card.append(heading,body);$('details').append(card);}
 const card=document.createElement('article');card.className='detail action';const heading=document.createElement('h3');heading.textContent='✦ 今日やるべきこと';const body=document.createElement('p');body.textContent=current.action;const lucky=document.createElement('p');lucky.textContent=`ラッキーカラー：${current.luckyColor}`;card.append(heading,body,lucky);$('details').append(card);
}
function setDetails(open){$('details').hidden=!open;$('details-toggle').setAttribute('aria-expanded',String(open));$('details-toggle').textContent=open?'詳しい結果を閉じる −':'詳しい結果をみる ＋';}
$('details-toggle').addEventListener('click',()=>{renderDetails();setDetails($('details').hidden);});
$('fortune-form').addEventListener('submit',async event=>{
 event.preventDefault();const name=$('name').value.trim();
 if(!name){$('name').setCustomValidity('お名前を入力してください。');$('name').reportValidity();return;}
 const birthDate=`${$('year').value}-${$('month').value.padStart(2,'0')}-${$('day').value.padStart(2,'0')}`;
 if(birthDate>localDate()){ $('form-status').textContent='生年月日は、今日以前の日付を選んでください。';return; }
 if($('fortune-button').disabled)return;
 const button=$('fortune-button');button.disabled=true;button.firstElementChild.textContent='月からのメッセージを読み解いています…';$('form-status').textContent='';
 const dialog=$('reading-dialog');$('reading-stage').textContent='生まれた日に、そっと光をあてて。';dialog.showModal();dialog.setAttribute('aria-busy','true');
 const stages=[setTimeout(()=>{$('reading-stage').textContent='今日の流れと、あなたの想いを重ねて。';},1400),setTimeout(()=>{$('reading-stage').textContent='あなたへのメッセージを、紡いでいます。';},2900)];
 try{
 const [result]=await Promise.all([generateFortune({name,birthDate}),new Promise(resolve=>setTimeout(resolve,4400))]);current=result;readingInput={name,birthDate};
 $('result-label').textContent='✦ あなたの鑑定結果 · サンプル';$('result-date').textContent=result.date.replaceAll('-','.');$('person').textContent=`${result.name}さんの今日の運勢`;$('score').textContent=result.score;$('result-heading').textContent=result.title;$('summary').textContent=result.summary;
 const stars=document.querySelector('.stars');const rating=Math.min(5,Math.max(1,Math.round(result.score/20)));stars.textContent='★'.repeat(rating)+'☆'.repeat(5-rating);stars.setAttribute('aria-label',`5段階中${rating}`);
 dialog.close();renderDetails();setDetails(true);$('result').classList.remove('revealed');void $('result').offsetWidth;$('result').classList.add('revealed');$('form-status').textContent='鑑定結果を表示しました。';$('result').focus({preventScroll:true});$('result').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});
 }catch{ $('form-status').textContent='結果を表示できませんでした。もう一度お試しください。'; }
 finally{stages.forEach(clearTimeout);dialog.close();dialog.removeAttribute('aria-busy');button.disabled=false;button.firstElementChild.textContent='今日の運勢を占う';}
});
$('reading-dialog').addEventListener('cancel',event=>event.preventDefault());
$('name').addEventListener('input',()=> $('name').setCustomValidity(''));
let widgetId=null;
const gmailReady=Boolean(mailConfig.appsScriptEndpoint);
const mailReady=Boolean(mailConfig.endpoint && mailConfig.turnstileSiteKey);
if(gmailReady){
 $('email-note').textContent='月の便りを1通お届けします。同じアドレスへの送信は1日1回です。';
 $('mail-consent-row').hidden=false;
 $('mail-consent-row').querySelector('span').textContent='月の便り1通のお届けに同意します。名前・生年月日・メールアドレスはGoogleで送信処理されます。鑑定はサンプルです。';
}
if(mailReady){
 $('email-note').textContent='今回の月の便りを1通お送りします。継続配信の登録はありません。';
 $('mail-consent-row').hidden=false;
 const script=document.createElement('script');script.src='https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';script.async=true;
 script.onload=()=>{widgetId=window.turnstile.render('#mail-challenge',{sitekey:mailConfig.turnstileSiteKey,action:'luna-letter',theme:'dark'});};
 script.onerror=()=>{$('email-status').textContent='送信確認を読み込めませんでした。ページを再読み込みしてください。';};
 document.head.append(script);
}
$('email-form').addEventListener('submit',async event=>{
 event.preventDefault();
 if(!mailReady && !gmailReady){$('email-status').textContent='月の便りはただいま準備中です。メールアドレスは送信・保存していません。';return;}
 if(!readingInput){$('email-status').textContent='あなたの便りをつくるため、先に生年月日とお名前で今日の運勢を占ってください。';$('name').focus();return;}
 if(!$('mail-consent').checked){$('email-status').textContent='お届けに必要な情報の取り扱いをご確認ください。';return;}
 if(gmailReady){
  const frame=$('mail-response');frame.hidden=false;
  $('email-status').textContent='月の便りを送信しています。下の欄で送信結果をご確認ください。';
  const post=document.createElement('form');post.method='POST';post.action=mailConfig.appsScriptEndpoint;post.target='luna-mail-response';post.hidden=true;
  for(const [key,value] of Object.entries({...readingInput,email:$('email').value.trim(),consent:'true',website:''})){const field=document.createElement('input');field.type='hidden';field.name=key;field.value=value;post.append(field);}
  document.body.append(post);post.submit();post.remove();return;
 }
 const token=widgetId!==null ? window.turnstile?.getResponse(widgetId):'';
 if(!token){$('email-status').textContent='送信確認が終わってから、もう一度押してください。';return;}
 const button=$('email-form').querySelector('button');if(button.disabled)return;button.disabled=true;$('email-status').textContent='あなたの月の便りを、お届けする準備をしています…';
 try{
 const response=await fetch(mailConfig.endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...readingInput,email:$('email').value.trim(),token,consent:true}),signal:AbortSignal.timeout(30000)});
 const result=await response.json();
 $('email-status').textContent=result.message||'送信を確認できませんでした。もう一度お試しください。';
 if(response.ok && result.ok){$('email').value='';$('mail-consent').checked=false;}
 }catch{$('email-status').textContent='送信を確認できませんでした。通信状況を確認して、もう一度お試しください。';}
 finally{button.disabled=false;if(widgetId!==null)window.turnstile?.reset(widgetId);}
});
