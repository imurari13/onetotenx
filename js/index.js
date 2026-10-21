const $=s=>document.querySelector(s),clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
/* stats */
const S=[["LIVE FORMAT", "Live", "Webinars that feel like a room.", "Interactive sessions where everyone can ask, answer and be seen, not a one-way broadcast.", "CHAT • Q&A • POLLS", "🎥"], ["ATTENDEE RATING", "4.8<em>/5</em>", "Rated by people who showed up.", "Verified reviews from attendees who learned something and met someone worth knowing.", "VERIFIED REVIEWS • SPEAKERS • COMMUNITY", "⭐"], ["SPEAKERS", "500<em>+</em>", "Experts who love sharing.", "Founders, engineers, creators and teachers hosting sessions across every field.", "ANY TOPIC • ANY LEVEL • ANY TIME ZONE", "🎤"], ["SESSIONS HOSTED", "10,000<em>+</em>", "Knowledge, shared in the open.", "Workshops, panels and fireside chats that end with notes, replays and new connections.", "WORKSHOPS • PANELS • AMAs", "📊"], ["COUNTRIES", "40<em>+</em>", "One community, everywhere.", "People join from every continent to swap ideas and build networks that outlast the session.", "GLOBAL • NETWORKING • 1:1 INTROS", "🌍"], ["ATTENDEES", "<em>2+ lakh</em>", "Learning, together.", "Learners, builders and curious minds who came for one session and stayed for the people.", "GROWING DAILY • OPEN COMMUNITY • AND COUNTING", "🎓"], ["SECURE CHECKOUT", "<em>100%</em>", "Pay your way, safely.", "Cards, UPI, wallets and more through trusted gateways. Instant ticket, instant access.", "ENCRYPTED • INSTANT TICKET • EASY REFUNDS", "🔒"]];
const ART=[[['',150,34,18,6],['',70,6,0,0],['',44,52,-6,0],['',120,2,48,-8]],[['',140,40,-4,4],['',130,6,30,-4],['',110,50,56,8]],[['',90,2,0,-6],['',130,34,22,0],['',110,2,52,0]],[['',150,22,24,0],['',90,50,-4,10],['',90,46,64,-30]],[['',90,10,0,-8],['',150,40,26,0],['',120,0,50,-4]],[['',100,50,0,8],['',150,28,26,0],['',110,50,62,-4]],[['',130,8,12,-6],['',150,36,40,0],['',80,58,6,10]]];
const st=$('#stats');S.forEach((s,i)=>st.insertAdjacentHTML('beforeend',`<div class="stat" data-i="${i+1}"><div class="c"><div><div class="eyebrow">${s[0]}</div><div class="big" style="margin-top:20px">${s[1]}</div><h3>${s[2]}</h3><p class="sub" style="font-size:15px;max-width:430px">${s[3]}</p><div class="tags">${s[4]}</div></div><div class="art">${ART[i].map(a=>`<span style="font-size:${a[1]}px;left:${a[2]}%;top:${a[3]}%;--r:${a[4]}deg;animation-delay:-${a[2]/10}s">${a[0]}</span>`).join('')}</div></div></div>`));
const io=new IntersectionObserver(e=>e.forEach(x=>x.target.classList.toggle('on',x.isIntersecting)),{threshold:.5});
document.querySelectorAll('.stat').forEach(e=>io.observe(e));
/* why */
if ($('#wt')) {
const W=[["01", "LIVE ROOMS", "Rooms that feel alive", "Chat, polls, hand-raises and breakouts so every attendee can take part.", "linear-gradient(135deg,#7aa6c7,#e8d8c0 60%,#b04a2b)"], ["02", "NETWORKING", "Meet the people in the room", "Swap profiles, get 1:1 intros and keep the conversation going after the session ends.", "linear-gradient(135deg,#9bd1a8,#4f8f9f)"], ["03", "SHARE KNOW-HOW", "Host your own session", "Anyone can teach what they know. Set a topic, pick a time and invite your people.", "linear-gradient(135deg,#c9b8a0,#5b4a3b)"], ["04", "REPLAYS", "Never miss a moment", "Recordings, notes and resources land in your library the moment a session ends.", "linear-gradient(135deg,#a8b5e8,#3b4a8b)"], ["05", "PAYMENTS", "Ticketing built in", "Free or paid sessions with cards, UPI and wallets. Hosts get paid, attendees get in.", "linear-gradient(135deg,#e8a8c9,#8b3b6a)"]];
W.forEach((w,i)=>$('#wt').insertAdjacentHTML('beforeend',`<button data-i="${i}">${w[0]} ${w[1]}</button>`));
const WP=[[['2+ lakh','Attendees'],['4.8/5','Rating'],['•','Interactive rooms']],[['40+','Countries'],['1:1','Intros'],['•','Keep the conversation going']],[['500+','Speakers'],['•','Any topic, any level'],['•','Host in minutes']],[['100%','Sessions recorded'],['•','Notes & resources'],['•','Watch anytime']],[['UPI','Cards · Wallets'],['•','Instant ticket'],['•','Easy refunds']]];
const WE=['🎥','🤝','🎤','▶️','💳'],WIMG=[]; /* put your photo URLs in WIMG, e.g. WIMG[0]='room.jpg' */
const PS=[[-26,4,18,16,1],[27,8,-20,14,1],[-26,8,14,14,1.05],[-28,-3,12,10,.92],[24,3,-40,16,1.05]],SIDE=[0,1,0,0,1];
let wi=-1;const lerp=(a,b,t)=>a+(b-a)*t,sm=t=>t*t*(3-2*t);
function textW(i){const w=W[i],t=$('.wtxt');t.classList.toggle('L',innerWidth>760&&!!SIDE[i]);
$('#wc').innerHTML=`<span style="opacity:.55">${w[0]}</span><span style="opacity:.3;margin:0 8px">|</span>${w[1]}`;$('#wh').textContent=w[2];$('#wp').textContent=w[3];
$('#wpl').innerHTML=WP[i].map(p=>p[0]=='•'?`<span><i></i>${p[1]}</span>`:`<span><b>${p[0]}</b>${p[1]}</span>`).join('');
t.classList.remove('go');void t.offsetWidth;t.classList.add('go');
const sc=$('#sc3');sc.style.background=WIMG[i]?`center/cover url(${WIMG[i]})`:w[4];sc.firstChild.textContent=WIMG[i]?'':WE[i];sc.lastChild.style.display=WIMG[i]?'none':''}
function whyS(){const r=$('.why'),pr=clamp(-r.getBoundingClientRect().top/(r.offsetHeight-innerHeight),0,.9999),k=pr*5,i=Math.floor(k),fr=k-i,f=i<4?sm(clamp((fr-.55)/.45,0,1)):0,n=Math.min(4,i+1),a=PS[i],b=PS[n],m=innerWidth>760;
let x=lerp(a[0],b[0],f),y=lerp(a[1],b[1],f)-Math.sin(Math.PI*f)*5,yaw=lerp(a[2],b[2],f)+Math.sin(Math.PI*f)*(i%2?-1:1)*78,pt=lerp(a[3],b[3],f),sc=lerp(a[4],b[4],f);
if(!m){x=0;y=-10;sc*=.8}
$('#l3').style.transform=`translate3d(${x}vw,${y}vh,0) rotateX(${pt}deg) rotateY(${yaw}deg) scale(${sc})`;$('#l3sh').style.transform=`translateX(${x}vw)`;
const cur=f>.5?n:i;if(cur!==wi){wi=cur;textW(cur);document.querySelectorAll('#wt button').forEach((b,j)=>b.classList.toggle('on',j==cur))}
document.querySelectorAll('#wt button').forEach((b,j)=>b.style.setProperty('--f',j<i?100:j==i?(i<4?clamp(fr/.55,0,1):fr)*100:0))}
document.querySelectorAll('#wt button').forEach(b=>b.onclick=()=>{const r=$('.why');scrollTo({top:r.offsetTop+(+b.dataset.i+.2)/5*(r.offsetHeight-innerHeight)})});
/* platform */
const P=[["Host dashboard", "Run your session, your way", "Schedule, promote and go live from one screen, with attendee stats updating in real time.", "Host Dashboard · 1,284 live"], ["Attendee lobby", "Walk in, say hi", "A lobby with profiles, topics and people to meet before the session starts.", "Lobby · Chat · Intros · Q&A"], ["Tickets & payouts", "Get paid, painlessly", "Sell tickets with Razorpay, Stripe, UPI or PayPal and track every payout.", "Tickets · Payouts · Refunds"]];
let pi=0;function setP(i){pi=i;const p=P[i];$('#pn').textContent=`0${i+1} / 03`;$('#pb').style.width=(i+1)/3*100+'%';$('#pc').textContent=p[0];$('#pc').className='chip';$('#ph').textContent=p[1];$('#pt').textContent=p[2];$('#pw').textContent=p[3]}
setP(0);setInterval(()=>setP((pi+1)%3),4500);
/* live room */
const M=$('#msgs');function add(n,t){const d=document.createElement('div'),b=document.createElement('b');b.textContent=n+' ';d.append(b,t);M.append(d);M.scrollTop=1e9}
[['Riya','Hello from Hyderabad! 👋'],['Sam','Loving this topic']].forEach(m=>add(...m));
const AU=['Is the replay shared?','Great point!','Can you share the slides?','Joined from London 🇬🇧'];let ai=0;setInterval(()=>add('Guest'+(10+ai),AU[ai++%4]),4000);
const send=()=>{const v=$('#mi').value.trim();if(v){add('You',v);$('#mi').value=''}};$('#send').onclick=send;$('#mi').onkeydown=e=>e.key=='Enter'&&send();
$('#hand').onclick=e=>{e.target.classList.toggle('on');e.target.textContent=e.target.classList.contains('on')?'✋ Hand raised':'✋ Raise hand'};
const PO=[['Live Q&A',40],['Networking',35],['Workshops',25]];let voted=0;
$('#poll').innerHTML='<b style="font-size:12px">Poll: what do you want next?</b>'+PO.map((o,i)=>`<button class="po" data-i="${i}"><i></i><span>${o[0]}</span></button>`).join('');
document.querySelectorAll('.po').forEach(b=>b.onclick=()=>{if(voted)return;voted=1;PO[b.dataset.i][1]+=15;const t=PO.reduce((a,o)=>a+o[1],0);document.querySelectorAll('.po').forEach((x,i)=>{x.querySelector('i').style.width=PO[i][1]/t*100+'%';x.querySelector('span').textContent=PO[i][0]+' · '+Math.round(PO[i][1]/t*100)+'%'})});
}
/* payments: plug real gateways into window.HUDDLE_PAY, e.g. HUDDLE_PAY.Razorpay=async({plan,price,email})=>{...open Razorpay checkout...} */
window.HUDDLE_PAY=window.HUDDLE_PAY||{};
const PL=[['Free','₹0'],['Pro','₹499'],['VIP','₹1,499']],GW=['Razorpay','Stripe','UPI','PayPal'];let pp=1,pg=0;
function drawPay(){$('#plans').innerHTML=PL.map((p,i)=>`<button class="${i==pp?'on':''}" onclick="pp=${i};drawPay()">${p[0]}<br>${p[1]}</button>`).join('');$('#gws').innerHTML=GW.map((g,i)=>`<button class="${i==pg?'on':''}" onclick="pg=${i};drawPay()">${g}</button>`).join('');$('#go').textContent=PL[pp][1]=='₹0'?'Reserve free seat':'Pay '+PL[pp][1]+' with '+GW[pg]}
function openPay(i){pp=i;drawPay();$('#pmsg').textContent='';$('#pay').classList.add('on')}function closePay(){$('#pay').classList.remove('on')}
$('#pay').onclick=e=>e.target.id=='pay'&&closePay();
$('#go').onclick=async()=>{const e=$('#em').value.trim();if(!/^\S+@\S+\.\S+$/.test(e)){$('#pmsg').textContent='Enter a valid email first.';return}
const h=HUDDLE_PAY[GW[pg]];$('#pmsg').textContent=h?'Opening '+GW[pg]+'…':'Demo mode: '+GW[pg]+' is not connected yet. Add its handler to HUDDLE_PAY.';if(h)try{await h({plan:PL[pp][0],price:PL[pp][1],email:e})}catch(x){$('#pmsg').textContent='Payment failed. Try again.'}};
/* circle slider */
const CS=[['Riya S.','Product Designer','I came for one talk and left with three collaborators.','🧑🏽'],['Arjun M.','Founder','The live Q&A alone was worth the ticket.','👨🏻'],['Sana K.','Student','Finally a webinar where I could actually ask questions.','👩🏽'],['Dev P.','Engineer','Hosted my first session here and got paid the same day.','🧑🏾'],['Meera L.','Marketer','The networking rooms are the best part.','👩🏻'],['Karan T.','Creator','Replays and notes make it easy to keep learning.','🧑🏻'],['Isha N.','Community Lead','Our whole community now meets here every week.','👩🏾']];
const GR=['linear-gradient(145deg,#E51F31,#EE5125)','linear-gradient(145deg,#EE5125,#F37A4F)','linear-gradient(145deg,#c81e2b,#ff5a2a)'];
let ji=0,sx=null,hov=0;const cs=$('#cs');
CS.forEach((c,i)=>{cs.insertAdjacentHTML('beforeend',`<div class="sl" style="background:${GR[i%3]}" data-i="${i}"><span>${c[3]}</span></div>`);$('#dots').insertAdjacentHTML('beforeend',`<i data-i="${i}"></i>`)});
function setJ(n){ji=(n+7)%7;const u=Math.min(1,innerWidth/820);
document.querySelectorAll('.sl').forEach((e,i)=>{let d=i-ji;if(d>3)d-=7;if(d<-3)d+=7;const a=Math.abs(d),sc=[1,.58,.36,.2][a]*(a?1:1),x=(a==0?0:Math.sign(d)*(a==1?250:a==2?390:480))*u;
e.style.transform=`translateX(${x}px) scale(${sc*(a?Math.max(u,.7):Math.max(u,.62))})`;e.style.opacity=a>2?0:a==0?1:a==1?.75:.4;e.style.zIndex=10-a;e.style.filter=a?'grayscale(1)':'none';e.style.pointerEvents=a>2?'none':'auto'});
$('#arc').style.transform=`rotate(${ji*51.4}deg)`;document.querySelectorAll('.dots i').forEach((e,i)=>e.classList.toggle('on',i==ji));
const c=$('#cap');c.style.opacity=0;setTimeout(()=>{$('#cname').textContent=CS[ji][0];$('#crole').textContent=CS[ji][1].toUpperCase();$('#cq').textContent='“'+CS[ji][2]+'”';c.style.opacity=1},220)}
$('#nx').onclick=()=>setJ(ji+1);$('#pv').onclick=()=>setJ(ji-1);
cs.addEventListener('pointerdown',e=>{sx=e.clientX});addEventListener('pointerup',e=>{if(sx==null)return;const d=e.clientX-sx;sx=null;if(Math.abs(d)>50)setJ(ji+(d<0?1:-1));else{const t=e.target.closest('.sl');if(t&&cs.contains(t))setJ(+t.dataset.i)}});
$('#dots').onclick=e=>e.target.dataset.i&&setJ(+e.target.dataset.i);
addEventListener('keydown',e=>{const r=cs.getBoundingClientRect();if(r.top<innerHeight&&r.bottom>0){if(e.key=='ArrowRight')setJ(ji+1);if(e.key=='ArrowLeft')setJ(ji-1)}});
cs.onmouseenter=()=>hov=1;cs.onmouseleave=()=>hov=0;addEventListener('resize',()=>setJ(ji));
if(!matchMedia('(prefers-reduced-motion:reduce)').matches)setInterval(()=>{if(!hov&&!document.hidden)setJ(ji+1)},4500);
setJ(0);

