import * as cheerio from 'cheerio';

const getCssFromStyleTag = (selector, property, html) => {
    const $ = cheerio.load(html);
    const styleTag = $('body').html();
  
    if (styleTag) {
      const regex = new RegExp(`${selector}\\s*{[^}]*${property}:\\s*([^;]+);`, 'i');
      const match = styleTag.match(regex);
      return match ? match[1].trim() : null;
    }
  
    return null;
};

export default getCssFromStyleTag