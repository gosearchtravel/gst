"use client";
import MobileBlogMenu from "./MobileBlogMenu";

export default function BlogMenuClient({ allPosts }: { allPosts: any[] }) {
  return <MobileBlogMenu allPosts={allPosts} />;
}
