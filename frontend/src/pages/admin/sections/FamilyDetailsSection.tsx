import React, { useState } from 'react';
import { Save, Users, Plus, Trash2, Check } from 'lucide-react';
import { adminService } from '../../../services/api';

interface FamilyDetailsSectionProps {
  initialMembers: any[];
  onRefresh: () => void;
}

export const FamilyDetailsSection: React.FC<FamilyDetailsSectionProps> = ({
  initialMembers,
  onRefresh,
}) => {
  const [members, setMembers] = useState(
    initialMembers && initialMembers.length > 0
      ? initialMembers
      : [
          {
            id: 'fam-1',
            name: 'Shri KBL Srivastava & Smt. Meera Devi',
            relationship: "Bride's Loving Parents",
            side: 'BRIDE',
            description: 'Bestowing their heartfelt blessings upon the sacred union.',
            order: 1,
          },
          {
            id: 'fam-2',
            name: 'Shri Lalit Mohan Joshi & Smt. Suman',
            relationship: "Groom's Loving Parents",
            side: 'GROOM',
            description: 'Welcoming Aditi into their family with open arms and immense love.',
            order: 2,
          },
        ]
  );

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleAddMember = () => {
    setMembers([
      ...members,
      {
        id: `fam-${Date.now()}`,
        name: 'Family Member Name',
        relationship: 'Blessing Elder',
        side: 'BRIDE',
        description: 'Heartiest blessings to the newlyweds.',
        order: members.length + 1,
      },
    ]);
  };

  const handleRemoveMember = (id: string) => {
    setMembers(members.filter((m) => m.id !== id));
  };

  const handleSave = async () => {
    setSaving(true);
    setSuccessMsg(null);
    try {
      await adminService.updateFamilyMembers(members);
      setSuccessMsg('Family member blessings updated and published!');
      onRefresh();
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      alert(`Save failed: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-gold-400" />
            Family Blessings & Lineage
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Manage the family introductions, parents, and respected elders from both Srivastava and Joshi families.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleAddMember}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gold-500/20 hover:bg-gold-500/30 text-gold-300 border border-gold-500/40 text-sm font-semibold transition"
          >
            <Plus className="w-4 h-4" /> Add Elder / Relation
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-600 text-burgundy-950 font-bold text-sm shadow-md transition disabled:opacity-50"
          >
            <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Family Details'}
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-sm flex items-center gap-2">
          <Check className="w-4 h-4" /> {successMsg}
        </div>
      )}

      <div className="space-y-4">
        {members.map((member, index) => (
          <div
            key={member.id}
            className="p-5 rounded-2xl bg-burgundy-950/40 border border-gold-500/20 shadow-md space-y-4"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-sm font-bold text-white font-serif">{member.name}</span>
              <button
                onClick={() => handleRemoveMember(member.id)}
                className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gold-300 mb-1">Names</label>
                <input
                  type="text"
                  value={member.name}
                  onChange={(e) => {
                    const copy = [...members];
                    copy[index].name = e.target.value;
                    setMembers(copy);
                  }}
                  className="w-full px-3 py-2 rounded-lg bg-black/40 border border-gold-500/30 text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gold-300 mb-1">Relationship</label>
                <input
                  type="text"
                  value={member.relationship}
                  onChange={(e) => {
                    const copy = [...members];
                    copy[index].relationship = e.target.value;
                    setMembers(copy);
                  }}
                  className="w-full px-3 py-2 rounded-lg bg-black/40 border border-gold-500/30 text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gold-300 mb-1">Family Side</label>
                <select
                  value={member.side}
                  onChange={(e) => {
                    const copy = [...members];
                    copy[index].side = e.target.value;
                    setMembers(copy);
                  }}
                  className="w-full px-3 py-2 rounded-lg bg-black/40 border border-gold-500/30 text-white text-sm"
                >
                  <option value="BRIDE">Bride Side (Srivastava)</option>
                  <option value="GROOM">Groom Side (Joshi)</option>
                </select>
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-semibold text-gold-300 mb-1">Blessing Message</label>
                <input
                  type="text"
                  value={member.description}
                  onChange={(e) => {
                    const copy = [...members];
                    copy[index].description = e.target.value;
                    setMembers(copy);
                  }}
                  className="w-full px-3 py-2 rounded-lg bg-black/40 border border-gold-500/30 text-white text-sm"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
