/* =========================================================
   PRABHAKAR INBALAGAN — CINEMATIC PORTFOLIO
   JavaScript: All interactions & unique transitions
   ========================================================= */

/* ---------- IMAGE HANDLING: lazy-load + graceful fallback ----------
   Prepares the site for full-resolution photography (50MB+ RAW-derived
   JPEGs). Real <img> tags get native lazy-loading + async decode so
   heavy files don't block first paint. If a referenced photo hasn't
   been dropped into /assets/img/ yet, it fails over to an elegant
   gold-on-charcoal placeholder instead of a broken-image icon —
   background-image layers already carry their own gradient fallback
   inline. */
const FALLBACK_IMG='data:image/svg+xml;charset=UTF-8,'+encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="900" height="1100" viewBox="0 0 900 1100">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#181818"/>
      <stop offset="100%" stop-color="#050505"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="42%" r="55%">
      <stop offset="0%" stop-color="#d4af37" stop-opacity="0.16"/>
      <stop offset="100%" stop-color="#d4af37" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="900" height="1100" fill="url(#g)"/>
  <rect width="900" height="1100" fill="url(#glow)"/>
  <g stroke="#d4af37" stroke-opacity="0.55" stroke-width="2" fill="none">
    <circle cx="450" cy="500" r="74"/>
    <circle cx="450" cy="500" r="30"/>
  </g>
