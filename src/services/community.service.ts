import { CommunityCategory, CommunityPost } from '../types';
import { MOCK_COMMUNITY_POSTS } from '../data/mock/community';

class CommunityService {
  private posts: CommunityPost[] = [...MOCK_COMMUNITY_POSTS];

  async getPosts(areaId?: string, category: CommunityCategory = 'all'): Promise<CommunityPost[]> {
    await new Promise((resolve) => setTimeout(resolve, 80));
    let filtered = [...this.posts];

    if (areaId) {
      // Include posts specifically for this area or general official announcements
      filtered = filtered.filter((p) => p.areaId === areaId || (p.category === 'official' && p.isPinned));
    }

    if (category !== 'all') {
      filtered = filtered.filter((p) => p.category === category);
    }

    return filtered.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }

  async toggleHelpful(postId: string): Promise<CommunityPost | undefined> {
    const post = this.posts.find((p) => p.id === postId);
    if (!post) return undefined;

    if (post.isHelpfulByMe) {
      post.helpfulCount = Math.max(0, post.helpfulCount - 1);
      post.isHelpfulByMe = false;
    } else {
      post.helpfulCount += 1;
      post.isHelpfulByMe = true;
    }

    return { ...post };
  }

  async addComment(postId: string, message: string, authorName: string = 'Resident'): Promise<CommunityPost | undefined> {
    const post = this.posts.find((p) => p.id === postId);
    if (!post) return undefined;

    const newComment = {
      id: `comm-${Date.now()}`,
      author: authorName,
      isOfficial: false,
      message,
      createdAt: new Date().toISOString()
    };

    post.comments.push(newComment);
    post.commentsCount = post.comments.length;
    return { ...post };
  }

  async createPost(params: {
    areaId: string;
    areaName: string;
    category: CommunityCategory;
    title: string;
    message: string;
    authorName?: string;
    tags?: string[];
  }): Promise<CommunityPost> {
    await new Promise((resolve) => setTimeout(resolve, 100));

    const newPost: CommunityPost = {
      id: `post-${Date.now()}`,
      author: {
        name: params.authorName || 'Local Resident',
        isOfficial: false,
        badge: 'Resident'
      },
      areaId: params.areaId,
      areaName: params.areaName,
      category: params.category === 'all' ? 'reports' : params.category,
      title: params.title,
      message: params.message,
      createdAt: new Date().toISOString(),
      helpfulCount: 0,
      isHelpfulByMe: false,
      commentsCount: 0,
      comments: [],
      tags: params.tags || []
    };

    this.posts.unshift(newPost);
    return newPost;
  }
}

export const communityService = new CommunityService();
