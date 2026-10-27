// The file-cabinet drawer: builds the hanging tabs from data, and pops open a
// file card when one is clicked. Ported from the original canvas component's
// state machine (SECTIONS / FILES / LAYOUT tables) into plain DOM + vanilla JS.
(function () {
  var SECTIONS = {
    D: { tag: 'A', short: 'build', label: 'design & build', color: '#A8C6FE', href: 'ai-tools.html' },
    A: { tag: 'B', short: 'data', label: 'analytics', color: '#CCE8B5', href: 'dashboards.html' },
    V: { tag: 'C', short: 'strategy', label: 'strategy & ventures', color: '#FFF995', href: 'ventures.html' },
    F: { tag: 'D', short: 'fun', label: 'fun stuff', color: '#FFFFFF', href: 'fun.html' }
  };

  var FILES = {
    '01': { s: 'D', title: 'On Brief', what: 'Ask for a script, ad concepts or a campaign idea and get structured ideas back, each with its reasoning and source. Built in: an ad scraper that shows what competitors are running.', role: 'builder', kit: 'Claude Code, VS Code' },
    '02': { s: 'D', href: 'ai-tools.html#pulse', title: 'Mosaic Pulse', what: 'Built during my Mosaic hiring process. Scans Reddit, Google Trends and competitor reviews for customer friction and turns it into scored product ideas.', role: 'builder', kit: 'Lovable' },
    '03': { s: 'A', href: 'dashboards.html#ads', title: 'Acquisition ads', what: 'Which Meta ads bring in customers who come back: retention by product, creative narrative and state, with an evidence bar so thin data isn’t ranked.', role: 'build', kit: 'Claude Code, VS Code, DBeaver' },
    '04': { s: 'A', href: 'dashboards.html#channels', title: 'Channel performance', what: 'How close the demand plan is to what actually sells, by channel. Now growing into stockout, opening inventory and DRR forecasts.', role: '[ROLE]', kit: 'Claude Code, VS Code, DBeaver' },
    '05': { s: 'V', href: 'ventures.html#category', title: 'Category @ Mosaic', what: 'Two months scaling NutriMix 2+: ran its acquisition, designed regional product pages and ads. Lesson: cheap attention, expensive customers.', role: 'category owner', kit: '2 months' },
    '06': { s: 'V', href: 'ventures.html#vc', title: 'Venture Catalysts', what: 'Evaluated early-stage B2B startups in healthtech and deep-tech, and wrote deal notes for the weekly partner review.', role: 'investment analyst intern', kit: 'Oct 2025 – Jan 2026' },
    '07': { s: 'V', href: 'ventures.html#vr', title: 'Meerahi VR', what: 'Founder’s office: built the pricing strategy from weekly revenue tracked by customer group, and a 200+ contact B2B outreach database.', role: 'intern, founder’s office', kit: 'May – Jul 2025' },
    '08': { s: 'V', href: 'ventures.html', title: 'Ember', what: 'Co-founded; led ops and product strategy for Burnicol, a herbal burn-care product used by 40,000+ people.', role: 'co-founder', kit: 'May – Aug 2025' },
    '09': { s: 'V', href: 'ventures.html', title: 'Case comps', what: 'Top 10 of 500+ teams at InnovateX, IIT Bombay; selected for the McKinsey Forward Program, 2025 cohort.', role: 'competitor', kit: '2025' },
    '10': { s: 'F', title: 'Writing', what: 'My first Substack post: “We’re All Just Feeding Off Your Impulses” — notes from the seduction department.', role: 'writer', kit: 'Substack' },
    '11': { s: 'F', title: 'Crochet', what: 'A deep red crochet bag, wooden beads and all.', role: 'maker', kit: 'hook + yarn' },
    '12': { s: 'F', title: 'Reading list', what: 'The Picture of Dorian Gray (the favourite), The Murder at the Vicarage, Wuthering Heights.', role: 'reader', kit: '3 books' }
  };

  // catalogue order top to bottom: d = divider, f = file; x = tab position across the strip (0-1)
  var LAYOUT = [
    { d: 'D', x: 0.14 }, { f: '01', x: 0.37 }, { f: '02', x: 0.67 },
    { d: 'A', x: 0.40 }, { f: '03', x: 0.67 }, { f: '04', x: 0.37 },
    { d: 'V', x: 0.06 }, { f: '05', x: 0.67 }, { f: '06', x: 0.37 }, { f: '07', x: 0.67 }, { f: '08', x: 0.37 }, { f: '09', x: 0.05, wide: true },
    { d: 'F', x: 0.40 }, { f: '10', x: 0.67 }, { f: '11', x: 0.37 }, { f: '12', x: 0.67 }
  ];

  var PITCH = 19;
  var N = LAYOUT.length;

  var counts = {};
  Object.keys(FILES).forEach(function (k) {
    var s = FILES[k].s;
    counts[s] = (counts[s] || 0) + 1;
  });

  var stage = document.getElementById('drawer-stage');
  var tabLayer = document.createElement('div');
  tabLayer.setAttribute('aria-hidden', 'false');
  stage.insertBefore(tabLayer, stage.firstChild);

  var selected = null;
  var fileCardEl = null;

  function svgTab(fill) {
    var ns = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '32');
    svg.setAttribute('viewBox', '0 0 200 32');
    svg.setAttribute('preserveAspectRatio', 'none');

    var fillPath = document.createElementNS(ns, 'path');
    fillPath.setAttribute('d', 'M0 33 C6 33 8 31 10 27 L18 5 C19 2 21 0 25 0 L175 0 C179 0 181 2 182 5 L190 27 C192 31 194 33 200 33 Z');
    fillPath.setAttribute('fill', fill);
    svg.appendChild(fillPath);

    var strokePath = document.createElementNS(ns, 'path');
    strokePath.setAttribute('d', 'M0 32 C6 32 8 30 10 26 L18 5 C19 2 21 0 25 0 L175 0 C179 0 181 2 182 5 L190 26 C192 30 194 32 200 32');
    strokePath.setAttribute('fill', 'none');
    strokePath.setAttribute('stroke', '#1C1D1F');
    strokePath.setAttribute('stroke-width', '1.2');
    strokePath.setAttribute('vector-effect', 'non-scaling-stroke');
    svg.appendChild(strokePath);

    return svg;
  }

  function closeFile() {
    selected = null;
    if (fileCardEl) {
      fileCardEl.remove();
      fileCardEl = null;
    }
    render();
  }

  function openFile(num) {
    selected = selected === num ? null : num;
    render();
  }

  function openSection(sectionKey) {
    var first = Object.keys(FILES).filter(function (k) { return FILES[k].s === sectionKey; })[0];
    openFile(first);
  }

  function renderFileCard(sel) {
    if (fileCardEl) fileCardEl.remove();

    var sec = SECTIONS[sel.s];
    var article = document.createElement('article');
    article.className = 'file-card is-open';
    article.style.background = sec.color;

    var top = document.createElement('div');
    top.className = 'file-card__top';
    var topLabel = document.createElement('span');
    topLabel.textContent = 'file ' + sel.num + ' · ' + sec.tag + ' — ' + sec.label;
    var closeBtn = document.createElement('button');
    closeBtn.className = 'file-card__close';
    closeBtn.setAttribute('aria-label', 'Put the file back');
    closeBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="#1C1D1F" stroke-width="1.8" aria-hidden="true"><path d="M3 3l10 10M13 3L3 13"></path></svg>';
    closeBtn.addEventListener('click', closeFile);
    top.appendChild(topLabel);
    top.appendChild(closeBtn);

    var h2 = document.createElement('h2');
    h2.textContent = sel.title;

    var p = document.createElement('p');
    p.textContent = sel.what;

    var kv = document.createElement('div');
    kv.className = 'key-value';
    kv.innerHTML =
      '<div>role</div><div>' + sel.role + '</div>' +
      '<div>kit</div><div>' + sel.kit + '</div>';

    var link = document.createElement('a');
    link.className = 'btn-dark';
    link.href = sel.href || sec.href;
    link.textContent = 'open the file →';

    article.appendChild(top);
    article.appendChild(h2);
    article.appendChild(p);
    article.appendChild(kv);
    article.appendChild(link);

    stage.insertBefore(article, tabLayer.nextSibling);
    fileCardEl = article;
  }

  function render() {
    tabLayer.innerHTML = '';
    var selData = null;

    LAYOUT.forEach(function (it, i) {
      var inset = 7 * (1 - i / (N - 1));
      var width = 100 - 2 * inset;
      var top = i * PITCH;
      var isDiv = !!it.d;

      var strip = document.createElement('div');
      strip.className = 'strip';
      strip.setAttribute('aria-hidden', 'true');
      strip.style.top = (top + 30) + 'px';
      strip.style.left = inset.toFixed(2) + '%';
      strip.style.width = width.toFixed(2) + '%';
      tabLayer.appendChild(strip);

      var tw = isDiv ? 0.19 : (it.wide ? 0.31 : 0.30);
      var tab = document.createElement('button');
      tab.className = 'tab';
      tab.style.left = (inset + it.x * width).toFixed(2) + '%';
      tab.style.width = (tw * width).toFixed(2) + '%';

      var left, right, fill, ink, weight, pressed, tabTop;

      if (isDiv) {
        var sec = SECTIONS[it.d];
        var c = counts[it.d] || 0;
        left = sec.tag;
        right = sec.short;
        fill = '#1C1D1F';
        ink = '#FFFFFF';
        weight = '500';
        pressed = 'false';
        tabTop = top;
        tab.setAttribute('aria-label', 'Section ' + sec.tag + ', ' + sec.label + ', ' + c + ' files');
        tab.addEventListener('click', function () { openSection(it.d); });
      } else {
        var file = FILES[it.f];
        var fsec = SECTIONS[file.s];
        var isSel = selected === it.f;
        if (isSel) {
          selData = {
            num: it.f, title: file.title, what: file.what, role: file.role, kit: file.kit,
            s: file.s, href: file.href || fsec.href
          };
        }
        left = it.f;
        right = file.title;
        fill = isSel ? fsec.color : '#F0F0F0';
        ink = '#1C1D1F';
        weight = '400';
        pressed = isSel ? 'true' : 'false';
        tabTop = isSel ? top - 12 : top;
        tab.setAttribute('aria-label', 'File ' + it.f + ', ' + file.title);
        tab.addEventListener('click', function () { openFile(it.f); });
      }

      tab.style.top = tabTop + 'px';
      tab.setAttribute('aria-pressed', pressed);
      tab.appendChild(svgTab(fill));

      var label = document.createElement('span');
      label.className = 'tab__label';
      label.style.color = ink;
      var leftSpan = document.createElement('span');
      leftSpan.style.fontWeight = weight;
      leftSpan.textContent = left;
      var rightSpan = document.createElement('span');
      rightSpan.style.overflow = 'hidden';
      rightSpan.style.textOverflow = 'ellipsis';
      rightSpan.textContent = right;
      label.appendChild(leftSpan);
      label.appendChild(rightSpan);
      tab.appendChild(label);

      tabLayer.appendChild(tab);
    });

    if (selData) {
      renderFileCard(selData);
    } else if (fileCardEl) {
      fileCardEl.remove();
      fileCardEl = null;
    }
  }

  render();
})();
