import { useQuery } from 'urql'

const TokensQuery = `
query {
  arbArtTokens(first: 100)  {
    id
    owner
    uri
    metadata {
      name
      description
      external_url
      image
    }
  }
}
`

export const useTokens = () => {
  const [result] = useQuery({
    query: TokensQuery,
  })
  const { data, fetching, error } = result

  const tokens = data?.arbArtTokens

  return {
    tokens,
    fetching,
    error,
  }
}
