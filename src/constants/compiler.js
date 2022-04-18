const delimiters = ['{{', '}}'];

const L = delimiters[0];
const R = delimiters[1];

const commonKeys = {
  name: `${L}name${R}`,
  name__pascal: `${L}name__pascal${R}`,
  title: `${L}title${R}`,
}

const pageKeys = {
  html: `${L}html${R}`,
  css: `${L}css${R}`,
}

const routerKeys = {
  start: `${L}start${R}`,
  end: `${L}end${R}`,
  pagePath: `${L}pagePath${R}`,
}

export {
  delimiters,
  commonKeys,
  pageKeys,
  routerKeys
}
