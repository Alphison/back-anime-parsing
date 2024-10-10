import axios from "axios";
import iconv from "iconv-lite";
import * as cheerio from 'cheerio';

export class InfoSerivce {
    async getInfo(start_from_page){
        const body = {
            ajax_load: 'yes',
            start_from_page: start_from_page
        }
        try {

            const response = await axios.post(process.env.URL_PARSE, body, {
                responseType: 'arraybuffer',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36',  
                    'Content-Type' : 'multipart/form-data'            
                },
                
            });
            

            const html = iconv.decode(Buffer.from(response.data), 'windows-1251');

            const $ = cheerio.load(html);
            const articles = [];
        
            $('.all_anime_global').each((index, element) => {
                
                const title = $(element).find('.aaname').text(); 
                const href = $(element).find('a').attr('href'); 

                
                const style = $(element).find('.all_anime_image').attr('style');
                const match = style.match(/url\('([^']+)'\)/);

                articles.push({
                    id: index,
                    title: title,
                    preview: match[1],
                    href: href
                });
                

            });

            return articles

        } catch (error) {
            console.error('Ошибка при парсинге:', error);
        }
    }
}