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
 const button=$('fortune-button');button.disabled=true;button.firstElementChild.textContent='月からのメッセージを読み解いています…';$('form-status').textContent='';
 try{
 const [result]=await Promise.all([generateFortune({name,birthDate}),new Promise(resolve=>setTimeout(resolve,650))]);current=result;
 $('result-label').textContent='✦ あなたの鑑定結果 · サンプル';$('result-date').textContent=result.date.replaceAll('-','.');$('person').textContent=`${result.name}さんの今日の運勢`;$('score').textContent=result.score;$('result-heading').textContent=result.title;$('summary').textContent=result.summary;
 const stars=document.querySelector('.stars');const rating=Math.min(5,Math.max(1,Math.round(result.score/20)));stars.textContent='★'.repeat(rating)+'☆'.repeat(5-rating);stars.setAttribute('aria-label',`5段階中${rating}`);
 renderDetails();setDetails(true);$('form-status').textContent='鑑定結果を表示しました。';$('result').focus({preventScroll:true});$('result').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});
 }catch{ $('form-status').textContent='結果を表示できませんでした。もう一度お試しください。'; }
 finally{button.disabled=false;button.firstElementChild.textContent='今日の運勢を占う';}
});
$('name').addEventListener('input',()=> $('name').setCustomValidity(''));
$('email-form').addEventListener('submit',event=>{event.preventDefault();$('email-status').textContent='入力ありがとうございます。現在は体験版のため、登録・配信は行われません。メールアドレスは送信・保存していません。';$('email').value='';});
