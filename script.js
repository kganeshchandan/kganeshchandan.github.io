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
window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMenu(true);
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
      description: 'Software engineer and AI researcher connecting scientific questions, human signals, and intelligent machines.',
      meta: { Focus: 'Robotics & AI', Base: 'Bangalore, India' }, link: 'resume.html'
    },
    {
      id: 'iiith', label: 'IIIT-H', kind: 'place', group: 'research', tx: 390, ty: 105, radius: 32,
      description: 'Integrated B.Tech and M.S. by Research, followed by three years of computational-science research.',
      meta: { Period: '2019–2024', Recognition: 'Academic Research Award' }, link: 'timeline.html#year-2021'
    },
    {
      id: 'samsung', label: 'Samsung', kind: 'place', group: 'professional', tx: 690, ty: 310, radius: 34,
      description: 'Senior Software Engineer in the Advanced Research and Standards Team, currently focused on robotics and AI.',
      meta: { Since: 'July 2024', Awards: 'Excellence · Spot' }, link: 'resume.html'
    },
    {
      id: 'virtual-labs', label: 'Virtual Labs', kind: 'place', group: 'build', tx: 380, ty: 545, radius: 31,
      description: 'Interactive Three.js simulations of solid-state chemistry experiments for a Ministry of Education initiative.',
      meta: { Role: 'Software Developer', Period: '2022–2023' }, link: 'timeline.html#year-2022'
    },
    {
      id: 'molecular-ai', label: 'Molecular AI', kind: 'domain', group: 'research', tx: 215, ty: 220, radius: 34,
      description: 'Generative models and learned representations for molecules, properties, and drug discovery.',
      meta: { Methods: 'GNNs · GPT · Diffusion', Domain: 'Scientific AI' }
    },
    {
      id: 'multimodal', label: 'Multimodal', kind: 'domain', group: 'research', tx: 330, ty: 300, radius: 31,
      description: 'Learning shared representations across molecular graphs, spectra, images, language, and neural signals.',
      meta: { Modalities: 'Graphs · Spectra · fMRI', Method: 'Contrastive learning' }
    },
    {
      id: 'biosensing', label: 'Biosensing', kind: 'domain', group: 'professional', tx: 630, ty: 185, radius: 32,
      description: 'AI for wearable PPG and audio signals, including heart health, hydration, glucose, and machine health.',
      meta: { Evidence: '2 patents filed', Platform: 'Wearable edge devices' }
    },
    {
      id: 'robotics', label: 'Robotics', kind: 'domain', group: 'professional', tx: 765, ty: 405, radius: 32,
      description: 'Current exploration of embodied intelligence, robotics, and systems that learn how the world behaves.',
      meta: { Focus: 'Embodied intelligence', Direction: 'World models' }
    },
    {
      id: 'neuro-ai', label: 'Neuro-AI', kind: 'domain', group: 'research', tx: 270, ty: 430, radius: 31,
      description: 'Cross-modal learning between fMRI brain activations, attention, and speech representations.',
      meta: { Signals: '3D fMRI', Models: 'CNNs · Transformers' }
    },
    {
      id: 'software', label: 'Software', kind: 'domain', group: 'build', tx: 515, ty: 505, radius: 31,
      description: 'Interactive scientific tools, local AI applications, systems coursework, games, and web software.',
      meta: { Repositories: '23 original public repos', Range: 'Systems to interfaces' }
    },
    {
      id: 'smen', label: 'SMEN', kind: 'project', group: 'research', tx: 190, ty: 95, radius: 27,
      description: 'A spectra-and-molecule encoder network for ranking and generating molecular structures from infrared spectra.',
      meta: { Evidence: 'Peer-reviewed evaluation', Status: 'Digital Discovery, 2024' }, link: 'https://doi.org/10.1039/D4DD00135D'
    },
    {
      id: 'molgpt', label: 'MolGPT 2.0', kind: 'project', group: 'research', tx: 75, ty: 180, radius: 30,
      description: 'Multi-objective molecular generation using transformer encoder-decoder models and direct preference optimization.',
      meta: { Evaluation: 'Checkpoint-dependent', Role: 'Initial codebase author' }, link: 'https://github.com/devalab/MolGPT2.0'
    },
    {
      id: 'bias-study', label: 'Bias study', kind: 'project', group: 'research', tx: 85, ty: 330, radius: 29,
      description: 'Research exposing latent biases in popular datasets and models for binding-affinity prediction.',
      meta: { Models: 'DeepDTA · GraphDTA · more', Status: 'Peer reviewed' }, link: 'https://doi.org/10.1021/acsomega.2c06781'
    },
    {
      id: 'beds', label: 'BEDS', kind: 'project', group: 'research', tx: 150, ty: 485, radius: 26,
      description: 'Brain Encoding and Decoding of Speech: a private research implementation with a public project summary.',
      meta: { Input: 'fMRI activations', Output: 'Speech representations' }, link: 'https://github.com/kganeshchandan/BEDS'
    },
    {
      id: 'jepa', label: 'JEPA GOAT', kind: 'project', group: 'build', tx: 800, ty: 535, radius: 29,
      description: 'A lightweight environment for collecting actions, frames, and object dynamics for future JEPA experiments.',
      meta: { Area: 'World models', Stack: 'Python · Pygame' }, link: 'https://github.com/kganeshchandan/jepa-goat'
    },
    {
      id: 'manga', label: 'Manga AI', kind: 'project', group: 'build', tx: 610, ty: 575, radius: 28,
      description: 'A local-first manga colorizer combining a browser extension, FastAPI service, and local GAN inference.',
      meta: { Privacy: 'Local-first', Stack: 'JavaScript · Python' }, link: 'https://github.com/kganeshchandan/manga-colorizer'
    },
    {
      id: 'molvis', label: 'MolVis', kind: 'project', group: 'build', tx: 455, ty: 590, radius: 27,
      description: 'An immersive Apple Vision Pro application for exploring and manipulating molecular structures.',
      meta: { Platform: 'visionOS', Stack: 'RealityKit · SwiftUI' }, link: 'https://github.com/kganeshchandan/MolVis'
    },
    {
      id: 'paper-spectra', label: 'Digital Discovery', kind: 'paper', group: 'publication', tx: 250, ty: 35, radius: 25,
      description: 'Spectra to structure: contrastive learning framework for library ranking and molecular generation.',
      meta: { Published: '2024', Journal: 'Digital Discovery' }, link: 'https://doi.org/10.1039/D4DD00135D'
    },
    {
      id: 'paper-generative', label: 'GenAI review', kind: 'paper', group: 'publication', tx: 65, ty: 70, radius: 25,
      description: 'A peer-reviewed review of generative artificial intelligence for small-molecule drug design.',
      meta: { Published: '2024', Journal: 'Current Opinion in Biotechnology' }, link: 'https://doi.org/10.1016/j.copbio.2024.103175'
    },
    {
      id: 'paper-bias', label: 'ACS Omega', kind: 'paper', group: 'publication', tx: 45, ty: 420, radius: 25,
      description: 'Peer-reviewed study of latent biases in binding-affinity models using popular datasets.',
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
      return { width: BASE_WIDTH, height: Math.max(340, Math.min(BASE_HEIGHT, BASE_WIDTH / aspect)), mobile: rect.width <= 720 };
    }
    const mobile = rect.width <= 720;
    return { width: Math.max(mobile ? 750 : 500, BASE_HEIGHT * aspect), height: BASE_HEIGHT, mobile };
  };

  const initialLayout = measureGraph();
  width = initialLayout.width;
  height = initialLayout.height;
  let mobileView = initialLayout.mobile;
  nodes.forEach((node) => {
    node.baseTx = node.tx;
    node.baseTy = node.ty;
    const padding = mobileView ? 58 : 42;
    node.tx = padding + (node.baseTx / BASE_WIDTH) * (width - padding * 2);
    node.ty = padding + (node.baseTy / BASE_HEIGHT) * (height - padding * 2);
  });

  let defaultView = { x: 0, y: 0, width, height };
  let currentView = { ...defaultView };
  let selectedId = null;
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
    visual.append(circle);

    const words = node.label.split(' ');
    const text = makeSvg('text', { class: `node-label${node.label.length > 12 ? ' is-small' : ''}` });
    if (words.length > 1) {
      const midpoint = Math.ceil(words.length / 2);
      [words.slice(0, midpoint), words.slice(midpoint)].forEach((line, lineIndex) => {
        if (!line.length) return;
        const tspan = makeSvg('tspan', { x: '0', dy: lineIndex === 0 ? '-1' : '12' });
        tspan.textContent = line.join(' ');
        text.append(tspan);
      });
    } else {
      text.setAttribute('dy', '3');
      text.textContent = node.label;
    }
    visual.append(text);
    group.append(visual);
    nodeLayer.append(group);
    node.element = group;
  });

  links.forEach((link) => {
    const line = makeSvg('line', { class: 'graph-edge', pathLength: '1' });
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

  const simulate = () => {
    const activeNodes = nodes.filter((node) => node.spawned);
    activeNodes.forEach((node) => {
      node.vx *= .88;
      node.vy *= .88;
      node.vx += (node.tx - node.x) * .0006;
      node.vy += (node.ty - node.y) * .0006;
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
        const force = 700 / (distance * distance) + Math.max(0, minimumDistance - distance) * .025;
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
      if (!source.spawned || !target.spawned) return;
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
      node.x = Math.max(node.renderRadius, Math.min(width - node.renderRadius, node.x + node.vx));
      node.y = Math.max(node.renderRadius, Math.min(height - node.renderRadius, node.y + node.vy));
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
    return .25 + Math.min(tokenScore, labelScore);
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
    });
  };

  const inspectNode = (node, moveFocus = false) => {
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
      }
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
      wakeSimulation(.8);
    });
    node.element.addEventListener('pointermove', (event) => {
      if (dragging !== node) return;
      const point = clientToGraph(event);
      if (Math.hypot(point.x + pointerOffset.x - node.x, point.y + pointerOffset.y - node.y) > 2) node.moved = true;
      node.x = Math.max(node.renderRadius, Math.min(width - node.renderRadius, point.x + pointerOffset.x));
      node.y = Math.max(node.renderRadius, Math.min(height - node.renderRadius, point.y + pointerOffset.y));
      wakeSimulation(1);
      render();
    });
    node.element.addEventListener('pointerup', () => {
      dragging = null;
      graph.classList.remove('is-dragging');
      wakeSimulation(1);
      setTimeout(() => { node.moved = false; }, 0);
    });
    node.element.addEventListener('pointercancel', () => {
      dragging = null;
      node.moved = false;
      graph.classList.remove('is-dragging');
      wakeSimulation(.8);
    });
  });

  graph.addEventListener('pointerdown', (event) => {
    if (event.target.closest('.graph-node')) return;
    panning = { pointerId: event.pointerId, clientX: event.clientX, clientY: event.clientY, view: { ...currentView } };
    graph.setPointerCapture(event.pointerId);
    graph.classList.add('is-dragging');
  });
  graph.addEventListener('pointermove', (event) => {
    if (!panning || panning.pointerId !== event.pointerId) return;
    const rect = graph.getBoundingClientRect();
    setView({
      ...panning.view,
      x: panning.view.x - (event.clientX - panning.clientX) * (panning.view.width / rect.width),
      y: panning.view.y - (event.clientY - panning.clientY) * (panning.view.height / rect.height)
    });
  });
  const stopPanning = () => {
    panning = null;
    graph.classList.remove('is-dragging');
  };
  graph.addEventListener('pointerup', stopPanning);
  graph.addEventListener('pointercancel', stopPanning);

  const zoomAt = (factor, point = { x: currentView.x + currentView.width / 2, y: currentView.y + currentView.height / 2 }) => {
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
      if (button.dataset.graphZoom === 'reset') setView({ ...defaultView });
      else zoomAt(button.dataset.graphZoom === 'in' ? .8 : 1.25);
    });
  });

  document.querySelector('[data-panel-close]')?.addEventListener('click', () => closePanel());

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
      inspectNode(node);
      const focusWidth = mobileView ? 400 : 650;
      setView({ x: node.x - focusWidth / 2, y: node.y - (focusWidth * defaultView.height / defaultView.width) / 2, width: focusWidth });
    } else if (item.url) {
      window.open(item.url, '_blank', 'noopener,noreferrer');
    }
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

    rankedResults = portfolioItems
      .map((item) => ({ ...item, score: searchScore(item, searchTerm) }))
      .sort((left, right) => left.score - right.score || left.label.localeCompare(right.label))
      .slice(0, 5);
    searchMatches = new Set(rankedResults.map((item) => item.nodeId).filter(Boolean));
    renderSearchResults();
    applyVisibility();
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
      const duration = 900;
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
      }, reducedMotion ? 0 : index * 145);
    });

    window.setTimeout(() => {
      refreshLinkLengths();
      wakeSimulation(.75);
    }, reducedMotion ? 0 : (order.length - 1) * 145 + 900);
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
    if (Math.abs(nextLayout.width - width) < 1 && Math.abs(nextLayout.height - height) < 1 && nextLayout.mobile === mobileView) return;

    width = nextLayout.width;
    height = nextLayout.height;
    mobileView = nextLayout.mobile;
    const padding = mobileView ? 58 : 42;
    nodes.forEach((node) => {
      if (node.growthFrame) cancelAnimationFrame(node.growthFrame);
      node.growthFrame = null;
      node.tx = padding + (node.baseTx / BASE_WIDTH) * (width - padding * 2);
      node.ty = padding + (node.baseTy / BASE_HEIGHT) * (height - padding * 2);
      node.x = node.tx;
      node.y = node.ty;
      node.vx = 0;
      node.vy = 0;
      node.progress = node.spawned ? 1 : 0;
      node.renderRadius = node.radius * (mobileView ? 1.45 : .9);
      node.circle.setAttribute('r', node.renderRadius);
    });
    refreshLinkLengths();
    defaultView = { x: 0, y: 0, width, height };
    setView(defaultView);
    render();
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
