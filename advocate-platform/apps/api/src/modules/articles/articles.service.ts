import { prisma } from '../../config/database';
import { AppError } from '../../utils/AppError';
import slugify from 'slugify';
import type { CreateArticleInput, ArticleQuery } from './articles.schemas';

async function generateSlug(title: string, excludeId?: string): Promise<string> {
  const base = slugify(title, { lower: true, strict: true });
  let slug = base;
  let counter = 1;

  while (true) {
    const existing = await prisma.article.findFirst({
      where: { slug, ...(excludeId ? { NOT: { id: excludeId } } : {}) },
    });
    if (!existing) return slug;
    slug = `${base}-${counter++}`;
  }
}

export async function createArticle(data: CreateArticleInput, authorId: string) {
  const slug = data.slug || await generateSlug(data.title);

  // Check slug uniqueness
  const existing = await prisma.article.findUnique({ where: { slug } });
  if (existing) throw new AppError('An article with this slug already exists', 409);

  return prisma.article.create({
    data: {
      title: data.title,
      slug,
      shortDesc: data.shortDesc,
      content: data.content,
      featuredImage: data.featuredImage,
      authorId,
      categoryId: data.categoryId,
      tags: data.tags,
      practiceAreas: data.practiceAreas,
      status: data.status,
      publishedAt: data.status === 'PUBLISHED' ? new Date() : null,
      scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null,
      seoTitle: data.seoTitle,
      metaDesc: data.metaDesc,
      focusKeywords: data.focusKeywords,
      canonicalUrl: data.canonicalUrl,
      ogImage: data.ogImage,
    },
    include: { category: true, author: { select: { id: true, email: true } } },
  });
}

export async function listArticles(query: ArticleQuery, isAdmin = false) {
  const { page, limit, status, category, search, sortBy, sortOrder } = query;
  const skip = (page - 1) * limit;

  const where: any = {};
  if (!isAdmin) where.status = 'PUBLISHED';
  else if (status) where.status = status;
  if (category) where.category = { slug: category };
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { shortDesc: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [articles, total] = await Promise.all([
    prisma.article.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
      select: {
        id: true, title: true, slug: true, shortDesc: true,
        featuredImage: true, status: true, publishedAt: true,
        practiceAreas: true, tags: true,
        category: { select: { name: true, slug: true } },
        author: { select: { id: true } },
        createdAt: true, updatedAt: true,
      },
    }),
    prisma.article.count({ where }),
  ]);

  return { articles, total };
}

export async function getArticleBySlug(slug: string, isAdmin = false) {
  const article = await prisma.article.findFirst({
    where: { slug, ...(isAdmin ? {} : { status: 'PUBLISHED' }) },
    include: { category: true, author: { select: { id: true } } },
  });
  if (!article) throw new AppError('Article not found', 404);
  return article;
}

export async function updateArticle(id: string, data: Partial<CreateArticleInput>, userId: string) {
  const existing = await prisma.article.findUnique({ where: { id } });
  if (!existing) throw new AppError('Article not found', 404);

  const slug = data.slug ? await generateSlug(data.slug, id) : undefined;

  return prisma.article.update({
    where: { id },
    data: {
      ...(data.title && { title: data.title }),
      ...(slug && { slug }),
      ...(data.shortDesc !== undefined && { shortDesc: data.shortDesc }),
      ...(data.content && { content: data.content }),
      ...(data.featuredImage !== undefined && { featuredImage: data.featuredImage }),
      ...(data.categoryId !== undefined && { categoryId: data.categoryId }),
      ...(data.tags && { tags: data.tags }),
      ...(data.practiceAreas && { practiceAreas: data.practiceAreas }),
      ...(data.status && {
        status: data.status,
        publishedAt: data.status === 'PUBLISHED' && !existing.publishedAt ? new Date() : existing.publishedAt,
      }),
      ...(data.seoTitle !== undefined && { seoTitle: data.seoTitle }),
      ...(data.metaDesc !== undefined && { metaDesc: data.metaDesc }),
      ...(data.canonicalUrl !== undefined && { canonicalUrl: data.canonicalUrl }),
      ...(data.ogImage !== undefined && { ogImage: data.ogImage }),
    },
  });
}

export async function publishArticle(id: string) {
  return prisma.article.update({
    where: { id },
    data: { status: 'PUBLISHED', publishedAt: new Date() },
  });
}

export async function unpublishArticle(id: string) {
  return prisma.article.update({
    where: { id },
    data: { status: 'DRAFT' },
  });
}

export async function deleteArticle(id: string) {
  return prisma.article.update({
    where: { id },
    data: { status: 'ARCHIVED' },
  });
}
