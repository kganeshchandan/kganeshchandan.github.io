const header = document.querySelector('[data-header]');
const menuToggle = document.querySelector('[data-menu-toggle]');
const nav = document.querySelector('[data-nav]');

document.querySelectorAll('[data-year]').forEach((year) => {
  year.textContent = new Date().getFullYear();
});

const updateHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 12);
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

const closeMenu = (returnFocus = false) => {
  menuToggle?.setAttribute('aria-expanded', 'false');
  nav?.classList.remove('is-open');
  if (returnFocus) menuToggle?.focus();
};

menuToggle?.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!open));
  nav?.classList.toggle('is-open', !open);
});
nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => closeMenu()));
const menuIsOpen = () => menuToggle?.getAttribute('aria-expanded') === 'true';
window.addEventListener('keydown', (event) => {
  if (!menuIsOpen()) return;
  // Only claim Escape while the menu is actually open, so it never steals focus from other widgets.
  if (event.key === 'Escape') closeMenu(true);
  // While the menu covers the page, Tab cycles between the toggle and the menu links.
  if (event.key === 'Tab') {
    const stops = [menuToggle, ...nav.querySelectorAll('a')];
    const index = stops.indexOf(document.activeElement);
    const next = event.shiftKey ? (index <= 0 ? stops.length - 1 : index - 1) : (index === stops.length - 1 ? 0 : index + 1);
    event.preventDefault();
    stops[next].focus();
  }
});
document.addEventListener('pointerdown', (event) => {
  if (menuIsOpen() && !header.contains(event.target)) closeMenu();
});

const graph = document.querySelector('[data-graph]');