/* hero */
const HS=[['LIVE SESSIONS',1],['MEET EXPERTS',0],['SHARE KNOW-HOW',0],['GROW YOUR NETWORK',1],['ASK ANYTHING',0],['REPLAYS ANYTIME',1],['SECURE PAYMENTS',0],['1to10X<br><small style="font-size:.4em;letter-spacing:.2em">REGISTRATIONS OPEN NOW</small>',0]];let hi=0;
function hs(){const e=$('#hsc'),h=HS[hi++%HS.length];e.className='hsc '+(h[1]?'light':'dark');e.innerHTML='<span>'+h[0]+'</span>'}hs();setInterval(hs,2200);
function heroS(){const y=scrollY,hp=clamp(y/(innerHeight*.85),0,1);document.body.classList.toggle('sc',y>60);
$('#lid').style.transform=`rotateX(${-hp*84}deg)`;$('#hl').style.transform=`translateX(-50%) translateY(${hp*6}vh)`;
const t=$('#ht');t.style.opacity=clamp(1-hp*1.6,0,1);t.style.transform=`translateY(${-hp*50}px)`;
document.querySelectorAll('.hs .fl').forEach(e=>{e.style.transform=`translateY(${-hp*e.dataset.s*45}vh)`;e.style.opacity=clamp(1.2-hp*1.1,0,1)})}
addEventListener('scroll',heroS,{passive:true});heroS();