</svg>`);
document.querySelectorAll('img').forEach(img=>{
  if(!img.hasAttribute('loading')) img.loading='lazy';
  img.decoding='async';
  img.addEventListener('error',()=>{
    if(img.src.startsWith('data:')) return;
    img.src=FALLBACK_IMG;
    img.classList.add('img-placeholder');
  },{once:true});
});

/* ---------- LENIS SMOOTH SCROLL ---------- */
const lenis = new Lenis({ duration:1.2, easing:t=>Math.min(1,1.001-Math.pow(2,-10*t)), smoothWheel:true });
function raf(time){ lenis.raf(time); requestAnimationFrame(raf); }
requestAnimationFrame(raf);
lenis.on('scroll',()=>{});

/* ---------- PRELOADER: LENS OPEN + SHUTTER FLASH ---------- */
window.addEventListener('load',()=>{
  setTimeout(()=>{
    document.querySelector('.preloader')?.classList.add('done');
    document.body.classList.remove('no-scroll');
    // reveal hero lines via class
    document.querySelector('#home')?.classList.add('loaded');
  }, 2400);
});

/* ---------- CAMERA FOCUS RING CURSOR ---------- */
const ring=document.createElement('div');ring.className='cursor-ring';
const dot=document.createElement('div');dot.className='cursor-dot';
document.body.append(ring,dot);
let mx=window.innerWidth/2,my=window.innerHeight/2,rx=mx,ry=my;
window.addEventListener('mousemove',e=>{
  mx=e.clientX;my=e.clientY;
  dot.style.left=mx+'px';dot.style.top=my+'px';
});
function ringLoop(){ rx+=(mx-rx)*0.18; ry+=(my-ry)*0.18; ring.style.left=rx+'px'; ring.style.top=ry+'px'; requestAnimationFrame(ringLoop);}ringLoop();
document.querySelectorAll('a,button,.btn,.chip,.filter-btn,.service-card,.masonry-item,.reel-thumb,.bts-card,.blog-card,.equip-card,.social-card,.journey-node .dot,.client-logo,.award,.nav-cta,.back-top,.ai-toggle,.theme-toggle,.lightbox-close,.lightbox-nav,.journey-card .close,.play-btn').forEach(el=>{
  el.addEventListener('mouseenter',()=>ring.classList.add('grow'));
  el.addEventListener('mouseleave',()=>ring.classList.remove('grow'));
});
document.addEventListener('mouseleave',()=>{ring.classList.add('hide');dot.style.opacity=0;});
document.addEventListener('mouseenter',()=>{ring.classList.remove('hide');dot.style.opacity=1;});

/* ---------- NAV ---------- */
const nav=document.querySelector('.nav');
window.addEventListener('scroll',()=>{ nav.classList.toggle('scrolled',window.scrollY>60); });
const burger=document.querySelector('.nav-burger');
const navLinks=document.querySelector('.nav-links');
burger?.addEventListener('click',()=>{ burger.classList.toggle('active'); navLinks.classList.toggle('mobile'); });
navLinks.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{ burger.classList.remove('active'); navLinks.classList.remove('mobile'); }));

/* smooth anchor via lenis */
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{
    const id=a.getAttribute('href');if(id.length<2)return;
    const el=document.querySelector(id);if(!el)return;
    e.preventDefault();lenis.scrollTo(el,{offset:-60});
  });
});

/* ---------- HERO BACKGROUND ROTATION ---------- */
const heroSlides=document.querySelectorAll('.hero-slide');
let hIndex=0;
setInterval(()=>{
  heroSlides.forEach(s=>s.classList.remove('active'));
  hIndex=(hIndex+1)%heroSlides.length;
  heroSlides[hIndex].classList.add('active');
},4200);

/* ---------- HERO PARALLAX DEPTH ---------- */
const heroContent=document.querySelector('.hero-content');
document.querySelector('#home')?.addEventListener('mousemove',e=>{
  const cx=(e.clientX/window.innerWidth-0.5);
  const cy=(e.clientY/window.innerHeight-0.5);
  if(heroContent){ heroContent.style.transform=`translate(${cx*20}px,${cy*20}px)`; }
  heroSlides.forEach(s=>s.style.transform=`translate(${cx*-30}px,${cy*-30}px) scale(1.08)`);
});

/* ---------- INTERSECTION REVEAL (unique per section) ---------- */
const io=new IntersectionObserver((entries)=>{
  entries.forEach(en=>{
    if(en.isIntersecting){
      en.target.classList.add('in','revealed');
      // section-specific transition triggers
      const id=en.target.id;
      if(id==='about') aboutReveal(en.target);
      if(id==='journey') journeyReveal(en.target);
      if(id==='services') servicesExplode(en.target);
      if(id==='portfolio') portfolioMorph(en.target);
      if(id==='showreel') showreelCurtain(en.target);
      if(id==='clients') clientsSpotlight(en.target);
      if(id==='awards') awardsSpark(en.target);
      if(id==='bts') btsFlash(en.target);
      if(id==='blog') blogTurn(en.target);
      if(id==='equipment') equipRotate(en.target);
      if(id==='book') bookGlass(en.target);
      if(id==='contact') contactPlane(en.target);
      io.unobserve(en.target);
    }
  });
},{threshold:0.18});
document.querySelectorAll('section').forEach(s=>io.observe(s));

/* generic fade-up children */
document.querySelectorAll('.reveal-up').forEach(el=>{
  el.style.opacity='0';el.style.transform='translateY(40px)';el.style.transition='all 1s var(--ease)';
});
const ioUp=new IntersectionObserver(es=>es.forEach(e=>{
  if(e.isIntersecting){e.target.style.opacity='1';e.target.style.transform='translateY(0)';ioUp.unobserve(e.target);}
}),{threshold:0.2});
document.querySelectorAll('.reveal-up').forEach(el=>ioUp.observe(el));

/* ---------- ABOUT: PARALLAX + FLOATING PARTICLES + COUNTERS ---------- */
function aboutReveal(sec){
  // floating particles
  const pc=sec.querySelector('.particles');
  if(pc && !pc.dataset.done){ pc.dataset.done='1';
    for(let i=0;i<28;i++){
      const p=document.createElement('div');p.className='particle';
      p.style.left=Math.random()*100+'%';
      p.style.animationDuration=(8+Math.random()*10)+'s';
      p.style.animationDelay=(-Math.random()*10)+'s';
      p.style.width=p.style.height=(2+Math.random()*4)+'px';
      pc.appendChild(p);
    }
  }
  // parallax portrait
  const portrait=sec.querySelector('.about-portrait');
  window.addEventListener('scroll',()=>{
    const r=sec.getBoundingClientRect();
    if(r.top<window.innerHeight && r.bottom>0){
      const off=(r.top/window.innerHeight);
      portrait.style.transform=`translateY(${off*40}px)`;
    }
  });
  // counters
  sec.querySelectorAll('.stat .num[data-count]').forEach(n=>{
    const target=+n.dataset.count;let cur=0;const step=target/60;
    const t=setInterval(()=>{
      cur+=step;if(cur>=target){cur=target;clearInterval(t);}
      n.firstChild.textContent=Math.floor(cur);
    },22);
  });
}

/* ---------- JOURNEY: STORYBOARD SLIDE + POPUP ---------- */
function journeyReveal(sec){
  const nodes=sec.querySelectorAll('.journey-node');
  nodes.forEach((n,i)=>{
    n.style.opacity='0';n.style.transform='translateX(60px) rotateY(20deg)';
    setTimeout(()=>{
      n.style.transition='all .8s var(--ease)';
      n.style.opacity='1';n.style.transform='translateX(0) rotateY(0)';
    },120*i+200);
  });
}
// drag to scroll
const rail=document.querySelector('.journey-rail');
if(rail){
  let down=false,startX,scrollLeft;
  rail.addEventListener('mousedown',e=>{down=true;rail.classList.add('dragging');startX=e.pageX-rail.offsetLeft;scrollLeft=rail.scrollLeft;});
  rail.addEventListener('mouseleave',()=>{down=false;rail.classList.remove('dragging');});
  rail.addEventListener('mouseup',()=>{down=false;rail.classList.remove('dragging');});
  rail.addEventListener('mousemove',e=>{if(!down)return;e.preventDefault();const x=e.pageX-rail.offsetLeft;rail.scrollLeft=scrollLeft-(x-startX)*1.5;});
}
// popup
const jpopup=document.querySelector('.journey-popup');
document.querySelectorAll('.journey-node .dot').forEach(d=>{
  d.addEventListener('click',()=>{
    const node=d.closest('.journey-node');
    jpopup.querySelector('.yr').textContent=node.dataset.year;
    jpopup.querySelector('h3').textContent=node.dataset.role;
    jpopup.querySelector('.co').textContent=node.dataset.company;
    jpopup.querySelector('.jc-desc').textContent=node.dataset.desc;
    jpopup.classList.add('show');
  });
});
jpopup?.querySelector('.close').addEventListener('click',()=>jpopup.classList.remove('show'));
jpopup?.addEventListener('click',e=>{if(e.target===jpopup)jpopup.classList.remove('show');});

/* ---------- SERVICES: CARD EXPLOSION ---------- */
function servicesExplode(sec){
  const cards=sec.querySelectorAll('.service-card');
  cards.forEach((c,i)=>{
    c.style.opacity='0';
    const ang=(Math.random()*2-1)*40;
    c.style.transform=`translate(${(Math.random()*2-1)*120}px,${(Math.random()*2-1)*120}px) rotate(${ang}deg) scale(.6)`;
    setTimeout(()=>{
      c.style.transition='all .9s var(--ease)';
      c.style.opacity='1';c.style.transform='translate(0,0) rotate(0) scale(1)';
    },90*i+150);
  });
}

/* ---------- PORTFOLIO: GALLERY MORPH ---------- */
function portfolioMorph(sec){
  sec.querySelectorAll('.masonry-item').forEach((it,i)=>{
    setTimeout(()=>{
      it.classList.add('morph-in');
    },80*i);
  });
}
// filters
document.querySelectorAll('.filter-btn').forEach(b=>{
  b.addEventListener('click',()=>{
    document.querySelectorAll('.filter-btn').forEach(x=>x.classList.remove('active'));
    b.classList.add('active');
    const cat=b.dataset.cat;
    document.querySelectorAll('.masonry-item').forEach(it=>{
      const show=cat==='all'||it.dataset.cat===cat;
      it.classList.toggle('hide',!show);
      if(show){ it.classList.remove('morph-in'); void it.offsetWidth; it.classList.add('morph-in'); }
    });
  });
});

/* lightbox */
const lb=document.querySelector('.lightbox');
const lbImg=lb?.querySelector('.lightbox-img');
const lbInfo=lb?.querySelector('.lightbox-info');
const lbCat=lb?.querySelector('.lightbox-info .cat');
const lbTitle=lb?.querySelector('.lightbox-info h3');
const lbExif=lb?.querySelector('.lightbox-info .exif');
let currentLb=0;const items=[...document.querySelectorAll('.masonry-item')];
function openLb(i){
  currentLb=i;const it=items[i];if(!it)return;
  const img=it.querySelector('img');
  lbImg.innerHTML=`<img src="${img.src}" alt="">`;
  lbCat.textContent=it.dataset.cat;
  lbTitle.textContent=it.dataset.title||'Untitled';
  const exif=JSON.parse(it.dataset.exif||'{}');
  lbExif.innerHTML=Object.entries(exif).map(([k,v])=>`<div class="exif-row"><span>${k}</span><span>${v}</span></div>`).join('');
  lb.classList.add('show');document.body.style.overflow='hidden';lenis.stop();
}
function closeLb(){lb.classList.remove('show');document.body.style.overflow='';lenis.start();}
items.forEach((it,i)=>it.addEventListener('click',()=>openLb(i)));
lb?.querySelector('.lightbox-close').addEventListener('click',closeLb);
lb?.addEventListener('click',e=>{if(e.target===lb)closeLb();});
lb?.querySelector('.lightbox-next')?.addEventListener('click',()=>openLb((currentLb+1)%items.length));
lb?.querySelector('.lightbox-prev')?.addEventListener('click',()=>openLb((currentLb-1+items.length)%items.length));
document.addEventListener('keydown',e=>{if(!lb.classList.contains('show'))return;if(e.key==='Escape')closeLb();if(e.key==='ArrowRight')openLb((currentLb+1)%items.length);if(e.key==='ArrowLeft')openLb((currentLb-1+items.length)%items.length);});

/* ---------- SHOWREEL: CURTAIN OPEN ---------- */
function showreelCurtain(sec){
  const cw=sec.querySelector('.curtain-wrap');
  setTimeout(()=>cw?.classList.add('opened'),300);
}
// reel switching
document.querySelectorAll('.reel-thumb').forEach(t=>{
  t.addEventListener('click',()=>{
    document.querySelectorAll('.reel-thumb').forEach(x=>x.classList.remove('active'));
    t.classList.add('active');
    const main=document.querySelector('.main-reel');
    const img=main.querySelector('img');const play=main.querySelector('.play');
    img.src=t.dataset.thumb;
    sec_showreelTitle(t.dataset.title,t.dataset.cat);
  });
});
function sec_showreelTitle(title,cat){
  const rt=document.querySelector('.reel-title');
  rt.querySelector('h3').textContent=title;
  rt.querySelector('span').textContent=cat;
}
document.querySelector('.play-btn')?.addEventListener('click',()=>{
  showToast('Showreel playback — connect a video source to autoplay.');
});

/* ---------- CLIENTS: SPOTLIGHT + TESTIMONIALS ---------- */
const spotlight=document.createElement('div');spotlight.className='spotlight';document.body.append(spotlight);
const clientsSec=document.querySelector('#clients');
clientsSec?.addEventListener('mousemove',e=>{
  const r=clientsSec.getBoundingClientRect();
  spotlight.style.left=e.clientX+'px';spotlight.style.top=e.clientY+'px';
  spotlight.style.opacity='1';
});
clientsSec?.addEventListener('mouseleave',()=>spotlight.style.opacity='0');
function clientsSpotlight(sec){
  const ts=sec.querySelectorAll('.testimonial');
  ts.forEach((t,i)=>setTimeout(()=>t.classList.add('in'),300*i+200));
}

/* ---------- AWARDS: GOLDEN SPARK ---------- */
function awardsSpark(sec){
  sec.querySelectorAll('.award').forEach((a,i)=>{
    setTimeout(()=>{
      a.style.opacity='0';a.style.transform='translateY(40px) scale(.8)';
      a.style.transition='all .8s var(--ease)';
      requestAnimationFrame(()=>{a.style.opacity='1';a.style.transform='translateY(0) scale(1)';});
      // emit sparks
      const r=a.getBoundingClientRect();
      for(let s=0;s<8;s++){
        const sp=document.createElement('div');sp.className='spark';
        sp.style.left=(r.left+r.width/2)+'px';sp.style.top=(r.top+r.height/2)+'px';
        sp.style.setProperty('--dx',(Math.random()*2-1)*80+'px');
        sp.style.setProperty('--dy',(Math.random()*2-1)*80+'px');
        document.body.append(sp);setTimeout(()=>sp.remove(),1100);
      }
    },180*i);
  });
}
document.querySelectorAll('.award').forEach(a=>a.addEventListener('mouseenter',()=>{
  const r=a.getBoundingClientRect();
  for(let s=0;s<6;s++){
    const sp=document.createElement('div');sp.className='spark';
    sp.style.left=(r.left+Math.random()*r.width)+'px';sp.style.top=(r.top+Math.random()*r.height)+'px';
    sp.style.setProperty('--dx',(Math.random()*2-1)*60+'px');
    sp.style.setProperty('--dy',(Math.random()*2-1)*60+'px');
    document.body.append(sp);setTimeout(()=>sp.remove(),1100);
  }
}));

/* ---------- BTS: CAMERA FLASH ---------- */
function btsFlash(sec){
  sec.querySelectorAll('.bts-card').forEach((c,i)=>{
    setTimeout(()=>{
      c.classList.add('flashing');
      c.style.opacity='0';c.style.transform='scale(.92)';
      c.style.transition='all .7s var(--ease)';
      requestAnimationFrame(()=>{c.style.opacity='1';c.style.transform='scale(1)';});
      setTimeout(()=>c.classList.remove('flashing'),600);
    },220*i);
  });
}

/* ---------- BLOG: PAGE TURNING ---------- */
function blogTurn(sec){
  sec.querySelectorAll('.blog-card').forEach((c,i)=>{
    c.style.opacity='0';c.style.transform='rotateY(-60deg) translateX(-40px)';
    c.style.transformOrigin='left center';
    setTimeout(()=>{
      c.style.transition='all .9s var(--ease)';
      c.style.opacity='1';c.style.transform='rotateY(0) translateX(0)';
    },180*i);
  });
}

/* ---------- EQUIPMENT: 3D ROTATE ---------- */
function equipRotate(sec){
  sec.querySelectorAll('.equip-card').forEach((c,i)=>{
    c.style.opacity='0';c.style.transform='rotateY(90deg) translateZ(-60px)';
    setTimeout(()=>{
      c.style.transition='all .9s var(--ease)';
      c.style.opacity='1';c.style.transform='rotateY(0) translateZ(0)';
    },160*i);
  });
}

/* ---------- BOOK: GLASS MORPH ---------- */
function bookGlass(sec){
  const w=sec.querySelector('.book-wrap');
  w.style.opacity='0';w.style.transform='scale(.9)';w.style.filter='blur(20px)';
  setTimeout(()=>{w.style.transition='all 1s var(--ease)';w.style.opacity='1';w.style.transform='scale(1)';w.style.filter='blur(0)';},200);
}
const WA_NUMBER='919986431991';

// booking session cards <-> Project Type select (two-way sync)
const bookTypeSelect=document.querySelector('#book-type');
document.querySelectorAll('.session-card').forEach(card=>card.addEventListener('click',()=>{
  document.querySelectorAll('.session-card').forEach(x=>x.classList.remove('active'));
  card.classList.add('active');
  if(bookTypeSelect) bookTypeSelect.value=card.dataset.type;
}));
bookTypeSelect?.addEventListener('change',()=>{
  document.querySelectorAll('.session-card').forEach(c=>{
    c.classList.toggle('active',c.dataset.type===bookTypeSelect.value);
  });
});

document.querySelectorAll('.reel-thumb').forEach(item => {
    item.addEventListener('click', function () {
        const video = this.dataset.video;
        if (video) {
            window.open(video, '_blank');
        }
    });
});

/* ---- WhatsApp CTA: ripple + magnetic pull ---- */
const waBtn=document.querySelector('.btn-whatsapp-cta');
waBtn?.addEventListener('click',e=>{
  const r=waBtn.getBoundingClientRect();
  const ripple=document.createElement('span');
  ripple.className='ripple';
  const size=Math.max(r.width,r.height);
  ripple.style.width=ripple.style.height=size+'px';
  ripple.style.left=(e.clientX-r.left-size/2)+'px';
  ripple.style.top=(e.clientY-r.top-size/2)+'px';
  waBtn.append(ripple);
  setTimeout(()=>ripple.remove(),650);
});
waBtn?.addEventListener('mousemove',e=>{
  const r=waBtn.getBoundingClientRect();
  const x=(e.clientX-r.left-r.width/2)*0.25;
  const y=(e.clientY-r.top-r.height/2)*0.35;
  waBtn.style.transform=`translate(${x}px,${y}px)`;
});
waBtn?.addEventListener('mouseleave',()=>{waBtn.style.transform='';});

/* ---- Book form submit: build message, show plane, open WhatsApp ---- */
document.querySelector('#book-form')?.addEventListener('submit',e=>{
  e.preventDefault();
  const name=document.querySelector('#book-name')?.value.trim()||'—';
  const phone=document.querySelector('#book-phone')?.value.trim()||'—';
  const type=document.querySelector('#book-type')?.value||'—';
  const date=document.querySelector('#book-date')?.value||'—';
  const loc=document.querySelector('#book-loc')?.value.trim()||'—';
  const budget=document.querySelector('#book-budget')?.value||'—';
  const details=document.querySelector('#book-message')?.value.trim()||'—';

  const msg=`Hello Prabhakar,\nI would like to book a shoot.\n\nName: ${name}\nPhone: ${phone}\nProject Type: ${type}\nDate: ${date}\nLocation: ${loc}\nBudget: ${budget}\n\nProject Details:\n${details}\n____________________\nPlease let me know your availability.`;

  const confirm=document.querySelector('.wa-confirm');
  confirm?.classList.add('show');
  setTimeout(()=>{
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`,'_blank');
    setTimeout(()=>confirm?.classList.remove('show'),500);
  },1300);
});

