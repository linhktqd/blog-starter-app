import { Post } from "@/interfaces/post";
// Dynamically require next.config.js to get basePath
// eslint-disable-next-line @typescript-eslint/no-var-requires
const nextConfig = require('../../next.config.js');
const basePath = nextConfig.basePath || '';
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

  // Prepend basePath to all image or picture fields if they start with '/assets/'
  function withBasePath(val: string | undefined) {
    if (val && val.startsWith('/assets/')) {
      return `${basePath}${val}`;
    }
    return val;
  }

  const coverImage = withBasePath(data.coverImage);
  const author = data.author ? { ...data.author, picture: withBasePath(data.author.picture) } : data.author;
  const ogImage = data.ogImage && data.ogImage.url ? { url: withBasePath(data.ogImage.url) } : data.ogImage;

  return { ...data, coverImage, author, ogImage, slug: realSlug, content } as Post;
}


export function getAllPosts(): Post[] {
  const slugs = getPostSlugs();
  const posts = slugs
    .map((slug) => getPostBySlug(slug))
    // sort posts by date in descending order
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
  return posts;
}
