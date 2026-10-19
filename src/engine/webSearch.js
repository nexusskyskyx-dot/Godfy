// Autonomous Live Web Search Engine for Godfy v1
// Godfy decides autonomously when to search the web for current, live information.
// Queries real-time CORS-enabled web providers without API keys:
// 1. Wikipedia Live Search API (Official MediaWiki CORS origin=*)
// 2. HackerNews Live Algolia Search (Real-time tech/news discussions)
// 3. DuckDuckGo Instant Knowledge API
// 4. Pollinations SearchGPT Live Web Crawler

/**
 * Autonomous Decision Engine:
 * Analyzes prompt intent, temporal terms, and entity inquiries to decide if live web search is needed.
 */
export function shouldGodfySearch(query, forceSearch = false) {
  if (forceSearch) return true;
  if (!query) return false;

  const q = query.trim().toLowerCase();

  // Explicit user search triggers
  if (/\b(search|look up|browse|find online|check the web|latest|current|recent|news|today|yesterday|this year|now)\b/i.test(q)) {
    return true;
  }

  // Temporal references (2024, 2025, 2026, 2027)
  if (/\b(2024|2025|2026|2027)\b/.test(q)) {
    return true;
  }

  // Real-time factual queries
  if (/\b(who is currently|who won|election|stock price|weather|release date|version|score|standing|valuation|headquarters)\b/i.test(q)) {
    return true;
  }

  // Real-world entities, organizations, or news
  if (/^(who is|who are|what is happening with|what happened to|status of|founder of|ceo of|latest on)\b/i.test(q)) {
    return true;
  }

  // High-frequency research terms
  if (q.includes('price of') || q.includes('rate of') || q.includes('market cap') || q.includes('update on')) {
    return true;
  }

  return false;
}

/**
 * Clean HTML tags from search snippets
 */
function cleanSnippet(html) {
  if (!html) return '';
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#039;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Provider 1: Wikipedia Real-Time Knowledge API (Official CORS origin=*)
 */
async function searchWikipedia(query, limit = 4, timeoutMs = 4000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const url = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&utf8=&format=json&origin=*&srlimit=${limit}`;
    const res = await fetch(url, { signal: controller.signal });

    if (res.ok) {
      const data = await res.json();
      const items = data?.query?.search || [];
      return items.map(item => ({
        title: item.title,
        snippet: cleanSnippet(item.snippet),
        url: `https://en.wikipedia.org/wiki/${encodeURIComponent(item.title.replace(/ /g, '_'))}`,
        source: 'Wikipedia Live',
        timestamp: item.timestamp || new Date().toISOString()
      }));
    }
  } catch {
    // Failover silently
  } finally {
    clearTimeout(timer);
  }
  return [];
}

/**
 * Provider 2: HackerNews Algolia Real-Time Search API (Tech & Breaking Updates)
 */
async function searchHackerNews(query, limit = 4, timeoutMs = 4000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const url = `https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(query)}&tags=story&hitsPerPage=${limit}`;
    const res = await fetch(url, { signal: controller.signal });

    if (res.ok) {
      const data = await res.json();
      const hits = data?.hits || [];
      return hits
        .filter(h => h.title)
        .map(h => ({
          title: h.title,
          snippet: h.story_text ? cleanSnippet(h.story_text).slice(0, 180) : `Discussion with ${h.num_comments || 0} comments and ${h.points || 0} points on Hacker News.`,
          url: h.url || `https://news.ycombinator.com/item?id=${h.objectID}`,
          source: 'Hacker News Live',
          timestamp: h.created_at || new Date().toISOString()
        }));
    }
  } catch {
    // Failover silently
  } finally {
    clearTimeout(timer);
  }
  return [];
}

/**
 * Provider 3: DuckDuckGo Instant Knowledge API
 */
async function searchDuckDuckGo(query, timeoutMs = 3500) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`;
    const res = await fetch(url, { signal: controller.signal });

    if (res.ok) {
      const data = await res.json();
      const results = [];

      if (data.AbstractText) {
        results.push({
          title: data.Heading || query,
          snippet: data.AbstractText,
          url: data.AbstractURL || 'https://duckduckgo.com',
          source: 'DuckDuckGo Instant',
          timestamp: new Date().toISOString()
        });
      }

      if (Array.isArray(data.RelatedTopics)) {
        for (const topic of data.RelatedTopics.slice(0, 2)) {
          if (topic.Text && topic.FirstURL) {
            results.push({
              title: topic.Text.split(' - ')[0] || query,
              snippet: topic.Text,
              url: topic.FirstURL,
              source: 'DuckDuckGo Related',
              timestamp: new Date().toISOString()
            });
          }
        }
      }

      return results;
    }
  } catch {
    // Failover
  } finally {
    clearTimeout(timer);
  }
  return [];
}

/**
 * Provider 4: Pollinations SearchGPT Live Web Crawler (Web-Augmented LLM)
 */
async function searchPollinationsSearchGPT(query, timeoutMs = 4500) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const url = `https://text.pollinations.ai/${encodeURIComponent('Search the web live and summarize current factual points with sources for: ' + query)}?model=searchgpt`;
    const res = await fetch(url, { signal: controller.signal });

    if (res.ok) {
      const text = await res.text();
      if (text && text.trim().length > 30 && !text.includes('"error":')) {
        return [{
          title: `Live Web Search Summary: ${query}`,
          snippet: text.trim().slice(0, 320),
          url: 'https://pollinations.ai/searchgpt',
          source: 'SearchGPT Live Crawler',
          timestamp: new Date().toISOString()
        }];
      }
    }
  } catch {
    // Failover
  } finally {
    clearTimeout(timer);
  }
  return [];
}

/**
 * Master Search Dispatcher:
 * Executes multi-provider live searches concurrently, ranks and dedupes the freshest results.
 */
export async function performLiveWebSearch(query) {
  const startTime = Date.now();
  const q = (query || '').trim();

  // Execute providers in parallel
  const [wikiResults, hnResults, ddgResults, searchGptResults] = await Promise.allSettled([
    searchWikipedia(q, 3),
    searchHackerNews(q, 3),
    searchDuckDuckGo(q),
    searchPollinationsSearchGPT(q)
  ]);

  const allItems = [
    ...(wikiResults.status === 'fulfilled' ? wikiResults.value : []),
    ...(hnResults.status === 'fulfilled' ? hnResults.value : []),
    ...(ddgResults.status === 'fulfilled' ? ddgResults.value : []),
    ...(searchGptResults.status === 'fulfilled' ? searchGptResults.value : [])
  ];

  // Deduplicate by URL or title
  const seenUrls = new Set();
  const deduped = [];

  for (const item of allItems) {
    if (!item.url || seenUrls.has(item.url)) continue;
    seenUrls.add(item.url);
    deduped.push(item);
    if (deduped.length >= 6) break;
  }

  return {
    searched: true,
    query: q,
    latencyMs: Date.now() - startTime,
    count: deduped.length,
    results: deduped
  };
}
