import 'server-only';

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export type ArticleStatus = 'draft' | 'published';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  sort_order: number | null;
  created_at: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  category_id: string | null;
  author_name: string | null;
  status: ArticleStatus;
  featured: boolean;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface ArticleRevision {
  id: string;
  article_id: string;
  title: string;
  content: string;
  saved_at: string;
}

export interface SiteSettings {
  site_name: string;
  site_description: string;
  logo_text: string;
  footer_text: string;
  theme_color: string;
}

interface WikiVaultData {
  settings: SiteSettings;
  categories: Category[];
  articles: Article[];
  article_revisions: ArticleRevision[];
}

export type ArticleWithCategory = Article & {
  categories: { id: string; name: string; slug: string } | null;
};

export type CategoryWithCount = Category & { article_count: number };

const DEFAULT_SETTINGS: SiteSettings = {
  site_name: 'WikiVault',
  site_description: 'Your self-hosted home for guides, docs and support articles.',
  logo_text: 'WV',
  footer_text: 'WikiVault — free, self-hosted knowledge management.',
  theme_color: '#6d5dfc',
};

const DEFAULT_DATA_DIR = path.join(process.cwd(), 'data');
const DATA_DIR = process.env.WIKIVAULT_DATA_DIR || DEFAULT_DATA_DIR;
const DATA_FILE = process.env.WIKIVAULT_DATA_FILE || path.join(DATA_DIR, 'wikivault.json');

function now() {
  return new Date().toISOString();
}

function id(prefix: string) {
  return `${prefix}_${crypto.randomBytes(9).toString('hex')}`;
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function seedData(): WikiVaultData {
  const created = now();
  const categories: Category[] = [
    { id: id('cat'), name: 'Getting Started', slug: 'getting-started', description: 'Start here and learn the basics of WikiVault.', icon: 'BookOpen', sort_order: 1, created_at: created },
    { id: id('cat'), name: 'Account & Billing', slug: 'account-billing', description: 'Guides for accounts, invoices, subscriptions and payments.', icon: 'CreditCard', sort_order: 2, created_at: created },
    { id: id('cat'), name: 'Game Servers', slug: 'game-servers', description: 'Helpful guides for Minecraft and other game servers.', icon: 'Gamepad2', sort_order: 3, created_at: created },
    { id: id('cat'), name: 'VPN', slug: 'vpn', description: 'VPN setup, troubleshooting and connection guides.', icon: 'Shield', sort_order: 4, created_at: created },
    { id: id('cat'), name: 'Troubleshooting', slug: 'troubleshooting', description: 'Fix common issues quickly with simple steps.', icon: 'Wrench', sort_order: 5, created_at: created },
  ];

  const category = (slug: string) => categories.find((c) => c.slug === slug)?.id ?? null;

  const articles: Article[] = [
    {
      id: id('art'),
      title: 'Welcome to WikiVault',
      slug: 'welcome-to-wikivault',
      excerpt: 'A quick introduction to your new self-hosted knowledgebase.',
      content: '# Welcome to WikiVault\n\nWikiVault is a free, self-hosted knowledgebase for guides, support docs, internal notes and public help articles.\n\n## What can you do?\n\n- Create categories\n- Publish Markdown articles\n- Keep drafts private\n- Search your public docs\n- Run everything on your own server\n\n```bash\ndocker compose up -d\n```\n\n> You own the data, the server and the deployment.',
      category_id: category('getting-started'),
      author_name: 'Admin',
      status: 'published',
      featured: true,
      tags: ['welcome', 'self-hosted'],
      created_at: created,
      updated_at: created,
    },
    {
      id: id('art'),
      title: 'How to create your first article',
      slug: 'how-to-create-your-first-article',
      excerpt: 'Create a new article, add Markdown content and publish it.',
      content: '# How to create your first article\n\n1. Sign in to the admin dashboard.\n2. Go to **Articles**.\n3. Click **New Article**.\n4. Add a title, content, category and status.\n5. Save the article.\n\nDraft articles stay hidden from the public site until you publish them.',
      category_id: category('getting-started'),
      author_name: 'Admin',
      status: 'published',
      featured: true,
      tags: ['articles', 'markdown'],
      created_at: created,
      updated_at: created,
    },
    {
      id: id('art'),
      title: 'How to organise categories',
      slug: 'how-to-organise-categories',
      excerpt: 'Keep your docs tidy with clear categories and slugs.',
      content: '# How to organise categories\n\nCategories help visitors browse your documentation. Keep category names short and clear. Use descriptions to explain what belongs inside each category.',
      category_id: category('getting-started'),
      author_name: 'Admin',
      status: 'published',
      featured: false,
      tags: ['categories'],
      created_at: created,
      updated_at: created,
    },
    {
      id: id('art'),
      title: 'How to upload a Minecraft world',
      slug: 'how-to-upload-a-minecraft-world',
      excerpt: 'A simple example article for Minecraft hosting customers.',
      content: '# How to upload a Minecraft world\n\n1. Stop your server.\n2. Take a backup of your current world.\n3. Upload your world folder using the file manager or SFTP.\n4. Make sure the folder name matches the world setting in your server config.\n5. Start the server and check the console for errors.',
      category_id: category('game-servers'),
      author_name: 'Admin',
      status: 'published',
      featured: true,
      tags: ['minecraft', 'world-upload'],
      created_at: created,
      updated_at: created,
    },
    {
      id: id('art'),
      title: 'How to reset your password',
      slug: 'how-to-reset-your-password',
      excerpt: 'Example account support article.',
      content: '# How to reset your password\n\nUse this article as a template for your own account recovery instructions. Replace this demo content with your real customer steps.',
      category_id: category('account-billing'),
      author_name: 'Admin',
      status: 'published',
      featured: false,
      tags: ['account', 'password'],
      created_at: created,
      updated_at: created,
    },
    {
      id: id('art'),
      title: 'How to contact support',
      slug: 'how-to-contact-support',
      excerpt: 'Tell customers where to go when they need help.',
      content: '# How to contact support\n\nAdd your real support channels here, such as tickets, email, Discord or live chat.\n\n## Before contacting support\n\nPlease include screenshots, error messages and the steps you already tried.',
      category_id: category('troubleshooting'),
      author_name: 'Admin',
      status: 'published',
      featured: false,
      tags: ['support'],
      created_at: created,
      updated_at: created,
    },
  ];

  return { settings: DEFAULT_SETTINGS, categories, articles, article_revisions: [] };
}

function ensureStore() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) writeData(seedData());
}

