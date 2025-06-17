/**
 * 支持保留安全HTML标签的XSS过滤
 */
/**
 * XSS 防御过滤函数
 * @param {string} input - 需要过滤的文本
 * @param {Object} [options] - 配置选项
 * @param {boolean} [options.escapeHtml=true] - 是否转义HTML标签
 * @param {boolean} [options.stripTags=false] - 是否完全删除HTML标签
 * @param {Array} [options.allowedTags=[]] - 允许保留的HTML标签（如['b','i']）
 * @param {Array} [options.allowedAttributes={}] - 允许保留的属性（如{'a':['href']}）
 * @returns {string} - 安全处理后的文本
 */
export function filterRichText(input, options = {}) {
  if (typeof input !== "string") return "";

  // 默认配置
  const config = {
    escapeHtml: true,
    stripTags: false,
    allowedTags: [],
    allowedAttributes: {},
    ...options,
  };

  // 1. 移除或保留特定HTML标签
  let output = input;
  if (config.stripTags) {
    output = output.replace(/<[^>]*>/g, "");
  } else if (config.allowedTags.length > 0) {
    const tagPattern = new RegExp(`<(/?)(?!(${config.allowedTags.join("|")})\\w+[^>]*>`, "gi");
    output = output.replace(tagPattern, "");
  }

  // 2. 处理允许标签的属性
  if (Object.keys(config.allowedAttributes).length > 0) {
    output = output.replace(/<([a-z][a-z0-9]*)([^>]*)>/gi, (match, tag, attrs) => {
      if (!config.allowedTags.find(tag.toLowerCase())) return "";

      const allowedAttrs = config.allowedAttributes[tag] || [];
      const filteredAttrs = [];

      // 提取并过滤属性
      const attrPattern = /(\w+)=("[^"]*"|'[^']*'|[^"'\s>]+)/gi;
      let attrMatch;
      while ((attrMatch = attrPattern.exec(attrs)) !== null) {
        const attrName = attrMatch[1].toLowerCase();
        if (allowedAttrs.includes(attrName)) {
          // 特别处理链接的href属性
          if (tag === "a" && attrName === "href") {
            const url = attrMatch[2].replace(/^['"]|['"]$/g, "");
            if (/^https?:\/\//i.test(url)) {
              // 只允许http/https协议
              filteredAttrs.push(`${attrName}="${url}"`);
            }
          } else {
            filteredAttrs.push(`${attrName}=${attrMatch[2]}`);
          }
        }
      }

      return `<${tag}${filteredAttrs.length ? " " + filteredAttrs.join(" ") : ""}>`;
    });
  }

  // 3. 转义危险字符（当escapeHtml为true时）
  if (config.escapeHtml) {
    const escapeMap = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#x27;",
      "/": "&#x2F;",
      "`": "&#x60;",
      "=": "&#x3D;",
    };
    output = output.replace(/[&<>"'`=/]/g, (char) => escapeMap[char]);
  }

  return output;
}
