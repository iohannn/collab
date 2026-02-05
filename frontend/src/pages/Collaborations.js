import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { CollaborationCard } from '../components/CollaborationCard';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Collaborations = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [collaborations, setCollaborations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [platform, setPlatform] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchCollaborations();
  }, [platform]);

  const fetchCollaborations = async () => {
    setLoading(true);
    try {
      let url = `${API}/collaborations?status=active`;
      if (platform && platform !== 'all') {
        url += `&platform=${platform}`;
      }
      
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setCollaborations(data);
      }
    } catch (error) {
      console.error('Failed to fetch collaborations:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCollabs = collaborations.filter((c) =>
    search
      ? c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.brand_name.toLowerCase().includes(search.toLowerCase())
      : true
  );

  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-heading font-bold text-foreground mb-2">
            {t('nav.collaborations')}
          </h1>
          <p className="text-muted-foreground">
            Descoperă oportunități de colaborare cu branduri
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder={t('common.search')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-12 rounded-xl"
              data-testid="search-input"
            />
          </div>
          <Select value={platform} onValueChange={setPlatform}>
            <SelectTrigger className="w-full sm:w-48 h-12 rounded-xl" data-testid="platform-filter">
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Platformă" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('common.all')}</SelectItem>
              <SelectItem value="instagram">Instagram</SelectItem>
              <SelectItem value="tiktok">TikTok</SelectItem>
              <SelectItem value="youtube">YouTube</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-xl h-80 animate-pulse" />
            ))}
          </div>
        ) : filteredCollabs.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCollabs.map((collab) => (
              <CollaborationCard
                key={collab.collab_id}
                collaboration={collab}
                onClick={() => navigate(`/collaborations/${collab.collab_id}`)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-border">
            <Filter className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Nicio colaborare găsită</h3>
            <p className="text-muted-foreground">
              Încearcă să schimbi filtrele sau caută altceva
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Collaborations;