/* ---------- CONTACT: PAPER PLANE ---------- */
function contactPlane(sec){
  // nothing extra needed, form handles it
}
document.querySelector('#contact-form')?.addEventListener('submit',e=>{
  e.preventDefault();
  const plane=document.createElement('div');plane.className='plane-send';plane.innerHTML='✈';
  const btn=e.target.querySelector('button');
  const r=btn.getBoundingClientRect();
  plane.style.left=r.left+'px';plane.style.top=r.top+'px';
  document.body.append(plane);
  requestAnimationFrame(()=>plane.classList.add('fly'));
  setTimeout(()=>{
    plane.remove();
    showToast('Message sent! Prabhakar will reach out soon.');
    e.target.reset();
  },1600);
});

/* ---------- FOOTER: SHUTTER CLOSE ON BACK TO TOP ---------- */
const shutterClose=document.createElement('div');shutterClose.className='shutter-close';
shutterClose.innerHTML='<span></span><span></span>';document.body.append(shutterClose);
document.querySelector('.back-top')?.addEventListener('click',()=>{
  shutterClose.classList.add('active');
  setTimeout(()=>{lenis.scrollTo(0);},300);
  setTimeout(()=>shutterClose.classList.remove('active'),1200);
});

/* ---------- AI ASSISTANT ---------- */
const aiPanel=document.querySelector('.ai-panel');
document.querySelector('.ai-toggle')?.addEventListener('click',()=>aiPanel.classList.toggle('show'));
const aiBody=document.querySelector('.ai-body');
const aiInput=document.querySelector('.ai-input input');
document.querySelector('.ai-input button')?.addEventListener('click',sendAI);
aiInput?.addEventListener('keydown',e=>{if(e.key==='Enter')sendAI();});
function aiPush(msg,who){
  const m=document.createElement('div');m.className='ai-msg '+who;m.textContent=msg;
  aiBody.appendChild(m);aiBody.scrollTop=aiBody.scrollHeight;
}
function sendAI(){
  const q=aiInput.value.trim();if(!q)return;
  aiPush(q,'user');aiInput.value='';
  setTimeout(()=>aiPush(botReply(q),'bot'),600);
}
function botReply(q){
  q=q.toLowerCase();
  if(q.includes('book')||q.includes('shoot'))return 'You can book a shoot in the "Book a Shoot" section — pick a package, set your budget and date, then tap WhatsApp or Email. Prabhakar replies fast!';
  if(q.includes('price')||q.includes('cost')||q.includes('budget'))return 'Pricing depends on the package. Use the budget slider in the booking section to explore ranges from ₹10k to ₹5L+.';
  if(q.includes('wedding'))return 'Wedding photography & cinematography are signature services. Full-day coverage, cinematic reels, and drone shots available.';
  if(q.includes('drone'))return 'Prabhakar is a certified drone pilot offering aerial cinematography for weddings, films, commercials & real estate.';
  if(q.includes('contact')||q.includes('phone')||q.includes('email'))return 'Call/WhatsApp +91 9986431991 or https://mail.google.com/mail/u/0/#inbox?compose=CllgCHrgmFvlzhpWpPxXgJZzjhSlzTHvxcWVdmnZRfnjHhDxqHTxzdVfmHsBzVgnblrVSTbBbxq. Based in Chennai, TN.';
  if(q.includes('portfolio')||q.includes('work')||q.includes('gallery'))return 'Check the Portfolio section — filter by Wedding, Portrait, Wildlife, Drone, Films & more. Click any image for full EXIF details.';
  if(q.includes('showreel')||q.includes('video'))return 'The Showreel section has 6 reels: Commercial, Wedding, Travel, Drone, Documentary & Film Trailer. Hover to preview!';
  if(q.includes('hi')||q.includes('hello')||q.includes('hey'))return 'Hey there! I am Prabhakar\'s AI assistant. Ask me about services, booking, portfolio, or pricing.';
  return 'Great question! Prabhakar specializes in photography, cinematography & drone work. Try asking about booking, services, portfolio, or pricing.';
}
aiPush("👋 Hi! I'm Prabhakar's AI assistant. Ask me about his work, services, or booking a shoot.",'bot');

