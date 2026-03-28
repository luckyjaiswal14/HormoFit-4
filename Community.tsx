/**
 * HormoFit Community Component
 * AI-verified PCOD community and trust network.
 */

import React, { useState } from 'react';
import { MessageSquare, ThumbsUp, Share2, ShieldCheck, User, Search, Plus, Filter, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Post {
  id: string;
  author: string;
  role: 'user' | 'doctor' | 'expert';
  content: string;
  likes: number;
  comments: number;
  isVerified: boolean;
  tags: string[];
  time: string;
}

export const Community: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([
    { id: '1', author: 'Dr. Sarah Smith', role: 'doctor', content: 'Recent research shows that even 10 minutes of strength training can significantly improve insulin sensitivity in women with PCOD. Focus on large muscle groups like legs and back.', likes: 124, comments: 18, isVerified: true, tags: ['Exercise', 'Research'], time: '2h ago' },
    { id: '2', author: 'Priya K.', role: 'user', content: 'I started adding flaxseeds to my breakfast every morning and I feel much less bloated! Has anyone else tried this?', likes: 45, comments: 12, isVerified: true, tags: ['Nutrition', 'Bloating'], time: '5h ago' },
    { id: '3', author: 'Expert AI', role: 'expert', content: 'Misinformation Alert: There is no single "cure" for PCOD, but lifestyle management is highly effective. Avoid extreme diets that promise instant results.', likes: 210, comments: 5, isVerified: true, tags: ['Alert', 'Management'], time: '1d ago' },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [newPost, setNewPost] = useState({ content: '', tags: [] as string[] });

  const handleAddPost = () => {
    if (newPost.content) {
      const post: Post = {
        id: Date.now().toString(),
        author: 'You',
        role: 'user',
        content: newPost.content,
        likes: 0,
        comments: 0,
        isVerified: false,
        tags: newPost.tags,
        time: 'Just now',
      };
      setPosts([post, ...posts]);
      setIsAdding(false);
      setNewPost({ content: '', tags: [] });
    }
  };

  const toggleTag = (tag: string) => {
    if (newPost.tags.includes(tag)) {
      setNewPost({ ...newPost, tags: newPost.tags.filter(t => t !== tag) });
    } else {
      setNewPost({ ...newPost, tags: [...newPost.tags, tag] });
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-rose-950">Trust Network</h1>
          <p className="text-rose-600/70 mt-1">AI-verified PCOD community and expert insights.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-rose-600 text-white px-5 py-2.5 rounded-2xl font-bold flex items-center gap-2 hover:bg-rose-700 transition-colors shadow-lg shadow-rose-200"
        >
          <Plus className="w-5 h-5" /> New Post
        </button>
      </header>

      {/* Trust Banner */}
      <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex items-center gap-4">
        <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <p className="text-sm text-emerald-800 font-medium">
          All medical advice in this community is verified by our AI and medical experts to prevent misinformation.
        </p>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-rose-400" />
          <input 
            type="text"
            placeholder="Search discussions..."
            className="w-full p-4 pl-12 bg-white/80 backdrop-blur-sm border border-rose-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-rose-500 focus:outline-none text-rose-900 placeholder:text-rose-300"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="w-14 h-14 bg-white/80 backdrop-blur-sm border border-rose-100 rounded-2xl flex items-center justify-center text-rose-500 hover:bg-rose-50 transition-colors shadow-sm">
          <Filter className="w-6 h-6" />
        </button>
      </div>

      {/* Post Feed */}
      <div className="space-y-6">
        {posts.map((post) => (
          <motion.div 
            key={post.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl shadow-sm border border-rose-100 space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-400">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-rose-900">{post.author}</h4>
                    {post.isVerified && <ShieldCheck className="w-4 h-4 text-rose-500" />}
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                      post.role === 'doctor' ? 'bg-emerald-50 text-emerald-600' :
                      post.role === 'expert' ? 'bg-rose-50 text-rose-600' :
                      'bg-rose-50 text-rose-600'
                    }`}>
                      {post.role}
                    </span>
                  </div>
                  <p className="text-xs text-rose-400 font-medium">{post.time}</p>
                </div>
              </div>
              <div className="flex gap-2">
                {post.tags.map(t => (
                  <span key={t} className="text-[10px] bg-rose-50 text-rose-500 px-2 py-0.5 rounded-full font-bold">{t}</span>
                ))}
              </div>
            </div>
            <p className="text-rose-800 leading-relaxed">{post.content}</p>
            <div className="flex items-center gap-6 pt-2 border-t border-rose-50">
              <button className="flex items-center gap-2 text-rose-400 hover:text-rose-600 transition-colors text-sm font-bold">
                <ThumbsUp className="w-5 h-5" /> {post.likes}
              </button>
              <button className="flex items-center gap-2 text-rose-400 hover:text-rose-600 transition-colors text-sm font-bold">
                <MessageSquare className="w-5 h-5" /> {post.comments}
              </button>
              <button className="flex items-center gap-2 text-rose-400 hover:text-rose-600 transition-colors text-sm font-bold ml-auto">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* New Post Modal */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAdding(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-8 space-y-6">
                <h3 className="text-2xl font-bold text-slate-900">Create New Post</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">What's on your mind?</label>
                    <textarea 
                      placeholder="Share your experience or ask a question..."
                      className="w-full mt-2 p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-rose-500 min-h-[120px] resize-none"
                      value={newPost.content}
                      onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">Tags</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {['Nutrition', 'Exercise', 'Mental Health', 'Bloating', 'Success Story', 'Question'].map((t) => (
                        <button
                          key={t}
                          onClick={() => toggleTag(t)}
                          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                            newPost.tags.includes(t) ? 'bg-rose-100 text-rose-700 border-rose-200' : 'bg-slate-50 text-slate-500 border-transparent'
                          } border`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button 
                    onClick={() => setIsAdding(false)}
                    className="flex-1 py-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleAddPost}
                    className="flex-1 py-4 rounded-2xl font-bold bg-rose-600 text-white hover:bg-rose-700 transition-colors shadow-lg shadow-rose-200"
                  >
                    Post to Community
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
