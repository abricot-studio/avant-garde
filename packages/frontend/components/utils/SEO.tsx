import React from 'react'
import Head from 'next/head'

export default function SEO({ data }) {
    const domain = process.env.APP_URL || 'http://localhost';

    return (
      <Head>
          <meta name="language" content="en" />

          <title>{data.title}</title>
          <meta name="title" content={data.title} />
          <meta content={data.description} name="description" />
          <meta content={data.keywords} name="keywords" />

          <meta itemProp="name" content={data.title} />
          <meta itemProp="description" content={data.description} />
          <meta
            itemProp="image"
            content={`${domain}/images/meta_card.jpg`}
          />

          <meta property="og:type" content="website" />
          <meta property="og:url" content={domain} />
          <meta property="og:title" content={data.title} />
          <meta property="og:description" content={data.description} />
          <meta
            property="og:image"
            content={`${domain}/images/meta_card.jpg`}
          />
          <meta property="og:image:alt" content={data.title} />
          <meta property="og:site_name" content={data.title} />

          <meta property="twitter:card" content="summary_large_image" />
          <meta property="twitter:url" content={domain} />
          <meta property="twitter:title" content={data.title} />
          <meta property="twitter:description" content={data.description} />
          <meta
            property="twitter:image"
            content={`${domain}/images/meta_card.jpg`}
          />
          <meta property="twitter:image:alt" content={data.title} />

          <meta name="robots" content="index,follow" />
      </Head>
    )
}