/* scroll section */
const WN=[...document.querySelectorAll('.wn')];
function wheelS(){const r=$('#stats').getBoundingClientRect(),sh=r.height/7,t=(innerHeight/2-r.top)/sh-.5,R=560,W=innerWidth;
WN.forEach((e,i)=>{const a=(i-t)*13,ar=a*Math.PI/180,x=.12*W-R+R*Math.cos(ar)+26,y=innerHeight/2+R*Math.sin(ar),d=Math.abs(a);
e.style.transform=`translate(${x}px,${y-16}px) rotate(${a*.9}deg) scale(${1-Math.min(d/45,.3)})`;e.style.opacity=d<6?1:Math.max(0,.4-d/130);e.style.color=d<6?'var(--ink)':'var(--mut)'});drawNet()}
const cv=$('#net'),c2=cv.getContext('2d');let mx=-999,my=-999;
function sz(){cv.width=innerWidth;cv.height=innerHeight}sz();addEventListener('resize',sz);
addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;drawNet()});
function drawNet(){c2.clearRect(0,0,cv.width,cv.height);const r=$('#stats').getBoundingClientRect();if(r.top>innerHeight||r.bottom<0||mx<0)return;const oy=((23-scrollY)%46+46)%46,gx=Math.round((mx-23)/46)*46+23,gy=Math.round((my-oy)/46)*46+oy;
for(let dx=-2;dx<=2;dx++)for(let dy=-2;dy<=2;dy++){const d=Math.hypot(dx,dy);if(!d||d>2.3)continue;const x=gx+dx*46,y=gy+dy*46;c2.strokeStyle=`rgba(120,120,130,${.35-d*.1})`;c2.beginPath();c2.moveTo(gx,gy);c2.lineTo(x,y);c2.stroke();c2.fillStyle=`rgba(90,90,100,${.8-d*.25})`;c2.beginPath();c2.arc(x,y,2,0,7);c2.fill()}
c2.beginPath();c2.arc(gx,gy,2.6,0,7);c2.fillStyle='rgba(60,60,70,.8)';c2.fill()}
addEventListener('scroll',wheelS,{passive:true});wheelS();
/* partner network */

