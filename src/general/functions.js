
export default function url(path) {
    const base = document.getElementsByTagName('base')[0];

    if (!base) {
        return path;
    }

    const href = base.getAttribute('href');

    if (!href) {
        return path;
    }

    return href.replace(/\/+$/, '') + '/' + path.replace(/^\/+/, '');
}
