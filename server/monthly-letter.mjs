const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function monthlyLetter({name,birthDate}, now = new Date()) {
 const end = new Date(now);end.setUTCDate(end.getUTCDate()+30);
 const format = d => new Intl.DateTimeFormat('ja-JP',{timeZone:'Asia/Tokyo',year:'numeric',month:'long',day:'numeric'}).format(d);
 let seed=0;for(const c of `${name.normalize('NFKC')}|${birthDate}|${format(now)}`)seed=(Math.imul(seed,31)+c.charCodeAt(0))>>>0;
 const themes=['小さな挑戦から、可能性を広げる1ヶ月','心と暮らしを整え、自分らしさを育む1ヶ月','つながりの中に、新しい喜びを見つける1ヶ月'];
 const items=['想いを書き留める小さなノート','穏やかな色のハンカチ','お気に入りの香りのハンドクリーム'];
 const weeks=['最初の7日間：今、心が動くことを3つ書き出して。誰かの期待より、自分の気持ちを出発点に。','8〜14日目：気になっていたことをひとつ試す時期。小さな行動に、次のヒントが見つかりそうです。','15〜21日目：人との対話を大切に。ひとりでは気づかなかった選択肢が、ふとした会話から見えてくるかもしれません。','22〜30日目：頑張ったことを振り返り、休む時間も予定に。続けたい習慣をひとつ選び、次の月へつなげましょう。'];
 const sections=[['あなたの1ヶ月',themes[seed%3]],...weeks.map((text,i)=>[`第${i+1}週のヒント`,text]),['恋愛・人とのつながり','自然体で話せる時間をつくってみて。感謝や好意を短い言葉で伝えることが、距離を縮めるきっかけに。'],['仕事のチャンス','温めているアイデアを、最初の一歩まで具体的に。相談や提案は、相手の話を聞く余裕がある日に。'],['お金との付き合い方','必要なものと、気分で欲しいものを分けてみましょう。買い足す前に今あるものを整えると、小さな満足が見つかりそうです。'],['あなたのラッキーアイテム',items[(seed>>>2)%3]],['開運アクション','朝、窓を開けて深呼吸を。今日大切にしたいことをひとつ決め、自分のペースで始めましょう。']];
 const title=`${name}さんへ、LUNAから月の便り`;
 const period=`${format(now)}〜${format(end)}の30日間`;
 const note='この便りはサンプル鑑定です。名前・生年月日をもとに用意した文章を組み合わせています。未来を保証するものではなく、毎日を楽しむヒントとしてお受け取りください。今回のご依頼に対する1通のみで、自動的な継続配信はありません。';
 return {subject:'LUNA｜あなたの今後1ヶ月と、幸運を呼ぶ小さなヒント',text:[title,period,...sections.flat(),note].join('\n\n'),html:`<!doctype html><html lang="ja"><body style="margin:0;background:#071525;color:#efe5d3;font-family:Georgia,serif;padding:30px 16px"><div style="max-width:580px;margin:auto"><p style="color:#e6c58e;letter-spacing:7px;font-size:30px">LUNA</p><h1 style="font-size:24px;font-weight:400">${escape(title)}</h1><p style="color:#c3cada">${escape(period)}</p>${sections.map(([heading,text])=>`<div style="border-top:1px solid #746345;padding:20px 0"><h2 style="color:#e6c58e;font-size:19px">${escape(heading)}</h2><p style="font-size:16px;line-height:1.9">${escape(text)}</p></div>`).join('')}<p style="font-size:12px;color:#b4becd;line-height:1.8">${escape(note)}</p></div></body></html>`};
}