/* ---------- TOAST ---------- */
function showToast(msg){
  let t=document.querySelector('.toast');
  if(!t){t=document.createElement('div');t.className='toast';document.body.append(t);}
  t.innerHTML=`<i>✦</i> ${msg}`;
  t.classList.add('show');
  clearTimeout(window._tt);window._tt=setTimeout(()=>t.classList.remove('show'),3000);
}

/* ---------- THEME TOGGLE ---------- */
document.querySelector('.theme-toggle')?.addEventListener('click',()=>{
  document.body.classList.toggle('light-theme');
  showToast(document.body.classList.contains('light-theme')?'Light mode (cinematic light) on':'Dark cinematic mode on');
});

/* ---------- MAGNETIC BUTTONS ---------- */
document.querySelectorAll('.btn,.nav-cta,.ai-toggle,.back-top').forEach(b=>{
  b.addEventListener('mousemove',e=>{
    const r=b.getBoundingClientRect();
    const x=e.clientX-r.left-r.width/2;const y=e.clientY-r.top-r.height/2;
    b.style.transform=`translate(${x*0.25}px,${y*0.25}px)`;
  });
  b.addEventListener('mouseleave',()=>b.style.transform='');
});

/* ---------- IMAGE TILT ON PORTFOLIO ---------- */
document.querySelectorAll('.masonry-item,.bts-card,.blog-card .thumb').forEach(el=>{
  el.addEventListener('mousemove',e=>{
    const r=el.getBoundingClientRect();
    const x=(e.clientX-r.left)/r.width-0.5;const y=(e.clientY-r.top)/r.height-0.5;
    el.style.transform=`perspective(800px) rotateY(${x*10}deg) rotateX(${-y*10}deg)`;
  });
  el.addEventListener('mouseleave',()=>el.style.transform='');
});