if (graph) {
  const SVG_NS = 'http://www.w3.org/2000/svg';
  const BASE_WIDTH = 900;
  const BASE_HEIGHT = 640;
  const graphStage = graph.closest('[data-atlas-stage]');
  let width = BASE_WIDTH;
  let height = BASE_HEIGHT;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const nodes = [
    {
      id: 'ganesh', label: 'Ganesh', kind: 'root', group: 'all', tx: 450, ty: 315, radius: 43,
      description: 'Software engineer and researcher. I build AI for robotics, wearable health sensing and molecular science.',
      meta: { Focus: 'Robotics & AI', Base: 'Bangalore, India' }, link: 'resume.html'
    },
    {
      id: 'iiith', label: 'IIIT-H', kind: 'place', group: 'research', tx: 390, ty: 105, radius: 32,
      description: 'Where I did an integrated B.Tech and M.S. by Research, including three years of research in computational science.',
      meta: { Period: '2019–2024', Recognition: 'Academic Research Award' }, link: 'timeline.html#year-2021'
    },
    {
      id: 'samsung', label: 'Samsung', kind: 'place', group: 'professional', tx: 690, ty: 310, radius: 34,
      description: 'I\'m a Senior Software Engineer in the Advanced Research and Standards team, working on robotics and AI.',
      meta: { Since: 'July 2024', Awards: 'Excellence · Spot' }, link: 'resume.html'
    },
    {
      id: 'virtual-labs', label: 'Virtual Labs', kind: 'place', group: 'build', tx: 380, ty: 545, radius: 31,
      description: 'I built Three.js simulations of solid-state chemistry experiments for a Ministry of Education project.',
      meta: { Role: 'Software Developer', Period: '2022–2023' }, link: 'timeline.html#year-2022'
    },
    {
      id: 'molecular-ai', label: 'Molecular AI', kind: 'domain', group: 'research', tx: 215, ty: 220, radius: 34,
      description: 'Using generative models to design molecules and predict their properties, mostly for drug discovery.',
      meta: { Methods: 'GNNs · GPT · Diffusion', Domain: 'Scientific AI' }
    },
    {
      id: 'multimodal', label: 'Multimodal', kind: 'domain', group: 'research', tx: 330, ty: 300, radius: 31,
      description: 'Training models that link different kinds of data: molecular graphs, spectra, images, text and brain signals.',
      meta: { Modalities: 'Graphs · Spectra · fMRI', Method: 'Contrastive learning' }
    },
    {
      id: 'biosensing', label: 'Biosensing', kind: 'domain', group: 'professional', tx: 630, ty: 185, radius: 32,
      description: 'AI on PPG and audio signals from wearables, for heart health, hydration, glucose and machine health.',
      meta: { Evidence: '2 patents filed', Platform: 'Wearable edge devices' }
    },
    {
      id: 'robotics', label: 'Robotics', kind: 'domain', group: 'professional', tx: 765, ty: 405, radius: 32,
      description: 'What I\'m working on now: robots, and models that learn how the physical world behaves.',
      meta: { Focus: 'Embodied intelligence', Direction: 'World models' }
    },
    {
      id: 'neuro-ai', label: 'Neuro-AI', kind: 'domain', group: 'research', tx: 270, ty: 430, radius: 31,
      description: 'Linking fMRI brain activity with attention and with how models represent speech.',
      meta: { Signals: '3D fMRI', Models: 'CNNs · Transformers' }
    },
    {
      id: 'software', label: 'Software', kind: 'domain', group: 'build', tx: 515, ty: 505, radius: 31,
      description: 'Everything else I\'ve built: science tools, local AI apps, games, web apps and systems coursework.',
      meta: { Repositories: '23 original public repos', Range: 'Systems to interfaces' }
    },
    {
      id: 'smen', label: 'SMEN', kind: 'project', group: 'research', tx: 190, ty: 95, radius: 27,
      description: 'A model that takes an infrared spectrum and ranks or generates the molecules that could have produced it.',
      meta: { Evidence: 'Peer-reviewed evaluation', Status: 'Digital Discovery, 2024' }, link: 'https://doi.org/10.1039/D4DD00135D'
    },
    {
      id: 'molgpt', label: 'MolGPT 2.0', kind: 'project', group: 'research', tx: 75, ty: 180, radius: 30,
      description: 'Generates molecules that meet several goals at once, using an encoder-decoder transformer tuned with direct preference optimization.',
      meta: { Evaluation: 'Checkpoint-dependent', Role: 'Initial codebase author' }, link: 'https://github.com/devalab/MolGPT2.0'
    },
    {
      id: 'bias-study', label: 'Bias study', kind: 'project', group: 'research', tx: 85, ty: 330, radius: 29,
      description: 'Found hidden biases in the popular datasets and models used to predict binding affinity.',
      meta: { Models: 'DeepDTA · GraphDTA · more', Status: 'Peer reviewed' }, link: 'https://doi.org/10.1021/acsomega.2c06781'
    },
    {
      id: 'beds', label: 'BEDS', kind: 'project', group: 'research', tx: 150, ty: 485, radius: 26,
      description: 'Brain Encoding and Decoding of Speech. The research code is private; the repo has a public summary.',
      meta: { Input: 'fMRI activations', Output: 'Speech representations' }, link: 'https://github.com/kganeshchandan/BEDS'
    },
    {
      id: 'jepa', label: 'JEPA GOAT', kind: 'project', group: 'build', tx: 800, ty: 535, radius: 29,
      description: 'A small game environment that records frames, actions and object movement, to use later for JEPA experiments.',
      meta: { Area: 'World models', Stack: 'Python · Pygame' }, link: 'https://github.com/kganeshchandan/jepa-goat'
    },
    {
      id: 'manga', label: 'Manga AI', kind: 'project', group: 'build', tx: 610, ty: 575, radius: 28,
      description: 'Colors manga in the browser. A Chrome extension sends pages to a FastAPI service that runs a GAN on your own machine.',
      meta: { Privacy: 'Local-first', Stack: 'JavaScript · Python' }, link: 'https://github.com/kganeshchandan/manga-colorizer'
    },
    {
      id: 'molvis', label: 'MolVis', kind: 'project', group: 'build', tx: 455, ty: 590, radius: 27,
      description: 'An Apple Vision Pro app for looking at molecules in 3D and moving them around.',
      meta: { Platform: 'visionOS', Stack: 'RealityKit · SwiftUI' }, link: 'https://github.com/kganeshchandan/MolVis'
    },
    {
      id: 'paper-spectra', label: 'Digital Discovery', kind: 'paper', group: 'publication', tx: 250, ty: 35, radius: 25,
      description: 'Spectra to structure: contrastive learning to rank candidate molecules and generate new ones from spectra.',
      meta: { Published: '2024', Journal: 'Digital Discovery' }, link: 'https://doi.org/10.1039/D4DD00135D'
    },
    {
      id: 'paper-generative', label: 'GenAI review', kind: 'paper', group: 'publication', tx: 65, ty: 70, radius: 25,
      description: 'A review of generative AI methods for designing small-molecule drugs.',
      meta: { Published: '2024', Journal: 'Current Opinion in Biotechnology' }, link: 'https://doi.org/10.1016/j.copbio.2024.103175'
    },
    {
      id: 'paper-bias', label: 'ACS Omega', kind: 'paper', group: 'publication', tx: 45, ty: 420, radius: 25,
      description: 'The published bias study: binding-affinity models and the datasets they are trained on.',
      meta: { Published: '2023', Journal: 'ACS Omega' }, link: 'https://doi.org/10.1021/acsomega.2c06781'
    }
  ];

  const repositoryItems = [
    ['hacktoberfest', 'C · first-contribution fork'],
    ['awesome-for-beginners', 'Open-source contribution resources · fork'],
    ['JobsHub', 'MERN-stack jobs platform · JavaScript'],
    ['AAD-Project', 'Blockchain web application · fork'],
    ['tgbot', 'Telegram administration bot · fork'],
    ['SpaceOdyssey', 'Two-player Pygame rocket game'],
    ['kaizoe_bot', 'Multipurpose Telegram bot · fork'],
    ['SpotifyAddBlocker', 'Desktop shell utility for Spotify'],
    ['BlockBreakerVII', 'Object-oriented Python Breakout game'],
    ['sim-CNNDTA', 'Drug–target affinity experiments · deep learning'],
    ['Operating-Systems-and-Networks', 'Systems and networking coursework · C'],
    ['MyDotfiles', 'Personal Vim and development configuration'],
    ['Multi-Handwritten-digit-recognition-CNN', 'PyTorch and OpenCV digit recognition'],
    ['dd_code', 'Binding-affinity dataset bias research code'],
    ['kganeshchandan', 'GitHub profile and statistics'],
    ['kganeshchandan.github.io', 'Interactive personal portfolio'],
    ['Tute12_data', 'ESOL and Tox21 molecular datasets'],
    ['3JS', 'Three.js atom and crystal simulation prototype'],
    ['d4-course-projs', 'Explainable drug–target and reinforcement learning coursework'],
    ['visiting-phd-exercises', 'AI, ML, PyTorch, RDKit, and chemistry tutorials'],
    ['CLIP_FULL', 'Spectra–molecule contrastive learning research code'],
    ['github-stats', 'GitHub Actions statistics visualizer'],
    ['SimpleRDBMS', 'C++ relational database coursework'],
    ['Spectra2Structure', 'Published spectra-to-molecule training implementation']
  ].map(([label, description]) => ({
    id: `repo-${label.toLowerCase()}`,
    label,
    description,
    type: 'Repository',
    url: `https://github.com/kganeshchandan/${label}`
  }));

  const portfolioItems = [
    ...nodes.map((node) => ({
      id: node.id,
      nodeId: node.id,
      label: node.label,
      description: `${node.description} ${Object.values(node.meta).join(' ')}`,
      type: node.kind === 'paper' ? 'Publication' : node.kind === 'place' ? 'Institution' : node.kind === 'domain' ? 'Domain' : node.kind === 'root' ? 'Profile' : 'Project',
      url: node.link
    })),
    ...repositoryItems
  ];

  const links = [
    ['ganesh', 'iiith'], ['ganesh', 'samsung'], ['ganesh', 'virtual-labs'],
    ['ganesh', 'molecular-ai'], ['ganesh', 'multimodal'], ['ganesh', 'neuro-ai'], ['ganesh', 'software'],
    ['samsung', 'biosensing'], ['samsung', 'robotics'], ['biosensing', 'multimodal'],
    ['robotics', 'jepa'], ['robotics', 'software'],
    ['iiith', 'molecular-ai'], ['iiith', 'multimodal'], ['iiith', 'neuro-ai'],
    ['molecular-ai', 'molgpt'], ['molecular-ai', 'bias-study'], ['molecular-ai', 'smen'],
    ['multimodal', 'smen'], ['multimodal', 'beds'], ['neuro-ai', 'beds'],
    ['software', 'manga'], ['software', 'molvis'], ['software', 'jepa'], ['software', 'virtual-labs'],
    ['smen', 'paper-spectra'], ['molgpt', 'paper-generative'], ['bias-study', 'paper-bias']
  ].map(([source, target]) => ({ source, target }));

  const nodeMap = new Map(nodes.map((node) => [node.id, node]));
  const edgeLayer = graph.querySelector('[data-edges]');
  const nodeLayer = graph.querySelector('[data-nodes]');
  const panel = document.querySelector('[data-node-panel]');
  const panelType = panel.querySelector('[data-panel-type]');
  const panelTitle = panel.querySelector('[data-panel-title]');
  const panelDescription = panel.querySelector('[data-panel-description]');
  const panelMeta = panel.querySelector('[data-panel-meta]');
  const panelLink = panel.querySelector('[data-panel-link]');
  const resultCount = document.querySelector('[data-result-count]');
  const searchInput = document.querySelector('[data-atlas-search]');
  const searchResults = document.querySelector('[data-search-results]');

  const measureGraph = () => {
    const rect = graphStage.getBoundingClientRect();
    const aspect = Math.max(.35, rect.width / Math.max(rect.height, 1));
    if (aspect >= 1) {
      // Wide-but-short canvases (landscape phones) keep desktop-sized nodes so the layout has room.
      return { width: BASE_WIDTH, height: Math.max(340, Math.min(BASE_HEIGHT, BASE_WIDTH / aspect)), mobile: rect.width <= 720 && aspect < 1.3 };
    }
    // Portrait canvases get a taller frame of the same shape, so the layout fills the stage
    // instead of sitting in a letterboxed band across the middle.
    const mobile = rect.width <= 720;
    const portraitWidth = Math.max(mobile ? 640 : 500, BASE_HEIGHT * aspect);
    return { width: portraitWidth, height: Math.max(BASE_HEIGHT, portraitWidth / aspect), mobile };
  };

  const initialLayout = measureGraph();
  width = initialLayout.width;
  height = initialLayout.height;
  let mobileView = initialLayout.mobile;
  nodes.forEach((node) => {
    node.baseTx = node.tx;
    node.baseTy = node.ty;
  });
  // Fit the authored layout's own extent (not the 900×640 frame) so it sits centred in the canvas.
  const layoutBounds = {
    minX: Math.min(...nodes.map((node) => node.baseTx - node.radius)),
    maxX: Math.max(...nodes.map((node) => node.baseTx + node.radius)),
    minY: Math.min(...nodes.map((node) => node.baseTy - node.radius)),
    maxY: Math.max(...nodes.map((node) => node.baseTy + node.radius))
  };
  const placeNode = (node) => {
    const padding = mobileView ? 52 : 34;
    node.tx = padding + ((node.baseTx - layoutBounds.minX) / (layoutBounds.maxX - layoutBounds.minX)) * (width - padding * 2);
    node.ty = padding + ((node.baseTy - layoutBounds.minY) / (layoutBounds.maxY - layoutBounds.minY)) * (height - padding * 2);
  };
  nodes.forEach(placeNode);


  let defaultView = { x: 0, y: 0, width, height };
  let currentView = { ...defaultView };
  let selectedId = null;
  let previewId = null;
  let lastTap = { node: null, time: 0 };
  let lastFocusedNode = null;
  let activeFilter = 'all';
  let searchTerm = '';
  let searchMatches = new Set();
  let rankedResults = [];
  let dragging = null;
  let panning = null;
  let simulationFrame = null;
  let simulationEnergy = 0;
  let pointerOffset = { x: 0, y: 0 };

  const setView = (view) => {
    const width = Math.min(1400, Math.max(300, view.width));
    const height = width * (defaultView.height / defaultView.width);
    currentView = {
      x: Math.max(-250, Math.min(defaultView.width + 250 - width, view.x)),
      y: Math.max(-180, Math.min(defaultView.height + 180 - height, view.y)),
      width,
      height
    };
    graph.setAttribute('viewBox', `${currentView.x} ${currentView.y} ${currentView.width} ${currentView.height}`);
  };
  setView(currentView);

  // Ease the camera to a new view; any direct pan, zoom or resize cancels the glide.
  let viewFrame = null;
  const stopGlide = () => {
    if (viewFrame) cancelAnimationFrame(viewFrame);
    viewFrame = null;
  };
  const glideView = (target) => {
    stopGlide();
    if (reducedMotion) {
      setView(target);
      return;
    }
    const from = { ...currentView };
    const start = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - start) / 360);
      const eased = 1 - Math.pow(1 - t, 3);
      setView({ x: from.x + (target.x - from.x) * eased, y: from.y + (target.y - from.y) * eased, width: from.width + (target.width - from.width) * eased });
      viewFrame = t < 1 ? requestAnimationFrame(step) : null;
    };
    viewFrame = requestAnimationFrame(step);
  };

  // Shrink a label until its widest line fits inside the circle. Measure the real glyphs when the
  // label is rendered (proportional lettering varies a lot); otherwise estimate from character count.
  const sizeLabel = (node) => {
    const baseSize = mobileView ? 17 : 9;
    const room = node.renderRadius * 2 * .8;
    node.text.style.fontSize = `${baseSize}px`;
    const lines = [...node.text.querySelectorAll('tspan')];
    const widest = node.text.isConnected
      ? Math.max(...(lines.length ? lines : [node.text]).map((line) => line.getComputedTextLength()))
      : 0;
    const longest = Math.max(...node.labelLines.map((line) => line.length));
    const fitSize = widest > 0 ? baseSize * room / widest : room / (longest * .6);
    node.text.style.fontSize = `${Math.min(baseSize, fitSize).toFixed(2)}px`;
  };

  const makeSvg = (name, attributes = {}) => {
    const element = document.createElementNS(SVG_NS, name);
    Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
    return element;
  };

  nodes.forEach((node) => {
    node.x = node.tx;
    node.y = node.ty;
    node.spawned = false;
    node.progress = 0;
    node.vx = 0;
    node.vy = 0;
    node.growthFrame = null;

    const group = makeSvg('g', {
      class: 'graph-node',
      'data-id': node.id,
      'data-kind': node.kind,
      role: 'button',
      tabindex: '0',
      'aria-label': `${node.label}: ${node.description}`
    });
    const visual = makeSvg('g', { class: 'node-visual' });
    const displayRadius = node.radius * (mobileView ? 1.45 : .9);
    node.renderRadius = displayRadius;
    const circle = makeSvg('circle', { class: 'node-ring', r: displayRadius });
    node.circle = circle;
    // Keyboard focus ring, drawn just outside the node so it reads on every fill style.
    node.focusRing = makeSvg('circle', { class: 'node-focus', r: displayRadius + 7 });
    visual.append(node.focusRing, circle);

    const words = node.label.split(' ');
    const text = makeSvg('text', { class: 'node-label' });
    if (words.length > 1) {
      const midpoint = Math.ceil(words.length / 2);
      node.labelLines = [words.slice(0, midpoint), words.slice(midpoint)].filter((line) => line.length).map((line) => line.join(' '));
      node.labelLines.forEach((line, lineIndex) => {
        const tspan = makeSvg('tspan', { x: '0', dy: lineIndex === 0 ? '-.2em' : '1.1em' });
        tspan.textContent = line;
        text.append(tspan);
      });
    } else {
      node.labelLines = [node.label];
      text.setAttribute('dy', '.35em');
      text.textContent = node.label;
    }
    node.text = text;
    visual.append(text);
    group.append(visual);
    nodeLayer.append(group);
    node.element = group;
    sizeLabel(node);
  });
  // Web fonts arrive after first paint; refit the lettering once they are in.
  document.fonts?.ready.then(() => nodes.forEach(sizeLabel));

  links.forEach((link) => {
    const line = makeSvg('line', { class: 'graph-edge' });
    edgeLayer.append(line);
    link.element = line;
  });

  const render = () => {
    nodes.forEach((node) => {
      node.element.setAttribute('transform', `translate(${node.x.toFixed(2)} ${node.y.toFixed(2)})`);
    });
    links.forEach((link) => {
      const source = nodeMap.get(link.source);
      const target = nodeMap.get(link.target);
      // Edges run behind the opaque nodes, so their visible ends always meet
      // the rendered circle boundary—even while a node scales or the layout moves.
      link.element.setAttribute('x1', source.x);
      link.element.setAttribute('y1', source.y);
      link.element.setAttribute('x2', target.x);
      link.element.setAttribute('y2', target.y);
    });
  };

  const refreshLinkLengths = () => {
    links.forEach((link) => {
      const source = nodeMap.get(link.source);
      const target = nodeMap.get(link.target);
      link.restLength = Math.hypot(target.tx - source.tx, target.ty - source.ty);
    });
  };

  const EDGE_GAP = 14;
  const clampX = (node, x) => Math.max(node.renderRadius + EDGE_GAP, Math.min(width - node.renderRadius - EDGE_GAP, x));
  const clampY = (node, y) => Math.max(node.renderRadius + EDGE_GAP, Math.min(height - node.renderRadius - EDGE_GAP, y));

  const MAX_SPEED = 9;
  // Nodes still growing out of their parent follow their own tween; letting the physics
  // see them would put two nodes on the same point and fling the parent across the canvas.
  const isSettled = (node) => node.spawned && !node.growthFrame;

  const simulate = () => {
    const activeNodes = nodes.filter(isSettled);
    activeNodes.forEach((node) => {
      node.vx *= .88;
      node.vy *= .88;
      node.vx += (node.tx - node.x) * .002;
      node.vy += (node.ty - node.y) * .002;
    });

    for (let i = 0; i < activeNodes.length; i += 1) {
      for (let j = i + 1; j < activeNodes.length; j += 1) {
        const left = activeNodes[i];
        const right = activeNodes[j];
        let dx = right.x - left.x;
        let dy = right.y - left.y;
        let distance = Math.hypot(dx, dy);
        if (distance < .01) {
          dx = (j - i) % 2 ? 1 : -1;
          dy = 1;
          distance = Math.SQRT2;
        }
        const minimumDistance = left.renderRadius + right.renderRadius + 10;
        const falloff = Math.max(distance, minimumDistance * .5);
        const force = 700 / (falloff * falloff) + Math.max(0, minimumDistance - distance) * .025;
        const forceX = (dx / distance) * force;
        const forceY = (dy / distance) * force;
        if (left !== dragging) {
          left.vx -= forceX;
          left.vy -= forceY;
        }
        if (right !== dragging) {
          right.vx += forceX;
          right.vy += forceY;
        }
      }
    }

    links.forEach((link) => {
      const source = nodeMap.get(link.source);
      const target = nodeMap.get(link.target);
      if (!isSettled(source) || !isSettled(target)) return;
      const dx = target.x - source.x;
      const dy = target.y - source.y;
      const distance = Math.max(1, Math.hypot(dx, dy));
      const force = (distance - link.restLength) * .004;
      const forceX = (dx / distance) * force;
      const forceY = (dy / distance) * force;
      if (source !== dragging) {
        source.vx += forceX;
        source.vy += forceY;
      }
      if (target !== dragging) {
        target.vx -= forceX;
        target.vy -= forceY;
      }
    });

    let motion = 0;
    activeNodes.forEach((node) => {
      if (node === dragging) {
        node.vx = 0;
        node.vy = 0;
        return;
      }
      const speed = Math.hypot(node.vx, node.vy);
      if (speed > MAX_SPEED) {
        node.vx *= MAX_SPEED / speed;
        node.vy *= MAX_SPEED / speed;
      }
      node.x = clampX(node, node.x + node.vx);
      node.y = clampY(node, node.y + node.vy);
      motion += Math.abs(node.vx) + Math.abs(node.vy);
    });
    render();

    simulationEnergy *= .985;
    if (dragging || simulationEnergy > .02 || motion > .08) simulationFrame = requestAnimationFrame(simulate);
    else simulationFrame = null;
  };

  const wakeSimulation = (energy = 1) => {
    if (reducedMotion) return;
    simulationEnergy = Math.max(simulationEnergy, energy);
    if (!simulationFrame) simulationFrame = requestAnimationFrame(simulate);
  };

  refreshLinkLengths();

  const relatedIds = (id) => new Set([
    id,
    ...links.filter((link) => link.source === id).map((link) => link.target),
    ...links.filter((link) => link.target === id).map((link) => link.source)
  ]);

  const normalizeSearch = (value) => value.toLowerCase().replace(/[^a-z0-9+#]+/g, ' ').trim();

  const editDistance = (left, right) => {
    const previous = Array.from({ length: right.length + 1 }, (_, index) => index);
    for (let i = 1; i <= left.length; i += 1) {
      let diagonal = previous[0];
      previous[0] = i;
      for (let j = 1; j <= right.length; j += 1) {
        const above = previous[j];
        previous[j] = left[i - 1] === right[j - 1]
          ? diagonal
          : 1 + Math.min(diagonal, previous[j - 1], above);
        diagonal = above;
      }
    }
    return previous[right.length];
  };

  const searchScore = (item, query) => {
    const label = normalizeSearch(item.label);
    const text = normalizeSearch(`${item.label} ${item.description} ${item.type}`);
    if (label === query) return 0;
    if (label.startsWith(query)) return .02 + (label.length - query.length) / 1000;
    if (label.includes(query)) return .08 + label.indexOf(query) / 100;
    if (text.includes(query)) return .18 + text.indexOf(query) / 1000;

    const queryWords = query.split(' ');
    const textWords = text.split(' ');
    const tokenScore = queryWords.reduce((total, queryWord) => {
      const closest = Math.min(...textWords.map((word) => editDistance(queryWord, word) / Math.max(queryWord.length, word.length, 1)));
      return total + closest;
    }, 0) / queryWords.length;
    const labelScore = editDistance(query, label) / Math.max(query.length, label.length, 1);
    // Break ties in favour of the item whose own name is closest to the query.
    return .25 + Math.min(tokenScore, labelScore) + labelScore / 100;
  };

  const applyVisibility = () => {
    const publicationContext = new Set(['ganesh', 'iiith', 'molecular-ai', 'multimodal', 'smen', 'molgpt', 'bias-study']);
    const matching = new Set(nodes.filter((node) => {
      const filterMatch = activeFilter === 'all'
        || node.group === activeFilter
        || node.id === 'ganesh'
        || (activeFilter === 'publication' && publicationContext.has(node.id));
      const searchMatch = !searchTerm || searchMatches.has(node.id);
      return filterMatch && searchMatch;
    }).map((node) => node.id));

    const selectedRelated = selectedId ? relatedIds(selectedId) : null;
    nodes.forEach((node) => {
      const mutedByFilter = !matching.has(node.id);
      const mutedBySelection = selectedRelated && !selectedRelated.has(node.id);
      node.element.classList.toggle('is-muted', Boolean(mutedByFilter || mutedBySelection));
      node.element.classList.toggle('is-match', Boolean(searchTerm && matching.has(node.id)));
      node.element.classList.toggle('is-selected', node.id === selectedId);
      node.element.setAttribute('tabindex', mutedByFilter ? '-1' : '0');
      node.element.setAttribute('aria-hidden', String(mutedByFilter));
    });
    if (resultCount) {
      const label = matching.size === 1 ? 'node' : 'nodes';
      resultCount.textContent = `${matching.size} ${label} shown · 28 relationships`;
    }
    links.forEach((link) => {
      const filterMuted = !matching.has(link.source) || !matching.has(link.target);
      const related = selectedId && (link.source === selectedId || link.target === selectedId);
      link.element.classList.toggle('is-muted', Boolean(filterMuted || (selectedId && !related)));
      link.element.classList.toggle('is-related', Boolean(related && !filterMuted));
      // Selected edges animate outward from the selection, so reverse the ones that point into it.
      link.element.classList.toggle('flows-in', Boolean(selectedId && link.target === selectedId));
    });

    const previewRelated = previewId && !selectedId && !searchTerm ? relatedIds(previewId) : null;
    graph.classList.toggle('is-previewing', Boolean(previewRelated));
    nodes.forEach((node) => node.element.classList.toggle('is-near', Boolean(previewRelated?.has(node.id))));
    links.forEach((link) => link.element.classList.toggle('is-near', Boolean(previewRelated && (link.source === previewId || link.target === previewId))));

  };

  // The detail panel sits over the canvas (right-hand card on desktop, bottom sheet on phones).
  // If it would cover the node being inspected, slide the view so the node stays in sight.
  const keepClearOfPanel = (node, view = currentView) => {
    const stageRect = graphStage.getBoundingClientRect();
    const scale = Math.min(stageRect.width / view.width, stageRect.height / view.height);
    const offsetX = (stageRect.width - view.width * scale) / 2;
    const offsetY = (stageRect.height - view.height * scale) / 2;
    const x = offsetX + (node.x - view.x) * scale;
    const y = offsetY + (node.y - view.y) * scale;
    const reach = node.renderRadius * scale + 20;
    const box = { left: panel.offsetLeft, top: panel.offsetTop, right: panel.offsetLeft + panel.offsetWidth, bottom: panel.offsetTop + panel.offsetHeight };
    const covered = x + reach > box.left && x - reach < box.right && y + reach > box.top && y - reach < box.bottom;
    if (!covered) {
      if (view !== currentView) glideView(view);
      return;
    }
    const dockedRight = box.left > stageRect.width * .35;
    glideView({
      ...view,
      x: view.x + (dockedRight ? (x - box.left / 2) / scale : 0),
      y: view.y + (dockedRight ? 0 : (y - box.top / 2) / scale)
    });
  };

  const zoomToNode = (node) => {
    const width = Math.max(300, currentView.width * .55);
    const height = width * (defaultView.height / defaultView.width);
    inspectNode(node, false, { x: node.x - width / 2, y: node.y - height / 2, width, height });
  };

  const inspectNode = (node, moveFocus = false, view = currentView) => {
    selectedId = node.id;
    lastFocusedNode = node;
    panelType.textContent = node.kind === 'paper' ? 'Publication' : node.kind === 'place' ? 'Institution' : node.kind === 'domain' ? 'Domain' : node.kind === 'root' ? 'Profile' : 'Project';
    panelTitle.textContent = node.label;
    panelDescription.textContent = node.description;
    panelMeta.replaceChildren(...Object.entries(node.meta).map(([term, value]) => {
      const row = document.createElement('div');
      const dt = document.createElement('dt');
      const dd = document.createElement('dd');
      dt.textContent = term;
      dd.textContent = value;
      row.append(dt, dd);
      return row;
    }));
    if (node.link) {
      panelLink.hidden = false;
      panelLink.href = node.link;
      const external = node.link.startsWith('http');
      panelLink.textContent = external ? 'Open source' : 'Explore page →';
      if (external) {
        panelLink.target = '_blank';
        panelLink.rel = 'noreferrer';
      } else {
        panelLink.removeAttribute('target');
        panelLink.removeAttribute('rel');
      }
    } else {
      panelLink.hidden = true;
    }
    panel.classList.add('is-open');
    applyVisibility();
    keepClearOfPanel(node, view);
    if (moveFocus) panel.focus();
  };

  const closePanel = (returnFocus = true) => {
    selectedId = null;
    panel.classList.remove('is-open');
    applyVisibility();
    if (returnFocus && lastFocusedNode?.element.getAttribute('tabindex') === '0') lastFocusedNode.element.focus();
  };

  const clientToGraph = (event) => {
    const point = graph.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    return point.matrixTransform(graph.getScreenCTM().inverse());
  };

  nodes.forEach((node) => {
    node.element.addEventListener('click', () => {
      if (!dragging && !node.moved) inspectNode(node);
    });
    node.element.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        inspectNode(node, true);
        return;
      }
      // Arrow keys move focus to the nearest reachable node in that direction.
      const direction = { ArrowRight: [1, 0], ArrowLeft: [-1, 0], ArrowDown: [0, 1], ArrowUp: [0, -1] }[event.key];
      if (!direction) return;
      event.preventDefault();
      const [dx, dy] = direction;
      let best = null;
      let bestScore = Infinity;
      nodes.forEach((other) => {
        if (other === node || other.element.getAttribute('tabindex') !== '0') return;
        const along = (other.x - node.x) * dx + (other.y - node.y) * dy;
        if (along <= 0) return;
        const across = Math.abs((other.x - node.x) * dy - (other.y - node.y) * dx);
        const score = along + across * 2;
        if (score < bestScore) { bestScore = score; best = other; }
      });
      best?.element.focus();
    });
    const preview = (on) => {
      if (dragging) return;
      if (on) previewId = node.id;
      else if (previewId === node.id) previewId = null;
      applyVisibility();
    };
    node.element.addEventListener('pointerenter', (event) => { if (event.pointerType === 'mouse') preview(true); });
    node.element.addEventListener('pointerleave', () => preview(false));
    node.element.addEventListener('focus', () => preview(true));
    node.element.addEventListener('blur', () => preview(false));
    node.element.addEventListener('dblclick', (event) => {
      event.preventDefault();
      zoomToNode(node);
    });
    node.element.addEventListener('pointerdown', (event) => {
      if (node.growthFrame) {
        cancelAnimationFrame(node.growthFrame);
        node.growthFrame = null;
        node.progress = 1;
      }
      const point = clientToGraph(event);
      dragging = node;
      dragging.moved = false;
      pointerOffset = { x: node.x - point.x, y: node.y - point.y };
      node.element.setPointerCapture(event.pointerId);
      graph.classList.add('is-dragging');
    });
    node.element.addEventListener('pointermove', (event) => {
      if (dragging !== node) return;
      const point = clientToGraph(event);
      if (Math.hypot(point.x + pointerOffset.x - node.x, point.y + pointerOffset.y - node.y) > 2) node.moved = true;
      node.x = clampX(node, point.x + pointerOffset.x);
      node.y = clampY(node, point.y + pointerOffset.y);
      wakeSimulation(1);
      render();
    });
    node.element.addEventListener('pointerup', (event) => {
      dragging = null;
      graph.classList.remove('is-dragging');
      if (node.moved) wakeSimulation(1);
      // Touch has no dblclick we can rely on, so detect a double tap on the same node.
      if (!node.moved && event.pointerType !== 'mouse') {
        const now = performance.now();
        if (lastTap.node === node && now - lastTap.time < 320) zoomToNode(node);
        lastTap = { node, time: now };
      }
      setTimeout(() => { node.moved = false; }, 0);
    });
    node.element.addEventListener('pointercancel', () => {
      dragging = null;
      node.moved = false;
      graph.classList.remove('is-dragging');
    });
  });

  const touches = new Map();
  let pinch = null;
  graph.addEventListener('pointerdown', (event) => {
    if (event.target.closest('.graph-node')) return;
    stopGlide();
    touches.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (touches.size === 2) {
      const [a, b] = [...touches.values()];
      panning = null;
      pinch = { distance: Math.hypot(a.x - b.x, a.y - b.y) || 1, view: { ...currentView }, centre: clientToGraph({ clientX: (a.x + b.x) / 2, clientY: (a.y + b.y) / 2 }) };
      graph.setPointerCapture(event.pointerId);
      return;
    }
    panning = { pointerId: event.pointerId, clientX: event.clientX, clientY: event.clientY, view: { ...currentView } };
    graph.setPointerCapture(event.pointerId);
    graph.classList.add('is-dragging');
  });
  graph.addEventListener('pointermove', (event) => {
    if (touches.has(event.pointerId)) touches.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pinch && touches.size === 2) {
      const [a, b] = [...touches.values()];
      const width = pinch.view.width * (pinch.distance / (Math.hypot(a.x - b.x, a.y - b.y) || 1));
      const height = width * (defaultView.height / defaultView.width);
      const xRatio = (pinch.centre.x - pinch.view.x) / pinch.view.width;
      const yRatio = (pinch.centre.y - pinch.view.y) / pinch.view.height;
      setView({ x: pinch.centre.x - xRatio * width, y: pinch.centre.y - yRatio * height, width, height });
      return;
    }
    if (!panning || panning.pointerId !== event.pointerId) return;
    const rect = graph.getBoundingClientRect();
    setView({
      ...panning.view,
      x: panning.view.x - (event.clientX - panning.clientX) * (panning.view.width / rect.width),
      y: panning.view.y - (event.clientY - panning.clientY) * (panning.view.height / rect.height)
    });
  });
  const stopPanning = (event) => {
    touches.delete(event.pointerId);
    if (touches.size < 2) pinch = null;
    panning = null;
    graph.classList.remove('is-dragging');
  };
  graph.addEventListener('pointerup', stopPanning);
  graph.addEventListener('pointercancel', stopPanning);

  const zoomAt = (factor, point = { x: currentView.x + currentView.width / 2, y: currentView.y + currentView.height / 2 }) => {
    stopGlide();
    const newWidth = currentView.width * factor;
    const xRatio = (point.x - currentView.x) / currentView.width;
    const yRatio = (point.y - currentView.y) / currentView.height;
    const newHeight = newWidth * (defaultView.height / defaultView.width);
    setView({ x: point.x - xRatio * newWidth, y: point.y - yRatio * newHeight, width: newWidth, height: newHeight });
  };
  graph.addEventListener('wheel', (event) => {
    event.preventDefault();
    zoomAt(event.deltaY > 0 ? 1.12 : .89, clientToGraph(event));
  }, { passive: false });
  document.querySelectorAll('[data-graph-zoom]').forEach((button) => {
    button.addEventListener('click', () => {
      if (button.dataset.graphZoom === 'reset') {
        stopGlide();
        setView({ ...defaultView });
      }
      else zoomAt(button.dataset.graphZoom === 'in' ? .8 : 1.25);
    });
  });

  document.querySelector('[data-panel-close]')?.addEventListener('click', () => closePanel());
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && panel.classList.contains('is-open') && !event.target.closest?.('.atlas-search-wrap')) closePanel();
  });

  document.querySelectorAll('[data-filter]').forEach((button) => {
    button.addEventListener('click', () => {
      activeFilter = button.dataset.filter;
      document.querySelectorAll('[data-filter]').forEach((item) => {
        const active = item === button;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-pressed', String(active));
      });
      closePanel(false);
      applyVisibility();
    });
  });

  const hideSearchResults = () => {
    searchResults.hidden = true;
    searchInput.setAttribute('aria-expanded', 'false');
  };

  const selectSearchItem = (item) => {
    hideSearchResults();
    if (item.nodeId) {
      const node = nodeMap.get(item.nodeId);
      const focusWidth = mobileView ? 400 : 650;
      inspectNode(node, false, { x: node.x - focusWidth / 2, y: node.y - (focusWidth * defaultView.height / defaultView.width) / 2, width: focusWidth, height: focusWidth * defaultView.height / defaultView.width });
    } else if (item.url) {
      window.open(item.url, '_blank', 'noopener,noreferrer');
    }
  };

  const showNoResults = (query) => {
    const message = document.createElement('p');
    message.className = 'search-empty';
    message.textContent = `No matches for “${query}”.`;
    searchResults.replaceChildren(message);
    searchResults.hidden = false;
    searchInput.setAttribute('aria-expanded', 'true');
  };

  const renderSearchResults = () => {
    searchResults.replaceChildren();
    rankedResults.forEach((item, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'search-result';
      button.setAttribute('role', 'option');
      button.dataset.searchIndex = String(index);

      const title = document.createElement('strong');
      title.textContent = item.label;
      const type = document.createElement('span');
      type.textContent = item.type;
      const description = document.createElement('small');
      description.textContent = item.description;
      button.append(title, type, description);
      button.addEventListener('click', () => selectSearchItem(item));
      searchResults.append(button);
    });
    searchResults.hidden = false;
    searchInput.setAttribute('aria-expanded', 'true');
  };

  searchInput?.addEventListener('input', (event) => {
    searchTerm = normalizeSearch(event.target.value);
    selectedId = null;
    panel.classList.remove('is-open');
    if (!searchTerm) {
      rankedResults = [];
      searchMatches = new Set();
      hideSearchResults();
      applyVisibility();
      return;
    }

    const scored = portfolioItems
      .map((item) => ({ ...item, score: searchScore(item, searchTerm) }))
      .sort((left, right) => left.score - right.score || left.label.localeCompare(right.label));
    // Fuzzy (typo-tolerant) guesses only fill the list when nothing actually contains the query;
    // otherwise they would light up unrelated nodes next to a real hit.
    const direct = scored.filter((item) => item.score < .25);
    const near = scored.filter((item) => item.score < .7);
    rankedResults = (direct.length ? direct : near).slice(0, 5);
    searchMatches = new Set(rankedResults.map((item) => item.nodeId).filter(Boolean));
    // Nothing close: every node dims and the list says so rather than showing random items.
    if (rankedResults.length) renderSearchResults();
    else showNoResults(event.target.value.trim());
    applyVisibility();
  });

  const searchToggle = document.querySelector('[data-search-toggle]');
  const toolbar = searchToggle?.closest('.atlas-toolbar');
  const setSearchOpen = (open) => {
    toolbar.classList.toggle('is-searching', open);
    searchToggle.setAttribute('aria-expanded', String(open));
    if (open) searchInput.focus();
  };
  searchToggle?.addEventListener('click', () => setSearchOpen(!toolbar.classList.contains('is-searching')));
  searchInput?.addEventListener('blur', () => {
    if (toolbar && !searchInput.value) setTimeout(() => {
      if (!toolbar.contains(document.activeElement)) setSearchOpen(false);
    }, 150);
  });

  searchInput?.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown' && rankedResults.length) {
      event.preventDefault();
      searchResults.querySelector('.search-result')?.focus();
    } else if (event.key === 'Enter' && rankedResults.length) {
      event.preventDefault();
      selectSearchItem(rankedResults[0]);
    } else if (event.key === 'Escape') {
      hideSearchResults();
    }
  });

  searchResults?.addEventListener('keydown', (event) => {
    const options = [...searchResults.querySelectorAll('.search-result')];
    const index = options.indexOf(document.activeElement);
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      options[Math.min(index + 1, options.length - 1)]?.focus();
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (index <= 0) searchInput.focus();
      else options[index - 1].focus();
    } else if (event.key === 'Escape') {
      hideSearchResults();
      searchInput.focus();
    }
  });

  document.addEventListener('pointerdown', (event) => {
    if (!event.target.closest('.atlas-search-wrap')) hideSearchResults();
  });

  const spawn = () => {
    const order = ['ganesh', 'iiith', 'samsung', 'virtual-labs', 'molecular-ai', 'multimodal', 'biosensing', 'robotics', 'neuro-ai', 'software', 'smen', 'molgpt', 'bias-study', 'beds', 'jepa', 'manga', 'molvis', 'paper-spectra', 'paper-generative', 'paper-bias'];
    const parents = {
      iiith: 'ganesh', samsung: 'ganesh', 'virtual-labs': 'ganesh',
      'molecular-ai': 'ganesh', multimodal: 'ganesh', 'neuro-ai': 'ganesh', software: 'ganesh',
      biosensing: 'samsung', robotics: 'samsung', smen: 'molecular-ai', molgpt: 'molecular-ai',
      'bias-study': 'molecular-ai', beds: 'neuro-ai', jepa: 'robotics', manga: 'software', molvis: 'software',
      'paper-spectra': 'smen', 'paper-generative': 'molgpt', 'paper-bias': 'bias-study'
    };

    const revealConnectedEdges = () => {
      links.forEach((link) => {
        if (nodeMap.get(link.source).spawned && nodeMap.get(link.target).spawned) {
          link.element.classList.add('is-visible');
        }
      });
    };

    const growNode = (node, parent) => {
      const targetX = node.tx;
      const targetY = node.ty;
      const startX = parent ? parent.x : targetX;
      const startY = parent ? parent.y : targetY;
      node.x = reducedMotion ? targetX : startX;
      node.y = reducedMotion ? targetY : startY;
      node.progress = reducedMotion ? 1 : 0;
      node.spawned = true;
      node.element.classList.add('is-visible');
      revealConnectedEdges();
      render();
      if (reducedMotion) return;

      const startTime = performance.now();
      const duration = 700;
      const animate = (now) => {
        const elapsed = Math.min(1, (now - startTime) / duration);
        const eased = 1 - Math.pow(1 - elapsed, 3);
        node.x = startX + (targetX - startX) * eased;
        node.y = startY + (targetY - startY) * eased;
        node.progress = eased;
        render();
        if (elapsed < 1) node.growthFrame = requestAnimationFrame(animate);
        else node.growthFrame = null;
      };
      node.growthFrame = requestAnimationFrame(animate);
    };

    order.forEach((id, index) => {
      window.setTimeout(() => {
        const node = nodeMap.get(id);
        const parent = parents[id] ? nodeMap.get(parents[id]) : null;
        growNode(node, parent);
      }, reducedMotion ? 0 : index * 70);
    });

    window.setTimeout(() => {
      refreshLinkLengths();
      wakeSimulation(.75);
    }, reducedMotion ? 0 : (order.length - 1) * 70 + 700);
  };

  render();
  const atlasObserver = new IntersectionObserver((entries, observer) => {
    if (entries.some((entry) => entry.isIntersecting)) {
      spawn();
      observer.disconnect();
    }
  }, { threshold: .18 });
  atlasObserver.observe(graph);

  const graphResizeObserver = new ResizeObserver(() => {
    const nextLayout = measureGraph();
    if (Math.abs(nextLayout.width - width) < 1 && Math.abs(nextLayout.height - height) < 1 && nextLayout.mobile === mobileView) {
      return;
    }

    width = nextLayout.width;
    height = nextLayout.height;
    mobileView = nextLayout.mobile;
    nodes.forEach((node) => {
      if (node.growthFrame) cancelAnimationFrame(node.growthFrame);
      node.growthFrame = null;
      placeNode(node);
      node.x = node.tx;
      node.y = node.ty;
      node.vx = 0;
      node.vy = 0;
      node.progress = node.spawned ? 1 : 0;
      node.renderRadius = node.radius * (mobileView ? 1.45 : .9);
      node.circle.setAttribute('r', node.renderRadius);
      node.focusRing.setAttribute('r', node.renderRadius + 7);
      sizeLabel(node);
    });
    refreshLinkLengths();
    defaultView = { x: 0, y: 0, width, height };
    stopGlide();
    setView(defaultView);
    render();
    if (selectedId) keepClearOfPanel(nodeMap.get(selectedId));
    wakeSimulation(.5);
  });
  graphResizeObserver.observe(graphStage);

}

