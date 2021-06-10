module.exports = {
  siteUrl: 'https://beta.avant-garde.gallery',
  generateRobotsTxt: true,
  exclude: ['/server-sitemap.xml'], // <= exclude here
  robotsTxtOptions: {
    additionalSitemaps: [
      'https://beta.avant-garde.gallery/server-sitemap.xml', // <==== Add here
    ],
  },
}
