import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDirectory = path.join(process.cwd(), 'src/content');

export function getPostBySlug(slug: string) {
  const fullPath = path.join(contentDirectory, `${slug}.mdx`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    slug,
    frontmatter: data,
    content,
  };
}

export function getAllPosts() {
  const files = fs.readdirSync(contentDirectory);
  return files.map((fileName) => {
    const slug = fileName.replace(/\.mdx$/, '');
    const { frontmatter } = getPostBySlug(slug);
    return {
      slug,
      ...frontmatter,
    };
  });
}