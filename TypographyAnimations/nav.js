// Shared study navigation: previous / next and a menu of every study, so a visitor can move between
// studies without returning to the index. Each page includes it with <script src="../nav.js" defer>.
// It replaces the page's "← Type Motion" link and takes its colours from the page's own variables.
(() => {
  // Same sections and order as the index page
  const SECTIONS = [
    ['Kinetic craft', [
      ['01-weight', 'Weightless'], ['02-reveal', 'On Reading'], ['03-magnetic', 'Closer'], ['04-rotator', 'Substitution'],
      ['05-scatter', 'Serendipity'], ['06-bounce', 'Buoyant'], ['07-whoosh', 'Velocity'],
    ]],
    ['Physical forces', [
      ['08-balance', 'Balance'], ['09-stability', 'Stability'], ['11-gravity', 'Gravity'], ['12-tension', 'Tension'],
      ['13-friction', 'Friction'], ['14-elasticity', 'Elasticity'], ['15-momentum', 'Momentum'], ['16-fragility', 'Fragility'],
      ['17-pressure', 'Pressure'],
    ]],
    ['Time & change', [
      ['10-structure', 'Structure'], ['18-growth', 'Growth'], ['19-decay', 'Decay'], ['20-memory', 'Memory'],
      ['21-patience', 'Patience'], ['22-entropy', 'Entropy'],
    ]],
    ['Inner states', [
      ['23-calm', 'Calm'], ['24-anxiety', 'Anxiety'], ['25-focus', 'Focus'], ['26-doubt', 'Doubt'], ['27-courage', 'Courage'],
      ['28-restraint', 'Restraint'], ['29-trust', 'Trust'],
    ]],
    ['Abstract & relational', [
      ['30-connection', 'Connection'], ['31-hierarchy', 'Hierarchy'], ['32-symmetry', 'Symmetry'], ['33-rhythm', 'Rhythm'],
      ['34-contradiction', 'Contradiction'], ['35-silence', 'Silence'],
    ]],
  ];
  const STUDIES = SECTIONS.flatMap(([, list]) => list);
  const folder = location.pathname.split('/').filter(Boolean).slice(-2, -1)[0];
  const index = STUDIES.findIndex(([slug]) => slug === folder);
  const back = document.querySelector('a[href="../index.html"]');
  if (index < 0 || !back) return;

  const href = (slug) => `../${slug}/index.html`;
  const prev = STUDIES[(index - 1 + STUDIES.length) % STUDIES.length];
  const next = STUDIES[(index + 1) % STUDIES.length];

  const style = document.createElement('style');
  style.textContent = `
    .tm-nav{display:inline-flex;align-items:center;gap:clamp(10px,1.6vw,18px)}
    .tm-nav a,.tm-nav button{color:inherit;font:inherit;letter-spacing:inherit;text-transform:inherit;text-decoration:none;
      background:none;border:0;border-bottom:1px solid transparent;padding:0;cursor:pointer;transition:color .3s,border-color .3s}
    .tm-nav a:hover,.tm-nav button:hover,.tm-nav a:focus-visible,.tm-nav button:focus-visible{color:var(--ink,#26221c);border-color:currentColor;outline:none}
    .tm-menu{position:fixed;inset:0;z-index:1000;display:none;overflow:auto;padding:clamp(70px,9vw,110px) clamp(18px,3vw,34px) 40px;
      background:color-mix(in srgb,var(--bg,var(--paper,#ece7de)) 94%,transparent);backdrop-filter:blur(8px);
      color:var(--ink,#26221c);font-family:"Space Mono",monospace}
    .tm-menu.open{display:block}
    .tm-menu .tm-top{position:fixed;top:clamp(18px,3vw,34px);left:clamp(18px,3vw,34px);right:clamp(18px,3vw,34px);display:flex;
      justify-content:space-between;font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:var(--dim,#8b8474)}
    .tm-menu .tm-top a,.tm-menu .tm-top button{color:inherit;font:inherit;letter-spacing:inherit;text-transform:inherit;background:none;border:0;
      border-bottom:1px solid transparent;padding:0;cursor:pointer;text-decoration:none}
    .tm-menu .tm-top a:hover,.tm-menu .tm-top button:hover{color:var(--ink,#26221c);border-color:currentColor}
    .tm-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:28px 36px;max-width:1100px;margin:0 auto}
    .tm-sec h3{font-size:10px;font-weight:400;letter-spacing:.22em;text-transform:uppercase;color:var(--dim,#8b8474);margin:0 0 10px;
      padding-bottom:8px;border-bottom:1px solid var(--line,rgba(127,127,127,.25))}
    .tm-sec a{display:block;font-family:"Fraunces",serif;font-size:19px;line-height:1.55;color:var(--ink,#26221c);text-decoration:none;
      opacity:.72;transition:opacity .2s}
    .tm-sec a:hover,.tm-sec a:focus-visible{opacity:1;outline:none;text-decoration:underline;text-underline-offset:4px}
    .tm-sec a[aria-current]{opacity:1;color:var(--acc,var(--ink,#26221c))}
    .tm-sec a[aria-current]::before{content:"→ ";font-family:"Space Mono",monospace;font-size:12px}
  `;
  document.head.appendChild(style);

  const nav = document.createElement('span');
  nav.className = 'tm-nav';
  nav.innerHTML = `
    <a href="${href(prev[0])}" title="Previous: ${prev[1]}">‹ Prev</a>
    <button type="button" aria-haspopup="dialog" aria-expanded="false">Studies ${index + 1}/${STUDIES.length}</button>
    <a href="${href(next[0])}" title="Next: ${next[1]}">Next ›</a>`;
  back.replaceWith(nav);
  const toggle = nav.querySelector('button');

  const menu = document.createElement('div');
  menu.className = 'tm-menu';
  menu.setAttribute('role', 'dialog');
  menu.setAttribute('aria-label', 'All studies');
  menu.innerHTML = `
    <div class="tm-top"><a href="../index.html">← Type Motion index</a><button type="button" class="tm-close">Close ✕</button></div>
    <div class="tm-grid">${SECTIONS.map(([name, list]) => `
      <div class="tm-sec"><h3>${name.replace('&', '&amp;')}</h3>${list.map(([slug, title]) =>
        `<a href="${href(slug)}"${slug === folder ? ' aria-current="page"' : ''}>${title}</a>`).join('')}</div>`).join('')}
    </div>`;
  document.body.appendChild(menu);

  // Keep the study's own pointer and keyboard handlers out of the menu
  ['pointerdown', 'pointerup', 'mousedown', 'mouseup', 'click', 'mousemove', 'pointermove', 'wheel', 'touchstart', 'touchmove'].forEach((type) => {
    nav.addEventListener(type, (e) => e.stopPropagation());
    menu.addEventListener(type, (e) => e.stopPropagation());
  });

  const setOpen = (open) => {
    menu.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    if (open) menu.querySelector('[aria-current]')?.focus();
    else toggle.focus();
  };
  toggle.addEventListener('click', () => setOpen(!menu.classList.contains('open')));
  menu.querySelector('.tm-close').addEventListener('click', () => setOpen(false));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('open')) {
      e.stopPropagation();
      setOpen(false);
    }
  }, true);
})();
