/** Replace this provider with a call to your own server endpoint when adding AI.
 * Never put API secrets in this public site. Keep the return shape unchanged. */
export function localDate(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
}
const messages = [
  ['思いつきを形にする、チャンスの日。','今日は、あなたの中にあるアイデアやひらめきが、現実に動き出しやすい日です。小さな一歩が、大きな未来につながります。迷っていることがあるなら、まずは試してみましょう。','気になっていたことをひとつ、10分だけ試してみましょう。'],
  ['心をほどくと、新しい風が吹く。','少し肩の力を抜くことで、見えてくる景色がありそうです。すべてを完璧にしようとせず、今のあなたが心地よいと思える選択を。何気ない会話にも、うれしいヒントが隠れています。','お気に入りの飲み物と一緒に、ひと息つく時間をつくりましょう。'],
  ['いつもの一歩に、うれしい発見。','慣れ親しんだ日常に、小さな幸せを見つけられる日。誰かの優しさや、自分が続けてきたことに目を向けてみて。あなたのペースで進むことが、明日への自信につながります。','今日うれしかったことを、寝る前に3つ書き留めてみましょう。']
];
export async function generateFortune({name, birthDate}, date = new Date()) {
  const day = localDate(date);
  let seed = 2166136261;
  for (const char of `${name.normalize('NFKC')}|${birthDate}|${day}`) seed = Math.imul(seed ^ char.charCodeAt(0), 16777619) >>> 0;
  const [title, summary, action] = messages[seed % messages.length];
  return {date:day,name,score:72+seed%25,title,summary,action, categories:[
    {label:'総合運',score:72+seed%25,text:summary},
    {label:'恋愛運',score:70+(seed>>>3)%28,text:'素直な言葉が、心の距離を少し近づけてくれそう。身近な人への「ありがとう」を、今日は言葉にしてみて。出会いを探している人は、自然体の笑顔を大切に。'},
    {label:'仕事運',score:71+(seed>>>6)%27,text:'大きな課題も、小さく分けると取り組みやすくなります。まずは一つ終わらせることから。周りの人の意見にも、次の一歩のヒントがありそうです。'},
    {label:'金運',score:70+(seed>>>9)%27,text:'今あるものを見直すと、豊かさに気づける日。買い物の前に少し時間を置いて、本当に大切に使えるものかを考えてみましょう。'}
  ],luckyColor:['シャンパンゴールド','ミッドナイトブルー','パールホワイト'][seed%3],isSample:true};
}