const NC=[[9,38,9],[20,72,7],[24,26,6],[33,78,6],[62,18,7],[58,72,8],[68,48,5],[82,22,10],[88,64,8],[40,12,5],[74,80,6],[14,10,5]];
let sv='<defs><linearGradient id="lg"><stop offset="0" stop-color="#E51F31"/><stop offset="1" stop-color="#EE5125"/></linearGradient></defs>',pd=[];
NC.forEach((c,i)=>{const x=c[0]*10,y=c[1]*3.8,d=`M${x} ${y}Q${(x+500)/2} ${(y+190)/2-50} 500 190`;pd.push(d);sv+=`<path d="${d}" fill="none" stroke="url(#lg)" stroke-opacity=".3" stroke-width="1.2" stroke-dasharray="4 5"><animate attributeName="stroke-dashoffset" from="0" to="-18" dur="${2+i%3}s" repeatCount="indefinite"/></path>`;
$('#nw').insertAdjacentHTML('beforeend',`<div class="nc" style="left:${c[0]}%;top:${c[1]}%;--s:${c[2]};animation-delay:-${i}s"><img src="../Assests/${i+1}.png" alt="Partner logo ${i+1}"></div>`)});
$('#nsv').innerHTML=sv;
let cd=0;new IntersectionObserver((e,o)=>{if(e[0].isIntersecting&&!cd){cd=1;const t0=performance.now();(function f(t){const k=Math.min(1,(t-t0)/3200);$('#ncount').textContent=Math.round(3000*(1-Math.pow(1-k,3))).toLocaleString('en-US')+'+';k<1&&requestAnimationFrame(f)})(t0)}},{threshold:.4}).observe($('#nw'));
/* classroom */
(function(){const w=$('#world');if(!w)return;let h='';
const P=(x,y,z,W,H,css,tf='')=>`<div style="left:${x}px;top:${y}px;width:${W}px;height:${H}px;transform:translate3d(0,0,${z}px) ${tf};${css}"></div>`;
h+=P(-900,-380,0,1800,760,'background:#b6d3b7');
h+=P(-900,380,0,1800,2400,'background:linear-gradient(#77777c,#9a9aa0)','rotateX(90deg)');
h+=P(-900,-2780,0,1800,2400,'background:#e9edf0;transform-origin:0 100%','rotateX(-90deg)')+P(500,-540,500,420,160,'background:#fff;box-shadow:0 0 30px #fff;transform-origin:0 100%','rotateX(-90deg)')+P(-500,-540,1100,420,160,'background:#fff;transform-origin:0 100%','rotateX(-90deg)');
h+=P(-900,-380,0,2400,760,'background:#a6c7a8','rotateY(-90deg)')+P(900,-380,0,2400,760,'background:#aecdb0','rotateY(-90deg)');
h+=P(-760,-380,520,140,760,'background:linear-gradient(90deg,#e4e4e7,#c8c8cc)');h+=P(660,-380,260,90,760,'background:linear-gradient(90deg,#e4e4e7,#c8c8cc)');
h+=P(-760,340,0,1520,400,'background:repeating-conic-gradient(#cbc6ba 0 25%,#b4af a1 0 50%) 0 0/60px 60px'.replace('#b4af a1','#b4afa1'),'rotateX(90deg)')+P(-760,340,400,1520,40,'background:#8f8a7e');
h+=P(-410,-250,3,820,470,'','')+'';
w.innerHTML=h;
const B=(x,z)=>{let t='';t+=P(x,290,z,520,100,'background:#b9693b','rotateX(90deg)');t+=P(x,290,z+100,520,22,'background:#8f4f2a');t+=P(x,335,z+140,520,60,'background:#a85d33','rotateX(90deg)');t+=P(x+30,290,z+100,12,90,'background:#26262a')+P(x+478,290,z+100,12,90,'background:#26262a');return t};
let bn='';[480,660,840].forEach(z=>{bn+=B(-800,z)+B(260,z)});w.insertAdjacentHTML('beforeend',bn);
w.insertAdjacentHTML('beforeend',`<div class="bd" style="left:-410px;top:-250px;width:820px;height:470px;transform:translateZ(3px)"><div class="tx">Application of<br>Live Community</div><div class="bx"><i></i><i style="width:100px"></i><i style="width:120px"></i></div><div class="em">🧑‍🏫</div></div>
<div class="bd bd2" id="bd2" style="left:-410px;top:-250px;width:820px;height:470px;transform:translateZ(4px)"><div class="tx" style="color:#0b2d5c">Join the room</div><div class="em">👩‍💻</div></div>
<div style="left:455px;top:130px;width:150px;height:210px;transform:translateZ(250px);background:linear-gradient(#8a5535,#6b3f26);border-radius:4px"><div style="margin:50px 14px;height:110px;background:#fff;display:grid;place-items:center;font:800 20px Inter;color:#E51F31;text-align:center">1to10X</div></div>
<div class="h3d" id="h3d" style="left:-450px;top:-370px;width:900px;transform:translateZ(6px) rotateZ(-3deg);opacity:0">Experience 1to10X live.</div>`);
})();
const smo=t=>{t=clamp(t,0,1);return t*t*(3-2*t)},EE=(a,b,t)=>a+(b-a)*smo(t);
function instS(p){const st=$('#stg'),R=Math.hypot(innerWidth,innerHeight)/2*1.06,rd=clamp((p-.03)/.27,0,1);
st.style.clipPath=`circle(${p<.025?0:Math.max(14,rd*rd*R)}px at 50% 50%)`;
const sc=Math.max(innerWidth/1600,innerHeight/900);$('#fit').style.transform=`scale(${sc})`;
let cz=500,cy=0,ry=0;
if(p>=.30&&p<.52){const t=(p-.30)/.22;cz=EE(500,-150,t);ry=EE(0,-5,t);cy=EE(0,-20,t)}
else if(p>=.52&&p<.62){cz=-150;ry=-5;cy=-20}
else if(p>=.62&&p<.80){const t=(p-.62)/.18;cz=EE(-150,380,t);ry=EE(-5,3,t);cy=EE(-20,30,t)}
else if(p>=.80){const t=(p-.80)/.13;cz=EE(380,520,t);ry=EE(3,0,t);cy=EE(30,0,t)}
$('#world').style.transform=`translate3d(0,${cy}px,${cz}px) rotateY(${ry}deg)`;
st.style.opacity=p>.93?clamp(1-(p-.93)/.06,0,1):1;$('.itt').style.opacity=p<.12?1:0;
$('#g1').classList.toggle('on',p>.52&&p<.64);$('#g2').classList.toggle('on',p>.68&&p<.88);
$('#h3d').style.opacity=p>.66&&p<.86?1:0;$('#bd2').style.opacity=clamp((p-.80)/.08,0,1);
$('#pl').textContent=p<.62?'THE ROOM':'YOUR SEAT';$('#pf').style.width=clamp((p-.3)/.62,0,1)*100+'%'}
/* hero premium */
(function(){const hs=$('.hs'),fls=[...document.querySelectorAll('.hs .fl')],cv=$('#hp'),g=cv.getContext('2d'),lw=$('#lw'),sp=$('#spot');
fls.forEach((e,i)=>{e.style.setProperty('--n',i);const d=+e.dataset.s;e.classList.add(d<.75?'far':d>1.15?'near':'mid');e._d=d});
const h1=$('.ht h1'),words=h1.textContent.split(' ');let n=0;h1.innerHTML=words.map((w,i)=>`<span class="wd${i==words.length-1?' ac':''}">${[...w].map(c=>`<span class="ch" style="--i:${n++}">${c}</span>`).join('')}</span>`).join(' ');
let mx=0,my=0,cx=0,cy=0,px=0,py=0,W,H;const DPR=Math.min(2,devicePixelRatio||1);
function rs(){W=cv.clientWidth;H=cv.clientHeight;cv.width=W*DPR;cv.height=H*DPR;g.setTransform(DPR,0,0,DPR,0,0)}rs();addEventListener('resize',rs);
const PT=Array.from({length:54},()=>({x:Math.random(),y:Math.random(),z:.15+Math.random()*.85,r:1+Math.random()*5,c:['238,81,37','229,31,49','255,179,71','255,255,255'][Math.random()*4|0],ph:Math.random()*6}));
hs.addEventListener('mousemove',e=>{const r=hs.getBoundingClientRect();mx=(e.clientX-r.left)/r.width*2-1;my=(e.clientY-r.top)/r.height*2-1;px=e.clientX-r.left;py=e.clientY-r.top;sp.style.opacity=1});
hs.addEventListener('mouseleave',()=>{mx=my=0;sp.style.opacity=0});
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
function tick(t){requestAnimationFrame(tick);if(scrollY>innerHeight*1.7||reduce)return;cx+=(mx-cx)*.07;cy+=(my-cy)*.07;
lw.style.transform=`rotateY(${cx*9}deg) rotateX(${-cy*4}deg)`;
fls.forEach(e=>{const f=e.querySelector('.fi,.ib');if(f)f.style.translate=`${-cx*e._d*26}px ${-cy*e._d*16}px`});
sp.style.transform=`translate(${px}px,${py}px)`;
g.clearRect(0,0,W,H);PT.forEach(q=>{q.y-=.00007*(.3+q.z)*16;if(q.y<-.05)q.y=1.05;const x=q.x*W-cx*q.z*38,y=q.y*H-cy*q.z*24,tw=.55+.45*Math.sin(t/900+q.ph),r=q.r*q.z*(q.r>3?3.2:1);
if(q.r>3){const gr=g.createRadialGradient(x,y,0,x,y,r*3);gr.addColorStop(0,`rgba(${q.c},${.22*q.z*tw})`);gr.addColorStop(1,`rgba(${q.c},0)`);g.fillStyle=gr;g.beginPath();g.arc(x,y,r*3,0,7);g.fill()}
else{g.fillStyle=`rgba(${q.c==='255,255,255'?'238,81,37':q.c},${.65*q.z*tw})`;g.beginPath();g.arc(x,y,r,0,7);g.fill()}})}
requestAnimationFrame(tick)})();
/* skyline */
let h='',x=0,seed=7;const r=()=>(seed=seed*16807%2147483647)/2147483647;
while(x<880){const w=20+r()*30,ht=40+r()*110,cx=x+w/2;const hero=x>400&&x<470;h+=`<rect x="${x}" y="${190-ht}" width="${w}" height="${ht}" fill="#fff" stroke="#111" stroke-width="1.2"/>`;for(let y=190-ht+8;y<185;y+=10)h+=`<line x1="${x+4}" x2="${x+w-4}" y1="${y}" y2="${y}" stroke="#999" stroke-width=".7"/>`;x+=w+4}
h+='<rect x="410" y="95" width="70" height="95" fill="#2b6fd6" stroke="#111"/><rect x="425" y="110" width="40" height="22" fill="#fff"/><text x="445" y="126" font-size="8" text-anchor="middle" font-weight="800">TAP</text>';
$('#sky').innerHTML=h;
/* scroll driver */
const rio=new IntersectionObserver(e=>e.forEach(x=>x.isIntersecting&&x.target.classList.add('in')),{threshold:.15});
document.querySelectorAll('.intro>*,.jr .c>*,.fg>*').forEach(e=>{e.classList.add('rv');rio.observe(e)});
/* STEP 4: load this AFTER immersive.js  ->  <script src="../js/hero-intro.js"></script> */
(function(){
const $=s=>document.querySelector(s),clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),ease=t=>{t=clamp(t,0,1);return t*t*(3-2*t)};
const h0=$('#h0');if(!h0)return;
const cv=$('#h0c'),g=cv.getContext('2d'),w0=$('#h0w');
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
let W=0,H=0,DPR=Math.min(2,devicePixelRatio||1),mx=0,my=0,sx=0,sy=0,P=0,vis=true;

function rs(){W=cv.clientWidth;H=cv.clientHeight;cv.width=W*DPR;cv.height=H*DPR;g.setTransform(DPR,0,0,DPR,0,0)}
rs();addEventListener('resize',rs);
h0.addEventListener('mousemove',e=>{mx=e.clientX/innerWidth*2-1;my=e.clientY/innerHeight*2-1});
h0.addEventListener('mouseleave',()=>{mx=my=0});
new IntersectionObserver(e=>{vis=e[0].isIntersecting},{threshold:0}).observe(h0);

/* ---------- wireframe geometry ---------- */
const cube=(()=>{const v=[],e=[];for(let i=0;i<8;i++)v.push([i&1?1:-1,i&2?1:-1,i&4?1:-1]);for(let i=0;i<8;i++)for(let b=1;b<8;b<<=1)if(!(i&b))e.push([i,i|b]);return{v,e}})();
const oct=(()=>{const v=[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]],e=[];for(let i=0;i<6;i++)for(let j=i+1;j<6;j++)if(j!==(i^1))e.push([i,j]);return{v,e}})();
const ico=(()=>{const f=(1+Math.sqrt(5))/2,v=[],e=[];[-1,1].forEach(a=>[-1,1].forEach(b=>{v.push([0,a,b*f],[a,b*f,0],[b*f,0,a])}));
for(let i=0;i<12;i++)for(let j=i+1;j<12;j++){const d=Math.hypot(v[i][0]-v[j][0],v[i][1]-v[j][1],v[i][2]-v[j][2]);if(d<2.05)e.push([i,j])}return{v,e}})();
const tor=(()=>{const U=30,V=12,R=1,r=.36,v=[],e=[];for(let u=0;u<U;u++)for(let k=0;k<V;k++){const a=u/U*6.2832,b=k/V*6.2832;v.push([(R+r*Math.cos(b))*Math.cos(a),r*Math.sin(b),(R+r*Math.cos(b))*Math.sin(a)])}
for(let u=0;u<U;u++)for(let k=0;k<V;k++){const i=u*V+k;e.push([i,u*V+(k+1)%V],[i,((u+1)%U)*V+k])}return{v,e}})();

