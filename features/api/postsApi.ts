/**
 * postsApi.ts
 *
 * RTK Query endpoints for DummyJSON Posts.
 * Injected into the existing dummyJsonApi slice to share
 * base URL, auth headers, and middleware.
 */

import { dummyJsonApi } from "./dummyJsonApi";
import type { Post, PostsResponse } from "@/types";

const postsApi = dummyJsonApi.injectEndpoints({
  endpoints: (builder) => ({
    /** Paginated post list — GET /posts?limit=&skip= */
    getPosts: builder.query<PostsResponse, { limit: number; skip: number }>({
      query: ({ limit, skip }) => `/posts?limit=${limit}&skip=${skip}`,
      keepUnusedDataFor: 300,
      providesTags: (result) =>
        result
          ? [
              ...result.posts.map(({ id }) => ({
                type: "Post" as const,
                id,
              })),
              { type: "Posts", id: "LIST" },
            ]
          : [{ type: "Posts", id: "LIST" }],
    }),

    /** Single post by ID — GET /posts/{id} */
    getPostById: builder.query<Post, number>({
      query: (id) => `/posts/${id}`,
      keepUnusedDataFor: 120,
      providesTags: (_result, _error, id) => [{ type: "Post", id }],
    }),

    /** Posts by a specific user — GET /posts/user/{userId} */
    getPostsByUser: builder.query<PostsResponse, number>({
      query: (userId) => `/posts/user/${userId}`,
      keepUnusedDataFor: 300,
      providesTags: (result, _error, userId) =>
        result
          ? [
              ...result.posts.map(({ id }) => ({
                type: "Post" as const,
                id,
              })),
              { type: "Posts", id: `USER_${userId}` },
            ]
          : [{ type: "Posts", id: `USER_${userId}` }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetPostsQuery,
  useGetPostByIdQuery,
  useGetPostsByUserQuery,
} = postsApi;
