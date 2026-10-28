const state = { data: null, query: '', filter: 'all' };
const $ = (selector, root = document) => root.querySelector(selector);

function statusLabel(status) {
  return status === 'documented' ? '資料上の記録' : '未検証';
}

function renderClaims() {
  const target = $('[data-claims]');
  const q = state.query.toLowerCase();
  const claims = state.data.claims.filter((claim) => {
    const matchesFilter = state.filter === 'all' || claim.status === state.filter;
    const haystack = [claim.title, claim.summary, claim.evidence, claim.nextAction].join(' ').toLowerCase();
    return matchesFilter && haystack.includes(q);
  });
  target.replaceChildren(...claims.map((claim) => {
    const article = document.createElement('article');
    article.className = `claim-card status-${claim.status}`;
    article.innerHTML = `<div class="claim-top"><span class="status-badge">${statusLabel(claim.status)}</span><span class="claim-id">${claim.id}</span></div><h3>${claim.title}</h3><p>${claim.summary}</p><dl><div><dt>出典</dt><dd>${claim.evidence}</dd></div><div><dt>次の確認</dt><dd>${claim.nextAction}</dd></div></dl>`;
    return article;
  }));
  if (!claims.length) target.innerHTML = '<p class="empty-state">該当する主張がありません。</p>';
}

function renderActions() {
  const target = $('[data-actions]');
  target.replaceChildren(...state.data.priorityActions.map((action) => {
    const article = document.createElement('article');
    article.className = `action-card action-${action.status}`;
    article.innerHTML = `<span class="action-number">0${action.priority}</span><div><div class="action-meta"><span>${action.status === 'done' ? '完了' : action.status === 'in_progress' ? '進行中' : '未着手'}</span></div><h3>${action.title}</h3><p>${action.detail}</p></div>`;
    return article;
  }));
}

async function init() {
  const response = await fetch('/data/evidence-summary.json');
  state.data = await response.json();
  ['retrievedFiles', 'assetRowCount', 'sourceCount'].forEach((key) => { const node = $(`[data-metric="${key}"]`); node.textContent = state.data[key].toLocaleString('ja-JP'); });
  renderClaims(); renderActions();
  $('#claim-search').addEventListener('input', (event) => { state.query = event.target.value; renderClaims(); });
  $('#claim-filter').addEventListener('change', (event) => { state.filter = event.target.value; renderClaims(); });
}
init().catch((error) => { $('[data-claims]').innerHTML = `<p class="empty-state">台帳データを読み込めませんでした: ${error.message}</p>`; });
