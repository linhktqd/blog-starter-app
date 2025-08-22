import { Post } from "@/interfaces/post";
import fs from "fs";
import matter from "gray-matter";
import { join } from "path";

const postsDirectory = join(process.cwd(), "_posts");

export function getPostSlugs() {
  return fs.readdirSync(postsDirectory);
}

export function getPostBySlug(slug: string) {
  const realSlug = slug.replace(/\.md$/, "");
  const fullPath = join(postsDirectory, `${realSlug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  // Prepend basePath to coverImage if in production
  const isProd = process.env.NODE_ENV === 'production';
  const basePath = isProd ? '/blog-starter-app' : '';
  let coverImage = data.coverImage;
  if (coverImage && !coverImage.startsWith('http')) {
    coverImage = `${coverImage.startsWith('/') ? '' : '/'}${coverImage}`;
  }
  return { ...data, coverImage, slug: realSlug, content } as Post;
}


export function getAllPosts(): Post[] {
  const slugs = getPostSlugs();
  const posts = slugs
    .map((slug) => getPostBySlug(slug))
    // sort posts by date in descending order
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
  return posts;
}
