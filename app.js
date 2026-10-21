const mapData = {
  nodes: [
    { id: 'nexus', title: 'Project Nexus', label: 'THE CONNECTIVE CORE', category: 'core', x: 600, y: 315, radius: 74, description: '点在する要素をひとつの見取り図へ接続する、Project Nexusの中心概念です。', links: ['01 / CONNECT', '04 / EVOLVE'] },
    { id: 'purpose', title: 'Purpose', label: 'WHY IT EXISTS', category: 'core', x: 365, y: 175, radius: 49, description: '何をつなぐのか、なぜ今つなぐのか。全体の判断軸を置く起点です。', links: ['nexus', 'identity'] },
    { id: 'identity', title: 'Identity', label: 'POINT OF VIEW', category: 'core', x: 360, y: 470, radius: 49, description: 'Project Nexusが大切にする姿勢と、他の要素を見渡す視点を定義します。', links: ['nexus', 'purpose'] },
    { id: 'experience', title: 'Experience', label: 'HOW IT FEELS', category: 'experience', x: 880, y: 150, radius: 58, description: '触れた人が理解し、探索し、次の行動へ移るまでの体験を設計します。', links: ['nexus', 'interface', 'story'] },
    { id: 'interface', title: 'Interface', label: 'MAKE IT LEGIBLE', category: 'experience', x: 1040, y: 285, radius: 45, description: '複雑な関係性を、読みやすく操作できる形へ翻訳する接続面です。', links: ['experience', 'system'] },
    { id: 'story', title: 'Story', label: 'MAKE IT MATTER', category: 'experience', x: 885, y: 500, radius: 46, description: '点在する情報に意味の流れを与え、共感と理解を生み出します。', links: ['experience', 'culture'] },
    { id: 'system', title: 'System', label: 'HOW IT WORKS', category: 'system', x: 350, y: 320, radius: 57, description: 'ノード、データ、ルールを組み合わせ、更新され続ける構造を支えます。', links: ['nexus', 'interface', 'ritual'] },
    { id: 'ritual', title: 'Ritual', label: 'KEEP IT MOVING', category: 'system', x: 170, y: 315, radius: 44, description: '一度つないで終わりにせず、見直しと対話を日常のリズムへ組み込みます。', links: ['system', 'culture'] },
    { id: 'growth', title: 'Growth', label: 'WHAT IT ENABLES', category: 'growth', x: 820, y: 340, radius: 57, description: 'つながりから生まれた気づきを、次の可能性と小さな実験へ展開します。', links: ['nexus', 'signal', 'culture'] },
    { id: 'signal', title: 'Signal', label: 'NOTICE THE SHIFT', category: 'growth', x: 1020, y: 440, radius: 44, description: '変化の兆しを見つけ、点ではなく流れとして読み取るための視点です。', links: ['growth', 'story'] },
    { id: 'culture', title: 'Culture', label: 'MAKE IT SHARED', category: 'growth', x: 610, y: 530, radius: 52, description: '個別の知見を共有可能な言葉に変え、接続をひらかれたものにします。', links: ['growth', 'ritual', 'story'] }
  ],
  connections: [
    ['nexus', 'purpose'], ['nexus', 'identity'], ['nexus', 'experience'], ['nexus', 'system'], ['nexus', 'growth'], ['nexus', 'culture'],
    ['purpose', 'system'], ['identity', 'system'], ['experience', 'interface'], ['experience', 'story'], ['interface', 'system'],
    ['story', 'culture'], ['system', 'ritual'], ['ritual', 'culture'], ['growth', 'signal'], ['growth', 'culture'], ['signal', 'story']
  ]
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const nodeById = new Map(mapData.nodes.map((node) => [node.id, node]));
const state = { filter: 'all', selected: 'nexus', camera: { x: 0, y: 0, scale: 1 }, dragging: false, lastPointer: null };
const colors = { core: '#b9ff5a', experience: '#62d8ff', system: '#a98bff', growth: '#ffba82' };

function createSvgElement(tag, attrs = {}) {
  const element = document.createElementNS('http://www.w3.org/2000/svg', tag);
  Object.entries(attrs).forEach(([key, value]) => element.setAttribute(key, value));
  return element;
}

function renderMap() {
  const linesGroup = $('[data-map-lines]');
  const nodesGroup = $('[data-map-nodes]');
  linesGroup.replaceChildren();
  nodesGroup.replaceChildren();

  mapData.connections.forEach(([fromId, toId]) => {
    const from = nodeById.get(fromId);
    const to = nodeById.get(toId);
    const path = createSvgElement('path', {
      d: `M ${from.x} ${from.y} C ${(from.x + to.x) / 2} ${from.y}, ${(from.x + to.x) / 2} ${to.y}, ${to.x} ${to.y}`,
      'data-from': fromId,
      'data-to': toId,
      'aria-hidden': 'true'
    });
    linesGroup.append(path);
  });

  mapData.nodes.forEach((node) => {
    const group = createSvgElement('g', {
      class: `map-node node-${node.category}`,
      tabindex: '0',
      role: 'button',
      'aria-label': `${node.title}。${node.label}`,
      'data-node-id': node.id
    });
    const pulse = createSvgElement('circle', { class: 'node-pulse', cx: node.x, cy: node.y, r: node.radius + 12 });
    const circle = createSvgElement('circle', { class: 'node-ring', cx: node.x, cy: node.y, r: node.radius });
    const category = createSvgElement('text', { class: 'node-category', x: node.x, y: node.y - (node.radius > 60 ? 17 : 12) });
    category.textContent = node.category.toUpperCase();
    const title = createSvgElement('text', { class: 'node-title', x: node.x, y: node.y + 4 });
    title.textContent = node.title;
    const label = createSvgElement('text', { class: 'node-label', x: node.x, y: node.y + (node.radius > 60 ? 26 : 21) });
    label.textContent = node.label;
    group.append(pulse, circle, category, title, label);
    group.addEventListener('click', () => selectNode(node.id));
    group.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); selectNode(node.id); }
    });
    nodesGroup.append(group);
  });
  updateMapVisibility();
}

