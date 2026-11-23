import React, { useState, useEffect } from 'react';
import {
  QrCode,
  Download,
  Plus,
  Trash2,
  CheckCircle,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { adminService } from '../../../services/api';
import { QRCodeItem } from '../../../types/wedding';

interface QRCodeSectionProps {
  onRefreshStats: () => void;
}

export const QRCodeSection: React.FC<QRCodeSectionProps> = ({ onRefreshStats }) => {
  const [qrs, setQrs] = useState<QRCodeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [verifyResult, setVerifyResult] = useState<string | null>(null);

  const [newQR, setNewQR] = useState<{
    title: string;
    type: 'INVITATION' | 'VENUE' | 'RSVP' | 'WHATSAPP' | 'CUSTOM';
    destinationUrl: string;
    darkColor: string;
    lightColor: string;
  }>({
    title: 'Wedding Invitation QR',
    type: 'INVITATION',
    destinationUrl: 'https://aditinitinwedding.com/',
    darkColor: '#780016',
    lightColor: '#ffffff',
  });

  const fetchQRs = async () => {
    setLoading(true);
    try {
      const res = await adminService.getQRCodes();
      if (res && res.data) {
        setQrs(res.data);
      }
    } catch (err: any) {
      console.warn('QR fetch notice:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQRs();
  }, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);
    try {
      await adminService.generateQRCode(newQR);
      setIsModalOpen(false);
      fetchQRs();
      onRefreshStats();
      setNewQR({
        title: 'Custom QR',
        type: 'CUSTOM',
        destinationUrl: 'https://aditinitinwedding.com/',
        darkColor: '#780016',
        lightColor: '#ffffff',
      });
    } catch (err: any) {
      alert(`Generation failed: ${err.message}`);
    } finally {
      setGenerating(false);
    }
  };

  const handleVerify = async (id: string, title: string) => {
    try {
      const res = await adminService.verifyQRCode(id);
      if (res.verified) {
        setVerifyResult(`Verified: QR "${title}" encodes payload: ${res.data.encodedPayload}`);
        setTimeout(() => setVerifyResult(null), 5000);
      }
    } catch (err: any) {
      alert(`Verification failed: ${err.message}`);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Delete QR code "${title}"?`)) return;
    try {
      await adminService.deleteQRCode(id);
      fetchQRs();
      onRefreshStats();
    } catch (err: any) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  const handleDownloadPNG = (qr: QRCodeItem) => {
    const link = document.createElement('a');
    link.href = qr.qrDataUrl;
    link.download = `qr_${qr.type.toLowerCase()}_${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadSVG = (qr: QRCodeItem) => {
    if (!qr.svgContent) return;
    const blob = new Blob([qr.svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `qr_${qr.type.toLowerCase()}_${Date.now()}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-white flex items-center gap-2">
            <QrCode className="w-6 h-6 text-gold-400" />
            Scannable QR Code Management
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Generate and verify scannable royal QR codes for printed physical cards and digital sharing.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-600 text-burgundy-950 font-bold text-sm shadow-md transition"
        >
          <Plus className="w-4 h-4" /> Generate New QR
        </button>
      </div>

      {verifyResult && (
        <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-sm flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" /> {verifyResult}
        </div>
      )}

      {loading ? (
        <div className="py-12 text-center text-gold-400 text-sm flex items-center justify-center gap-2">
          <RefreshCw className="w-4 h-4 animate-spin" /> Loading QR codes...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {qrs.map((qr) => (
            <div
              key={qr._id}
              className="p-5 rounded-2xl bg-burgundy-950/40 border border-gold-500/20 shadow-xl space-y-4 hover:border-gold-500/40 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gold-400 px-2 py-0.5 rounded bg-gold-500/10 border border-gold-500/20">
                      {qr.type}
                    </span>
                    <h3 className="text-base font-serif font-bold text-white mt-1.5">{qr.title}</h3>
                  </div>
                  <button
                    onClick={() => handleDelete(qr._id, qr.title)}
                    className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300"
                    title="Delete QR"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* QR Preview Card */}
                <div className="mt-4 p-4 rounded-xl bg-white flex items-center justify-center shadow-inner">
                  <img src={qr.qrDataUrl} alt={qr.title} className="w-40 h-40 object-contain" />
                </div>

                <div className="mt-3 text-[11px] text-gray-300 break-all line-clamp-2">
                  <span className="font-semibold text-gold-300">Target:</span> {qr.destinationUrl}
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 space-y-2">
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>Scans: {qr.scanCount}</span>
                  <button
                    onClick={() => handleVerify(qr._id, qr.title)}
                    className="flex items-center gap-1 text-gold-400 hover:text-gold-300 font-medium"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" /> Test Decode
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => handleDownloadPNG(qr)}
                    className="flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-gold-500/15 hover:bg-gold-500/25 text-gold-300 text-xs font-semibold border border-gold-500/30 transition"
                  >
                    <Download className="w-3.5 h-3.5" /> PNG High-Res
                  </button>
                  <button
                    onClick={() => handleDownloadSVG(qr)}
                    className="flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-black/40 hover:bg-black/60 text-gray-300 text-xs font-semibold border border-white/10 transition"
                  >
                    <Download className="w-3.5 h-3.5" /> Vector SVG
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Generate Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-burgundy-950 border border-gold-500/40 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-serif font-bold text-white">Generate Scannable QR Code</h3>

            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gold-300 mb-1">Title</label>
                <input
                  type="text"
                  value={newQR.title}
                  onChange={(e) => setNewQR({ ...newQR, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-black/40 border border-gold-500/30 text-white text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gold-300 mb-1">QR Type</label>
                <select
                  value={newQR.type}
                  onChange={(e) => {
                    const type = e.target.value as any;
                    let url = newQR.destinationUrl;
                    if (type === 'INVITATION') url = 'https://aditinitinwedding.com/';
                    if (type === 'VENUE')
                      url = 'https://maps.google.com/?q=002E+Bank+Colony,+Padari+Bazaar,+Gorakhpur';
                    if (type === 'RSVP') url = 'https://aditinitinwedding.com/#rsvp';
                    if (type === 'WHATSAPP')
                      url =
                        'https://wa.me/919876543210?text=Namaste!%20I%20have%20a%20query%20regarding%20Aditi%20%26%20Nitin%27s%20wedding';
                    setNewQR({ ...newQR, type, destinationUrl: url });
                  }}
                  className="w-full px-3 py-2 rounded-lg bg-black/40 border border-gold-500/30 text-white text-sm"
                >
                  <option value="INVITATION">Wedding Invitation Website</option>
                  <option value="VENUE">Google Maps Venue Location</option>
                  <option value="RSVP">RSVP Submission Form</option>
                  <option value="WHATSAPP">WhatsApp Wedding Helpline</option>
                  <option value="CUSTOM">Custom Destination URL</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gold-300 mb-1">Destination URL</label>
                <input
                  type="url"
                  value={newQR.destinationUrl}
                  onChange={(e) => setNewQR({ ...newQR, destinationUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-black/40 border border-gold-500/30 text-white text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gold-300 mb-1">Module Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={newQR.darkColor}
                      onChange={(e) => setNewQR({ ...newQR, darkColor: e.target.value })}
                      className="w-8 h-8 rounded border-none cursor-pointer"
                    />
                    <span className="text-xs text-white">{newQR.darkColor}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gold-300 mb-1">Background</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={newQR.lightColor}
                      onChange={(e) => setNewQR({ ...newQR, lightColor: e.target.value })}
                      className="w-8 h-8 rounded border-none cursor-pointer"
                    />
                    <span className="text-xs text-white">{newQR.lightColor}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 text-gray-300 text-sm font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={generating}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-gold-500 to-amber-600 text-burgundy-950 text-sm font-bold shadow-md"
                >
                  {generating ? 'Generating...' : 'Generate QR'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
