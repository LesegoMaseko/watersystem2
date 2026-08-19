import { useState, useEffect, useCallback } from 'react';
import { CommunityCategory, CommunityPost } from '../types';
import { communityService } from '../services/community.service';
import { useAreaStore } from '../store/area.store';

export const useCommunity = (category: CommunityCategory = 'all') => {
  const currentArea = useAreaStore((state) => state.currentArea);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await communityService.getPosts(currentArea.id, category);
      setPosts(data);
    } finally {
      setIsLoading(false);
    }
  }, [currentArea.id, category]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const toggleHelpful = async (postId: string) => {
    const updated = await communityService.toggleHelpful(postId);
    if (updated) {
      setPosts((prev) => prev.map((p) => (p.id === postId ? updated : p)));
    }
  };

  const addComment = async (postId: string, message: string, authorName?: string) => {
    const updated = await communityService.addComment(postId, message, authorName);
    if (updated) {
      setPosts((prev) => prev.map((p) => (p.id === postId ? updated : p)));
    }
  };

  const createPost = async (params: {
    title: string;
    message: string;
    category: CommunityCategory;
    authorName?: string;
    tags?: string[];
  }) => {
    const newPost = await communityService.createPost({
      ...params,
      areaId: currentArea.id,
      areaName: currentArea.name
    });
    setPosts((prev) => [newPost, ...prev]);
    return newPost;
  };

  return {
    posts,
    isLoading,
    toggleHelpful,
    addComment,
    createPost,
    refetch: fetchPosts
  };
};
