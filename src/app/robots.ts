import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/login'],
      },
    ],
    sitemap: 'https://yourwebsite.com/sitemap.xml', // TODO: Update with your actual domain
  }
}