const scrollProgress = document.querySelector('[data-scroll-progress]');
if (scrollProgress) {
  const updateProgress = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
    scrollProgress.style.transform = `scaleX(${Math.min(1, Math.max(0, progress))})`;
  };
  updateProgress();
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);
}

// Timeline year dial: follows the entry crossing 40% of the viewport, like a calendar turning over.
const dial = document.querySelector('[data-year-dial]');
if (dial) {
  const track = document.querySelector('.repo-timeline');
  const entries = [...track.querySelectorAll('.repo-entry')];
  const yearEl = dial.querySelector('[data-dial-year]');
  const captionEl = dial.querySelector('[data-dial-caption]');
  const countEl = dial.querySelector('[data-dial-count]');
  const monthCells = [...dial.querySelectorAll('[data-dial-months] li')];
  const yearLinks = [...dial.querySelectorAll('.dial-years a')];
  const monthOf = (entry) => new Date(entry.querySelector('time').dateTime).getUTCMonth();
  // A year's first entry turns over when its section header reaches the reading line, so the dial
  // never keeps showing last year while the new year's heading is already on screen.
  const triggers = entries.map((entry) => (entry === entry.parentElement.firstElementChild
    ? entry.closest('[data-timeline-year]').querySelector('header')
    : entry));
  let current = null;

  const showEntry = (entry) => {
    if (entry === current) return;
    const section = entry.closest('[data-timeline-year]');
    const previousSection = current?.closest('[data-timeline-year]');
    current?.classList.remove('is-current');
    entry.classList.add('is-current');
    current = entry;

    if (section !== previousSection) {
      const header = section.querySelector('header');
      const nextYear = header.querySelector('p').textContent;
      const lastYear = yearEl.textContent;
      const rollClass = Number(nextYear) < Number(lastYear) ? 'is-rolling-back' : 'is-rolling';
      yearEl.replaceChildren(...[...nextYear].map((digit, index) => {
        const span = document.createElement('span');
        span.textContent = digit;
        span.style.setProperty('--i', index);
        if (previousSection && digit !== lastYear[index]) span.className = rollClass;
        return span;
      }));
      captionEl.textContent = header.querySelector('h2').textContent;
      countEl.textContent = header.querySelector('span').textContent;
      const months = new Set([...section.querySelectorAll('.repo-entry')].map(monthOf));
      monthCells.forEach((cell, index) => cell.classList.toggle('has-repo', months.has(index)));
      yearLinks.forEach((link) => {
        if (link.hash === `#${section.id}`) link.setAttribute('aria-current', 'true');
        else link.removeAttribute('aria-current');
      });
    }
    const month = monthOf(entry);
    monthCells.forEach((cell, index) => cell.classList.toggle('is-current', index === month));
    const dotCentre = parseFloat(getComputedStyle(entry, '::before').top) + 5;
    const dotY = entry.getBoundingClientRect().top - track.getBoundingClientRect().top + dotCentre;
    track.style.setProperty('--rail-fill', `${Math.max(0, dotY)}px`);
  };

  let pending = false;
  const updateDial = () => {
    pending = false;
    const line = window.innerHeight * .4;
    let active = entries[0];
    for (const [index, entry] of entries.entries()) {
      if (triggers[index].getBoundingClientRect().top <= line) active = entry;
      else break;
    }
    showEntry(active);
  };
  const requestUpdate = () => {
    if (!pending) { pending = true; requestAnimationFrame(updateDial); }
  };
  const reducedMotionPage = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Clicking a marked month jumps to that month's first repository in the year on show.
  monthCells.forEach((cell, month) => cell.addEventListener('click', () => {
    const section = current?.closest('[data-timeline-year]');
    const target = section && [...section.querySelectorAll('.repo-entry')].find((entry) => monthOf(entry) === month);
    if (!target) return;
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - window.innerHeight * .34, behavior: reducedMotionPage ? 'auto' : 'smooth' });
  }));
  updateDial();
  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate);
}

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// The header slides away while reading down a page and returns as soon as the reader scrolls back up.
if (header && !document.body.classList.contains('graph-page')) {
  const root = document.documentElement;
  let lastY = window.scrollY;
  let ticking = false;
  const updateHeaderVisibility = () => {
    ticking = false;
    const y = window.scrollY;
    const menuOpen = menuToggle?.getAttribute('aria-expanded') === 'true';
    if (menuOpen || y < 160 || y < lastY - 4 || header.contains(document.activeElement)) root.classList.remove('header-hidden');
    else if (y > lastY + 4) root.classList.add('header-hidden');
    if (Math.abs(y - lastY) > 4) lastY = y;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(updateHeaderVisibility); }
  }, { passive: true });
  header.addEventListener('focusin', () => root.classList.remove('header-hidden'));
}

