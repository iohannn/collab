import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { toast } from 'sonner';
import { AlertTriangle, XCircle, Shield } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// ============ DISPUTE DIALOG ============

export const DisputeDialog = ({ collabId, collabTitle, open, onOpenChange, onSuccess }) => {
  const { getAuthHeaders } = useAuth();
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const DISPUTE_REASONS = [
    { value: 'content_not_delivered', label: 'Conținutul nu a fost livrat conform specificațiilor' },
    { value: 'quality_issues', label: 'Calitate necorespunzătoare' },
    { value: 'deadline_missed', label: 'Termen depășit' },
    { value: 'brand_unresponsive', label: 'Brandul nu răspunde / nu respectă acordul' },
    { value: 'payment_concern', label: 'Preocupări legate de plată' },
    { value: 'other', label: 'Alt motiv' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason) return toast.error('Selectează un motiv');
    if (!details.trim()) return toast.error('Adaugă detalii');

    setSubmitting(true);
    try {
      const res = await fetch(`${API}/disputes/create/${collabId}`, {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify({ reason, details: details.trim() }),
      });

      if (res.ok) {
        toast.success('Dispută deschisă. Un administrator va analiza situația.');
        onOpenChange(false);
        onSuccess?.();
      } else {
        const err = await res.json();
        toast.error(err.detail || 'Eroare la deschiderea disputei');
      }
    } catch {
      toast.error('Eroare de conexiune');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="w-5 h-5" />
            Raportează o problemă
          </DialogTitle>
          <DialogDescription>
            {collabTitle}
          </DialogDescription>
        </DialogHeader>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-700">
          <p className="font-medium mb-1">Ce se întâmplă când deschizi o dispută:</p>
          <ul className="list-disc pl-4 space-y-1 text-xs">
            <li>Eliberarea fondurilor este blocată temporar</li>
            <li>Mesajele devin read-only</li>
            <li>Un administrator va analiza situația și va decide rezoluția</li>
          </ul>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div>
            <Label>Motiv *</Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger data-testid="dispute-reason-select">
                <SelectValue placeholder="Selectează motivul..." />
              </SelectTrigger>
              <SelectContent>
                {DISPUTE_REASONS.map((r) => (
                  <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Detalii *</Label>
            <Textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Descrie problema în detaliu..."
              rows={4}
              maxLength={1000}
              data-testid="dispute-details"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Renunță
            </Button>
            <Button type="submit" disabled={submitting} className="bg-red-600 hover:bg-red-700 text-white" data-testid="submit-dispute-btn">
              <AlertTriangle className="w-4 h-4 mr-1" />
              {submitting ? 'Se trimite...' : 'Deschide dispută'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// ============ CANCELLATION DIALOG ============

export const CancellationDialog = ({ collabId, collabTitle, collabStatus, open, onOpenChange, onSuccess }) => {
  const { getAuthHeaders } = useAuth();
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isInProgress = collabStatus === 'in_progress';

  const CANCEL_REASONS = [
    { value: 'brand_changed_requirements', label: 'Cerințele s-au schimbat' },
    { value: 'influencer_unavailable', label: 'Creatorul nu mai este disponibil' },
    { value: 'budget_issues', label: 'Probleme de buget' },
    { value: 'timeline_conflict', label: 'Conflict de timeline' },
    { value: 'quality_concerns', label: 'Preocupări legate de calitate' },
    { value: 'mutual_agreement', label: 'Acord mutual' },
    { value: 'other', label: 'Alt motiv' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason) return toast.error('Selectează un motiv');

    setSubmitting(true);
    try {
      const res = await fetch(`${API}/collaborations/${collabId}/cancel`, {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify({ reason, details: details.trim() }),
      });

      if (res.ok) {
        const data = await res.json();
        toast.success(data.message || 'Colaborare anulată.');
        onOpenChange(false);
        onSuccess?.();
      } else {
        const err = await res.json();
        toast.error(err.detail || 'Eroare la anulare');
      }
    } catch {
      toast.error('Eroare de conexiune');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <XCircle className="w-5 h-5 text-muted-foreground" />
            Anulare colaborare
          </DialogTitle>
          <DialogDescription>
            {collabTitle}
          </DialogDescription>
        </DialogHeader>

        {isInProgress ? (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-700">
            <Shield className="w-4 h-4 inline mr-1" />
            Colaborarea este în desfășurare. Cererea ta de anulare va fi analizată de un administrator.
            Fondurile rămân securizate până la decizie.
          </div>
        ) : (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700">
            <Shield className="w-4 h-4 inline mr-1" />
            Colaborarea nu a început încă. Anularea va fi procesată imediat cu rambursare integrală.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div>
            <Label>Motiv *</Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger data-testid="cancel-reason-select">
                <SelectValue placeholder="Selectează motivul..." />
              </SelectTrigger>
              <SelectContent>
                {CANCEL_REASONS.map((r) => (
                  <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Detalii (opțional)</Label>
            <Textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Adaugă detalii suplimentare..."
              rows={3}
              data-testid="cancel-details"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Renunță
            </Button>
            <Button type="submit" disabled={submitting} variant="destructive" data-testid="submit-cancel-btn">
              {submitting ? 'Se procesează...' : isInProgress ? 'Solicită anulare' : 'Anulează colaborarea'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
