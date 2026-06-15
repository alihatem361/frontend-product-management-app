"use client";

/**
 * Posts page — displays a paginated list of posts from DummyJSON.
 * Uses Next/Prev buttons with skip/limit for pagination.
 */

import { useState } from "react";
import { useGetPostsQuery } from "@/features/api/postsApi";
import { PostCard } from "@/components/posts/PostCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";

const LIMIT = 12;

function PostCardSkeleton() {
  return (
    <div className="rounded-2xl bg-slate-900/60 border border-white/5 overflow-hidden p-5 space-y-3">
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <div className="flex gap-2 pt-1">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-5 w-14 rounded-full" />
      </div>
      <div className="flex items-center gap-4 pt-3 border-t border-white/5">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-4 w-16 ml-auto" />
      </div>
    </div>
  );
}

export default function PostsPage() {
  const [page, setPage] = useState(0);
  const skip = page * LIMIT;

  const { data, isFetching, isError } = useGetPostsQuery({ limit: LIMIT, skip });

  const totalPages = data ? Math.ceil(data.total / LIMIT) : 0;
  const isFirstPage = page === 0;
  const isLastPage = data ? page >= totalPages - 1 : true;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Posts</h1>
          {data && (
            <p className="text-sm text-slate-500 mt-1">
              Showing {skip + 1}–{Math.min(skip + LIMIT, data.total)} of{" "}
              {data.total} posts
            </p>
          )}
        </div>
      </div>

      {/* Error state */}
      {isError && (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
            <svg
              className="w-7 h-7 text-rose-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <p className="text-slate-300 font-semibold">Failed to load posts</p>
          <p className="text-slate-500 text-sm">
            Check your connection and try again.
          </p>
        </div>
      )}

      {/* Skeleton grid */}
      {isFetching && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: LIMIT }).map((_, i) => (
            <PostCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Posts grid */}
      {data && !isFetching && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {data.posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          {/* Empty state */}
          {data.posts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
              <div className="w-14 h-14 rounded-2xl bg-slate-800/80 border border-white/5 flex items-center justify-center">
                <svg
                  className="w-7 h-7 text-slate-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <p className="text-slate-300 font-semibold">No posts found</p>
            </div>
          )}
        </>
      )}

      {/* Pagination controls */}
      {data && data.total > LIMIT && (
        <div className="flex items-center justify-center gap-4 mt-10">
          <Button
            variant="secondary"
            size="md"
            disabled={isFirstPage || isFetching}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            leftIcon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            }
          >
            Previous
          </Button>

          <span className="text-sm text-slate-400">
            Page {page + 1} of {totalPages}
          </span>

          <Button
            variant="secondary"
            size="md"
            disabled={isLastPage || isFetching}
            onClick={() => setPage((p) => p + 1)}
            rightIcon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            }
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
