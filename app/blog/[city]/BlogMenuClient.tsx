"use client";
import MobileBlogMenu from "./MobileBlogMenu";

interface BlogPost {
  id: number;
  city: string;
}

export default function BlogMenuClient({ allPosts }: { allPosts: BlogPost[] }) {
  return <MobileBlogMenu allPosts={allPosts} />;
}
