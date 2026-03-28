import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import {
  Heart,
  MessageCircle,
  Trash2,
  Plus,
} from "lucide-react";
import { motion } from "framer-motion";

export default function CommunitySection({ user }) {
  const [communities, setCommunities] = useState([]);
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [commentText, setCommentText] = useState({});

  useEffect(() => {
    fetchCommunities();
  }, []);

  const fetchCommunities = async () => {
    const { data } = await supabase.from("communities").select("*");
    setCommunities(data || []);
  };

  const fetchPosts = async (communityId) => {
    setSelectedCommunity(communityId);

    const { data } = await supabase
      .from("posts")
      .select(`
        *,
        profiles(username),
        post_likes(user_id),
        comments(
          id,
          content,
          user_id,
          created_at,
          profiles(username)
        )
      `)
      .eq("community_id", communityId)
      .order("created_at", { ascending: false });

    setPosts(data || []);
  };

  const createPost = async () => {
    if (!newPost.trim()) return;

    await supabase.from("posts").insert({
      content: newPost,
      community_id: selectedCommunity,
      user_id: user.id,
    });

    setNewPost("");
    fetchPosts(selectedCommunity);
  };

  const deletePost = async (postId) => {
    await supabase.from("posts").delete().eq("id", postId);
    fetchPosts(selectedCommunity);
  };

  const toggleLike = async (postId, likes) => {
    const alreadyLiked = likes.some((l) => l.user_id === user.id);

    if (alreadyLiked) {
      await supabase
        .from("post_likes")
        .delete()
        .eq("post_id", postId)
        .eq("user_id", user.id);
    } else {
      await supabase.from("post_likes").insert({
        post_id: postId,
        user_id: user.id,
      });
    }

    fetchPosts(selectedCommunity);
  };

  const addComment = async (postId) => {
    if (!commentText[postId]?.trim()) return;

    await supabase.from("comments").insert({
      post_id: postId,
      user_id: user.id,
      content: commentText[postId],
    });

    setCommentText((prev) => ({ ...prev, [postId]: "" }));
    fetchPosts(selectedCommunity);
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] px-6 py-12">
      <div className="max-w-4xl mx-auto">

        <div className="mb-10">
          <h2 className="text-3xl font-semibold text-white">
            Community Hub
          </h2>
          <p className="text-gray-400 text-sm mt-2">
            Connect, share updates, and stay informed.
          </p>
        </div>

        <div className="flex gap-3 flex-wrap mb-10">
          {communities.map((c) => (
            <button
              key={c.id}
              onClick={() => fetchPosts(c.id)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition
              ${
                selectedCommunity === c.id
                  ? "bg-orange-500 text-white"
                  : "bg-white/5 text-gray-300 hover:bg-white/10"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {selectedCommunity && (
          <>
            <div className="bg-[#151515] border border-white/5 rounded-2xl p-6 mb-10">
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="Share something with the community..."
                className="w-full bg-transparent text-white resize-none outline-none placeholder-gray-500 min-h-[80px]"
              />

              <div className="flex justify-end mt-4">
                <button
                  onClick={createPost}
                  className="flex items-center gap-2 px-5 py-2 bg-orange-500 hover:bg-orange-600 transition rounded-xl text-white text-sm font-medium"
                >
                  <Plus size={16} /> Post
                </button>
              </div>
            </div>

            <div className="space-y-8">
              {posts.map((p) => {
                const liked = p.post_likes.some(
                  (l) => l.user_id === user.id
                );

                return (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#151515] border border-white/5 rounded-2xl p-6"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <p className="text-sm text-gray-400">
                        @{p.profiles?.username}
                      </p>

                      {p.user_id === user.id && (
                        <Trash2
                          size={16}
                          onClick={() => deletePost(p.id)}
                          className="text-red-400 cursor-pointer hover:text-red-500"
                        />
                      )}
                    </div>

                    <p className="text-white mb-4">{p.content}</p>

                    <div className="flex items-center gap-6 text-sm text-gray-400 mb-4">
                      <button
                        onClick={() =>
                          toggleLike(p.id, p.post_likes)
                        }
                        className={`flex items-center gap-2 ${
                          liked ? "text-orange-500" : ""
                        }`}
                      >
                        <Heart size={16} />
                        {p.post_likes.length}
                      </button>

                      <div className="flex items-center gap-2">
                        <MessageCircle size={16} />
                        {p.comments.length}
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      {p.comments.map((c) => (
                        <div
                          key={c.id}
                          className="bg-black/30 p-3 rounded-lg text-sm"
                        >
                          <p className="text-gray-400 text-xs mb-1">
                            @{c.profiles?.username}
                          </p>
                          <p className="text-white">{c.content}</p>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-3">
                      <input
                        value={commentText[p.id] || ""}
                        onChange={(e) =>
                          setCommentText({
                            ...commentText,
                            [p.id]: e.target.value,
                          })
                        }
                        placeholder="Write a comment..."
                        className="flex-1 bg-black/30 text-white px-4 py-2 rounded-lg outline-none text-sm"
                      />

                      <button
                        onClick={() => addComment(p.id)}
                        className="px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg text-sm"
                      >
                        Send
                      </button>
                    </div>
                  </motion.div>
                );
              })}

              {posts.length === 0 && (
                <div className="text-center text-gray-500 py-12">
                  No posts yet.
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}