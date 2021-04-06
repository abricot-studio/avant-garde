import React, { useMemo } from 'react'
import Head from 'next/head'

interface SEOData {
  title?: string;
  description?: string;
  keywords?: string;
}

const defaultSEOData = {
  title: 'AvantGarde',
  description: 'Mint unique NFTs based on your ethereum address, generated by deep-learning algorithms.',
  keywords: 'nft,defi,ai,machine learning,deep learning,ethereum,crypto,blockchain,ETH',
}

export default function SEO({ data }: { data: SEOData }) {
  const domain = process.env.APP_URL || 'http://localhost'

  const title = useMemo(() => `${data.title && `${data.title} | ` || ''}${defaultSEOData.title}`, [data]);

  return (
    <Head>
      <meta name="language" content="en" />

      <title>{title}</title>
      <meta name="title" content={title} />
      <meta content={data.description || defaultSEOData.description} name="description" />
      <meta content={data.keywords || defaultSEOData.keywords} name="keywords" />

      <meta itemProp="name" content={title} />
      <meta itemProp="description" content={data.description || defaultSEOData.description} />
      <meta itemProp="image" content={`${domain}/images/meta_card.jpg`} />

      <meta property="og:type" content="website" />
      <meta property="og:url" content={domain} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={data.description || defaultSEOData.description} />
      <meta property="og:image" content={`${domain}/images/meta_card.jpg`} />
      <meta property="og:image:alt" content={title} />
      <meta property="og:site_name" content={title} />

      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={domain} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={data.description || defaultSEOData.description} />
      <meta
        property="twitter:image"
        content={`${domain}/images/meta_card.jpg`}
      />
      <meta property="twitter:image:alt" content={data.title} />

      <meta name="robots" content="index,follow" />
    </Head>
  )
}
