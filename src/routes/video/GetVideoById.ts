import fs from 'fs'
import Path from '../../base/Path'

import {
  HttpReq,
  HttpRes,
  IRoute
} from '../../Types'
import Utils from '../../Utils'

const CHUNK_SIZE = (1024 * 1024) * 2

class GetVideoById extends Path implements IRoute {
  public path   = '/api/video/:id'
  public method = 'get'

  public async onRequest(req: HttpReq, res: HttpRes) {
    const videoId = req.params.id,
      path = await Utils.getFilePath(this.server, videoId)

    let filePath = ''
    if (typeof path === 'string')
      filePath = path
    else {
      // get season and episode
      const season = Number(req.query.s ?? 1),
        episode = Number(req.query.e ?? 1)

      filePath = path?.find(
        (p) => p.includes(`S${Utils.pad(season, '0', 2)}`) && p.includes(`E${Utils.pad(episode, '0', 2)}`)
      )
    }

    if (!filePath)
      return {
        code: 404,
        message: 'Video ID not found in our database.'
      }

    const videoSize = fs.statSync(filePath).size,
      range = req.headers.range ?? '',
      start = Number(
        range.replace(/\D/g, '')
      ),
      end = Math.min(start + CHUNK_SIZE, videoSize - 1),
      extension = filePath.split('.')
        .pop()
        ?.toLowerCase()
    
    res.writeHead(
      206,
      {
        'Content-Type': `video/${extension}`,
        'Content-Range': `bytes ${start}-${end}/${videoSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': end - start + 1
      }
    )

    fs.createReadStream(
      filePath,
      { start, end }
    )
      .pipe(res)

    return {
      willPipe: true
    }
  }
}

export default GetVideoById