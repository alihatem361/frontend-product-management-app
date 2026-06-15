'use client';

/**
 * PostCard.tsx
 *
 * Displays a post title, body preview, tags, and reaction count.
 * Follows the same glass-morphism dark theme as ProductCard.
 */

import type { Post } from '@/types';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const { id, title, body, tags, reactions, views } = post;

  return (
    <article
      id={`post-card-${id}`}
      className={[
        'flex flex-col rounded-2xl overflow-hidden',
        'bg-slate-900/60 border border-white/5',
        'hover:border-violet-500/30 hover:shadow-xl hover:shadow-violet-500/10',
        'transition-all duration-300 ease-out',
        'hover:-translate-y-1',
      ].join(' ')}
    >
      <div className="flex flex-col flex-1 p-5 gap-3">
        {/* Title */}
        <h3 className="text-base font-semibold text-white leading-snug line-clamp-2 hover:text-violet-300 transition-colors">
          {title}
        </h3>

        {/* Body preview */}
        <p className="text-sm text-slate-400 leading-relaxed line-clamp-3">
          {body}
        </p>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-full text-xs font-medium bg-violet-500/10 text-violet-300 border border-violet-500/20 capitalize"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Stats row */}
        <div className="mt-auto pt-3 flex items-center gap-4 border-t border-white/5">
          {/* Likes */}
          <span className="flex items-center gap-1.5 text-xs text-slate-400">
            <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
            </svg>
            {reactions.likes}
          </span>

          {/* Dislikes */}
          <span className="flex items-center gap-1.5 text-xs text-slate-400">
            <svg className="w-4 h-4 text-rose-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 10.667v-5.43a2 2 0 00-1.106-1.79l-.05-.025A4 4 0 0011.057 2H5.641a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z" />
            </svg>
            {reactions.dislikes}
          </span>

          {/* Views */}
          <span className="flex items-center gap-1.5 text-xs text-slate-400 ml-auto">
            <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            {views.toLocaleString()}
          </span>
        </div>
      </div>
    </article>
  );
}