// Content below the first screen fades up as it arrives; anything already visible is left alone.
if (!prefersReducedMotion && 'IntersectionObserver' in window) {
  const revealTargets = [...document.querySelectorAll('.resume-facts article, .resume-section > header, .resume-rows article, .publication-rows li, .skills-grid p, .pdf-section, .timeline-year-section > header, .repo-entry, .timeline-note, .email-row, .contact-links a')]
    .filter((element) => element.getBoundingClientRect().top > window.innerHeight * .92);
  const revealer = new IntersectionObserver((entries) => {
    entries.filter((entry) => entry.isIntersecting).forEach((entry, index) => {
      entry.target.style.setProperty('--reveal-delay', `${Math.min(index, 5) * 70}ms`);
      entry.target.classList.add('is-revealed');
      revealer.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -8% 0px' });
  revealTargets.forEach((element) => {
    element.classList.add('reveal');
    revealer.observe(element);
  });
}

// Headline figures count up once on load, keeping their zero padding.
if (!prefersReducedMotion) {
  document.querySelectorAll('.timeline-intro dd').forEach((figure) => {
    const text = figure.textContent.trim();
    const target = Number(text);
    if (!Number.isFinite(target)) return;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / 900);
      figure.textContent = String(Math.round(target * (1 - Math.pow(1 - t, 3)))).padStart(text.length, '0');
      if (t < 1) requestAnimationFrame(tick);
    };
    figure.textContent = '0'.padStart(text.length, '0');
    requestAnimationFrame(tick);
  });
}

// Copy the email address; if the clipboard is unavailable, select it so it can be copied by hand.
document.querySelectorAll('[data-copy-email]').forEach((button) => {
  const label = button.textContent;
  button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(button.dataset.copyEmail);
      button.textContent = 'Copied';
    } catch {
      const range = document.createRange();
      range.selectNodeContents(document.querySelector('.email-link strong'));
      window.getSelection().removeAllRanges();
      window.getSelection().addRange(range);
      button.textContent = 'Selected';
    }
    button.classList.add('is-done');
    clearTimeout(button.resetTimer);
    button.resetTimer = setTimeout(() => {
      button.textContent = label;
      button.classList.remove('is-done');
    }, 1800);
  });
});
