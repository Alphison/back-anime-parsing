import { Router } from "express";
import { InfoSerivce } from "./info.service.js";

const router = Router()

const infoService = new InfoSerivce()

router.get('/', async (req, res) => {    
    const data = await infoService.getInfo(req.query.start_from_page)    
    res.json(data).status(200) 
})

router.get('/anime', async (req, res) => {    
    const data = await infoService.getAnimeInfo(req.query.anime_name)    
    res.json(data).status(200) 
})

router.post('/videos', async (req, res) => {    
    const data = await infoService.getVideosAnime(req.body.href)    
    res.json(data).status(200) 
})

router.get('/download', async (req, res) => {
    try {
      const url = req.query.url; // URL видео
      const response = await axios.get(url, {
        responseType: 'stream',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36',
          'Host': 'r441.yandexwebcache.org',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7'
        }
      });
      res.setHeader('Content-Disposition', `attachment; filename="video.mp4"`);
      response.data.pipe(res);
    } catch (error) {
        console.error('Ошибка:', error.message);
        if (error.response) {
          console.error('Статус ответа:', error.response.status);
          console.error('Данные ответа:', error.response.data);
        }
        res.status(500).send('Ошибка загрузки видео');
      }
  })

export const infoRouter = router