import React, { useState, useRef } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useModerationStore } from '../store/useModerationStore';
import { useLanguageStore } from '../store/useLanguageStore';
import { t } from '../lib/i18n';
import VerificationGate from './VerificationGate';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Textarea, Input } from './ui/input';
import { Send, MapPin, AlertTriangle, Package, Heart, MessageCircle, Flag, BadgeCheck, Plus, X, Crop, Type, Smile, Image as ImageIcon, Sticker, Check, Eye, EyeOff, Pin, Share2, BarChart2, Lock } from 'lucide-react';
import { useChatStore } from '../store/useChatStore';
import { useNavigate } from 'react-router-dom';

export default function Feed() {
  const { user } = useAuthStore();
  const isGuest = user?.role === 'guest';
  const { language } = useLanguageStore();
  const { addReport } = useModerationStore();
  const { openOrCreateChat } = useChatStore();
  const navigate = useNavigate();
  
  const [posts, setPosts] = useState([
    { 
      id: 1, author: 'Leyla M.', avatar: null, type: 'alert', 
      content: 'Suspicious caller pretending to be from Kapital Bank. They asked for card details. Please warn your elderly relatives!', 
      time: '2 hours ago', likes: 12, verified: true, pinned: false, hidden: false, locationScope: 'neighborhood', views: 142, clicks: 12, image: null,
      comments: [
        { id: 101, author: 'Samir', content: 'Thanks for the warning!', reactions: ['👍', '❤️', '🙏', '💯'] },
        { id: 102, author: 'Aysel', content: 'Same happened to me yesterday.', reactions: ['😠', '👍'] }
      ]
    },
    { id: 2, author: 'Kamran B.', avatar: null, type: 'free_stuff', content: 'Leaving an old but working desk near block A. Anyone can pick it up today.', time: '4 hours ago', likes: 8, comments: [], verified: false, pinned: false, hidden: false, locationScope: 'building', views: 89, clicks: 4, image: null },
    { id: 3, author: 'Aysel H.', avatar: null, type: 'feed', content: 'Does anyone know when the hot water will be back in the second block?', time: '5 hours ago', likes: 2, comments: [], verified: true, pinned: false, hidden: false, locationScope: 'building', views: 45, clicks: 0, image: null },
  ]);

  const [moments, setMoments] = useState([
    { id: 1, author: 'Tural S.', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop', image: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&h=800&fit=crop', verified: true, reactions: ['👍', '❤️', '🔥'] },
    { id: 2, author: 'Aysel H.', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&h=800&fit=crop', verified: false, reactions: ['🤩', '👍'] },
    { id: 3, author: 'Kamran B.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop', image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&h=800&fit=crop', verified: false, reactions: [] },
  ]);

  const [expandedComments, setExpandedComments] = useState<number[]>([]);
  const [expandedReactions, setExpandedReactions] = useState<number[]>([]);
  const [activeMoment, setActiveMoment] = useState<any>(null);
  
  // Moment Editor
  const [momentDraft, setMomentDraft] = useState<string | null>(null);
  const [showMomentEditor, setShowMomentEditor] = useState(false);
  
  // Feed Composer & 1:1 Crop
  const [postDraftContent, setPostDraftContent] = useState('');
  const [postDraftImage, setPostDraftImage] = useState<string | null>(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const [postType, setPostType] = useState<'feed' | 'alert' | 'question'>('feed');
  
  const [selectedNeighbor, setSelectedNeighbor] = useState<any>(null);
  const [locationFilter, setLocationFilter] = useState<'all' | 'building' | 'neighborhood'>('all');
  const [postAnonymously, setPostAnonymously] = useState(false);

  const toggleComments = (postId: number) => {
    setExpandedComments(prev => prev.includes(postId) ? prev.filter(id => id !== postId) : [...prev, postId]);
  };

  const toggleReactions = (commentId: number) => {
    setExpandedReactions(prev => prev.includes(commentId) ? prev.filter(id => id !== commentId) : [...prev, commentId]);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'alert': return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'free_stuff': return <Package className="h-4 w-4 text-green-500" />;
      case 'lost_pet': return <Heart className="h-4 w-4 text-red-500" />;
      default: return <MapPin className="h-4 w-4 text-blue-500" />;
    }
  };

  const handleUploadMoment = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = (e: any) => {
      const file = e.target.files?.[0];
      if (file) {
        setMomentDraft(URL.createObjectURL(file));
        setShowMomentEditor(true);
      }
    };
    fileInput.click();
  };

  const confirmMomentUpload = () => {
    if (!momentDraft) return;
    setShowMomentEditor(false);
    alert('Moment uploaded! AI moderation is checking for 18+ content...');
    setTimeout(() => {
      const newMoment = {
        id: Date.now(),
        author: user?.name || 'You',
        avatar: user?.avatar || null,
        image: momentDraft,
        verified: user?.is_verified || false,
        reactions: []
      };
      setMoments([newMoment, ...moments]);
      setMomentDraft(null);
    }, 1500);
  };
  
  const handleUploadPostImage = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = (e: any) => {
      const file = e.target.files?.[0];
      if (file) {
        setCropImageSrc(URL.createObjectURL(file));
        setShowCropModal(true);
      }
    };
    fileInput.click();
  };
  
  const handleConfirmCrop = () => {
    if (cropImageSrc) {
      setPostDraftImage(cropImageSrc);
    }
    setShowCropModal(false);
    setCropImageSrc(null);
  };
  
  const handlePostSubmit = () => {
    if (!postDraftContent.trim() && !postDraftImage) return;
    
    const newPost: any = {
      id: Date.now(),
      author: user?.name || 'You',
      avatar: user?.avatar || null,
      type: postType,
      content: postDraftContent,
      time: 'Just now',
      likes: 0,
      verified: user?.is_verified || false,
      pinned: false,
      hidden: false,
      locationScope: 'building',
      views: 0,
      clicks: 0,
      image: postDraftImage,
      comments: []
    };
    
    setPosts([newPost, ...posts]);
    setPostDraftContent('');
    setPostDraftImage(null);
    setPostAnonymously(false);
    setPostType('feed');
  };

  const handleLike = (postId: number) => {
    setPosts(posts.map(p => p.id === postId ? { ...p, likes: p.likes + 1 } : p));
  };

  const togglePin = (postId: number) => {
    setPosts(posts.map(p => p.id === postId ? { ...p, pinned: !p.pinned } : p));
  };
  
  const hidePost = (postId: number) => {
    setPosts(posts.map(p => p.id === postId ? { ...p, hidden: true } : p));
  };
  
  const handleShare = () => {
    alert('Post shared via internal messages!');
  };

  const visiblePosts = posts
    .filter(p => !p.hidden)
    .filter(p => locationFilter === 'all' || p.locationScope === locationFilter)
    .sort((a, b) => {
      if (a.pinned === b.pinned) return b.id - a.id;
      return a.pinned ? -1 : 1;
    });

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{t('feed.title', language)}</h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">{t('feed.subtitle', language)}</p>
        </div>
        <span className="inline-flex items-center rounded-full bg-black/10 dark:bg-white/10 border border-black/10 dark:border-white/10 px-3 py-1 text-xs font-medium text-blue-300">
          {user?.district}
        </span>
      </div>

      {/* Moments */}
      {!isGuest && (
        <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
          <div className="flex flex-col items-center space-y-1 shrink-0 snap-start">
            <button 
              onClick={handleUploadMoment}
              className="w-16 h-16 rounded-full bg-white dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              <Plus className="w-6 h-6 text-slate-400" />
            </button>
            <span className="text-[10px] font-medium text-slate-600 dark:text-slate-400">Add Moment</span>
          </div>
          
          {moments.map(moment => (
            <div key={moment.id} className="flex flex-col items-center space-y-1 shrink-0 snap-start relative">
              <button 
                onClick={() => setActiveMoment(moment)}
                className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-blue-500 to-purple-500"
              >
                <div className="w-full h-full rounded-full overflow-hidden border-2 border-white dark:border-slate-900 bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                  {moment.avatar && !isGuest ? (
                    <img src={moment.avatar} alt={isGuest ? 'Neighbor' : moment.author} className="w-full h-full object-cover" />
                  ) : (
                    <span className="font-bold text-slate-500">{(isGuest ? 'Neighbor' : moment.author).charAt(0)}</span>
                  )}
                </div>
              </button>
              <span className="text-[10px] font-medium text-slate-600 dark:text-slate-400 truncate w-16 text-center">
                {isGuest ? 'Neighbor' : moment.author.split(' ')[0]}
              </span>
              
              {/* Reactions summary in feed */}
              {moment.reactions.length > 0 && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white dark:bg-slate-800 rounded-full px-1.5 py-0.5 shadow-sm border border-slate-100 dark:border-slate-700 text-[10px] flex items-center z-10 whitespace-nowrap">
                  {moment.reactions.slice(0, 3).join('')}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <VerificationGate>
        <Card className="glass-panel border-black/10 dark:border-white/10 shadow-2xl">
          <CardContent className="pt-6">
            <Textarea 
              placeholder={t('feed.post_placeholder', language)} 
              value={postDraftContent}
              onChange={(e) => setPostDraftContent(e.target.value)}
              className="mb-4 bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-500 dark:text-slate-500 resize-none" 
            />
            
            {postDraftImage && (
              <div className="mb-4 relative w-32 h-32 rounded-lg overflow-hidden border border-black/10 dark:border-white/10">
                <img src={postDraftImage} alt="Draft" className="w-full h-full object-cover" />
                <button 
                  onClick={() => setPostDraftImage(null)}
                  className="absolute top-1 right-1 bg-black/50 p-1 rounded-full text-white hover:bg-black/70"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                <Eye className="w-4 h-4" />
                <span>Visible to:</span>
                <select className="bg-transparent border-b border-black/20 dark:border-white/20 text-slate-900 dark:text-white outline-none focus:border-indigo-500">
                  <option value="everyone" className="text-black">Everyone</option>
                  <option value="building" className="text-black">Same Building</option>
                  <option value="landing" className="text-black">Same Landing</option>
                  <option value="courtyard" className="text-black">Same Courtyard</option>
                </select>
              </div>
              <button 
                onClick={handleUploadPostImage}
                className="flex items-center space-x-1 text-sm text-slate-600 hover:text-indigo-500 transition-colors"
              >
                <ImageIcon className="w-5 h-5" />
                <span>Photo</span>
              </button>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex space-x-2 text-sm text-slate-600 dark:text-slate-400">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setPostType(p => p === 'alert' ? 'feed' : 'alert')} 
                  className={`h-8 border-black/10 dark:border-white/10 text-slate-700 dark:text-slate-300 transition-all ${postType === 'alert' ? 'bg-orange-500/20 border-orange-500 text-orange-500 font-semibold hover:bg-orange-500/30' : 'hover:bg-black/5 dark:bg-white/5 hover:text-slate-900 dark:text-white'}`}
                >
                  {t('common.alert', language)}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setPostType(p => p === 'question' ? 'feed' : 'question')} 
                  className={`h-8 border-black/10 dark:border-white/10 text-slate-700 dark:text-slate-300 transition-all ${postType === 'question' ? 'bg-indigo-500/20 border-indigo-500 text-indigo-500 font-semibold hover:bg-indigo-500/30' : 'hover:bg-black/5 dark:bg-white/5 hover:text-slate-900 dark:text-white'}`}
                >
                  {t('common.question', language)}
                </Button>
              </div>
              <Button onClick={handlePostSubmit} size="sm" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white border-none shadow-lg shadow-blue-500/20">
                <Send className="mr-2 h-4 w-4" />
                {t('common.post', language)}
              </Button>
            </div>
          </CardContent>
        </Card>
      </VerificationGate>
      
      {/* Location Filter */}
      <div className="flex space-x-2 pb-2 overflow-x-auto scrollbar-hide">
        <button 
          onClick={() => setLocationFilter('all')}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${locationFilter === 'all' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' : 'bg-black/5 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-black/10 dark:hover:bg-white/10'}`}
        >
          All Posts
        </button>
        <button 
          onClick={() => setLocationFilter('building')}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${locationFilter === 'building' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' : 'bg-black/5 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-black/10 dark:hover:bg-white/10'}`}
        >{t('common.building', language)}</button>
        <button 
          onClick={() => setLocationFilter('neighborhood')}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${locationFilter === 'neighborhood' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' : 'bg-black/5 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-black/10 dark:hover:bg-white/10'}`}
        >{t('common.neighborhood', language)}</button>
      </div>

      <div className="space-y-4">
        {visiblePosts.map(post => (
          <Card key={post.id} className={`glass-panel overflow-hidden border-black/10 dark:border-white/10 transition-all hover:shadow-xl ${post.pinned ? 'ring-2 ring-indigo-500/50' : ''}`}>
            {post.pinned && (
              <div className="bg-indigo-500/10 px-4 py-1 flex items-center space-x-2 border-b border-indigo-500/10">
                <Pin className="h-3 w-3 text-indigo-500" />
                <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Pinned by {isGuest ? 'Neighbor' : post.author}</span>
              </div>
            )}
            <CardHeader className="flex flex-row items-start justify-between space-y-0 p-4 pb-2">
              <div className="flex items-center space-x-3">
                <div 
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-700 overflow-hidden text-slate-800 dark:text-slate-200 font-medium cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => setSelectedNeighbor(post)}
                >
                  {post.avatar && !isGuest ? (
                    <img src={post.avatar} alt={isGuest ? 'Neighbor' : post.author} className="w-full h-full object-cover" />
                  ) : (
                    (isGuest ? 'Neighbor' : post.author).charAt(0)
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-1 cursor-pointer hover:underline" onClick={() => setSelectedNeighbor(post)}>
                    {isGuest ? 'Neighbor' : post.author}
                    {!isGuest && post.verified && <BadgeCheck className="h-4 w-4 text-blue-500" />}
                  </h4>
                  <div className="flex items-center space-x-1 text-xs text-slate-600 dark:text-slate-400">
                    {getTypeIcon(post.type)}
                    <span className="uppercase tracking-wider font-bold">{t(('common.' + post.type) as any, language)}</span>
                    {!isGuest && (
                      <>
                        <span>•</span>
                        <span>{post.time}</span>
                      </>
                    )}
                    <span>•</span>
                    <span className="capitalize">{post.locationScope}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={`h-8 w-8 p-0 ${post.pinned ? 'text-indigo-500' : 'text-slate-400 hover:text-indigo-500'}`}
                  onClick={() => togglePin(post.id)}
                  title={post.pinned ? "Unpin post" : "Pin post"}
                >
                  <Pin className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                  onClick={() => hidePost(post.id)}
                  title="Hide post"
                >
                  <EyeOff className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0 text-slate-400 hover:text-red-400 hover:bg-red-500/10"
                  onClick={() => addReport({ type: 'post', contentId: post.id, content: post.content, author: isGuest ? 'Neighbor' : post.author, reason: 'Flagged by user' })}
                  title="Report post"
                >
                  <Flag className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-2">
              <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed">{post.content}</p>
              
              {post.image && (
                <div className="mt-3 rounded-xl overflow-hidden max-w-sm border border-black/10 dark:border-white/10 aspect-square">
                  <img src={post.image} alt="Post content" className="w-full h-full object-cover" />
                </div>
              )}
              
              <div className="mt-4 flex items-center justify-between border-t border-black/10 dark:border-white/10 pt-3 text-sm text-slate-600 dark:text-slate-400 font-medium">
                <div className="flex items-center space-x-4">
                  <button onClick={() => handleLike(post.id)} className="flex items-center space-x-1 hover:text-blue-400 transition-colors">
                    <Heart className="h-4 w-4" />
                    <span>{post.likes} {t('common.helpful', language)}</span>
                  </button>
                  <button 
                    onClick={() => toggleComments(post.id)}
                    className="flex items-center space-x-1 hover:text-blue-400 transition-colors"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>{post.comments.length} {t('common.comments', language)}</span>
                  </button>
                  <button 
                    onClick={handleShare}
                    className="flex items-center space-x-1 hover:text-blue-400 transition-colors"
                  >
                    <Share2 className="h-4 w-4" />
                    <span>{t('common.share', language)}</span>
                  </button>
                </div>
                
                {/* Views & Clicks for author */}
                {(post.author === user?.name || post.author === 'You') && (
                  <div className="flex items-center space-x-3 text-xs text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
                    <div className="flex items-center space-x-1">
                      <Eye className="w-3 h-3" />
                      <span>{post.views} views</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <BarChart2 className="w-3 h-3" />
                      <span>{post.clicks} clicks</span>
                    </div>
                  </div>
                )}
              </div>
              
              {expandedComments.includes(post.id) && (
                <div className="mt-4 space-y-3 pt-3 border-t border-black/5 dark:border-white/5">
                  {post.comments.map(comment => (
                    <div key={comment.id} className="bg-black/5 dark:bg-white/5 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-semibold text-slate-900 dark:text-white">{isGuest ? 'Neighbor' : comment.author}</span>
                      </div>
                      <p className="text-sm text-slate-700 dark:text-slate-300">{comment.content}</p>
                      
                      {/* Comment reactions */}
                      {comment.reactions && comment.reactions.length > 0 && (
                        <div className="mt-2 flex items-center space-x-2 text-xs">
                          <button 
                            onClick={() => toggleReactions(comment.id)}
                            className="bg-black/10 dark:bg-white/10 px-2 py-0.5 rounded-full hover:bg-black/20 dark:hover:bg-white/20 transition-colors"
                          >
                            {expandedReactions.includes(comment.id) 
                              ? comment.reactions.join(' ')
                              : comment.reactions.slice(0, 3).join(' ') + (comment.reactions.length > 3 ? ` +${comment.reactions.length - 3}` : '')
                            }
                          </button>
                          <button className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">Reply</button>
                        </div>
                      )}
                    </div>
                  ))}
                  {isGuest ? (
                    <div className="flex items-center space-x-2 mt-2 p-2 bg-slate-500/5 rounded-lg border border-slate-500/10">
                      <Lock className="w-3.5 h-3.5 text-slate-500 mr-1 shrink-0" />
                      <span className="text-xs text-slate-500">Register or sign in to comment on posts</span>
                    </div>
                  ) : (
                    <VerificationGate compact={true}>
                      <div className="flex items-center space-x-2 mt-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-700 text-white text-xs font-medium shrink-0 overflow-hidden">
                          {user?.avatar ? <img src={user.avatar} alt="You" className="w-full h-full object-cover" /> : user?.name.charAt(0)}
                        </div>
                        <Input placeholder="Write a comment..." className="h-8 text-sm bg-white dark:bg-slate-900" />
                      </div>
                    </VerificationGate>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Post Image 1:1 Crop Modal */}
      {showCropModal && cropImageSrc && (
        <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-black/10 dark:border-white/10 flex items-center justify-between">
              <h3 className="font-semibold text-slate-900 dark:text-white">Crop Image (1:1)</h3>
              <button onClick={() => setShowCropModal(false)} className="text-slate-500 hover:text-slate-800 dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 flex items-center justify-center bg-black/5 dark:bg-white/5">
              <div className="relative w-64 h-64 border-2 border-indigo-500 rounded-lg overflow-hidden flex items-center justify-center bg-black">
                {/* Mocking a crop interaction, displaying the image fitting the 1:1 box */}
                <img src={cropImageSrc} alt="To crop" className="w-full h-full object-cover opacity-80" />
                <div className="absolute inset-0 border-4 border-white/50 border-dashed rounded-lg pointer-events-none"></div>
                <div className="absolute top-2 left-2 text-white/80 text-[10px] font-bold bg-black/40 px-1 rounded">1:1 FRAME</div>
              </div>
            </div>
            <div className="p-4 flex justify-end space-x-2 border-t border-black/10 dark:border-white/10">
              <Button variant="ghost" onClick={() => setShowCropModal(false)}>Cancel</Button>
              <Button onClick={handleConfirmCrop} className="bg-indigo-600 hover:bg-indigo-500 text-white">
                <Check className="w-4 h-4 mr-2" />
                Apply Crop
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Moment Editor Modal */}
      {showMomentEditor && momentDraft && (
        <div className="fixed inset-0 z-50 bg-black/90 flex flex-col">
          <div className="flex items-center justify-between p-4 absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/60 to-transparent">
            <button onClick={() => { setShowMomentEditor(false); setMomentDraft(null); }} className="text-white hover:bg-white/20 p-2 rounded-full">
              <X className="w-6 h-6" />
            </button>
            <h3 className="text-white font-medium">Edit Moment</h3>
            <button onClick={confirmMomentUpload} className="text-white bg-blue-600 hover:bg-blue-500 p-2 rounded-full">
              <Check className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex-1 flex items-center justify-center p-4">
            <img src={momentDraft} alt="Draft" className="max-h-[70vh] max-w-full object-contain rounded-xl" />
          </div>
          
          <div className="p-6 absolute bottom-0 left-0 right-0 bg-black/80 flex justify-center space-x-6 border-t border-white/10">
            <button className="flex flex-col items-center space-y-1 text-white/70 hover:text-white transition-colors">
              <Crop className="w-6 h-6" /><span className="text-xs">Crop</span>
            </button>
            <button className="flex flex-col items-center space-y-1 text-white/70 hover:text-white transition-colors">
              <Type className="w-6 h-6" /><span className="text-xs">Text</span>
            </button>
            <button className="flex flex-col items-center space-y-1 text-white/70 hover:text-white transition-colors">
              <Smile className="w-6 h-6" /><span className="text-xs">Emotion</span>
            </button>
            <button className="flex flex-col items-center space-y-1 text-white/70 hover:text-white transition-colors">
              <Sticker className="w-6 h-6" /><span className="text-xs">Sticker</span>
            </button>
            <button className="flex flex-col items-center space-y-1 text-white/70 hover:text-white transition-colors">
              <ImageIcon className="w-6 h-6" /><span className="text-xs">Add Photo</span>
            </button>
          </div>
        </div>
      )}

      {/* Moment Viewer Modal */}
      
      {/* Neighbor Profile Modal */}
      {selectedNeighbor && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-black/10 dark:border-white/10">
            <div className="relative h-32 bg-gradient-to-r from-blue-500 to-indigo-600">
              <button onClick={() => setSelectedNeighbor(null)} className="absolute top-4 right-4 bg-black/20 p-2 rounded-full text-white hover:bg-black/40">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="px-6 pb-6">
              <div className="flex justify-between items-end -mt-12 mb-4">
                <div className="w-24 h-24 rounded-full border-4 border-white dark:border-slate-900 bg-slate-200 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
                  {selectedNeighbor.avatar && !isGuest ? (
                    <img src={selectedNeighbor.avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-4xl font-bold text-slate-400">{(isGuest ? 'Neighbor' : selectedNeighbor.author).charAt(0)}</span>
                  )}
                </div>
                {!isGuest && (
                  <Button 
                    onClick={() => { 
                      openOrCreateChat(`neighbor-${selectedNeighbor.author}`, selectedNeighbor.author, 'neighbor'); 
                      navigate('/chat'); 
                    }} 
                    className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-full px-6"
                  >
                    Message
                  </Button>
                )}
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                {isGuest ? 'Neighbor' : selectedNeighbor.author}
                {!isGuest && selectedNeighbor.verified && <BadgeCheck className="w-5 h-5 text-blue-500" />}
              </h2>
              <p className="text-slate-500 dark:text-slate-400 mt-1">{t('feed.resident_in', language)} {selectedNeighbor.locationScope === 'neighborhood' ? t('common.neighborhood', language).toLowerCase() : t('common.building', language).toLowerCase()}</p>
              
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">{t('feed.status', language)}</div>
                  <div className="text-sm font-medium text-slate-800 dark:text-slate-200">Active Neighbor</div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">{t('feed.joined', language)}</div>
                  <div className="text-sm font-medium text-slate-800 dark:text-slate-200">March 2026</div>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Recent Activity</h3>
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-100 dark:border-slate-800 text-sm text-slate-600 dark:text-slate-400 italic">
                  Shared {t(('common.' + selectedNeighbor.type) as any, language)} recently.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeMoment && (
        <div className="fixed inset-0 z-50 bg-black/90 flex flex-col">
          <div className="flex items-center justify-between p-4 absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/60 to-transparent">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-white">
                {activeMoment.avatar && !isGuest ? (
                  <img src={activeMoment.avatar} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-slate-800 flex items-center justify-center text-white font-bold">
                    {(isGuest ? 'Neighbor' : activeMoment.author).charAt(0)}
                  </div>
                )}
              </div>
              <span className="text-white font-medium">{isGuest ? 'Neighbor' : activeMoment.author}</span>
              {!isGuest && activeMoment.verified && <BadgeCheck className="w-4 h-4 text-blue-400" />}
            </div>
            <button onClick={() => setActiveMoment(null)} className="text-white hover:bg-white/20 p-2 rounded-full">
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="flex-1 flex items-center justify-center p-4 relative">
            <img src={activeMoment.image} alt="Moment" className="max-h-full max-w-full object-contain rounded-xl" />
            
            {/* Reactions placed on the right side in a straight orbit (3 P.M.) */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col items-center justify-center space-y-4">
              {['👍', '❤️', '🔥', '😂', '😲', '😢'].map((emoji, idx) => (
                <button 
                  key={emoji}
                  className="w-12 h-12 bg-black/40 hover:bg-black/60 border border-white/20 rounded-full text-2xl flex items-center justify-center transition-all hover:scale-110"
                  onClick={() => {
                    alert(`Reacted with ${emoji}`);
                    setActiveMoment(null);
                  }}
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
          
          <div className="p-4 absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent">
            <Input placeholder="Reply to moment..." className="bg-white/20 border-none text-white placeholder:text-white/60" />
          </div>
        </div>
      )}
    </div>
  );
}
