'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Heart, Car, MapPin, Star, Trash2, Search, Loader2, Bike } from 'lucide-react';
import toast from 'react-hot-toast';

export default function FavoritesPage() {
  const { data: session } = useSession();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = () => {
    setLoading(true);
    fetch('/api/favorites')
      .then((r) => r.json())
      .then((d) => setFavorites(d.favorites || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchFavorites(); }, []);

  const removeFavorite = async (id) => {
    try {
      await fetch(`/api/favorites/${id}`, { method: 'DELETE' });
      setFavorites((f) => f.filter((fav) => fav.id !== id));
      toast.success('Removed from favorites');
    } catch {
      toast.error('Failed to remove favorite');
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-2xl gradient-primary flex items-center justify-center">
          <Heart className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-outfit font-bold">My <span className="gradient-text">Favorites</span></h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Saved riders and routes</p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="card-premium h-36 skeleton" />)}
        </div>
      ) : favorites.length === 0 ? (
        <div className="text-center py-20">
          <Heart className="w-14 h-14 mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
          <h3 className="font-semibold text-lg mb-2">No favorites yet</h3>
          <p className="mb-6" style={{ color: 'var(--text-muted)' }}>Save your favorite riders for quick rebooking</p>
          <Link href="/find-ride">
            <button className="btn-primary"><Search className="w-4 h-4" /> Find Rides</button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {favorites.map((fav, i) => {
            const rider = fav.rider;
            return (
              <motion.div key={fav.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="card-premium p-5 flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center text-white font-bold text-xl overflow-hidden flex-shrink-0">
                  {rider?.image ? <img src={rider.image} alt="" className="w-full h-full object-cover" /> : rider?.name?.[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold truncate">{rider?.name}</div>
                  <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                    <Star className="w-3 h-3" style={{ fill: '#fbbf24', color: '#fbbf24' }} />
                    {rider?.profile?.averageRating?.toFixed(1) || 'New'} •
                    {rider?.profile?.totalTrips || 0} rides
                  </div>
                  <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                    <MapPin className="w-3 h-3 inline mr-1" />{rider?.profile?.city || 'Pakistan'}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link href={`/find-ride?rider=${rider?.id}`}>
                    <button className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(99,102,241,0.1)', color: 'var(--primary)' }}>
                      <Car className="w-4 h-4" />
                    </button>
                  </Link>
                  <button onClick={() => removeFavorite(fav.id)} className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--danger)' }}>
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
