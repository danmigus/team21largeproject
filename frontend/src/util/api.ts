export const URL = 'galaxycollapse.com'

export function buildUrl(route: string): string
{
  if (process.env.NODE_ENV != 'development')
  {
    return 'https://' + URL + '/' + route;
  }
  else
  {
    return 'http://localhost:5000/' + route;
  }
}
