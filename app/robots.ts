import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api'],
      },
    ],
    sitemap: 'https://www.oliodellacontrada.it/sitemap.xml',
    host: 'https://www.oliodellacontrada.it',
  }
}