/* g=shape, p=world position, s=scale, r0=start rotation, vx/vy=spin, c=rgb, a=alpha */
const O=[
 {g:tor,p:[3.9,-.1,5.2],s:1.55,r:[1.15,0],vx:.0,vy:.22,c:'238,81,37',a:.7},
 {g:tor,p:[3.9,-.1,5.2],s:2.05,r:[.4,.6],vx:.05,vy:-.14,c:'229,31,49',a:.35},
 {g:ico,p:[-5.4,-2.2,8],s:1.1,r:[0,0],vx:.12,vy:.2,c:'229,31,49',a:.7},
 {g:cube,p:[6.5,2.2,7],s:.8,r:[.4,.2],vx:.18,vy:.24,c:'238,81,37',a:.7},
 {g:oct,p:[.8,-2.8,9],s:.95,r:[0,0],vx:.1,vy:.3,c:'255,160,110',a:.6},
 {g:cube,p:[-2.8,2.3,6],s:.42,r:[.2,.5],vx:.25,vy:.18,c:'255,255,255',a:.5},
 {g:ico,p:[9.4,-1.6,12],s:1.7,r:[.3,0],vx:.08,vy:.12,c:'238,81,37',a:.55},
 {g:oct,p:[-8.4,1,11],s:1.3,r:[0,.3],vx:.1,vy:.16,c:'229,31,49',a:.5},
 {g:tor,p:[-2,-3.4,14],s:1.4,r:[1.3,.2],vx:.04,vy:.2,c:'238,81,37',a:.45}
];
const PT=Array.from({length:80},()=>({x:(Math.random()-.5)*26,y:(Math.random()-.5)*11,z:Math.random()*18,s:Math.random()*.6+.4}));

