// Simple interactive logic + confetti (vanilla JS)
const modal = document.getElementById('proposalModal');
const music = document.getElementById('music');
const celebrate = document.getElementById('celebrate');
const canvas = document.getElementById('confettiCanvas');
const ctx = canvas.getContext && canvas.getContext('2d');

function startProposal(){
  modal.setAttribute('aria-hidden','false');
  modal.style.pointerEvents = 'auto';
}

function previewMessage(){
  alert("Rija, তুমিই আমার সব — সবসময় তোমার পাশে থাকতে চাই।");
}

// When user answers
function respond(yes){
  modal.setAttribute('aria-hidden','true');
  if(yes){
    celebrate.setAttribute('aria-hidden','false');
    // try to play music (user's browser may block autoplay; will work after a user gesture)
    try { music && music.play().catch(()=>{}); } catch(e){}
    runConfetti();
  } else {
    alert("কোনো ভয় নেই — সময় নাও। :)");
  }
}

// Reset page to initial state
function resetPage(){
  celebrate.setAttribute('aria-hidden','true');
  // stop music if playing
  if(music){
    music.pause(); music.currentTime = 0;
  }
  clearConfetti();
}

// ----- Confetti -----
// small lightweight confetti using canvas
let confettiPieces = [];
let confettiInterval = null;
function setCanvasSize(){
  if(!canvas) return;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', setCanvasSize);
setCanvasSize();

function random(min,max){ return Math.random()*(max-min)+min }

function createConfettiPiece(){
  return {
    x: random(0, canvas.width),
    y: random(-canvas.height*0.2, 0),
    size: random(6,14),
    color: `hsl(${Math.floor(random(0,360))}deg ${random(60,90)}% ${random(45,65)}%)`,
    tilt: random(-0.3,0.3),
    speedY: random(1,4),
    speedX: random(-1.5,1.5),
    rot: random(0,Math.PI*2),
    rotSpeed: random(-0.06, 0.06)
  };
}

function runConfetti(){
  if(!ctx) return simpleConfettiFallback();
  confettiPieces = new Array(140).fill(0).map(createConfettiPiece);
  if(confettiInterval) clearInterval(confettiInterval);
  confettiInterval = setInterval(renderConfetti, 1000/60);
  // auto stop after 9s
  setTimeout(()=>{ clearConfetti(); }, 9000);
}

function clearConfetti(){
  if(confettiInterval) { clearInterval(confettiInterval); confettiInterval = null; }
  confettiPieces = [];
  if(ctx) { ctx.clearRect(0,0,canvas.width,canvas.height); }
}

function renderConfetti(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  for(let p of confettiPieces){
    p.x += p.speedX;
    p.y += p.speedY;
    p.rot += p.rotSpeed;
    p.speedY *= 1.01; // slight gravity

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size*0.6);
    ctx.restore();

    // recycle
    if(p.y > canvas.height + 50 || p.x < -50 || p.x > canvas.width + 50){
      Object.assign(p, createConfettiPiece(), {y: -10});
    }
  }
}

// Fallback (no canvas): small DOM hearts/confetti
function simpleConfettiFallback(){
  const frag = document.createDocumentFragment();
  for(let i=0;i<60;i++){
    const el = document.createElement('div');
    el.textContent = '❤';
    el.style.position='fixed';
    el.style.left = Math.random()*100 + 'vw';
    el.style.top = (-5 + Math.random()*20)+'vh';
    el.style.fontSize = (12+Math.random()*36)+'px';
    el.style.opacity = Math.random()*0.9 + 0.1;
    el.style.transition = 'transform 6s linear, opacity 6s';
    document.body.appendChild(el);
    setTimeout(()=> { el.style.transform = `translateY(${100+Math.random()*40}vh) rotate(${Math.random()*720-360}deg)`; el.style.opacity=0; }, 60);
    setTimeout(()=> el.remove(), 7000);
  }
}

// Accessibility: close modal on ESC
window.addEventListener('keydown', (e)=>{
  if(e.key === 'Escape'){
    modal.setAttribute('aria-hidden','true');
  }
});
