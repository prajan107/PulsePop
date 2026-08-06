import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CategoryType } from '@/types';

interface CreateAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (newAlert: any) => void;
}

export const CreateAlertModal: React.FC<CreateAlertModalProps> = ({ isOpen, onClose, onCreate }) => {
  const [title, setTitle] = useState('');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<CategoryType>('AI & ML');
  const [platform, setPlatform] = useState<string>('All Platforms');
  const [threshold, setThreshold] = useState<number>(50000);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !query) return;

    onCreate({
      id: `alert-${Date.now()}`,
      title,
      query,
      category,
      platform,
      threshold,
      triggerCount: 0,
      status: 'active',
      lastTriggered: 'Just created',
      createdAt: new Date().toISOString().split('T')[0]
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md border-[#1F2937] bg-[#111827] text-white">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Create Real-time Signal Alert</DialogTitle>
          <DialogDescription className="text-xs text-[#94A3B8]">
            Receive automated Slack, Email, or Webhook notifications when a trend crosses your threshold.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div>
            <label className="text-xs font-semibold text-[#94A3B8] mb-1 block">Alert Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Agentic AI Star Surge"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#94A3B8] mb-1 block">Search Query / Keyword</label>
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. Autonomous Code Refactoring"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-[#94A3B8] mb-1 block">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full rounded-lg border border-[#1F2937] bg-[#0F172A] px-3 py-2 text-xs text-white outline-none focus:border-[#6366F1]"
              >
                <option value="AI & ML">AI & ML</option>
                <option value="SaaS">SaaS</option>
                <option value="Developer Tools">Developer Tools</option>
                <option value="Crypto">Crypto</option>
                <option value="E-Commerce">E-Commerce</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#94A3B8] mb-1 block">Platform</label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="w-full rounded-lg border border-[#1F2937] bg-[#0F172A] px-3 py-2 text-xs text-white outline-none focus:border-[#6366F1]"
              >
                <option value="All Platforms">All Platforms</option>
                <option value="Twitter">Twitter / X</option>
                <option value="GitHub">GitHub</option>
                <option value="Reddit">Reddit</option>
                <option value="ProductHunt">ProductHunt</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-[#94A3B8] mb-1 block">
              Volume Threshold: <strong className="text-white font-mono">{threshold.toLocaleString()} mentions</strong>
            </label>
            <input
              type="range"
              min="5000"
              max="200000"
              step="5000"
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
              className="w-full accent-[#6366F1]"
            />
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="border-[#1F2937]">
              Cancel
            </Button>
            <Button type="submit" className="bg-[#6366F1] text-white">
              Create Alert
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