/* world -> camera space (mouse yaw/pitch + scroll dive) */
function cam(x,y,z,cy,sy_,cp,sp,dz){const X=x*cy+z*sy_;let Z=-x*sy_+z*cy;const Y=y*cp-Z*sp;Z=y*sp+Z*cp;return[X,Y,Z-dz]}
const rot=(v,ax,ay)=>{let x=v[0],y=v[1],z=v[2],c=Math.cos(ay),s=Math.sin(ay),t;t=x*c+z*s;z=-x*s+z*c;x=t;c=Math.cos(ax);s=Math.sin(ax);t=y*c-z*s;z=y*s+z*c;y=t;return[x,y,z]};

function draw(t){
  const f=H*.9,cx=W/2,cyp=H/2,ts=t/1000,dz=P*10;
  const yaw=sx*.13,pit=sy*.07,cY=Math.cos(yaw),sY=Math.sin(yaw),cP=Math.cos(pit),sP=Math.sin(pit);
  g.clearRect(0,0,W,H);g.globalCompositeOperation='lighter';g.lineCap='round';

  /* moving perspective floor */
  const off=((ts*.7+dz)%2+2)%2,FY=3.1,seg=[.5,2,4,8,16,30,46];
  for(let k=0;k<24;k++){const Z=k*2-off+.5;if(Z<.5)continue;
    const a=cam(-26,FY,Z,cY,sY,cP,sP,0),b=cam(26,FY,Z,cY,sY,cP,sP,0);if(a[2]<.3||b[2]<.3)continue;
    g.strokeStyle=`rgba(238,81,37,${clamp(.34-Z*.0075,0,.34)})`;g.lineWidth=1;g.beginPath();
    g.moveTo(cx+a[0]/a[2]*f,cyp+a[1]/a[2]*f);g.lineTo(cx+b[0]/b[2]*f,cyp+b[1]/b[2]*f);g.stroke()}
  for(let j=-12;j<=12;j++){const x=j*2.2;
    for(let i=0;i<seg.length-1;i++){const a=cam(x,FY,seg[i],cY,sY,cP,sP,0),b=cam(x,FY,seg[i+1],cY,sY,cP,sP,0);
      g.strokeStyle=`rgba(229,31,49,${clamp(.3-seg[i]*.008,.02,.3)})`;g.beginPath();
      g.moveTo(cx+a[0]/a[2]*f,cyp+a[1]/a[2]*f);g.lineTo(cx+b[0]/b[2]*f,cyp+b[1]/b[2]*f);g.stroke()}}

  /* spinning wireframes */
  O.forEach(o=>{
    const ax=o.r[0]+ts*o.vx,ay=o.r[1]+ts*o.vy,bob=Math.sin(ts*.6+o.p[0])*.18,pts=o.g.v.map(v=>{
      const r=rot(v,ax,ay);return cam(o.p[0]+r[0]*o.s,o.p[1]+bob+r[1]*o.s,o.p[2]+r[2]*o.s,cY,sY,cP,sP,dz)});
    const zc=cam(o.p[0],o.p[1],o.p[2],cY,sY,cP,sP,dz)[2];if(zc<.4)return;
    const al=o.a*clamp(1.15-zc*.045,.15,1);
    [[3.2,.14],[1,1]].forEach(([lw,m])=>{g.lineWidth=lw;g.strokeStyle=`rgba(${o.c},${al*m})`;g.beginPath();
      o.g.e.forEach(([i,j])=>{const a=pts[i],b=pts[j];if(a[2]<.3||b[2]<.3)return;
        g.moveTo(cx+a[0]/a[2]*f,cyp+a[1]/a[2]*f);g.lineTo(cx+b[0]/b[2]*f,cyp+b[1]/b[2]*f)});g.stroke()})});

  /* dust */
  PT.forEach(q=>{const y=q.y-ts*.12*q.s,p=cam(q.x,((y+6)%12+12)%12-6,0,cY,sY,cP,sP,0),Z=(((q.z-dz)%18)+18)%18+1.5,
    X=q.x*cY+Z*sY,Y=(((y+6)%12+12)%12-6)*cP,r=clamp(7/Z*q.s,.5,3.2);
    g.fillStyle=`rgba(255,${130+q.s*80|0},90,${clamp(1.1-Z/20,.08,.7)*.7})`;g.beginPath();g.arc(cx+X/Z*f,cyp+Y/Z*f,r,0,7);g.fill()});
  g.globalCompositeOperation='source-over';
}

