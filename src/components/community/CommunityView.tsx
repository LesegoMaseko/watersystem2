import React, { useState } from 'react';
import {
  MessageSquare,
  ShieldCheck,
  ThumbsUp,
  MessageCircle,
  PlusCircle,
  Pin,
  Tag,
  Clock,
  Send,
  User,
  Filter,
  CheckCircle2,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Modal } from '../ui/modal';
import { CommunityCategory, CommunityPost } from '../../types';
import { useCommunity } from '../../hooks/use-community';
import { useAreaStore } from '../../store/area.store';
import { useToast } from '../../hooks/use-toast';

export const CommunityView: React.FC = () => {
  const { currentArea } = useAreaStore();
  const [selectedCategory, setSelectedCategory] = useState<CommunityCategory>('all');
  const { posts, isLoading, toggleHelpful, addComment, createPost } = useCommunity(selectedCategory);
  const { showToast } = useToast();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [newCategory, setNewCategory] = useState<CommunityCategory>('reports');
  const [authorName, setAuthorName] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  const [expandedCommentsPostId, setExpandedCommentsPostId] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState('');

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newMessage.trim()) return;

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    await createPost({
      title: newTitle.trim(),
      message: newMessage.trim(),
      category: newCategory,
      authorName: authorName.trim() || 'Resident',
      tags
    });

    showToast({
      type: 'success',
      title: 'Post Published',
      message: 'Your update is now visible in the community feed.'
    });

    setIsCreateModalOpen(false);
    setNewTitle('');
    setNewMessage('');
    setTagsInput('');
  };

  const handleSendComment = async (postId: string) => {
    if (!commentInput.trim()) return;
    await addComment(postId, commentInput.trim());
    setCommentInput('');
    showToast({
      type: 'success',
      title: 'Comment Added',
      message: 'Your reply has been posted.'
    });
  };

  const categoryLabels: Record<CommunityCategory, { label: string; icon?: any }> = {
    all: { label: 'All Updates' },
    official: { label: 'Official Notices' },
    reports: { label: 'Field Reports' },
    restored: { label: 'Restored & Flow' },
    questions: { label: 'Questions' },
    tips: { label: 'Outage Tips' }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-950 tracking-tight flex items-center gap-2.5">
            <MessageSquare className="w-6 h-6 text-blue-600" />
            Civic Community & Verified Notices
          </h1>
          <p className="text-sm text-slate-700 font-medium mt-1">
            Official municipal alerts, councilor dispatches, and grassroots neighborhood updates for {currentArea.name}.
          </p>
        </div>

        <Button
          variant="primary"
          leftIcon={<PlusCircle className="w-4 h-4" />}
          onClick={() => setIsCreateModalOpen(true)}
          className="self-start sm:self-auto"
        >
          Share Update / Ask
        </Button>
      </div>

      {/* Categories Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {(Object.keys(categoryLabels) as CommunityCategory[]).map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {categoryLabels[cat].label}
          </button>
        ))}
      </div>

      {/* Feed */}
      <div className="space-y-4">
        {posts.length === 0 ? (
          <Card className="p-12 text-center text-slate-700 space-y-2">
            <MessageSquare className="w-10 h-10 text-slate-500 mx-auto" />
            <h3 className="text-base font-bold text-slate-950">No Posts In This Category</h3>
            <p className="text-xs max-w-sm mx-auto font-medium text-slate-700">
              Be the first to share an update about water pressure or restoration in {currentArea.suburb}.
            </p>
          </Card>
        ) : (
          posts.map((post) => {
            const isOfficial = post.author.isOfficial;
            const isExpanded = expandedCommentsPostId === post.id;

            return (
              <Card
                key={post.id}
                className={`p-5 sm:p-6 transition-all ${
                  post.isPinned
                    ? 'border-blue-300 bg-gradient-to-r from-blue-50/40 via-white to-white'
                    : 'border-slate-200'
                }`}
              >
                <div className="space-y-3.5">
                  {/* Top Author Row */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm ${
                          isOfficial
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-800'
                        }`}
                      >
                        {isOfficial ? <ShieldCheck className="w-5 h-5" /> : post.author.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-slate-950">
                            {post.author.name}
                          </span>
                          {isOfficial && (
                            <Badge variant="info" size="sm">
                              VERIFIED OFFICIAL
                            </Badge>
                          )}
                          {!isOfficial && post.author.badge && (
                            <span className="text-[10px] text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full font-bold">
                              {post.author.badge}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-700 font-medium mt-0.5">
                          <span>{post.areaName}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-600" />
                            {new Date(post.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    {post.isPinned && (
                      <div className="flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-100 px-2.5 py-1 rounded-full">
                        <Pin className="w-3 h-3" /> Pinned
                      </div>
                    )}
                  </div>

                  {/* Title & Message Body */}
                  <div>
                    <h3 className="text-base font-bold text-slate-950">
                      {post.title}
                    </h3>
                    <p className="text-sm text-slate-800 font-medium mt-1.5 leading-relaxed whitespace-pre-line">
                      {post.message}
                    </p>
                  </div>

                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {post.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Actions (Helpful Button & Comments Button) */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => toggleHelpful(post.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                          post.isHelpfulByMe
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <ThumbsUp className={`w-3.5 h-3.5 ${post.isHelpfulByMe ? 'fill-current' : ''}`} />
                        <span>Helpful ({post.helpfulCount})</span>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setExpandedCommentsPostId(isExpanded ? null : post.id)
                        }
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold bg-slate-50 text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Replies ({post.comments.length})</span>
                      </button>
                    </div>

                    <span className="capitalize text-[11px] font-bold text-slate-700">
                      Category: {post.category}
                    </span>
                  </div>

                  {/* Expandable Comments Drawer */}
                  {isExpanded && (
                    <div className="pt-4 border-t border-slate-100 space-y-3">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-700">
                        Community Discussion
                      </p>

                      {/* Existing Comments */}
                      <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                        {post.comments.length === 0 ? (
                          <p className="text-xs font-medium text-slate-700 py-2">No replies yet. Be the first!</p>
                        ) : (
                          post.comments.map((comm) => (
                            <div
                              key={comm.id}
                              className={`p-3 rounded-xl text-xs space-y-1 ${
                                comm.isOfficial
                                  ? 'bg-blue-50 border border-blue-200'
                                  : 'bg-slate-50'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5 font-bold text-slate-950">
                                  <span>{comm.author}</span>
                                  {comm.isOfficial && (
                                    <span className="text-[9px] bg-blue-600 text-white px-1.5 py-0.2 rounded font-bold">
                                      OFFICIAL
                                    </span>
                                  )}
                                </div>
                                <span className="text-[10px] font-medium text-slate-700">
                                  {new Date(comm.createdAt).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </span>
                              </div>
                              <p className="text-slate-800 font-medium leading-relaxed">
                                {comm.message}
                              </p>
                            </div>
                          ))
                        )}
                      </div>

                      {/* Add comment input */}
                      <div className="flex gap-2 pt-2">
                        <Input
                          value={commentInput}
                          onChange={(e) => setCommentInput(e.target.value)}
                          placeholder="Write a helpful response or report..."
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSendComment(post.id);
                          }}
                        />
                        <Button
                          size="sm"
                          rightIcon={<Send className="w-3.5 h-3.5" />}
                          onClick={() => handleSendComment(post.id)}
                        >
                          Reply
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Create Post Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Share a Water Update or Question"
        description={`Posting to ${currentArea.name} community feed.`}
        maxWidth="lg"
      >
        <form onSubmit={handleCreatePost} className="space-y-4">
          <Input
            label="Your Name / Handle"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder="e.g. Sipho (Resident, Sector 4)"
          />

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              Category
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'reports', label: 'Field Report' },
                { id: 'restored', label: 'Water Restored' },
                { id: 'questions', label: 'Question' },
                { id: 'tips', label: 'Outage Tip' }
              ].map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setNewCategory(c.id as CommunityCategory)}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    newCategory === c.id
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <Input
            label="Post Headline"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="e.g. Tanker just arrived at community centre"
            required
          />

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              Message Details
            </label>
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              rows={4}
              className="w-full bg-white border border-slate-300 rounded-xl p-3 text-sm text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Provide exact street location, tap flow observations, tanker queues, or useful advice for neighbors..."
              required
            />
          </div>

          <Input
            label="Tags (Comma separated)"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="e.g. Tanker, LowPressure, 4thAve"
          />

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <Button variant="outline" type="button" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Publish Update
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