function isVisible(node) { return state.filter === 'all' || node.category === state.filter; }

function updateMapVisibility() {
  $$('.map-node').forEach((element) => {
    const node = nodeById.get(element.dataset.nodeId);
    const visible = isVisible(node);
    element.classList.toggle('is-dim', !visible);
    element.setAttribute('aria-hidden', visible ? 'false' : 'true');
    element.setAttribute('tabindex', visible ? '0' : '-1');
  });
  $$('[data-map-lines] path').forEach((line) => {
    const visible = isVisible(nodeById.get(line.dataset.from)) && isVisible(nodeById.get(line.dataset.to));
    line.style.opacity = visible ? '0.8' : '0.08';
  });
  $$('.filter-button').forEach((button) => {
    const active = button.dataset.filter === state.filter;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
  });
}

function selectNode(id) {
  const node = nodeById.get(id);
  if (!node) return;
  state.selected = id;
  $$('.map-node').forEach((element) => element.classList.toggle('is-active', element.dataset.nodeId === id));
  const detail = $('[data-node-detail]');
  const connected = node.links.map((link) => nodeById.get(link)).filter(Boolean);
  detail.innerHTML = `<p class="detail-kicker">${node.category.toUpperCase()} / SELECTED NODE</p><h3 class="detail-title">${node.title}</h3><p class="detail-description">${node.description}</p><div class="detail-links" aria-label="関連ノード">${connected.map((related) => `<button class="detail-link" type="button" data-related-node="${related.id}">${related.title}</button>`).join('')}</div>`;
  $$('[data-related-node]', detail).forEach((button) => button.addEventListener('click', () => selectNode(button.dataset.relatedNode)));
}

function updateCamera() {
  $('[data-map-camera]').setAttribute('transform', `translate(${state.camera.x} ${state.camera.y}) scale(${state.camera.scale})`);
  $('[data-zoom-value]').value = `${Math.round(state.camera.scale * 100)}%`;
  $('[data-zoom-value]').textContent = `${Math.round(state.camera.scale * 100)}%`;
}

function resetCamera() { state.camera = { x: 0, y: 0, scale: 1 }; updateCamera(); }
function zoomBy(amount, origin = { x: 600, y: 325 }) {
  const oldScale = state.camera.scale;
  const newScale = Math.min(1.8, Math.max(.65, oldScale + amount));
  const ratio = newScale / oldScale;
  state.camera.x = origin.x - (origin.x - state.camera.x) * ratio;
  state.camera.y = origin.y - (origin.y - state.camera.y) * ratio;
  state.camera.scale = newScale;
  updateCamera();
}

function clientToSvg(event) {
  const svg = $('[data-map-svg]');
  const point = svg.createSVGPoint();
  point.x = event.clientX; point.y = event.clientY;
  const matrix = svg.getScreenCTM();
  if (!matrix) return { x: 600, y: 325 };
  return point.matrixTransform(matrix.inverse());
}

function setupInteractions() {
  const stage = $('[data-map-stage]');
  stage.addEventListener('pointerdown', (event) => {
    if (event.target.closest('.map-node')) return;
    state.dragging = true; state.lastPointer = { x: event.clientX, y: event.clientY };
    stage.classList.add('is-dragging'); stage.setPointerCapture(event.pointerId);
  });
  stage.addEventListener('pointermove', (event) => {
    if (!state.dragging) return;
    const rect = stage.getBoundingClientRect();
    const factor = 1200 / rect.width / state.camera.scale;
    state.camera.x += (event.clientX - state.lastPointer.x) * factor;
    state.camera.y += (event.clientY - state.lastPointer.y) * factor;
    state.lastPointer = { x: event.clientX, y: event.clientY };
    updateCamera();
  });
  const stopDragging = () => { state.dragging = false; stage.classList.remove('is-dragging'); };
  stage.addEventListener('pointerup', stopDragging); stage.addEventListener('pointercancel', stopDragging); stage.addEventListener('pointerleave', () => { if (state.dragging) stopDragging(); });
  stage.addEventListener('wheel', (event) => { event.preventDefault(); zoomBy(event.deltaY < 0 ? .08 : -.08, clientToSvg(event)); }, { passive: false });
  stage.addEventListener('keydown', (event) => { if (event.key === 'Escape') { resetCamera(); stage.blur(); } });
  $$('.filter-button').forEach((button) => button.addEventListener('click', () => { state.filter = button.dataset.filter; updateMapVisibility(); if (!isVisible(nodeById.get(state.selected))) selectNode('nexus'); }));
  $('[data-reset]').addEventListener('click', resetCamera);
  $('[data-zoom="in"]').addEventListener('click', () => zoomBy(.1));
  $('[data-zoom="out"]').addEventListener('click', () => zoomBy(-.1));
}

function setupHeader() {
  const header = $('[data-header]');
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 12);
  onScroll(); window.addEventListener('scroll', onScroll, { passive: true });
}

renderMap(); selectNode('nexus'); setupInteractions(); setupHeader(); updateCamera();
$('[data-year]').textContent = new Date().getFullYear();