/* ---------- scroll-linked exit of section 1 + render loop ---------- */
function loop(t){
  requestAnimationFrame(loop);
  const r=h0.getBoundingClientRect();P=clamp(-r.top/(h0.offsetHeight-innerHeight),0,1);
  sx+=(mx-sx)*.05;sy+=(my-sy)*.05;
  if(r.bottom<0||!vis)return;
  w0.style.opacity=clamp(1-ease((P-.3)/.55),0,1);
  w0.style.transform=`translate3d(0,${-P*70}px,0) scale(${1-P*.06})`;
  w0.style.filter=P>.55?`blur(${ease((P-.55)/.45)*8}px)`:'none';
  if(!h0.classList.contains('webgl-on'))draw(reduce?0:t);
}
requestAnimationFrame(loop);

/* ---------- laptop hero: opens up, then zooms until the screen fills the viewport ---------- */
const hero=$('#hero'),hl=$('#hl'),lid=$('#lid'),ht=$('#ht'),fx=$('#hfx'),fd=$('#hfade'),fls=[...document.querySelectorAll('.hs .fl')];
let M=null;
function meas(){const l=lid.offsetWidth,h=lid.offsetHeight;
  M={cy:hl.offsetTop+h/2,s:Math.max(innerWidth/(l-12),innerHeight/(h-12))*1.04};hl.style.transformOrigin=`50% ${h/2}px`}