/* ---------- SITEWIDE BUTTON POLISH: ripple + gentle magnetic pull ---------- */
document.querySelectorAll('.btn').forEach(btn=>{
  btn.addEventListener('click',e=>{
    const r=btn.getBoundingClientRect();
    const ripple=document.createElement('span');
    ripple.className='ripple';
    const size=Math.max(r.width,r.height);
    ripple.style.width=ripple.style.height=size+'px';
    ripple.style.left=(e.clientX-r.left-size/2)+'px';
    ripple.style.top=(e.clientY-r.top-size/2)+'px';
    btn.append(ripple);
    setTimeout(()=>ripple.remove(),650);
  });
  btn.addEventListener('mousemove',e=>{
    const r=btn.getBoundingClientRect();
    const x=(e.clientX-r.left-r.width/2)*0.12;
    const y=(e.clientY-r.top-r.height/2)*0.18;
    btn.style.transform=`translate(${x}px,${y}px)`;
  });
  btn.addEventListener('mouseleave',()=>{btn.style.transform='';});
});

/* ---------- EXPERIENCE: PWA / SERVICE WORKER ---------- */
if('serviceWorker' in navigator){
  // inline minimal service worker registration optional
}
console.log('%c INBA STUDIOS · PRABHAKAR ','background:#d4af37;color:#000;font-weight:700;padding:6px 12px;font-size:14px;');
