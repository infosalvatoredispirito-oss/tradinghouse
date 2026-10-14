import OpenAI from 'openai';
import {agents,basePrompt} from '../../../lib/agents';
export const runtime='nodejs';
export async function POST(req:Request){
 try{
  if(!process.env.OPENAI_API_KEY)return Response.json({error:'Chiave OpenAI non configurata sul server.'},{status:503});
  const body=await req.json();
  const agent=agents.find(a=>a.id===body.agentId)||agents[0];
  const messages=Array.isArray(body.messages)?body.messages.slice(-12):[];
  if(!messages.length)return Response.json({error:'Messaggio mancante'},{status:400});
  const input=messages.map((m:any)=>({role:m.role==='assistant'?'assistant':'user',content:[...(typeof m.text==='string'?[{type:m.role==='assistant'?'output_text':'input_text',text:m.text.slice(0,8000)}]:[]),...(m.role==='user'&&typeof m.image==='string'&&/^data:image\/(png|jpeg|webp);base64,/.test(m.image)&&m.image.length<7000000?[{type:'input_image',image_url:m.image}]:[])]}));
  const client=new OpenAI({apiKey:process.env.OPENAI_API_KEY});
  const response=await client.responses.create({model:process.env.OPENAI_MODEL||'gpt-4.1-mini',instructions:basePrompt+'\n'+agent.instructions,input:input as any,max_output_tokens:1200});
  return Response.json({text:response.output_text||'Nessuna risposta disponibile'});
 }catch(e:any){console.error(e?.message);return Response.json({error:'Errore API. Verifica credenziali e limiti.'},{status:500})}
}