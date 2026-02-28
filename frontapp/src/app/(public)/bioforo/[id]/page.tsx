'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Icon from '@/components/ui/Icon';
import { forumApi } from '@/shared/lib/api/forum';

const REACTION_EMOJIS: Record<string, string> = {
  up: '👍',
  down: '👎',
};

export default function BioForoTopicPage() {
  const params = useParams();
  const router = useRouter();
  const topicId = parseInt(params.id as string);

  const [topic, setTopic] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyContent, setReplyContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadTopic();
  }, [topicId]);

  const loadTopic = async () => {
    setLoading(true);
    try {
      const [topicData, postsData] = await Promise.all([
        forumApi.getTopic(topicId),
        forumApi.getTopicPosts(topicId),
      ]);
      setTopic(topicData);
      setPosts(Array.isArray(postsData) ? postsData : []);
    } catch (error) {
      console.error('Error loading topic:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day} ${month} ${year} ${hours}:${minutes}`;
  };

  const getInitial = (name: string) => {
    if (!name) return '?';
    return name.charAt(0).toUpperCase();
  };

  const handleReply = async () => {
    if (!replyContent.trim()) return;

    setSubmitting(true);
    try {
      await forumApi.createPost({
        topicid: topicId,
        content: replyContent,
      });
      setReplyContent('');
      loadTopic();
    } catch (error) {
      console.error('Error creating reply:', error);
      alert('Para responder necesitas iniciar sesión en WordPress');
    } finally {
      setSubmitting(false);
    }
  };

  const handleVote = async (postId: number, type: 'up' | 'down') => {
    try {
      await forumApi.setVote(postId, type);
      loadTopic();
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 flex justify-center">
        <div className="loader-small" />
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <h2 className="text-xl font-bold text-slate-700 mb-4">Tema no encontrado</h2>
        <Link href="/bioforo" className="text-emerald-500 hover:underline">
          Volver al BioForo
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-3 md:px-4 py-4 md:py-8">
      {/* Volver */}
      <Link
        href="/bioforo"
        className="inline-flex items-center gap-2 text-slate-600 hover:text-emerald-500 mb-4"
      >
        <Icon name="ArrowLeft" className="w-4 h-4" />
        Volver al BioForo
      </Link>

      {/* Tema Principal */}
      <div className="bg-white border-[3px] border-[#009a6279] rounded-xl md:rounded-2xl p-4 md:p-6 shadow-sm mb-6">
        {/* Autor */}
        <div className="flex items-start gap-3 mb-4">
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-blue-100 to-emerald-100 flex items-center justify-center text-blue-700 font-bold text-lg md:text-xl flex-shrink-0">
            {getInitial(topic.topic_author_name || topic.author_name)}
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-slate-800 text-lg">
              {topic.topic_author_name || topic.author_name || 'Anónimo'}
            </h4>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span className="flex items-center gap-1">
                <Icon name="Clock" className="w-3 h-3" />
                {formatDate(topic.topic_created || topic.created)}
              </span>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                {topic.forum_name || 'General'}
              </span>
            </div>
          </div>
        </div>

        {/* Título */}
        <h1 className="text-black font-bold text-xl md:text-2xl underline decoration-dashed decoration-[#8db701] decoration-3 underline-offset-[9px] mb-4">
          {topic.topic_subject || topic.title?.rendered}
        </h1>

        {/* Contenido */}
        <div
          className="text-[#00866d] font-semibold leading-relaxed mb-6"
          dangerouslySetInnerHTML={{ __html: topic.topic_content || topic.content || '' }}
        />

        {/* Acciones */}
        <div className="flex items-center gap-4 border-t border-slate-100 pt-4">
          <button
            onClick={() => handleVote(topic.id, 'up')}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-700 transition-all"
          >
            <span className="text-lg">👍</span>
            <span className="font-medium text-sm">{topic.votes_up || 0}</span>
          </button>
          <button
            onClick={() => handleVote(topic.id, 'down')}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-700 transition-all"
          >
            <span className="text-lg">👎</span>
            <span className="font-medium text-sm">{topic.votes_down || 0}</span>
          </button>
          <span className="text-sm text-slate-500">
            {topic.views || 0} vistas
          </span>
        </div>
      </div>

      {/* Respuestas */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Icon name="ChatsCircle" className="text-emerald-600" />
          Respuestas ({posts.length})
        </h3>

        {posts.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center border border-slate-200">
            <p className="text-slate-500">No hay respuestas aún. ¡Sé el primero en responder!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post, index) => (
              <div
                key={post.post_id || post.id || index}
                className="bg-white border-2 border-slate-200 rounded-xl p-4 md:p-6"
              >
                {/* Cita si existe */}
                {post.reply_to && (
                  <div
                    className="quote-box-whatsapp bg-gradient-to-r from-blue-50 to-sky-50 border-l-4 border-sky-500 p-3 rounded-r-lg mb-4"
                  >
                    <p className="text-xs font-bold text-sky-700 flex items-center gap-1 mb-1">
                      <Icon name="Quote" className="w-3 h-3" />
                      {post.reply_to_name || 'Cita'}
                    </p>
                    <p className="text-sm text-slate-600 line-clamp-2">
                      {post.reply_to_content}
                    </p>
                  </div>
                )}

                {/* Autor de respuesta */}
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-emerald-100 flex items-center justify-center text-blue-700 font-bold">
                    {getInitial(post.author_name)}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">{post.author_name || 'Anónimo'}</p>
                    <p className="text-xs text-slate-500">{formatDate(post.post_created)}</p>
                  </div>
                </div>

                {/* Contenido */}
                <div
                  className="text-slate-700 leading-relaxed mb-4"
                  dangerouslySetInnerHTML={{ __html: post.post_content || post.content || '' }}
                />

                {/* Votos */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleVote(post.post_id || post.id, 'up')}
                    className="flex items-center gap-1 px-3 py-1 rounded-full bg-slate-50 hover:bg-slate-100 text-sm"
                  >
                    👍 {post.votes_up || 0}
                  </button>
                  <button
                    onClick={() => handleVote(post.post_id || post.id, 'down')}
                    className="flex items-center gap-1 px-3 py-1 rounded-full bg-slate-50 hover:bg-slate-100 text-sm"
                  >
                    👎 {post.votes_down || 0}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Formulario de respuesta */}
      <div className="bg-white border-2 border-slate-200 rounded-xl p-4 md:p-6">
        <h4 className="font-bold text-slate-800 mb-4">Responder al tema</h4>
        <textarea
          value={replyContent}
          onChange={(e) => setReplyContent(e.target.value)}
          placeholder="Escribe tu respuesta..."
          className="w-full p-4 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-none min-h-[120px] mb-4"
        />
        <div className="flex items-center justify-between">
          <p className="text-xs text-slate-500">
            Para responder necesitas{' '}
            <a
              href="https://lyriumbiomarketplace.com/community/?wpforo=login"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-500 hover:underline"
            >
              iniciar sesión
            </a>
          </p>
          <button
            onClick={handleReply}
            disabled={submitting || !replyContent.trim()}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-6 py-2 rounded-full font-semibold disabled:opacity-50"
          >
            {submitting ? 'Enviando...' : 'Publicar Respuesta'}
          </button>
        </div>
      </div>
    </div>
  );
}
