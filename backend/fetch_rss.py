import feedparser
import json
import os
import time
from datetime import datetime
from email.utils import parsedate_to_datetime

# Configuration
SITES_FILE = "sites.txt"
OUTPUT_FILE = "../frontend/public/articles.json" # Output directly to frontend public folder
MAX_ARTICLES_PER_SITE = 5

def load_sites():
    sites = []
    if os.path.exists(SITES_FILE):
        with open(SITES_FILE, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#"):
                    sites.append(line)
    return sites

def fetch_feed(url):
    print(f"Fetching {url}...")
    try:
        feed = feedparser.parse(url)
        articles = []
        if feed.entries:
            blog_title = feed.feed.title if 'title' in feed.feed else "Unknown Blog"
            for entry in feed.entries[:MAX_ARTICLES_PER_SITE]:
                # Parse date
                published_at = None
                if 'published_parsed' in entry:
                    published_at = time.mktime(entry.published_parsed)
                elif 'updated_parsed' in entry:
                    published_at = time.mktime(entry.updated_parsed)
                else:
                    published_at = time.time()
                
                # Format date for display
                date_str = datetime.fromtimestamp(published_at).strftime('%Y-%m-%d %H:%M')

                articles.append({
                    'title': entry.title,
                    'url': entry.link,
                    'blog_title': blog_title,
                    'date': date_str,
                    'timestamp': published_at,
                    # Some feeds might have images in content or summary, but keeping it simple for now
                })
        return articles
    except Exception as e:
        print(f"Error fetching {url}: {e}")
        return []

def main():
    sites = load_sites()
    all_articles = []

    for site_url in sites:
        articles = fetch_feed(site_url)
        all_articles.extend(articles)
    
    # Sort by timestamp descending (newest first)
    all_articles.sort(key=lambda x: x['timestamp'], reverse=True)

    # Ensure output directory exists (frontend/public might not exist yet if run before frontend setup)
    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(all_articles, f, ensure_ascii=False, indent=2)
    
    print(f"Saved {len(all_articles)} articles to {OUTPUT_FILE}")

if __name__ == "__main__":
    main()
