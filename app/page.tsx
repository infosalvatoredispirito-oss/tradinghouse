'use client';
import {useEffect,useRef,useState} from 'react';
import {agents} from '../lib/agents';
type Message={role:'user'|'assistant',text:string,image?:string};
export default function Home(){
 const [agentId,setAgentId]=useState<string>('general');
 const [messages,setMessages]=useState<Message[]>([]);
 const [draft,setDraft]=useState('');
 const [image,setImage]=useState<string>('');
 const [busy,setBusy]=useState(false);
 const [menu,setMenu]=useState(false);
 const [error,setError]=useState('');
 const bottom=useRef<HTMLDivElement>(null);
 useEffect(()=>{try{const saved=JSON.parse(localStorage.getItem('th-ai-history')||'{}');setMessages(saved[agentId]||[])}catch{setMessages([])}},[agentId]);
 useEffect(()=>{bottom.current?.scrollIntoView({behavior:'smooth'})},[messages,busy]);
 function save(next:Message[]){setMessages(next);try{const all=JSON.parse(localStorage.getItem('th-ai-history')||'{}');all[agentId]=next.map(({role,text})=>({role,text}));localStorage.setItem('th-ai-history',JSON.stringify(all))}catch{}}
 async function send(){
  if(busy||(!draft.trim()&&!image))return;
  const next=[...messages,{role:'user' as const,text:draft.trim(),...(image?{image}: {})}];
  save(next);setDraft('');setImage('');setBusy(true);setError('');
  try{const r=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({agentId,messages:next})});const j=await r.json();if(!r.ok)throw Error(j.error||'Errore API');save([...next,{role:'assistant',text:j.text}])}catch(e:any){setError(e.message)}finally{setBusy(false)}
 }
 function upload(file?:File){if(!file)return;if(!['image/png','image/jpeg','image/webp'].includes(file.type)||file.size>4500000){setError('Carica PNG/JPG/WebP fino a 4,5 MB');return}const r=new FileReader();r.onload=()=>setImage(String(r.result));r.readAsDataURL(file)}
 const agent=agents.find(a=>a.id===agentId)||agents[0];
 return <div className="shell">
  <aside className={'sidebar '+(menu?'visible':'')}>
   <div className="brand"><span className="gem">◆</span><div>TRADING <b>HOUSE</b><small>AI WORKSPACE</small></div></div>
   <button className="new" onClick={()=>{save([]);setMenu(false)}}>＋ Nuova conversazione</button>
   <p className="eyebrow">AGENTI INTELLIGENTI</p>
   {agents.map(a=><button key={a.id} className={'agent '+(a.id===agentId?'selected':'')} onClick={()=>{setAgentId(a.id);setMenu(false);setError('')}}><span className="dot">✦</span><span><b>{a.name}</b><small>{a.description}</small></span></button>)}
   <div className="asideFoot">TRADING HOUSE AI <span>· MVP 0.1</span></div>
  </aside>
  {menu&&<div className="overlay" onClick={()=>setMenu(false)}/>}
  <main className="main">
   <header><button className="mobileMenu" onClick={()=>setMenu(!menu)}>☰</button><span className="headerAgent"><span className="blue">✦</span> {agent.name}</span><span className="demo">BETA</span></header>
   <div className="thread">
    {messages.length===0&&<section className="welcome"><div className="heroIcon">◆</div><div className="overline">INTELLIGENCE FOR TRADERS</div><h1>Il mercato cambia.<br/><em>La tua analisi evolve.</em></h1><p>Seleziona un agente, fai una domanda o carica uno screenshot del grafico. Le analisi sono indicative e non usano feed realtime.</p><div className="suggestions">{['Analizza trend e struttura','Trova supporti e resistenze','Valuta un setup con rischio'].map(t=><button key={t} onClick={()=>setDraft(t)}>{t} ↗</button>)}</div></section>}
    {messages.map((m,i)=><article key={i} className={'message '+m.role}><div className="avatar">{m.role==='user'?'TU':'◆'}</div><div className="bubble">{m.image&&<img src={m.image} alt="Grafico caricato"/>}<div>{m.text}</div></div></article>)}
    {busy&&<div className="loading">✦ L'agente sta analizzando…</div>}
    <div ref={bottom}/>
   </div>
   <div className="composerWrap">
    {error&&<div className="error">{error}</div>}
    {image&&<div className="preview"><img src={image} alt="Anteprima screenshot"/><button onClick={()=>setImage('')}>✕</button></div>}
    <div className="composer"><label className="upload" title="Carica screenshot">＋<input type="file" accept="image/png,image/jpeg,image/webp" onChange={e=>{upload(e.target.files?.[0]);e.target.value=''}} hidden/></label><textarea rows={1} value={draft} placeholder={'Chiedi a '+agent.name+'…'} onChange={e=>setDraft(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send()}}}/><button className="send" disabled={busy||(!draft.trim()&&!image)} onClick={send}>↑</button></div>
    <p className="disclaimer">Analisi educative, non consulenza finanziaria · Nessun dato di mercato in tempo reale</p>
   </div>
  </main>
 </div>
}