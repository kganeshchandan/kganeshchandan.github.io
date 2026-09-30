// Intelligence Atlas: the interactive map of work on the home page.
// Network and timeline layouts, cluster regions, a guided tour, path tracing, repository
// expansion, deep links and keyboard shortcuts all live here; the rest of the site is in script.js.
(() => {
  const graph = document.querySelector('[data-graph]');
  if (!graph) return;

  const SVG_NS = 'http://www.w3.org/2000/svg';
  const BASE_WIDTH = 900;
  const BASE_HEIGHT = 640;
  const graphStage = graph.closest('[data-atlas-stage]');
  let width = BASE_WIDTH;
  let height = BASE_HEIGHT;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------------------------------------------------------------- data
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

  // Year each node belongs to in the timeline layout: role start dates, publication years and
  // repository creation dates from the evidence dossier.
  const YEARS = {
    ganesh: 2019, iiith: 2019, samsung: 2024, 'virtual-labs': 2022, 'molecular-ai': 2021, multimodal: 2023,
    biosensing: 2024, robotics: 2026, 'neuro-ai': 2022, software: 2021, smen: 2023, molgpt: 2025,
    'bias-study': 2022, beds: 2022, jepa: 2026, manga: 2026, molvis: 2023,
    'paper-spectra': 2024, 'paper-generative': 2024, 'paper-bias': 2023
  };
  nodes.forEach((node) => { node.year = YEARS[node.id]; });

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

  const CLUSTERS = [
    { id: 'research', label: 'Research at IIIT Hyderabad', short: 'IIIT Hyderabad', members: ['iiith', 'molecular-ai', 'multimodal', 'neuro-ai', 'smen', 'molgpt', 'bias-study', 'beds', 'paper-spectra', 'paper-generative', 'paper-bias'] },
    { id: 'samsung', label: 'Samsung Research', short: 'Samsung', members: ['samsung', 'biosensing', 'robotics'] },
    { id: 'builds', label: 'Things I\'ve built', short: 'Builds', members: ['software', 'virtual-labs', 'molvis', 'manga', 'jepa'] }
  ];

  // Repositories that can fan out from a node: [repository name, short label, year created].
  const EXPANSIONS = {
    software: [['JobsHub', 'JobsHub', 2021], ['SpaceOdyssey', 'SpaceOdyssey', 2021], ['SpotifyAddBlocker', 'Spotify ad blocker', 2021], ['BlockBreakerVII', 'BlockBreaker', 2021], ['Operating-Systems-and-Networks', 'OS & networks', 2021], ['MyDotfiles', 'Dotfiles', 2021], ['kganeshchandan.github.io', 'This website', 2022], ['github-stats', 'GitHub stats', 2023], ['SimpleRDBMS', 'SimpleRDBMS', 2023]],
    'molecular-ai': [['sim-CNNDTA', 'sim-CNNDTA', 2021], ['dd_code', 'dd_code', 2022], ['Tute12_data', 'Tute12 data', 2022], ['d4-course-projs', 'D4 course', 2022]],
    multimodal: [['CLIP_FULL', 'CLIP_FULL', 2023], ['Spectra2Structure', 'Spectra2Structure', 2024]],
    iiith: [['Multi-Handwritten-digit-recognition-CNN', 'Digit CNN', 2022], ['visiting-phd-exercises', 'PhD exercises', 2023]],
    'virtual-labs': [['3JS', '3JS', 2022]]
  };

  const TOUR = [
    ['ganesh', 'This map shows my work. The circles are places I\'ve been, research areas, projects and papers.'],
    ['iiith', 'I studied at IIIT Hyderabad, where I did an integrated B.Tech and an M.S. by Research.'],
    ['molecular-ai', 'Most of my research there was machine learning for molecules and drug discovery.'],
    ['smen', 'SMEN takes an infrared spectrum and ranks the molecules that could have produced it.'],
    ['paper-spectra', 'That work was published in Digital Discovery in 2024.'],
    ['neuro-ai', 'I also worked on linking fMRI brain activity with how models represent speech.'],
    ['samsung', 'Since July 2024 I\'ve been a Senior Software Engineer at Samsung Research India.'],
    ['biosensing', 'There I first built AI for wearable health signals, and filed two patents.'],
    ['robotics', 'Now I work on robotics and AI, including models that learn how the world behaves.'],
    ['software', 'Along the way I\'ve built apps, games and tools, from a Vision Pro molecule viewer to a manga colorizer.'],
    [null, 'That\'s the tour. Click any circle to explore, or press ? to see the shortcuts.']
  ];
  const TOUR_STEP_MS = 5200;

  const KIND_NAMES = { root: 'Profile', place: 'Institution', domain: 'Research area', project: 'Project', paper: 'Publication', repo: 'Repository' };

  // Small line icons drawn on each node's rim, in a 12×12 box.
  const ICONS = {
    place: 'M1.5 11h9M2.5 11V5.2L6 2.5l3.5 2.7V11M5 11V8h2v3',
    domain: 'M6 1.5v9M1.5 6h9M2.8 2.8l6.4 6.4M9.2 2.8 2.8 9.2',
    project: 'M4.2 3.2 1.4 6l2.8 2.8M7.8 3.2 10.6 6 7.8 8.8',
    paper: 'M3 1.5h4l2.5 2.5v6.5H3zM7 1.5V4h2.5'
  };

  // ---------------------------------------------------------------- elements
  const edgeLayer = graph.querySelector('[data-edges]');
  const nodeLayer = graph.querySelector('[data-nodes]');
  const hullLayer = graph.querySelector('[data-hulls]');
  const axisLayer = graph.querySelector('[data-axis]');
  const particleLayer = graph.querySelector('[data-particles]');
  const panel = document.querySelector('[data-node-panel]');
  const panelType = panel.querySelector('[data-panel-type]');
  const panelTitle = panel.querySelector('[data-panel-title]');
  const panelDescription = panel.querySelector('[data-panel-description]');
  const panelMeta = panel.querySelector('[data-panel-meta]');
  const panelLink = panel.querySelector('[data-panel-link]');
  const panelExpand = panel.querySelector('[data-panel-expand]');
  const panelShare = panel.querySelector('[data-panel-share]');
  const resultCount = document.querySelector('[data-result-count]');
  const searchInput = document.querySelector('[data-atlas-search]');
  const searchResults = document.querySelector('[data-search-results]');
  const card = document.querySelector('[data-node-card]');
  const tourBar = document.querySelector('[data-tour-bar]');
  const pathBar = document.querySelector('[data-path-bar]');
  const minimap = document.querySelector('[data-minimap]');
  const shortcuts = document.querySelector('[data-shortcuts]');
  const legendButtons = [...document.querySelectorAll('[data-legend]')];
  const layoutButtons = [...document.querySelectorAll('[data-layout]')];
  const tourButton = document.querySelector('[data-tour]');

  const makeSvg = (name, attributes = {}) => {
    const element = document.createElementNS(SVG_NS, name);
    Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
    return element;
  };

  // ---------------------------------------------------------------- canvas size and layouts
  const measureGraph = () => {
    const rect = graphStage.getBoundingClientRect();
    const aspect = Math.max(.35, rect.width / Math.max(rect.height, 1));
    if (aspect >= 1) {
      // Wide-but-short canvases (landscape phones) keep desktop-sized nodes so the layout has room.
      return { width: BASE_WIDTH, height: Math.max(340, Math.min(BASE_HEIGHT, BASE_WIDTH / aspect)), mobile: rect.width <= 720 && aspect < 1.3 };
    }
    // Portrait canvases get a taller frame of the same shape, so the layout fills the stage.
    const mobile = rect.width <= 720;
    const portraitWidth = Math.max(mobile ? 640 : 500, BASE_HEIGHT * aspect);
    return { width: portraitWidth, height: Math.max(BASE_HEIGHT, portraitWidth / aspect), mobile };
  };

  const initialLayout = measureGraph();
  width = initialLayout.width;
  height = initialLayout.height;
  let mobileView = initialLayout.mobile;
  let layoutMode = 'network';
  const nodeMap = new Map(nodes.map((node) => [node.id, node]));
  let layoutScale = 1;
  const baseRadius = (node) => node.radius * (mobileView ? 1.45 : .9);
  const radiusFor = (node) => baseRadius(node) * layoutScale;

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
  const EDGE_GAP = 14;
  // Buttons that float over the canvas (layout/tour toggle, zoom controls), in default-view units,
  // so nodes can be kept out from under them.
  let keepOut = [];
  let unitsPerPixel = 1;
  const measureOverlays = () => {
    const svgRect = graph.getBoundingClientRect();
    if (!svgRect.width || !svgRect.height) return;
    const scale = Math.min(svgRect.width / width, svgRect.height / height);
    const offsetX = svgRect.left + (svgRect.width - width * scale) / 2;
    const offsetY = svgRect.top + (svgRect.height - height * scale) / 2;
    unitsPerPixel = 1 / scale;
    graph.style.setProperty('--unit', unitsPerPixel.toFixed(3));
    keepOut = [...graphStage.querySelectorAll('.graph-modes, .graph-controls')]
      .map((element) => element.getBoundingClientRect())
      .filter((rect) => rect.width && rect.height)
      .map((rect) => ({
        left: (rect.left - offsetX) / scale - 6,
        right: (rect.right - offsetX) / scale + 6,
        top: (rect.top - offsetY) / scale - 6,
        bottom: (rect.bottom - offsetY) / scale + 6
      }));
  };
  // Where a circle would have to move to clear every overlay (its own position if already clear).
  const clearOfOverlays = (x, y, radius) => {
    let point = { x, y };
    keepOut.forEach((box) => {
      const nearestX = Math.max(box.left, Math.min(box.right, point.x));
      const nearestY = Math.max(box.top, Math.min(box.bottom, point.y));
      const distance = Math.hypot(point.x - nearestX, point.y - nearestY);
      if (distance >= radius) return;
      if (distance > .01) {
        const push = radius - distance;
        point = { x: point.x + ((point.x - nearestX) / distance) * push, y: point.y + ((point.y - nearestY) / distance) * push };
        return;
      }
      // Centre inside the box: leave by the nearest side that stays on the canvas.
      const exits = [
        { x: point.x, y: box.bottom + radius, cost: box.bottom - point.y },
        { x: point.x, y: box.top - radius, cost: point.y - box.top },
        { x: box.right + radius, y: point.y, cost: box.right - point.x },
        { x: box.left - radius, y: point.y, cost: point.x - box.left }
      ].filter((exit) => exit.x > radius && exit.x < width - radius && exit.y > radius && exit.y < height - radius);
      if (exits.length) point = exits.reduce((best, exit) => (exit.cost < best.cost ? exit : best));
    });
    return point;
  };
  const clampX = (node, x) => Math.max(node.renderRadius + EDGE_GAP, Math.min(width - node.renderRadius - EDGE_GAP, x));
  const clampY = (node, y) => Math.max(node.renderRadius + EDGE_GAP, Math.min(height - node.renderRadius - EDGE_GAP, y));

  const placeNetwork = (node) => {
    if (node.parentId) {
      // Repositories sit on a ring around the node they fanned out from.
      const parent = nodeMap.get(node.parentId);
      const distance = node.anchorDistance * (mobileView ? 1.45 : 1);
      node.tx = clampX(node, parent.tx + Math.cos(node.anchorAngle) * distance);
      node.ty = clampY(node, parent.ty + Math.sin(node.anchorAngle) * distance);
      return;
    }
    const padding = mobileView ? 52 : 34;
    const top = mobileView ? 130 : 66;
    const bottom = mobileView ? 150 : 44;
    const x = padding + ((node.baseTx - layoutBounds.minX) / (layoutBounds.maxX - layoutBounds.minX)) * (width - padding * 2);
    const y = top + ((node.baseTy - layoutBounds.minY) / (layoutBounds.maxY - layoutBounds.minY)) * (height - top - bottom);
    const clear = clearOfOverlays(x, y, radiusFor(node) + 8);
    node.tx = clear.x;
    node.ty = clear.y;
  };

  // Timeline layout: years run along the long side of the canvas, one lane per kind of node.
  const FIRST_YEAR = 2019;
  const LAST_YEAR = 2026;
  const LANES = [['place', 'Institutions'], ['domain', 'Research areas'], ['project', 'Projects'], ['paper', 'Papers'], ['repo', 'Repositories']];
  const LABEL_STRIP = 16;
  // Portrait phones stack the lanes as narrow columns, so their headings use shorter names.
  const SHORT_LANES = { Institutions: 'Places', 'Research areas': 'Research', Repositories: 'Repos' };
  // Years run along the long side of the canvas: left to right on wide screens, top to bottom on
  // portrait phones. `a` is the position along the years, `c` the position across the lanes.
  const timelineGeometry = () => {
    const lanes = LANES.filter(([kind]) => nodes.some((node) => node.kind === kind));
    const vertical = height > width * 1.2;
    const pad = mobileView ? 30 : 24;
    const root = nodeMap.get('ganesh');
    const rootSpace = baseRadius(root) * 1.3 + 28;
    const labelSpace = mobileView ? 56 : 30;
    const top = mobileView ? 130 : 60;
    const along = vertical
      ? { start: top + rootSpace + LABEL_STRIP, end: height - pad - (mobileView ? 90 : 0) }
      : { start: pad + rootSpace, end: width - pad };
    const across = vertical
      ? { start: pad + labelSpace, end: width - pad }
      : { start: top, end: height - pad - labelSpace };
    const years = LAST_YEAR - FIRST_YEAR + 1;
    const column = (along.end - along.start) / years;
    return {
      lanes, vertical, pad, top, along, across, rootSpace, column,
      laneSize: (across.end - across.start) / lanes.length,
      // Horizontal lanes keep a strip for their label; vertical lanes label above the first row.
      strip: vertical ? 0 : LABEL_STRIP,
      yearAt: (year) => along.start + (year - FIRST_YEAR + .5) * column,
      point: (a, c) => (vertical ? { x: c, y: a } : { x: a, y: c })
    };
  };
  // Largest scale at which every node still fits inside its lane and its year slot.
  const timelineScale = (geo) => {
    const largest = Math.max(...nodes.filter((node) => node.kind !== 'root').map(baseRadius));
    const fit = Math.min((geo.laneSize - geo.strip - 14) / (2 * largest), (geo.column * .92) / (2 * largest));
    return Math.max(.4, Math.min(1, fit));
  };

  const placeTimeline = () => {
    const geo = timelineGeometry();
    const root = nodeMap.get('ganesh');
    const rootPoint = geo.vertical
      ? { x: (geo.across.start + geo.across.end) / 2, y: geo.top + geo.rootSpace / 2 - 4 }
      : { x: geo.pad + geo.rootSpace / 2 - 4, y: (geo.across.start + geo.across.end) / 2 };
    root.tx = rootPoint.x;
    root.ty = rootPoint.y;
    geo.lanes.forEach(([kind], laneIndex) => {
      const laneStart = geo.across.start + laneIndex * geo.laneSize;
      const usable = geo.laneSize - geo.strip;
      const laneCentre = laneStart + geo.strip + usable / 2;
      const cells = new Map();
      nodes.filter((node) => node.kind === kind).forEach((node) => {
        if (!cells.has(node.year)) cells.set(node.year, []);
        cells.get(node.year).push(node);
      });
      cells.forEach((members, year) => {
        const step = Math.max(...members.map((node) => node.renderRadius)) * 2 + 6;
        const perLine = Math.max(1, Math.floor(usable / step));
        const across = Math.min(perLine, members.length);
        const lines = Math.ceil(members.length / perLine);
        const lineStep = Math.min(step, geo.column / lines);
        members.forEach((node, index) => {
          const slot = index % perLine;
          const line = Math.floor(index / perLine);
          // When only one fits across the lane, alternate the extras so neighbours don't touch.
          const zigzag = across === 1 && lines > 1 ? (line % 2 ? 1 : -1) * Math.min(usable * .2, step * .35) : 0;
          const point = geo.point(
            geo.yearAt(year) + (line - (lines - 1) / 2) * lineStep,
            laneCentre + (slot - (across - 1) / 2) * Math.min(step, usable / across) + zigzag
          );
          node.tx = point.x;
          node.ty = point.y;
          node.slot = { across: [laneStart + geo.strip, laneStart + geo.laneSize], along: geo.yearAt(year) };
        });
      });
    });
    separateTimeline(geo);
    return geo;
  };
  // Crowded year cells can still leave circles touching, so nudge overlapping pairs apart while
  // keeping every node inside its lane and near its year.
  const separateTimeline = (geo) => {
    const placed = nodes.filter((node) => node.slot);
    const axis = geo.vertical ? { along: 'ty', across: 'tx' } : { along: 'tx', across: 'ty' };
    for (let pass = 0; pass < 120; pass += 1) {
      let moved = false;
      for (let i = 0; i < placed.length; i += 1) {
        for (let j = i + 1; j < placed.length; j += 1) {
          const left = placed[i];
          const right = placed[j];
          let dx = right.tx - left.tx;
          let dy = right.ty - left.ty;
          let distance = Math.hypot(dx, dy);
          const minimum = left.renderRadius + right.renderRadius + 5;
          if (distance >= minimum) continue;
          if (distance < .01) {
            dx = 1;
            dy = 1;
            distance = Math.SQRT2;
          }
          const push = (minimum - distance) / 2 + .1;
          left.tx -= (dx / distance) * push;
          left.ty -= (dy / distance) * push;
          right.tx += (dx / distance) * push;
          right.ty += (dy / distance) * push;
          moved = true;
        }
      }
      placed.forEach((node) => {
        const [low, high] = node.slot.across;
        const r = node.renderRadius + 2;
        node[axis.across] = Math.max(low + r, Math.min(high - r, node[axis.across]));
        const reach = geo.column * .65;
        node[axis.along] = Math.max(node.slot.along - reach, Math.min(node.slot.along + reach, node[axis.along]));
      });
      if (!moved) break;
    }
  };

  const drawAxis = () => {
    axisLayer.replaceChildren();
    if (layoutMode !== 'timeline') return;
    const geo = timelineGeometry();
    geo.lanes.forEach(([, label], laneIndex) => {
      const start = geo.across.start + laneIndex * geo.laneSize;
      const group = makeSvg('g', { class: 'axis-lane' });
      const band = geo.vertical
        ? { x: start, y: geo.along.start, width: geo.laneSize, height: geo.along.end - geo.along.start }
        : { x: geo.along.start, y: start, width: geo.along.end - geo.along.start, height: geo.laneSize };
      if (laneIndex % 2 === 0) group.append(makeSvg('rect', band));
      const text = makeSvg('text', geo.vertical
        ? { x: start + geo.laneSize / 2, y: geo.along.start - 6, 'text-anchor': 'middle' }
        : { x: geo.along.start + 6, y: start + 11 });
      text.textContent = geo.vertical ? SHORT_LANES[label] || label : label;
      group.append(text);
      axisLayer.append(group);
    });
    for (let year = FIRST_YEAR; year <= LAST_YEAR; year += 1) {
      const position = geo.yearAt(year);
      const group = makeSvg('g', { class: 'axis-year' });
      const from = geo.point(position, geo.across.start);
      const to = geo.point(position, geo.across.end);
      group.append(makeSvg('line', { x1: from.x, y1: from.y, x2: to.x, y2: to.y }));
      const label = makeSvg('text', geo.vertical
        ? { x: geo.across.start - 10, y: position + 4, 'text-anchor': 'end' }
        : { x: position, y: geo.across.end + 18, 'text-anchor': 'middle' });
      label.textContent = String(year);
      group.append(label);
      axisLayer.append(group);
    }
  };

  const rescaleNodes = () => {
    layoutScale = layoutMode === 'timeline' ? timelineScale(timelineGeometry()) : 1;
    nodes.forEach((node) => {
      node.renderRadius = radiusFor(node);
      if (node.element) shapeNode(node);
    });
  };
  const applyLayoutTargets = () => {
    nodes.forEach((node) => { node.slot = null; });
    if (layoutMode === 'timeline') placeTimeline();
    else {
      nodes.filter((node) => !node.parentId).forEach(placeNetwork);
      nodes.filter((node) => node.parentId).forEach(placeNetwork);
    }
  };

  // ---------------------------------------------------------------- state
  let defaultView = { x: 0, y: 0, width, height };
  let currentView = { ...defaultView };
  let selectedId = null;
  let previewIds = null;
  let previewSource = null;
  let pathState = null;
  let legendKind = null;
  let legendPinned = false;
  let lastTap = { node: null, time: 0 };
  let lastFocusedNode = null;
  let activeFilter = 'all';
  let searchTerm = '';
  let searchMatches = new Set();
  let rankedResults = [];
  let dragging = null;
  let dragTrail = [];
  let panning = null;
  let simulationFrame = null;
  let simulationEnergy = 0;
  let pointerOffset = { x: 0, y: 0 };
  let spawnDone = false;
  let tour = null;

  // ---------------------------------------------------------------- camera
  const aspectRatio = () => defaultView.height / defaultView.width;
  const setView = (view) => {
    const viewWidth = Math.min(1400, Math.max(300, view.width));
    const viewHeight = viewWidth * aspectRatio();
    currentView = {
      x: Math.max(-250, Math.min(defaultView.width + 250 - viewWidth, view.x)),
      y: Math.max(-180, Math.min(defaultView.height + 180 - viewHeight, view.y)),
      width: viewWidth,
      height: viewHeight
    };
    graph.setAttribute('viewBox', `${currentView.x} ${currentView.y} ${currentView.width} ${currentView.height}`);
    graph.classList.toggle('is-zoomed', currentView.width < defaultView.width * .62);
    graph.style.setProperty('--zoom', (currentView.width / defaultView.width).toFixed(3));
    graphStage.classList.toggle('is-moved', Math.abs(currentView.width - defaultView.width) > 4
      || Math.abs(currentView.x - defaultView.x) > 4 || Math.abs(currentView.y - defaultView.y) > 4);
    updateMinimapView();
  };

  // Ease the camera to a new view; any direct pan, zoom or resize cancels the glide.
  let viewFrame = null;
  const stopGlide = () => {
    if (viewFrame) cancelAnimationFrame(viewFrame);
    viewFrame = null;
  };
  const glideView = (target, duration = 420) => {
    stopGlide();
    if (reducedMotion) {
      setView(target);
      return;
    }
    const from = { ...currentView };
    const start = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      setView({ x: from.x + (target.x - from.x) * eased, y: from.y + (target.y - from.y) * eased, width: from.width + (target.width - from.width) * eased });
      viewFrame = t < 1 ? requestAnimationFrame(step) : null;
    };
    viewFrame = requestAnimationFrame(step);
  };

  // Share of the stage height hidden under the layout and tour buttons along its top edge.
  const topInset = () => {
    const stageRect = graphStage.getBoundingClientRect();
    const modes = graphStage.querySelector('.graph-modes');
    if (!modes || !stageRect.height) return 0;
    return Math.max(0, Math.min(.3, (modes.getBoundingClientRect().bottom - stageRect.top + 6) / stageRect.height));
  };
  // A view that frames the given nodes (with their radius and some breathing room) in the part of
  // the stage that isn't covered: below the top buttons and above any bar along the bottom.
  const viewFor = (list, padding = 60, bottomInset = 0) => {
    if (!list.length) return { ...defaultView };
    // Settled nodes are framed where they actually are; moving ones where they are heading.
    const px = (node) => (node.spawned && !node.tweening && layoutMode === 'network' ? node.x : node.tx);
    const py = (node) => (node.spawned && !node.tweening && layoutMode === 'network' ? node.y : node.ty);
    const minX = Math.min(...list.map((node) => px(node) - node.renderRadius)) - padding;
    const maxX = Math.max(...list.map((node) => px(node) + node.renderRadius)) + padding;
    const minY = Math.min(...list.map((node) => py(node) - node.renderRadius)) - padding * .6;
    const maxY = Math.max(...list.map((node) => py(node) + node.renderRadius)) + padding * .6;
    const top = topInset();
    const free = Math.max(.35, 1 - top - bottomInset);
    const viewWidth = Math.min(defaultView.width, Math.max(maxX - minX, (maxY - minY) / free / aspectRatio(), 300));
    const viewHeight = viewWidth * aspectRatio();
    const y = minY - viewHeight * top - (viewHeight * free - (maxY - minY)) / 2;
    return { x: (minX + maxX) / 2 - viewWidth / 2, y, width: viewWidth, height: viewHeight };
  };

  const zoomAt = (factor, point = { x: currentView.x + currentView.width / 2, y: currentView.y + currentView.height / 2 }) => {
    stopGlide();
    const newWidth = currentView.width * factor;
    const xRatio = (point.x - currentView.x) / currentView.width;
    const yRatio = (point.y - currentView.y) / currentView.height;
    setView({ x: point.x - xRatio * newWidth, y: point.y - yRatio * newWidth * aspectRatio(), width: newWidth });
  };
  const resetView = () => glideView({ ...defaultView });

  // ---------------------------------------------------------------- node elements
  // Shrink a label until its widest line fits inside the circle, measuring the real glyphs.
  const sizeLabel = (node) => {
    if (node.kind === 'repo') {
      node.text.style.fontSize = `${mobileView ? 11 : 7}px`;
      return;
    }
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

  const shapeNode = (node) => {
    const r = node.renderRadius;
    node.circle.setAttribute('r', r);
    node.focusRing.setAttribute('r', r + 7);
    node.halo.setAttribute('r', r + 10);
    if (node.badge) {
      const size = Math.max(5.5, r * .27);
      const angle = -Math.PI / 4;
      node.badge.setAttribute('transform', `translate(${(Math.cos(angle) * r).toFixed(2)} ${(Math.sin(angle) * r).toFixed(2)})`);
      node.badge.querySelector('circle').setAttribute('r', size);
      node.badge.querySelector('path').setAttribute('transform', `translate(${-size * .62} ${-size * .62}) scale(${(size * 1.24 / 12).toFixed(3)})`);
    }
    if (node.caption) {
      node.caption.setAttribute('y', r + (mobileView ? 14 : 9));
      node.caption.style.fontSize = `${mobileView ? 7.5 : 4.8}px`;
    }
    if (node.kind === 'repo') node.text.setAttribute('y', r + (mobileView ? 14 : 9));
    sizeLabel(node);
  };

  const createNodeElement = (node) => {
    node.x = node.x ?? node.tx;
    node.y = node.y ?? node.ty;
    node.spawned = false;
    node.progress = 0;
    node.vx = 0;
    node.vy = 0;
    node.growthFrame = null;
    node.renderRadius = radiusFor(node);

    const group = makeSvg('g', {
      class: 'graph-node',
      'data-id': node.id,
      'data-kind': node.kind,
      role: 'button',
      tabindex: '0',
      'aria-label': `${node.label}: ${node.description}`
    });
    const visual = makeSvg('g', { class: 'node-visual' });
    // An inner group carries the slow idle float so it never fights the spawn/filter scale.
    const float = makeSvg('g', { class: 'node-float' });
    float.style.setProperty('--float-delay', `${(-Math.random() * 6).toFixed(2)}s`);
    float.style.setProperty('--float-duration', `${(5 + Math.random() * 3).toFixed(2)}s`);
    node.halo = makeSvg('circle', { class: 'node-halo' });
    node.circle = makeSvg('circle', { class: 'node-ring' });
    // Keyboard focus ring, drawn just outside the node so it reads on every fill style.
    node.focusRing = makeSvg('circle', { class: 'node-focus' });
    float.append(node.halo, node.focusRing, node.circle);

    const text = makeSvg('text', { class: 'node-label' });
    const words = node.label.split(' ');
    if (node.kind !== 'repo' && words.length > 1) {
      const midpoint = Math.ceil(words.length / 2);
      node.labelLines = [words.slice(0, midpoint), words.slice(midpoint)].filter((line) => line.length).map((line) => line.join(' '));
      node.labelLines.forEach((line, lineIndex) => {
        const tspan = makeSvg('tspan', { x: '0', dy: lineIndex === 0 ? '-.2em' : '1.1em' });
        tspan.textContent = line;
        text.append(tspan);
      });
    } else {
      node.labelLines = [node.label];
      text.setAttribute('dy', node.kind === 'repo' ? '0' : '.35em');
      text.textContent = node.label;
    }
    node.text = text;
    float.append(text);

    if (ICONS[node.kind]) {
      node.badge = makeSvg('g', { class: 'node-badge', 'aria-hidden': 'true' });
      node.badge.append(makeSvg('circle'), makeSvg('path', { d: ICONS[node.kind] }));
      float.append(node.badge);
    }
    const captionText = node.kind === 'repo' ? '' : Object.values(node.meta || {})[0];
    if (captionText) {
      node.caption = makeSvg('text', { class: 'node-caption', 'aria-hidden': 'true' });
      node.caption.textContent = captionText.length > 28 ? `${captionText.slice(0, 27)}…` : captionText;
      float.append(node.caption);
    }

    visual.append(float);
    group.append(visual);
    nodeLayer.append(group);
    node.element = group;
    shapeNode(node);
    bindNodeEvents(node);
  };

  const createEdgeElement = (link) => {
    link.element = makeSvg('path', { class: 'graph-edge', pathLength: '1' });
    edgeLayer.append(link.element);
  };

  // ---------------------------------------------------------------- rendering
  // Edges bend gently to one side so crossings are rarer and the map reads less like a grid.
  const curveOf = (link) => {
    const source = nodeMap.get(link.source);
    const target = nodeMap.get(link.target);
    const dx = target.x - source.x;
    const dy = target.y - source.y;
    const length = Math.hypot(dx, dy) || 1;
    const bend = Math.min(length * .14, 34) * (layoutMode === 'timeline' ? .6 : 1);
    return {
      sx: source.x, sy: source.y, tx: target.x, ty: target.y,
      cx: (source.x + target.x) / 2 - (dy / length) * bend,
      cy: (source.y + target.y) / 2 + (dx / length) * bend
    };
  };
  const pointOnCurve = (curve, t) => {
    const u = 1 - t;
    return {
      x: u * u * curve.sx + 2 * u * t * curve.cx + t * t * curve.tx,
      y: u * u * curve.sy + 2 * u * t * curve.cy + t * t * curve.ty
    };
  };

  // Cluster regions: a smoothed convex hull around each group's visible members.
  const hulls = CLUSTERS.map((cluster) => {
    const group = makeSvg('g', { class: 'hull', 'data-cluster': cluster.id });
    const shape = makeSvg('path', { class: 'hull-shape' });
    const label = makeSvg('text', { class: 'hull-label', tabindex: '0', role: 'button', 'aria-label': `Zoom to ${cluster.label}` });
    label.textContent = cluster.label;
    group.append(shape, label);
    hullLayer.append(group);
    return { ...cluster, group, shape, label };
  });
  const convexHull = (points) => {
    const sorted = [...points].sort((a, b) => a.x - b.x || a.y - b.y);
    const cross = (o, a, b) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
    const lower = [];
    sorted.forEach((point) => {
      while (lower.length >= 2 && cross(lower.at(-2), lower.at(-1), point) <= 0) lower.pop();
      lower.push(point);
    });
    const upper = [];
    [...sorted].reverse().forEach((point) => {
      while (upper.length >= 2 && cross(upper.at(-2), upper.at(-1), point) <= 0) upper.pop();
      upper.push(point);
    });
    return [...lower.slice(0, -1), ...upper.slice(0, -1)];
  };
  const smoothClosedPath = (points) => {
    // Quadratic curves through edge midpoints give a soft, blobby outline.
    const mid = (a, b) => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });
    let d = '';
    points.forEach((point, index) => {
      const next = points[(index + 1) % points.length];
      const start = mid(points[(index - 1 + points.length) % points.length], point);
      const end = mid(point, next);
      d += `${index === 0 ? `M${start.x.toFixed(1)} ${start.y.toFixed(1)}` : ''}Q${point.x.toFixed(1)} ${point.y.toFixed(1)} ${end.x.toFixed(1)} ${end.y.toFixed(1)}`;
    });
    return `${d}Z`;
  };
  const clusterMembers = (hull) => nodes.filter((node) => node.spawned && !node.element.classList.contains('is-filtered')
    && (hull.members.includes(node.id) || (node.parentId && hull.members.includes(node.parentId))));
  const drawHulls = () => {
    if (layoutMode !== 'network') return;
    const takenLabels = [];
    hulls.forEach((hull) => {
      const members = clusterMembers(hull);
      hull.group.classList.toggle('is-empty', members.length === 0);
      if (!members.length) return;
      const points = [];
      members.forEach((node) => {
        const reach = node.renderRadius + (mobileView ? 22 : 16);
        for (let i = 0; i < 12; i += 1) {
          const angle = (i / 12) * Math.PI * 2;
          points.push({ x: node.x + Math.cos(angle) * reach, y: node.y + Math.sin(angle) * reach });
        }
      });
      const outline = convexHull(points);
      hull.shape.setAttribute('d', smoothClosedPath(outline));
      // The label sits just above the region, unless that runs off the canvas or into a node or a
      // button, in which case it tries just below the region, then off to either side of the top.
      const cluster = CLUSTERS.find((item) => item.id === hull.group.dataset.cluster);
      const text = mobileView ? cluster.short : cluster.label;
      if (hull.label.textContent !== text) hull.label.textContent = text;
      const font = (mobileView ? 9 : 11) * unitsPerPixel * (currentView.width / defaultView.width);
      const half = hull.label.textContent.length * font * .34;
      const top = outline.reduce((best, point) => (point.y < best.y ? point : best), outline[0]);
      const bottom = outline.reduce((best, point) => (point.y > best.y ? point : best), outline[0]);
      const fits = (spot) => {
        const box = { left: spot.x - half - 4, right: spot.x + half + 4, top: spot.y - font, bottom: spot.y + 3 };
        if (box.top < 4 || box.bottom > height - 4) return false;
        const hitsNode = nodes.some((node) => node.spawned && !node.element.classList.contains('is-filtered')
          && node.x + node.renderRadius > box.left && node.x - node.renderRadius < box.right
          && node.y + node.renderRadius > box.top && node.y - node.renderRadius < box.bottom);
        const overlaps = (zone) => zone.right > box.left && zone.left < box.right && zone.bottom > box.top && zone.top < box.bottom;
        return !hitsNode && !keepOut.some(overlaps) && !takenLabels.some(overlaps);
      };
      const clampSpot = (spot) => ({ x: Math.max(half + 6, Math.min(width - half - 6, spot.x)), y: spot.y });
      const candidates = [
        { x: top.x, y: top.y - 6 },
        { x: top.x - half, y: top.y - 6 },
        { x: top.x + half, y: top.y - 6 },
        { x: bottom.x, y: bottom.y + font + 2 },
        { x: bottom.x - half, y: bottom.y + font + 2 },
        { x: bottom.x + half, y: bottom.y + font + 2 },
        { x: top.x - half * 1.4, y: top.y + font * 1.5 },
        { x: top.x + half * 1.4, y: top.y + font * 1.5 },
        { x: bottom.x, y: bottom.y - font }
      ].map(clampSpot);
      // Last resort: any clear gap inside the region, scanning down from the top.
      const inside = () => {
        const xs = outline.map((point) => point.x);
        const centre = (Math.min(...xs) + Math.max(...xs)) / 2;
        for (let y = top.y + font * 2; y < bottom.y - font; y += font) {
          const found = [centre, centre - half, centre + half].map((x) => clampSpot({ x, y })).find(fits);
          if (found) return found;
        }
        return null;
      };
      const spot = candidates.find(fits) || inside();
      hull.label.classList.toggle('is-hidden', !spot);
      if (!spot) return;
      takenLabels.push({ left: spot.x - half - 6, right: spot.x + half + 6, top: spot.y - font - 4, bottom: spot.y + 6 });
      hull.label.setAttribute('x', spot.x.toFixed(1));
      hull.label.setAttribute('y', spot.y.toFixed(1));
    });
  };

  const render = () => {
    nodes.forEach((node) => {
      node.element.setAttribute('transform', `translate(${node.x.toFixed(2)} ${node.y.toFixed(2)})`);
    });
    links.forEach((link) => {
      const curve = curveOf(link);
      link.curve = curve;
      link.element.setAttribute('d', `M${curve.sx.toFixed(1)} ${curve.sy.toFixed(1)}Q${curve.cx.toFixed(1)} ${curve.cy.toFixed(1)} ${curve.tx.toFixed(1)} ${curve.ty.toFixed(1)}`);
    });
    drawHulls();
    updateMinimapNodes();
    if (card && !card.hidden && card.node) positionCard(card.node);
  };
  let renderQueued = false;
  const requestRender = () => {
    if (renderQueued) return;
    renderQueued = true;
    requestAnimationFrame(() => {
      renderQueued = false;
      render();
    });
  };

  // ---------------------------------------------------------------- physics
  const refreshLinkLengths = () => {
    links.forEach((link) => {
      const source = nodeMap.get(link.source);
      const target = nodeMap.get(link.target);
      link.restLength = Math.hypot(target.tx - source.tx, target.ty - source.ty);
    });
  };

  const MAX_SPEED = 9;
  // Nodes still growing out of their parent, or morphing between layouts, follow their own tween;
  // letting the physics see them would put two nodes on the same point and fling them apart.
  const isSettled = (node) => node.spawned && !node.growthFrame && !node.tweening;

  const simulate = () => {
    const activeNodes = nodes.filter(isSettled);
    const timeline = layoutMode === 'timeline';
    activeNodes.forEach((node) => {
      node.vx *= .88;
      node.vy *= .88;
      // In the timeline every node has a fixed slot, so the anchor is much stiffer.
      const stiffness = timeline ? .03 : .002;
      node.vx += (node.tx - node.x) * stiffness;
      node.vy += (node.ty - node.y) * stiffness;
    });

    if (!timeline) {
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
        if (!isSettled(source) || !isSettled(target) || !Number.isFinite(link.restLength)) return;
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
    }

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
      if (!timeline && keepOut.length) {
        const clear = clearOfOverlays(node.x, node.y, node.renderRadius + 6);
        if (clear.x !== node.x || clear.y !== node.y) {
          node.vx += (clear.x - node.x) * .08;
          node.vy += (clear.y - node.y) * .08;
          node.x += (clear.x - node.x) * .25;
          node.y += (clear.y - node.y) * .25;
        }
      }
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

  // Move every node to its current target in one shared tween (used when switching layouts).
  let morphFrame = null;
  const morphToTargets = (duration = 900) => {
    if (morphFrame) cancelAnimationFrame(morphFrame);
    const moving = nodes.filter((node) => node.spawned);
    if (reducedMotion) {
      moving.forEach((node) => { node.x = node.tx; node.y = node.ty; node.vx = 0; node.vy = 0; });
      render();
      return;
    }
    const start = performance.now();
    moving.forEach((node, index) => {
      node.tweening = { fromX: node.x, fromY: node.y, delay: Math.min(index * 18, 260) };
      node.vx = 0;
      node.vy = 0;
    });
    const step = (now) => {
      let running = false;
      moving.forEach((node) => {
        if (!node.tweening) return;
        const t = Math.max(0, Math.min(1, (now - start - node.tweening.delay) / duration));
        const eased = t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        node.x = node.tweening.fromX + (node.tx - node.tweening.fromX) * eased;
        node.y = node.tweening.fromY + (node.ty - node.tweening.fromY) * eased;
        if (t < 1) running = true;
        else node.tweening = null;
      });
      render();
      if (running) morphFrame = requestAnimationFrame(step);
      else {
        morphFrame = null;
        refreshLinkLengths();
        wakeSimulation(.3);
      }
    };
    morphFrame = requestAnimationFrame(step);
  };

  // ---------------------------------------------------------------- relationships and visibility
  const neighbours = (id) => new Set([
    id,
    ...links.filter((link) => link.source === id).map((link) => link.target),
    ...links.filter((link) => link.target === id).map((link) => link.source)
  ]);

  const findPath = (fromId, toId) => {
    const previous = new Map([[fromId, null]]);
    const queue = [fromId];
    while (queue.length) {
      const id = queue.shift();
      if (id === toId) break;
      links.forEach((link) => {
        const other = link.source === id ? link.target : link.target === id ? link.source : null;
        if (other && !previous.has(other)) {
          previous.set(other, id);
          queue.push(other);
        }
      });
    }
    if (!previous.has(toId)) return null;
    const path = [];
    for (let id = toId; id !== null; id = previous.get(id)) path.unshift(id);
    return path;
  };
  const pathEdges = (ids) => ids.slice(1).map((id, index) => {
    const from = ids[index];
    const link = links.find((item) => (item.source === from && item.target === id) || (item.target === from && item.source === id));
    return { link, forward: link.source === from };
  });

  const matchingIds = () => {
    const publicationContext = new Set(['ganesh', 'iiith', 'molecular-ai', 'multimodal', 'smen', 'molgpt', 'bias-study']);
    return new Set(nodes.filter((node) => {
      const group = node.parentId ? nodeMap.get(node.parentId).group : node.group;
      const filterMatch = activeFilter === 'all'
        || group === activeFilter
        || node.id === 'ganesh'
        || (activeFilter === 'publication' && publicationContext.has(node.parentId || node.id));
      const searchMatch = !searchTerm || searchMatches.has(node.id);
      return filterMatch && searchMatch;
    }).map((node) => node.id));
  };

  const applyVisibility = () => {
    const matching = matchingIds();
    const focus = pathState ? new Set(pathState.ids) : selectedId ? neighbours(selectedId) : null;
    const pathLinks = new Set(pathState ? pathState.edges.map((edge) => edge.link) : []);
    const preview = !focus && !searchTerm ? previewIds : null;
    const legend = !focus && legendKind;

    // Under a filter, nodes kept only to show where the matches connect sit a step back.
    const primary = (node) => activeFilter === 'all' || (node.parentId ? nodeMap.get(node.parentId).group : node.group) === activeFilter;
    nodes.forEach((node) => {
      const filtered = !matching.has(node.id);
      node.element.classList.toggle('is-filtered', filtered);
      node.element.classList.toggle('is-context', Boolean(!filtered && !focus && !primary(node)));
      node.element.classList.toggle('is-muted', Boolean(!filtered && focus && !focus.has(node.id)));
      node.element.classList.toggle('is-match', Boolean(searchTerm && !filtered));
      node.element.classList.toggle('is-selected', node.id === selectedId);
      node.element.classList.toggle('is-path', Boolean(pathState?.ids.includes(node.id)));
      node.element.classList.toggle('is-near', Boolean(preview?.has(node.id)));
      node.element.classList.toggle('is-kind', Boolean(legend && node.kind === legend));
      node.element.setAttribute('tabindex', filtered ? '-1' : '0');
      node.element.setAttribute('aria-hidden', String(filtered));
    });
    links.forEach((link) => {
      const filtered = !matching.has(link.source) || !matching.has(link.target);
      const inFocus = pathState ? pathLinks.has(link) : Boolean(selectedId && (link.source === selectedId || link.target === selectedId));
      link.element.classList.toggle('is-muted', Boolean(filtered || (focus && !inFocus)));
      link.element.classList.toggle('is-related', Boolean(inFocus && !pathState && !filtered));
      link.element.classList.toggle('is-path', pathLinks.has(link));
      link.element.classList.toggle('is-near', Boolean(preview && preview.has(link.source) && preview.has(link.target)
        && (previewSource === null || link.source === previewSource || link.target === previewSource)));
    });
    graph.classList.toggle('is-previewing', Boolean(preview));
    graph.classList.toggle('is-legend', Boolean(legend));
    graph.classList.toggle('has-focus', Boolean(focus));
    if (resultCount) {
      const label = matching.size === 1 ? 'node' : 'nodes';
      const shownLinks = links.filter((link) => matching.has(link.source) && matching.has(link.target)).length;
      resultCount.textContent = `${matching.size} ${label} shown · ${shownLinks} ${shownLinks === 1 ? 'relationship' : 'relationships'}`;
    }
    const expanded = nodes.some((node) => node.kind === 'repo');
    document.querySelector('[data-legend="repo"]')?.toggleAttribute('hidden', !expanded);
    requestRender();
    syncParticles();
  };

  // ---------------------------------------------------------------- particles and ripples
  // Small lights travel along the highlighted edges, outward from the selection or along a path.
  let particles = [];
  let particleFrame = null;
  const syncParticles = () => {
    particleLayer.querySelectorAll('.graph-particle').forEach((dot) => dot.remove());
    particles = [];
    if (reducedMotion) return;
    let routes = [];
    if (pathState) routes = pathState.edges.map((edge, index) => ({ ...edge, offset: index * .22 }));
    else if (selectedId) {
      routes = links.filter((link) => (link.source === selectedId || link.target === selectedId) && !link.element.classList.contains('is-muted'))
        .map((link) => ({ link, forward: link.source === selectedId, offset: 0 }));
    }
    routes.forEach((route) => {
      for (let i = 0; i < 2; i += 1) {
        const dot = makeSvg('circle', { class: 'graph-particle', r: mobileView ? 3.4 : 2.3 });
        particleLayer.append(dot);
        particles.push({ ...route, dot, phase: i / 2 + route.offset });
      }
    });
    if (particles.length && !particleFrame) particleFrame = requestAnimationFrame(animateParticles);
  };
  const animateParticles = (now) => {
    if (!particles.length) {
      particleFrame = null;
      return;
    }
    particles.forEach((particle) => {
      const curve = particle.link.curve;
      if (!curve) return;
      const t = ((now / 1500) + particle.phase) % 1;
      const along = particle.forward ? t : 1 - t;
      const point = pointOnCurve(curve, along);
      particle.dot.setAttribute('cx', point.x.toFixed(1));
      particle.dot.setAttribute('cy', point.y.toFixed(1));
      particle.dot.style.opacity = Math.sin(Math.PI * t).toFixed(2);
    });
    particleFrame = requestAnimationFrame(animateParticles);
  };
  const ripple = (node) => {
    if (reducedMotion) return;
    const ring = makeSvg('circle', { class: 'graph-ripple', cx: node.x, cy: node.y, r: node.renderRadius });
    ring.addEventListener('animationend', () => ring.remove());
    particleLayer.append(ring);
  };

  // ---------------------------------------------------------------- hover card
  const positionCard = (node) => {
    const stageRect = graphStage.getBoundingClientRect();
    const nodeRect = node.element.querySelector('.node-ring').getBoundingClientRect();
    const cardWidth = card.offsetWidth;
    const cardHeight = card.offsetHeight;
    // Keep right of the node unless that runs off the stage or under the open detail panel.
    const panelOpen = panel.classList.contains('is-open') && panel.offsetLeft > stageRect.width * .35;
    const rightLimit = panelOpen ? panel.offsetLeft - 10 : stageRect.width - 10;
    let left = nodeRect.right - stageRect.left + 14;
    if (left + cardWidth > rightLimit) left = nodeRect.left - stageRect.left - cardWidth - 14;
    let top = nodeRect.top - stageRect.top + nodeRect.height / 2 - cardHeight / 2;
    top = Math.max(10, Math.min(stageRect.height - cardHeight - 10, top));
    card.style.transform = `translate(${Math.max(10, left).toFixed(0)}px, ${top.toFixed(0)}px)`;
  };
  const showCard = (node) => {
    if (!card || tour || dragging || node.id === selectedId) return;
    card.node = node;
    card.querySelector('[data-card-type]').textContent = KIND_NAMES[node.kind];
    card.querySelector('[data-card-title]').textContent = node.label;
    card.querySelector('[data-card-text]').textContent = node.description;
    const selected = selectedId && nodeMap.get(selectedId);
    card.querySelector('[data-card-hint]').textContent = selected
      ? `Shift-click to see how it connects to ${selected.label}`
      : 'Click for details · Double-click to zoom';
    card.hidden = false;
    positionCard(node);
  };
  const hideCard = () => {
    if (!card) return;
    card.hidden = true;
    card.node = null;
  };

  // ---------------------------------------------------------------- detail panel and deep links
  const keepClearOfPanel = (node, view = currentView) => {
    // The detail panel sits over the canvas (right-hand card on desktop, bottom sheet on phones).
    // If it would cover the node being inspected, slide the view so the node stays in sight.
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
    const clearTop = topInset() * stageRect.height;
    glideView({
      ...view,
      x: view.x + (dockedRight ? (x - box.left / 2) / scale : 0),
      y: view.y + (dockedRight ? 0 : (y - (clearTop + box.top) / 2) / scale)
    });
  };

  const setHash = (id) => {
    const url = `${location.pathname}${location.search}${id ? `#${id}` : ''}`;
    history.replaceState(null, '', url);
  };

  const updateExpandButton = (node) => {
    const repos = EXPANSIONS[node.id];
    if (!panelExpand) return;
    panelExpand.hidden = !repos;
    if (!repos) return;
    const open = nodes.some((item) => item.parentId === node.id);
    panelExpand.textContent = open ? 'Hide repositories' : `Show ${repos.length} ${repos.length === 1 ? 'repository' : 'repositories'}`;
    panelExpand.setAttribute('aria-pressed', String(open));
  };

  const inspectNode = (node, moveFocus = false, view = currentView) => {
    stopTour();
    clearPath(false);
    selectedId = node.id;
    lastFocusedNode = node;
    hideCard();
    panelType.textContent = KIND_NAMES[node.kind];
    panelTitle.textContent = node.label;
    panelDescription.textContent = node.description;
    panelMeta.replaceChildren(...Object.entries(node.meta || {}).map(([term, value]) => {
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
    updateExpandButton(node);
    if (panelShare) {
      panelShare.hidden = Boolean(node.parentId);
      panelShare.textContent = 'Copy link';
    }
    panel.classList.add('is-open');
    if (!node.parentId) setHash(node.id);
    ripple(node);
    applyVisibility();
    keepClearOfPanel(node, view);
    if (moveFocus) panel.focus();
  };

  const closePanel = (returnFocus = true) => {
    const hadSelection = Boolean(selectedId);
    selectedId = null;
    panel.classList.remove('is-open');
    if (hadSelection) setHash(null);
    applyVisibility();
    if (returnFocus && lastFocusedNode?.element.getAttribute('tabindex') === '0') lastFocusedNode.element.focus();
  };

  const focusView = (node, extra = []) => viewFor([node, ...extra], mobileView ? 90 : 70);
  const openFromHash = () => {
    const id = decodeURIComponent(location.hash.slice(1));
    const node = nodeMap.get(id);
    if (!node || node.id === selectedId) return;
    const related = [...neighbours(node.id)].map((item) => nodeMap.get(item));
    inspectNode(node, false, focusView(node, related));
  };

  panelShare?.addEventListener('click', async () => {
    const url = `${location.origin}${location.pathname}#${selectedId}`;
    try {
      await navigator.clipboard.writeText(url);
      panelShare.textContent = 'Link copied';
    } catch {
      panelShare.textContent = url;
    }
  });
  panelExpand?.addEventListener('click', () => {
    if (!selectedId) return;
    const node = nodeMap.get(selectedId);
    if (nodes.some((item) => item.parentId === node.id)) collapseNode(node);
    else expandNode(node);
    updateExpandButton(node);
  });

  // ---------------------------------------------------------------- path tracing
  const clearPath = (update = true) => {
    if (!pathState) return;
    pathState = null;
    if (pathBar) pathBar.hidden = true;
    if (update) applyVisibility();
  };
  const showPath = (fromId, toId) => {
    const ids = findPath(fromId, toId);
    if (!ids) return;
    selectedId = null;
    panel.classList.remove('is-open');
    setHash(null);
    hideCard();
    pathState = { ids, edges: pathEdges(ids) };
    if (pathBar) {
      pathBar.querySelector('[data-path-text]').textContent = ids.map((id) => nodeMap.get(id).label).join('  →  ');
      pathBar.hidden = false;
    }
    applyVisibility();
    glideView(viewFor(ids.map((id) => nodeMap.get(id)), mobileView ? 80 : 70), 600);
  };
  pathBar?.querySelector('[data-path-clear]')?.addEventListener('click', () => clearPath());

  // ---------------------------------------------------------------- repository expansion
  const repoDescriptions = new Map(repositoryItems.map((item) => [item.label, item.description]));
  const expandNode = (parent) => {
    const repos = EXPANSIONS[parent.id];
    if (!repos) return;
    // Fan the repositories out toward the emptiest open space around the parent.
    let outward = 0;
    let bestScore = -Infinity;
    for (let i = 0; i < 24; i += 1) {
      const angle = (i / 24) * Math.PI * 2;
      const probe = { x: parent.tx + Math.cos(angle) * 90, y: parent.ty + Math.sin(angle) * 90 };
      const room = Math.min(probe.x, width - probe.x, probe.y, height - probe.y);
      const crowd = nodes.reduce((total, other) => (other === parent ? total : total + Math.max(0, 1 - Math.hypot(other.tx - probe.x, other.ty - probe.y) / 110)), 0);
      const score = Math.min(room, 120) / 120 - crowd * .7;
      if (score > bestScore) { bestScore = score; outward = angle; }
    }
    const spread = Math.min(Math.PI * 1.2, .38 * repos.length);
    repos.forEach(([name, label, year], index) => {
      const id = `repo-${name.toLowerCase()}`;
      if (nodeMap.has(id)) return;
      const angle = outward + (repos.length === 1 ? 0 : (index / (repos.length - 1) - .5) * spread);
      const node = {
        id, label, kind: 'repo', group: parent.group, radius: 9, year,
        parentId: parent.id, anchorAngle: angle, anchorDistance: parent.radius * .9 + 46 + (index % 2) * 20,
        description: repoDescriptions.get(name) || 'Public repository.',
        meta: { Repository: name, Created: String(year) },
        link: `https://github.com/kganeshchandan/${name}`,
        x: parent.x, y: parent.y
      };
      nodes.push(node);
      nodeMap.set(id, node);
      const link = { source: parent.id, target: id };
      links.push(link);
      createEdgeElement(link);
      node.renderRadius = radiusFor(node);
      placeNetwork(node);
      link.restLength = Math.hypot(node.tx - parent.tx, node.ty - parent.ty);
      createNodeElement(node);
      node.x = parent.x;
      node.y = parent.y;
      addMinimapDot(node);
      setTimeout(() => growNode(node, parent), reducedMotion ? 0 : index * 45);
    });
    if (layoutMode === 'timeline') {
      rescaleNodes();
      applyLayoutTargets();
      drawAxis();
      setTimeout(() => morphToTargets(700), reducedMotion ? 0 : repos.length * 45 + 700);
    } else {
      setTimeout(() => {
        refreshLinkLengths();
        wakeSimulation(.8);
      }, reducedMotion ? 0 : repos.length * 45 + 700);
    }
    applyVisibility();
  };
  const collapseNode = (parent) => {
    const removing = nodes.filter((node) => node.parentId === parent.id);
    removing.forEach((node) => {
      node.element.remove();
      node.minimapDot?.remove();
      nodeMap.delete(node.id);
    });
    for (let i = links.length - 1; i >= 0; i -= 1) {
      if (removing.some((node) => node.id === links[i].target)) {
        links[i].element.remove();
        links.splice(i, 1);
      }
    }
    for (let i = nodes.length - 1; i >= 0; i -= 1) {
      if (removing.includes(nodes[i])) nodes.splice(i, 1);
    }
    if (layoutMode === 'timeline') {
      rescaleNodes();
      applyLayoutTargets();
      drawAxis();
      morphToTargets(600);
    } else wakeSimulation(.4);
    applyVisibility();
  };

  // ---------------------------------------------------------------- layouts
  const setLayout = (mode) => {
    if (mode === layoutMode) return;
    layoutMode = mode;
    graph.classList.toggle('is-timeline', mode === 'timeline');
    layoutButtons.forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.layout === mode)));
    rescaleNodes();
    applyLayoutTargets();
    drawAxis();
    clearPath(false);
    stopGlide();
    glideView({ ...defaultView });
    morphToTargets();
    applyVisibility();
  };
  layoutButtons.forEach((button) => button.addEventListener('click', () => {
    stopTour();
    setLayout(button.dataset.layout);
  }));

  // ---------------------------------------------------------------- guided tour
  const tourText = tourBar?.querySelector('[data-tour-text]');
  const tourStep = tourBar?.querySelector('[data-tour-step]');
  const tourProgress = tourBar?.querySelector('[data-tour-progress]');
  const showTourStep = (index) => {
    if (!tour) return;
    clearTimeout(tour.timer);
    tour.index = Math.max(0, Math.min(TOUR.length - 1, index));
    const [id, text] = TOUR[tour.index];
    selectedId = id;
    tourStep.textContent = `${tour.index + 1} / ${TOUR.length}`;
    tourText.textContent = text;
    tourBar.querySelector('[data-tour-prev]').disabled = tour.index === 0;
    tourBar.querySelector('[data-tour-next]').textContent = tour.index === TOUR.length - 1 ? 'Done' : 'Next';
    applyVisibility();
    if (id) {
      const node = nodeMap.get(id);
      ripple(node);
      const related = [...neighbours(id)].map((item) => nodeMap.get(item));
      // Frame the step in the space above the caption bar rather than behind it.
      const stageHeight = graphStage.getBoundingClientRect().height || 1;
      const covered = (tourBar.offsetHeight + 24) / stageHeight;
      glideView(viewFor([node, ...related], mobileView ? 90 : 80, covered), 900);
    } else glideView({ ...defaultView }, 900);
    // Restart the progress bar for this step.
    tourProgress.style.transition = 'none';
    tourProgress.style.transform = 'scaleX(0)';
    void tourProgress.offsetWidth;
    tourProgress.style.transition = `transform ${TOUR_STEP_MS}ms linear`;
    tourProgress.style.transform = 'scaleX(1)';
    if (tour.index < TOUR.length - 1) tour.timer = setTimeout(() => showTourStep(tour.index + 1), TOUR_STEP_MS);
  };
  const startTour = () => {
    if (!tourBar) return;
    if (layoutMode !== 'network') setLayout('network');
    closePanel(false);
    clearPath(false);
    hideCard();
    tour = { index: 0, timer: null };
    graph.classList.add('is-touring');
    tourBar.hidden = false;
    tourButton?.setAttribute('aria-pressed', 'true');
    showTourStep(0);
  };
  function stopTour() {
    if (!tour) return;
    clearTimeout(tour.timer);
    tour = null;
    selectedId = null;
    graph.classList.remove('is-touring');
    if (tourBar) tourBar.hidden = true;
    tourButton?.setAttribute('aria-pressed', 'false');
    applyVisibility();
  }
  tourButton?.addEventListener('click', () => (tour ? stopTour() : startTour()));
  tourBar?.querySelector('[data-tour-prev]')?.addEventListener('click', () => showTourStep(tour.index - 1));
  tourBar?.querySelector('[data-tour-next]')?.addEventListener('click', () => {
    if (tour.index === TOUR.length - 1) stopTour();
    else showTourStep(tour.index + 1);
  });
  tourBar?.querySelector('[data-tour-stop]')?.addEventListener('click', () => stopTour());

  // ---------------------------------------------------------------- minimap
  const minimapView = minimap ? makeSvg('rect', { class: 'minimap-view' }) : null;
  const addMinimapDot = (node) => {
    if (!minimap) return;
    node.minimapDot = makeSvg('circle', { class: 'minimap-dot', 'data-kind': node.kind, r: Math.max(6, node.renderRadius * .8) });
    minimap.insertBefore(node.minimapDot, minimapView);
  };
  const setupMinimap = () => {
    if (!minimap) return;
    minimap.setAttribute('viewBox', `0 0 ${width} ${height}`);
    minimap.replaceChildren(makeSvg('rect', { class: 'minimap-frame', width, height }), minimapView);
    nodes.forEach(addMinimapDot);
  };
  function updateMinimapNodes() {
    if (!minimap || minimap.hasAttribute('hidden')) return;
    nodes.forEach((node) => {
      node.minimapDot?.setAttribute('cx', node.x.toFixed(0));
      node.minimapDot?.setAttribute('cy', node.y.toFixed(0));
    });
  }
  function updateMinimapView() {
    if (!minimap || !minimapView) return;
    const zoomed = currentView.width < defaultView.width * .9
      || Math.abs(currentView.x - defaultView.x) > 40 || Math.abs(currentView.y - defaultView.y) > 40;
    // An <svg> has no .hidden property, so toggle the attribute itself.
    if (minimap.hasAttribute('hidden') === zoomed) {
      minimap.toggleAttribute('hidden', !zoomed);
      if (zoomed) updateMinimapNodes();
    }
    minimapView.setAttribute('x', currentView.x);
    minimapView.setAttribute('y', currentView.y);
    minimapView.setAttribute('width', currentView.width);
    minimapView.setAttribute('height', currentView.height);
  }
  if (minimap) {
    let steering = false;
    const steer = (event) => {
      const point = minimap.createSVGPoint();
      point.x = event.clientX;
      point.y = event.clientY;
      const target = point.matrixTransform(minimap.getScreenCTM().inverse());
      stopGlide();
      setView({ ...currentView, x: target.x - currentView.width / 2, y: target.y - currentView.height / 2 });
    };
    minimap.addEventListener('pointerdown', (event) => {
      steering = true;
      minimap.setPointerCapture(event.pointerId);
      steer(event);
    });
    minimap.addEventListener('pointermove', (event) => { if (steering) steer(event); });
    minimap.addEventListener('pointerup', () => { steering = false; });
  }

  // ---------------------------------------------------------------- node events
  // Pointer capture can fail for a pointer the browser no longer tracks; dragging still works without it.
  const capture = (element, pointerId) => {
    try {
      element.setPointerCapture(pointerId);
    } catch {
      /* not an active pointer */
    }
  };

  const clientToGraph = (event) => {
    const point = graph.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    return point.matrixTransform(graph.getScreenCTM().inverse());
  };

  const zoomToNode = (node) => {
    const viewWidth = Math.max(300, currentView.width * .55);
    const viewHeight = viewWidth * aspectRatio();
    inspectNode(node, false, { x: node.x - viewWidth / 2, y: node.y - viewHeight / 2, width: viewWidth, height: viewHeight });
  };

  const setPreview = (ids, source = null) => {
    previewIds = ids;
    previewSource = source;
    applyVisibility();
  };

  function bindNodeEvents(node) {
    node.element.addEventListener('click', (event) => {
      if (dragging || node.moved) return;
      if (event.shiftKey && selectedId && selectedId !== node.id) showPath(selectedId, node.id);
      else if (event.shiftKey && pathState) showPath(pathState.ids[0], node.id);
      else inspectNode(node);
    });
    node.element.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        if (event.shiftKey && selectedId && selectedId !== node.id) showPath(selectedId, node.id);
        else inspectNode(node, true);
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
        // Only consider nodes within roughly 45° of the arrow's direction.
        if (across > along * 1.1) return;
        const score = along + across * 2;
        if (score < bestScore) { bestScore = score; best = other; }
      });
      best?.element.focus();
    });
    const preview = (on, withCard) => {
      if (dragging) return;
      if (on) {
        setPreview(neighbours(node.id), node.id);
        if (withCard) showCard(node);
      } else if (previewSource === node.id) {
        setPreview(null);
        hideCard();
      }
    };
    node.element.addEventListener('pointerenter', (event) => { if (event.pointerType === 'mouse') preview(true, true); });
    node.element.addEventListener('pointerleave', () => preview(false));
    node.element.addEventListener('focus', () => preview(true, node.element.matches(':focus-visible')));
    node.element.addEventListener('blur', () => preview(false));
    node.element.addEventListener('dblclick', (event) => {
      event.preventDefault();
      zoomToNode(node);
    });
    node.element.addEventListener('pointerdown', (event) => {
      stopTour();
      if (node.growthFrame) {
        cancelAnimationFrame(node.growthFrame);
        node.growthFrame = null;
        node.progress = 1;
      }
      hideCard();
      const point = clientToGraph(event);
      dragging = node;
      dragging.moved = false;
      dragTrail = [{ x: point.x, y: point.y, t: performance.now() }];
      pointerOffset = { x: node.x - point.x, y: node.y - point.y };
      capture(node.element, event.pointerId);
      graph.classList.add('is-dragging');
    });
    node.element.addEventListener('pointermove', (event) => {
      if (dragging !== node) return;
      const point = clientToGraph(event);
      if (Math.hypot(point.x + pointerOffset.x - node.x, point.y + pointerOffset.y - node.y) > 2) node.moved = true;
      node.x = clampX(node, point.x + pointerOffset.x);
      node.y = clampY(node, point.y + pointerOffset.y);
      dragTrail.push({ x: point.x, y: point.y, t: performance.now() });
      if (dragTrail.length > 5) dragTrail.shift();
      wakeSimulation(1);
      requestRender();
    });
    node.element.addEventListener('pointerup', (event) => {
      dragging = null;
      graph.classList.remove('is-dragging');
      if (node.moved) {
        // Let a flicked node carry its momentum into the physics.
        const first = dragTrail[0];
        const last = dragTrail.at(-1);
        const elapsed = Math.max(16, last.t - first.t);
        if (layoutMode === 'network' && elapsed < 180) {
          node.vx = Math.max(-MAX_SPEED, Math.min(MAX_SPEED, ((last.x - first.x) / elapsed) * 16));
          node.vy = Math.max(-MAX_SPEED, Math.min(MAX_SPEED, ((last.y - first.y) / elapsed) * 16));
        }
        wakeSimulation(1);
      }
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
  }

  // ---------------------------------------------------------------- build the graph
  measureOverlays();
  applyLayoutTargets();
  nodes.forEach(createNodeElement);
  // Web fonts arrive after first paint; refit the lettering once they are in.
  document.fonts?.ready.then(() => nodes.forEach(sizeLabel));
  links.forEach(createEdgeElement);
  setupMinimap();
  setView(currentView);

  hulls.forEach((hull) => {
    const zoomToCluster = () => {
      stopTour();
      const members = clusterMembers(hull);
      if (members.length) glideView(viewFor(members, 50), 600);
    };
    hull.label.addEventListener('click', zoomToCluster);
    hull.label.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        zoomToCluster();
      }
    });
    const previewCluster = (on) => {
      if (on) setPreview(new Set(clusterMembers(hull).map((node) => node.id)));
      else setPreview(null);
      hull.group.classList.toggle('is-active', on);
    };
    hull.label.addEventListener('pointerenter', () => previewCluster(true));
    hull.label.addEventListener('pointerleave', () => previewCluster(false));
    hull.label.addEventListener('focus', () => previewCluster(true));
    hull.label.addEventListener('blur', () => previewCluster(false));
  });

  // ---------------------------------------------------------------- canvas gestures
  const touches = new Map();
  let pinch = null;
  let pressStart = null;
  // A shift-click would otherwise extend any text selection on the page up to the graph.
  graph.addEventListener('mousedown', (event) => {
    if (event.shiftKey) event.preventDefault();
  });
  graph.addEventListener('pointerdown', (event) => {
    if (event.target.closest('.graph-node, .hull-label')) return;
    stopTour();
    stopGlide();
    hideCard();
    pressStart = { x: event.clientX, y: event.clientY };
    touches.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (touches.size === 2) {
      const [a, b] = [...touches.values()];
      panning = null;
      pressStart = null;
      pinch = { distance: Math.hypot(a.x - b.x, a.y - b.y) || 1, view: { ...currentView }, centre: clientToGraph({ clientX: (a.x + b.x) / 2, clientY: (a.y + b.y) / 2 }) };
      capture(graph, event.pointerId);
      return;
    }
    panning = { pointerId: event.pointerId, clientX: event.clientX, clientY: event.clientY, view: { ...currentView } };
    capture(graph, event.pointerId);
    graph.classList.add('is-dragging');
  });
  graph.addEventListener('pointermove', (event) => {
    if (touches.has(event.pointerId)) touches.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pinch && touches.size === 2) {
      const [a, b] = [...touches.values()];
      const viewWidth = pinch.view.width * (pinch.distance / (Math.hypot(a.x - b.x, a.y - b.y) || 1));
      const xRatio = (pinch.centre.x - pinch.view.x) / pinch.view.width;
      const yRatio = (pinch.centre.y - pinch.view.y) / pinch.view.height;
      setView({ x: pinch.centre.x - xRatio * viewWidth, y: pinch.centre.y - yRatio * viewWidth * aspectRatio(), width: viewWidth });
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
    // A tap on empty canvas (no drag) clears the current selection or path.
    if (pressStart && event.type === 'pointerup' && Math.hypot(event.clientX - pressStart.x, event.clientY - pressStart.y) < 5) {
      if (pathState) clearPath();
      else if (selectedId) closePanel(false);
    }
    pressStart = null;
    panning = null;
    graph.classList.remove('is-dragging');
  };
  graph.addEventListener('pointerup', stopPanning);
  graph.addEventListener('pointercancel', stopPanning);

  graph.addEventListener('wheel', (event) => {
    event.preventDefault();
    zoomAt(event.deltaY > 0 ? 1.12 : .89, clientToGraph(event));
  }, { passive: false });
  document.querySelectorAll('[data-graph-zoom]').forEach((button) => {
    button.addEventListener('click', () => {
      if (button.dataset.graphZoom === 'reset') resetView();
      else zoomAt(button.dataset.graphZoom === 'in' ? .8 : 1.25);
    });
  });

  document.querySelector('[data-panel-close]')?.addEventListener('click', () => closePanel());

  // ---------------------------------------------------------------- legend
  legendButtons.forEach((button) => {
    const kind = button.dataset.legend;
    const show = () => {
      legendKind = kind;
      applyVisibility();
    };
    const hide = () => {
      if (legendPinned) return;
      legendKind = null;
      applyVisibility();
    };
    button.addEventListener('pointerenter', show);
    button.addEventListener('focus', show);
    button.addEventListener('pointerleave', hide);
    button.addEventListener('blur', hide);
    button.addEventListener('click', () => {
      const pin = !(legendPinned && legendKind === kind);
      legendPinned = pin;
      legendKind = pin ? kind : null;
      legendButtons.forEach((item) => item.setAttribute('aria-pressed', String(pin && item === button)));
      applyVisibility();
    });
  });

  // ---------------------------------------------------------------- filters: dim, then frame what's left
  document.querySelectorAll('[data-filter]').forEach((button) => {
    button.addEventListener('click', () => {
      stopTour();
      clearPath(false);
      activeFilter = button.dataset.filter;
      document.querySelectorAll('[data-filter]').forEach((item) => {
        const active = item === button;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-pressed', String(active));
      });
      closePanel(false);
      applyVisibility();
      const matching = matchingIds();
      glideView(activeFilter === 'all' ? { ...defaultView } : viewFor(nodes.filter((node) => matching.has(node.id)), 50), 650);
    });
  });

  // ---------------------------------------------------------------- search
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

  const hideSearchResults = () => {
    searchResults.hidden = true;
    searchInput.setAttribute('aria-expanded', 'false');
  };

  const selectSearchItem = (item) => {
    hideSearchResults();
    const node = nodeMap.get(item.nodeId || item.id);
    if (node) {
      const related = [...neighbours(node.id)].map((id) => nodeMap.get(id));
      inspectNode(node, false, focusView(node, related));
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
    stopTour();
    clearPath(false);
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
    searchMatches = new Set(rankedResults.map((item) => item.nodeId || item.id).filter((id) => nodeMap.has(id)));
    // Nothing close: every node dims and the list says so rather than showing random items.
    if (rankedResults.length) renderSearchResults();
    else showNoResults(event.target.value.trim());
    applyVisibility();
  });

  const searchToggle = document.querySelector('[data-search-toggle]');
  const toolbar = searchToggle?.closest('.atlas-toolbar');
  const setSearchOpen = (open) => {
    if (!toolbar) return;
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

  // ---------------------------------------------------------------- keyboard shortcuts
  const openShortcuts = () => {
    if (!shortcuts) return;
    if (shortcuts.open) shortcuts.close();
    else shortcuts.showModal();
  };
  document.querySelector('[data-help]')?.addEventListener('click', openShortcuts);
  shortcuts?.querySelector('[data-shortcuts-close]')?.addEventListener('click', () => shortcuts.close());
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      if (tour) stopTour();
      else if (pathState) clearPath();
      else if (panel.classList.contains('is-open') && !event.target.closest?.('.atlas-search-wrap')) closePanel();
      return;
    }
    const typing = event.target.closest?.('input, textarea, select, [contenteditable="true"]');
    if (typing || event.metaKey || event.ctrlKey || event.altKey || shortcuts?.open) return;
    const actions = {
      '/': () => {
        setSearchOpen(true);
        searchInput.focus();
      },
      '+': () => zoomAt(.8),
      '=': () => zoomAt(.8),
      '-': () => zoomAt(1.25),
      '0': () => resetView(),
      t: () => setLayout(layoutMode === 'network' ? 'timeline' : 'network'),
      p: () => (tour ? stopTour() : startTour()),
      '?': openShortcuts
    };
    const action = actions[event.key];
    if (!action) return;
    event.preventDefault();
    action();
  });

  // ---------------------------------------------------------------- entrance
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
    // Edges draw themselves out from the parent as each node arrives.
    links.forEach((link) => {
      if (nodeMap.get(link.source)?.spawned && nodeMap.get(link.target)?.spawned) link.element.classList.add('is-visible');
    });
    requestRender();
    if (reducedMotion) return;

    const startTime = performance.now();
    const duration = 700;
    const animate = (now) => {
      const elapsed = Math.min(1, (now - startTime) / duration);
      const eased = 1 - Math.pow(1 - elapsed, 3);
      node.x = startX + (targetX - startX) * eased;
      node.y = startY + (targetY - startY) * eased;
      node.progress = eased;
      requestRender();
      if (elapsed < 1) node.growthFrame = requestAnimationFrame(animate);
      else node.growthFrame = null;
    };
    node.growthFrame = requestAnimationFrame(animate);
  };

  const spawn = () => {
    const order = ['ganesh', 'iiith', 'samsung', 'virtual-labs', 'molecular-ai', 'multimodal', 'biosensing', 'robotics', 'neuro-ai', 'software', 'smen', 'molgpt', 'bias-study', 'beds', 'jepa', 'manga', 'molvis', 'paper-spectra', 'paper-generative', 'paper-bias'];
    const parents = {
      iiith: 'ganesh', samsung: 'ganesh', 'virtual-labs': 'ganesh',
      'molecular-ai': 'ganesh', multimodal: 'ganesh', 'neuro-ai': 'ganesh', software: 'ganesh',
      biosensing: 'samsung', robotics: 'samsung', smen: 'molecular-ai', molgpt: 'molecular-ai',
      'bias-study': 'molecular-ai', beds: 'neuro-ai', jepa: 'robotics', manga: 'software', molvis: 'software',
      'paper-spectra': 'smen', 'paper-generative': 'molgpt', 'paper-bias': 'bias-study'
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
      spawnDone = true;
      graph.classList.add('is-ready');
      if (location.hash) openFromHash();
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
  window.addEventListener('hashchange', () => { if (spawnDone) openFromHash(); });

  // ---------------------------------------------------------------- resize
  const graphResizeObserver = new ResizeObserver(() => {
    const nextLayout = measureGraph();
    if (Math.abs(nextLayout.width - width) < 1 && Math.abs(nextLayout.height - height) < 1 && nextLayout.mobile === mobileView) {
      measureOverlays();
      return;
    }
    width = nextLayout.width;
    height = nextLayout.height;
    mobileView = nextLayout.mobile;
    measureOverlays();
    if (morphFrame) cancelAnimationFrame(morphFrame);
    morphFrame = null;
    nodes.forEach((node) => {
      if (node.growthFrame) cancelAnimationFrame(node.growthFrame);
      node.growthFrame = null;
      node.tweening = null;
    });
    rescaleNodes();
    applyLayoutTargets();
    nodes.forEach((node) => {
      node.x = node.tx;
      node.y = node.ty;
      node.vx = 0;
      node.vy = 0;
      node.progress = node.spawned ? 1 : 0;
      shapeNode(node);
    });
    refreshLinkLengths();
    defaultView = { x: 0, y: 0, width, height };
    setupMinimap();
    drawAxis();
    stopGlide();
    setView(defaultView);
    render();
    syncParticles();
    if (selectedId) keepClearOfPanel(nodeMap.get(selectedId));
    wakeSimulation(.5);
  });
  graphResizeObserver.observe(graphStage);
})();