function readData(): WikiVaultData {
  ensureStore();
  const raw = fs.readFileSync(DATA_FILE, 'utf8');
  const parsed = JSON.parse(raw) as Partial<WikiVaultData>;
  return {
    settings: { ...DEFAULT_SETTINGS, ...(parsed.settings ?? {}) },
    categories: parsed.categories ?? [],
    articles: parsed.articles ?? [],
    article_revisions: parsed.article_revisions ?? [],
  };
}

function writeData(data: WikiVaultData) {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  const temp = `${DATA_FILE}.tmp`;
  fs.writeFileSync(temp, JSON.stringify(data, null, 2));
  fs.renameSync(temp, DATA_FILE);
}

function withCategory(article: Article, categories: Category[]): ArticleWithCategory {
  const c = categories.find((cat) => cat.id === article.category_id);
  return { ...article, categories: c ? { id: c.id, name: c.name, slug: c.slug } : null };
}

export function getSettings(): SiteSettings {
  return readData().settings;
}

export function updateSettings(settings: Partial<SiteSettings>): SiteSettings {
  const data = readData();
  data.settings = { ...data.settings, ...settings };
  writeData(data);
  return data.settings;
}

export function getCategories(): Category[] {
  return readData().categories.sort((a, b) => (a.sort_order ?? 999) - (b.sort_order ?? 999) || a.name.localeCompare(b.name));
}

export function getCategoriesWithCounts(includeDrafts = false): CategoryWithCount[] {
  const data = readData();
  return getCategories().map((category) => ({
    ...category,
    article_count: data.articles.filter((article) => article.category_id === category.id && (includeDrafts || article.status === 'published')).length,
  }));
}

export function getCategoryBySlug(slug: string): Category | null {
  return readData().categories.find((category) => category.slug === slug) ?? null;
}

export function getCategoryById(idValue: string): Category | null {
  return readData().categories.find((category) => category.id === idValue) ?? null;
}

export function createCategory(input: Partial<Category>) {
  const data = readData();
  const name = input.name?.trim() || 'Untitled Category';
  const slug = slugify(input.slug || name);
  if (data.categories.some((category) => category.slug === slug)) throw new Error('A category with that slug already exists.');
  const category: Category = {
    id: id('cat'),
    name,
    slug,
    description: input.description?.trim() || null,
    icon: input.icon?.trim() || 'BookOpen',
    sort_order: Number.isFinite(input.sort_order) ? Number(input.sort_order) : data.categories.length + 1,
    created_at: now(),
  };
  data.categories.push(category);
  writeData(data);
  return category;
}

export function updateCategory(idValue: string, input: Partial<Category>) {
  const data = readData();
  const index = data.categories.findIndex((category) => category.id === idValue);
  if (index === -1) throw new Error('Category not found.');
  const name = input.name?.trim() || data.categories[index].name;
  const slug = slugify(input.slug || name);
  if (data.categories.some((category) => category.id !== idValue && category.slug === slug)) throw new Error('A category with that slug already exists.');
  data.categories[index] = {
    ...data.categories[index],
    name,
    slug,
    description: typeof input.description === 'string' ? input.description.trim() || null : data.categories[index].description,
    icon: typeof input.icon === 'string' ? input.icon.trim() || 'BookOpen' : data.categories[index].icon,
    sort_order: input.sort_order === null || input.sort_order === undefined ? data.categories[index].sort_order : Number(input.sort_order),
  };
  writeData(data);
  return data.categories[index];
}

