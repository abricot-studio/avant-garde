module.exports = {
  siteUrl: 'https://avant-garde.gallery',
  generateRobotsTxt: true,
  exclude: ['/server-sitemap.xml'], // <= exclude here
  robotsTxtOptions: {
    additionalSitemaps: [
      'https://avant-garde.gallery/server-sitemap.xml', // <==== Add here
    ],
  },
}
