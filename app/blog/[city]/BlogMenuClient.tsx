"use client";
import MobileBlogMenu from "./MobileBlogMenu";
import { BlogPost } from "../../../types/blog";

export default function BlogMenuClient({ allPosts }: { allPosts: BlogPost[] }) {
  return <MobileBlogMenu allPosts={allPosts} />;
}