export function deleteCategory(idValue: string) {
  const data = readData();
  data.categories = data.categories.filter((category) => category.id !== idValue);
  data.articles = data.articles.map((article) => article.category_id === idValue ? { ...article, category_id: null, updated_at: now() } : article);
  writeData(data);
}

export function getArticles(options: { includeDrafts?: boolean; limit?: number; featured?: boolean; categoryId?: string | null } = {}): ArticleWithCategory[] {
  const data = readData();
  let articles = data.articles.slice();
  if (!options.includeDrafts) articles = articles.filter((article) => article.status === 'published');
  if (typeof options.featured === 'boolean') articles = articles.filter((article) => article.featured === options.featured);
  if (options.categoryId !== undefined) articles = articles.filter((article) => article.category_id === options.categoryId);
  articles.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
  if (options.limit) articles = articles.slice(0, options.limit);
  return articles.map((article) => withCategory(article, data.categories));
}

export function getArticleBySlug(slug: string, includeDrafts = false): ArticleWithCategory | null {
  const data = readData();
  const article = data.articles.find((item) => item.slug === slug && (includeDrafts || item.status === 'published'));
  return article ? withCategory(article, data.categories) : null;
}

export function getArticleById(idValue: string): ArticleWithCategory | null {
  const data = readData();
  const article = data.articles.find((item) => item.id === idValue);
  return article ? withCategory(article, data.categories) : null;
}

export function createArticle(input: Partial<Article>) {
  const data = readData();
  const title = input.title?.trim() || 'Untitled Article';
  const slug = slugify(input.slug || title);
  if (data.articles.some((article) => article.slug === slug)) throw new Error('An article with that slug already exists.');
  const timestamp = now();
  const article: Article = {
    id: id('art'),
    title,
    slug,
    content: input.content ?? '',
    excerpt: input.excerpt?.trim() || null,
    category_id: input.category_id || null,
    author_name: input.author_name?.trim() || 'Admin',
    status: input.status === 'published' ? 'published' : 'draft',
    featured: Boolean(input.featured),
    tags: Array.isArray(input.tags) ? input.tags.map((tag) => String(tag).trim()).filter(Boolean) : [],
    created_at: timestamp,
    updated_at: timestamp,
  };
  data.articles.push(article);
  writeData(data);
  return withCategory(article, data.categories);
}

export function updateArticle(idValue: string, input: Partial<Article>) {
  const data = readData();
  const index = data.articles.findIndex((article) => article.id === idValue);
  if (index === -1) throw new Error('Article not found.');
  const original = data.articles[index];
  if (original.content !== input.content || original.title !== input.title) {
    data.article_revisions.push({ id: id('rev'), article_id: original.id, title: original.title, content: original.content, saved_at: now() });
  }
  const title = input.title?.trim() || original.title;
  const slug = slugify(input.slug || title);
  if (data.articles.some((article) => article.id !== idValue && article.slug === slug)) throw new Error('An article with that slug already exists.');
  data.articles[index] = {
    ...original,
    title,
    slug,
    content: typeof input.content === 'string' ? input.content : original.content,
    excerpt: typeof input.excerpt === 'string' ? input.excerpt.trim() || null : original.excerpt,
    category_id: input.category_id === undefined ? original.category_id : input.category_id || null,
    author_name: input.author_name?.trim() || original.author_name || 'Admin',
    status: input.status === 'published' ? 'published' : 'draft',
    featured: typeof input.featured === 'boolean' ? input.featured : original.featured,
    tags: Array.isArray(input.tags) ? input.tags.map((tag) => String(tag).trim()).filter(Boolean) : original.tags,
    updated_at: now(),
  };
  writeData(data);
  return withCategory(data.articles[index], data.categories);
}

export function deleteArticle(idValue: string) {
  const data = readData();
  data.articles = data.articles.filter((article) => article.id !== idValue);
  data.article_revisions = data.article_revisions.filter((revision) => revision.article_id !== idValue);
  writeData(data);
}

export function searchArticles(query: string): ArticleWithCategory[] {
  const term = query.trim().toLowerCase();
  if (!term) return [];
  const data = readData();
  return data.articles
    .filter((article) => article.status === 'published')
    .map((article) => withCategory(article, data.categories))
    .filter((article) => [
      article.title,
      article.excerpt ?? '',
      article.content,
      article.categories?.name ?? '',
      article.tags.join(' '),
    ].join(' ').toLowerCase().includes(term))
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, 50);
}

export function getStats() {
  const data = readData();
  const recent = data.articles
    .slice()
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, 5)
    .map((article) => withCategory(article, data.categories));
  return {
    totalArticles: data.articles.length,
    publishedArticles: data.articles.filter((article) => article.status === 'published').length,
    draftArticles: data.articles.filter((article) => article.status === 'draft').length,
    totalCategories: data.categories.length,
    recentArticles: recent,
  };
}
