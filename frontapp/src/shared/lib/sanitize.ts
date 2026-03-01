export function sanitizeHtml(html: string): string {
    const allowedTags = [
        'p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'ul', 'ol', 'li', 'a', 'img', 'blockquote', 'code', 'pre', 'span',
        'div', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'figure', 'figcaption'
    ];
    
    const allowedAttrs: Record<string, string[]> = {
        'a': ['href', 'title', 'target'],
        'img': ['src', 'alt', 'title', 'width', 'height'],
        'td': ['colspan', 'rowspan'],
        'th': ['colspan', 'rowspan'],
    };

    if (!html) return '';

    const doc = new DOMParser().parseFromString(html, 'text/html');
    
    function cleanNode(node: Node): string {
        if (node.nodeType === Node.TEXT_NODE) {
            return node.textContent || '';
        }
        
        if (node.nodeType !== Node.ELEMENT_NODE) {
            return '';
        }

        const element = node as Element;
        const tagName = element.tagName.toLowerCase();
        
        if (!allowedTags.includes(tagName)) {
            return Array.from(element.childNodes).map(cleanNode).join('');
        }

        const attrs = allowedAttrs[tagName] || [];
        const filteredAttrs = attrs
            .map(attr => {
                const value = element.getAttribute(attr);
                return value ? `${attr}="${value.replace(/"/g, '&quot;')}"` : null;
            })
            .filter(Boolean)
            .join(' ');

        const children = Array.from(element.childNodes).map(cleanNode).join('');
        
        if (['br', 'hr', 'img'].includes(tagName)) {
            return `<${tagName} ${filteredAttrs} />`.replace(/\s+\/>/, ' />');
        }
        
        return `<${tagName} ${filteredAttrs}>${children}</${tagName}>`;
    }

    return Array.from(doc.body.childNodes).map(cleanNode).join('');
}
