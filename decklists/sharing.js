import {initializeApp} from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js';
import {getAuth,GoogleAuthProvider,signInWithPopup,onAuthStateChanged} from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js';
import {getDatabase,ref,get,set,update} from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-database.js';

const app=initializeApp({apiKey:"AIzaSyDQpTvOLF-RqYZQJHe8cCk_0E8E5M5GkK8",authDomain:"cronoapp-97aa6.firebaseapp.com",databaseURL:"https://cronoapp-97aa6-default-rtdb.firebaseio.com",projectId:"cronoapp-97aa6",appId:"1:482155443294:web:b62c46a3ae16ca551630cf"});
const auth=getAuth(app),db=getDatabase(app),$=id=>document.getElementById(id);
const valid=code=>/^DK-[A-Z0-9]{10}$/.test(code);
const PUBLISHED_KEY="cronoapp-published-decklist-v1:";
let current=null,open=false,busy=false,busyText="",authRevision=0;

function cacheKey(uid){return PUBLISHED_KEY+uid}
function cacheRead(uid){try{return localStorage.getItem(cacheKey(uid))}catch(e){return null}}
function cacheWrite(uid,code){try{localStorage.setItem(cacheKey(uid),code)}catch(e){}}
function cacheClear(uid){try{localStorage.removeItem(cacheKey(uid))}catch(e){}}
function message(text){$('shareStatus').textContent=text||''}
function friendlyError(e){
 const code=String(e?.code||'');
 if(code.includes("permission-denied")||code.includes("PERMISSION_DENIED"))return 'Firebase denegó el permiso. Verifica las reglas de acceso.';
 return e?.message||'No se pudo completar la operación. Inténtalo nuevamente.';
}
function shareLink(code){return new URL('./consultar/?list='+encodeURIComponent(code),location.href).href}
function syncUI(){
 const signedIn=!!auth.currentUser;
 $('loginBtn').hidden=signedIn;
 $('shareBtn').disabled=!signedIn||busy||!!current;
 $('shareBtn').textContent=current?'Decklist pública':busy?busyText:'Hacer Decklist pública';
 $('shareBtn').classList.toggle('is-public',!!current);
 $('shareDetailsBtn').hidden=!current;
 $('shareDetailsBtn').setAttribute('aria-expanded',String(!!current&&open));
 $('shareResult').hidden=!current||!open;
 if(current){
  $('shareCode').value=current;
  $('shareUrl').value=shareLink(current);
 }else{
  $('shareCode').value='';
  $('shareUrl').value='';
 }
 $('authStatus').textContent=signedIn?'Sesión iniciada: '+(auth.currentUser.email||auth.currentUser.displayName||'Cuenta Google'):'Inicia sesión con Google para hacer pública tu Decklist.';
}
function setDetails(visible,focus=false){
 open=!!visible&&!!current;
 syncUI();
 if(focus&&open)$('shareCloseBtn').focus();
}

$('shareDetailsBtn').addEventListener('click',()=>setDetails(!open,true));
$('shareCloseBtn').addEventListener('click',()=>{setDetails(false);$('shareDetailsBtn').focus()});
document.addEventListener('keydown',e=>{
 if(e.key==='Escape'&&open){setDetails(false);$('shareDetailsBtn').focus()}
});
document.addEventListener('pointerdown',e=>{
 if(open&&!$('shareMenu').contains(e.target))setDetails(false);
});

onAuthStateChanged(auth,async user=>{
 const thisRevision=++authRevision;
 current=null;open=false;busy=false;busyText='';message('');syncUI();
 if(!user)return;
 const saved=cacheRead(user.uid);
 if(!saved||!valid(saved))return;
 busy=true;busyText='Comprobando publicación…';syncUI();
 try{
  const snap=await get(ref(db,'sharedDecklists/'+saved));
  if(thisRevision!==authRevision)return;
  const data=snap.exists()?snap.val():null;
  if(data?.active===true&&data.ownerUid===user.uid){
   current=saved;
  }else{
   cacheClear(user.uid);
  }
 }catch(e){
  if(thisRevision!==authRevision)return;
  message('No se pudo verificar la publicación guardada. Revisa tu conexión e inténtalo nuevamente.');
 }finally{
  if(thisRevision===authRevision){busy=false;busyText='';syncUI()}
 }
});

$('loginBtn').addEventListener('click',async()=>{
 try{await signInWithPopup(auth,new GoogleAuthProvider())}
 catch(e){message(friendlyError(e))}
});

$('shareBtn').addEventListener('click',async()=>{
 if(busy||current)return;
 const user=auth.currentUser;
 if(!user||!user.emailVerified){
  message('Inicia sesión con una cuenta Google verificada para publicar tu Decklist.');
  return;
 }
 const deck=window.getDeckSnapshot();
 const total=Object.values(deck.cards).reduce((sum,c)=>sum+Number(c.quantity||0),0);
 if(total!==60){message('Completa las 60 cartas antes de hacer pública tu Decklist. Actualmente tienes '+total+'/60.');return}
 if(!deck.player.trim()){message('Agrega el nombre del jugador en «Mi mazo» antes de publicar.');return}
 busy=true;busyText='Publicando…';message('');syncUI();
 try{
  const alphabet='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const random=crypto.getRandomValues(new Uint8Array(10));
  const code='DK-'+Array.from(random,n=>alphabet[n%alphabet.length]).join('');
  await set(ref(db,'sharedDecklists/'+code),{
   ownerUid:user.uid,active:true,name:deck.name,player:deck.player,cards:deck.cards,createdAt:Date.now()
  });
  current=code;
  cacheWrite(user.uid,code);
  open=true;
  message('Decklist pública. Puedes copiar el código o el enlace desde el ícono de información.');
 }catch(e){message(friendlyError(e))}
 finally{busy=false;busyText='';syncUI()}
});

$('unshareBtn').addEventListener('click',async()=>{
 const user=auth.currentUser,code=current;
 if(!user||!code||busy)return;
 if(!confirm('¿Dejar de hacer pública esta Decklist? Su código y enlace dejarán de funcionar.'))return;
 busy=true;busyText='Actualizando…';$('unshareBtn').disabled=true;message('');syncUI();
 try{
  await update(ref(db,'sharedDecklists/'+code),{active:false});
  cacheClear(user.uid);
  current=null;open=false;
  message('Decklist privada nuevamente. El código y el enlace fueron revocados.');
 }catch(e){message(friendlyError(e))}
 finally{busy=false;busyText='';$('unshareBtn').disabled=false;syncUI()}
});

async function copyField(id,label){
 const value=$(id).value;
 if(!value)return;
 try{
  await navigator.clipboard.writeText(value);
  message(label+' copiado al portapapeles.');
 }catch(e){
  $(id).focus();$(id).select();
  message('No se pudo copiar automáticamente. Selecciona el texto para copiarlo.');
 }
}
$('copyShare').addEventListener('click',()=>copyField('shareUrl','Enlace'));
$('copyCode').addEventListener('click',()=>copyField('shareCode','Código'));
