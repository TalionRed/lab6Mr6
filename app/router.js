let onRoute;

export function initRouter(callback) {
  onRoute = () => { callback(); };
  window.addEventListener('hashchange', onRoute);
  if (!location.hash) {
    navigateTo('#users', true);
  }
}

export function navigateTo(hash, replace = false) {
  if (replace) location.replace(hash);
  else location.hash = hash;
}


