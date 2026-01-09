import { z } from 'zod';

// Date range pattern: YYYY-MM-DDtoYYYY-MM-DD
const dateRangePattern = /^\d{4}-\d{2}-\d{2}to\d{4}-\d{2}-\d{2}$/;

export const params = z.object({
  query: z
    .string()
    .min(1)
    .max(400)
    .refine((str) => str.split(/\s+/).length <= 50, 'Query cannot exceed 50 words')
    .describe('Search query (max 400 chars, 50 words)'),
  count: z
    .number()
    .int()
    .min(1)
    .max(20)
    .default(10)
    .describe(
      'Number of results (1-20, default 10). Applies only to web search results (i.e., has no effect on news, videos, etc.)'
    )
    .optional(),
  freshness: z
    .string()
    .refine(
      (val) => ['pd', 'pw', 'pm', 'py'].includes(val) || dateRangePattern.test(val),
      "Must be 'pd', 'pw', 'pm', 'py', or date range 'YYYY-MM-DDtoYYYY-MM-DD'"
    )
    .describe(
      "Filters search results by when they were discovered. The following values are supported: 'pd' - Discovered within the last 24 hours. 'pw' - Discovered within the last 7 days. 'pm' - Discovered within the last 31 days. 'py' - Discovered within the last 365 days. 'YYYY-MM-DDtoYYYY-MM-DD' - Timeframe is also supported by specifying the date range e.g. 2022-04-01to2022-07-30."
    )
    .optional(),
  result_filter: z
    .array(
      z.enum([
        'discussions',
        'faq',
        'infobox',
        'news',
        'query',
        'summarizer',
        'videos',
        'web',
        'locations',
        'rich',
      ])
    )
    .default(['web'])
    .describe(
      "Filter result types to return. Supported values: 'discussions' - Forum and discussion threads. 'faq' - Frequently asked questions. 'infobox' - Knowledge panel information. 'news' - News articles (use for current events). 'query' - Query suggestions. 'summarizer' - AI summary (requires summary param). 'videos' - Video results. 'web' - Standard web pages. 'locations' - Local business results. 'rich' - Rich media results. Default is ['web']."
    )
    .optional(),
  goggles: z
    .array(z.string())
    .describe(
      "Goggles act as a custom re-ranking on top of Brave's search index. The parameter supports both a url where the Goggle is hosted or the definition of the Goggle. For more details, refer to the Goggles repository (i.e., https://github.com/brave/goggles-quickstart)."
    )
    .optional(),
  extra_snippets: z
    .boolean()
    .describe(
      'A snippet is an excerpt from a page you get as a result of the query, and extra_snippets allow you to get up to 5 additional, alternative excerpts. Only available under Free AI, Base AI, Pro AI, Base Data, Pro Data and Custom plans.'
    )
    .optional(),
});

export type QueryParams = z.infer<typeof params>;

export default params;