addEventListener('resize',()=>{M=null;lap()});addEventListener('load',()=>{M=null;lap()});
function lap(){
  if(!M)meas();
  const vh=innerHeight,r=hero.getBoundingClientRect();if(r.bottom<-50||r.top>vh+50)return;
  const open=ease(1-clamp(r.top/vh,0,1)),p=clamp(-r.top/(hero.offsetHeight-vh),0,1),
        z=ease((p-.22)/.5),hp=clamp(p/.2,0,1),bell=Math.sin(Math.PI*clamp((p-.42)/.4,0,1));
  window.hz=z;
  lid.style.transform=`rotateX(${(1-open)*58}deg)`;
  hl.style.transform=`translateX(-50%) translateY(${(vh/2-M.cy)*z}px) scale(${1+(M.s-1)*z})`;
  hl.style.setProperty('--bz',clamp(1-z*1.8,0,1));
  ht.style.opacity=clamp(1-hp*1.5,0,1);ht.style.transform=`translateY(${-hp*50}px)`;
  fls.forEach(e=>{e.style.transform=`translateY(${-hp*e.dataset.s*45}vh)`;e.style.opacity=clamp(1.2-hp*1.1,0,1)});
  fx.style.opacity=bell*.5;fd.style.opacity=ease((p-.88)/.12);
  document.body.classList.toggle('zoomed',z>.5);
}
addEventListener('scroll',lap,{passive:true});lap();

/* ---------- "Watch the intro" -> glide to the laptop ---------- */
function glide(y,d=1500){
  if(window.__goTo){window.__goTo(y);return}
  if(reduce){scrollTo(0,y);return}
  const y0=scrollY,t0=performance.now(),de=document.documentElement;de.style.scrollBehavior='auto';
  (function f(t){const k=clamp((t-t0)/d,0,1),e=k<.5?4*k*k*k:1-Math.pow(-2*k+2,3)/2;scrollTo(0,y0+(y-y0)*e);
    if(k<1)requestAnimationFrame(f);else de.style.scrollBehavior=''})(t0);
}
$('#h0watch').addEventListener('click',e=>{e.preventDefault();glide(hero.getBoundingClientRect().top+scrollY)});
$('.h0c').addEventListener('click',e=>{e.preventDefault();glide(hero.getBoundingClientRect().top+scrollY)});
})();