import { promises as fs } from 'fs';
import path from 'path';

interface Article {
  title: string;
  url: string;
  blog_title: string;
  date: string;
  timestamp: number;
}

async function getArticles() {
  const filePath = path.join(process.cwd(), 'public', 'articles.json');
  try {
    const fileContents = await fs.readFile(filePath, 'utf8');
    const articles = JSON.parse(fileContents) as Article[];
    // Ensure sorted by timestamp desc just in case
    return articles.sort((a, b) => b.timestamp - a.timestamp);
  } catch (error) {
    console.error("Error reading articles:", error);
    return [];
  }
}

export default async function Home() {
  const articles = await getArticles();

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-zinc-900 text-gray-900 dark:text-gray-100 font-sans">
      <header className="bg-white dark:bg-zinc-800 shadow-sm sticky top-0 z-10 border-b border-gray-200 dark:border-zinc-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <Link href="/" className="text-lg font-bold tracking-tight hover:opacity-80 transition-opacity">
            2chmm Antenna
          </Link>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {articles.length} articles
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {articles.map((article, index) => (
            <a
              key={index}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block bg-white dark:bg-zinc-800 rounded-md shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-gray-200 dark:border-zinc-700 hover:border-blue-400 dark:hover:border-blue-500"
            >
              <div className="p-3">
                <div className="flex items-center justify-between mb-2 text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                  <span className="font-medium truncate max-w-[70%] text-emerald-600 dark:text-emerald-400">
                    {article.blog_title}
                  </span>
                  <span>{article.date.split(' ')[1]}</span>
                </div>
                <h2 className="text-sm font-medium line-clamp-2 leading-snug mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {article.title}
                </h2>
                <div className="text-[10px] text-gray-400 text-right">
                  {article.date.split(' ')[0]}
                </div>
              </div>
            </a>
          ))}
        </div>
      </main>

      <footer className="bg-white dark:bg-zinc-800 border-t border-gray-200 dark:border-zinc-700 mt-12">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center text-xs text-gray-500">
          &copy; {new Date().getFullYear()} 2chmm Antenna. Generated at {new Date().toLocaleTimeString()}.
        </div>
      </footer>
    </div>
  );
}

import Link from 'next/link';
