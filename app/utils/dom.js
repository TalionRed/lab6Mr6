export function createElement(tag, props = {}, children = []) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (k === 'className') el.className = v;
    else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
    else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2).toLowerCase(), v);
    else if (v !== undefined && v !== null) el.setAttribute(k, v);
  }
  const append = (child) => {
    if (child === null || child === undefined) return;
    if (Array.isArray(child)) child.forEach(append);
    else if (child instanceof Node) el.appendChild(child);
    else el.appendChild(document.createTextNode(String(child)));
  };
  append(children);
  return el;
}

export function clearChildren(el) {
  while (el.firstChild) el.removeChild(el.firstChild);
}

export function debounce(fn, wait = 300) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(null, args), wait);
  };
}


