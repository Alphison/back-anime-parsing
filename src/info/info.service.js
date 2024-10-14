import axios from "axios";
import iconv from "iconv-lite";
import * as cheerio from 'cheerio';
import getCssFromStyleTag from "../../utils/parseStyle.js";

export class InfoSerivce {
    async getInfo(start_from_page){
        const body = {
            ajax_load: 'yes',
            start_from_page: start_from_page
        }
        try {

            const response = await axios.post(`${process.env.URL_PARSE}/anime`, body, {
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
                const name_anime = href.match(/(?<=\/)[^\/]+(?=\/)/g);                

                articles.push({
                    id: index,
                    title: title,
                    preview: match[1],
                    name_anime: name_anime
                });
                

            });

            return articles

        } catch (error) {
            console.error('Ошибка при парсинге:', error);
        }
    }

    async getVideosAnime(href){        
        try {
            const response = await axios.get(`${process.env.URL_PARSE + href}`, {
                responseType: 'arraybuffer',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36',           
                },
            });

            const html = iconv.decode(Buffer.from(response.data), 'windows-1251');
            const $ = cheerio.load(html);

            const videos = []

            $('source').each((index, element) => {
                const hrefVideo = $(element).attr('src')
                const labelVideo = $(element).attr('label')

                videos.push({
                    src: hrefVideo,
                    label: labelVideo
                })
            })

            return videos            

        } catch (error) {
            console.error('Ошибка при парсинге видео:', error);            
        }
    }

    async getAnimeInfo(anime_name) {
        try {
            const response = await axios.get(`${process.env.URL_PARSE}/${anime_name}`, {
                responseType: 'arraybuffer',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36',           
                },
            });            

            const html = iconv.decode(Buffer.from(response.data), 'windows-1251');
            const $ = cheerio.load(html);

            const articles = {};
            const episodes = [];

            const bodyBackground = getCssFromStyleTag('body', 'background-image', html);
            const valueUrlBackground = bodyBackground.match(/url\('([^']+)'\)/);         
            articles['background_anime'] = valueUrlBackground[1]

            const nameAnime = $('.header_video').text().match(/Смотреть\s+(.*?)\s+все/)            
        
            $('.short-btn').each((index, element) => {
                const number_episode_text = $(element).contents().not('i').text().trim();
                const number_episode = number_episode_text.match(/(\d+)\s+(?:серия|фильм)/);

                const href = $(element).attr('href')
                const sezon = href.match(/\/(season-\d+)\//)               
                
                episodes.push({
                    id: number_episode[1],
                    sezon: sezon !== null ? sezon[1] : null,
                    url: href
                })                

            });

            articles['name'] = nameAnime[1].trim()
            articles['episodes'] = episodes

            return articles

        } catch (error) {
            console.error('Ошибка при парсинге:', error);
        }
    } 
}