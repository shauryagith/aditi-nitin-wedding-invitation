import React, { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Copy, Check, Share2, Download, MessageCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { getShareInvitationWhatsAppUrl, getShareInvitationMessage } from '../../utils/whatsapp';
import { GaneshaEmblem, OrnamentalDivider } from './DecorativeOrnaments';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose }) => {
  const { t, language } = useLanguage();
  const [copied, setCopied] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://aditinitinwedding.com';
  const whatsappUrl = getShareInvitationWhatsAppUrl(currentUrl);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // Fallback
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: language === 'hi' ? 'अदिति एवं नितिन – शुभ विवाह निमंत्रण' : 'Aditi & Nitin – Royal Wedding Invitation',
          text: getShareInvitationMessage(currentUrl),
          url: currentUrl,
        });
      } catch {
        // User cancelled share
      }
    } else {
      handleCopy();
    }
  };

  const handleDownloadQr = () => {
    if (!qrRef.current) return;
    const svgElement = qrRef.current.querySelector('svg');
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    canvas.width = 400;
    canvas.height = 400;

    img.onload = () => {
      if (ctx) {
        ctx.fillStyle = '#FFF9F0';
        ctx.fillRect(0, 0, 400, 400);
        ctx.drawImage(img, 20, 20, 360, 360);
        const pngFile = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.download = 'Aditi-Nitin-Wedding-Invitation-QR.png';
        downloadLink.href = pngFile;
        downloadLink.click();
      }
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-maroon-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-ivory rounded-2xl shadow-2xl border-2 border-gold-500 overflow-hidden text-deepBrown">
        {/* Header background ribbon */}
        <div className="bg-gradient-to-r from-maroon-800 via-maroon-700 to-maroon-800 text-ivory py-4 px-6 text-center relative">
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="absolute top-3.5 right-3.5 p-1 text-gold-300 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <GaneshaEmblem size={44} className="mx-auto mb-1 text-gold-400" />
          <h3 className="font-heading text-xl font-bold text-gold-300 tracking-wide">
            {t.whatsapp.shareInviteHeading}
          </h3>
          <p className="text-xs text-gold-100/90 font-cormorant italic mt-0.5">
            {language === 'hi' ? 'शुभ निमंत्रण को सप्रेम साझा करें' : 'Invite your friends & family'}
          </p>
        </div>

        <div className="p-6 text-center space-y-5">
          {/* QR Code Container */}
          <div className="flex flex-col items-center">
            <div
              ref={qrRef}
              className="p-4 bg-white rounded-xl border-2 border-gold-400/80 shadow-md inline-block relative group"
            >
              <QRCodeSVG
                value={currentUrl}
                size={180}
                bgColor="#FFFFFF"
                fgColor="#581C2B"
                level="Q"
                includeMargin={false}
              />
            </div>
            <p className="text-[11px] text-deepBrown/70 mt-2 font-medium">
              {language === 'hi'
                ? 'स्मार्टफोन कैमरा से स्कैन कर निमंत्रण देखें'
                : 'Scan with smartphone camera to view wedding invitation'}
            </p>
          </div>

          <OrnamentalDivider className="my-2" />

          {/* Action Buttons */}
          <div className="grid grid-cols-1 gap-2.5">
            {/* WhatsApp Direct Share */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 rounded-xl bg-[#25D366] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow hover:bg-[#20ba5a] transition-all"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              {t.whatsapp.shareViaWhatsappBtn}
            </a>

            {/* Native Share / Copy Link */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleNativeShare}
                className="py-2.5 px-3 rounded-xl border border-gold-500 bg-gold-50 text-maroon-800 font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-gold-100 transition-all"
              >
                <Share2 className="w-3.5 h-3.5 text-gold-600" />
                {t.whatsapp.shareViaNative}
              </button>

              <button
                onClick={handleDownloadQr}
                className="py-2.5 px-3 rounded-xl border border-gold-500 bg-gold-50 text-maroon-800 font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-gold-100 transition-all"
              >
                <Download className="w-3.5 h-3.5 text-gold-600" />
                {language === 'hi' ? 'QR डाउनलोड करें' : 'Download QR'}
              </button>
            </div>

            {/* Copy Link Input Bar */}
            <div className="flex items-center gap-2 mt-1">
              <input
                type="text"
                readOnly
                value={currentUrl}
                aria-label="Invitation Link URL"
                className="flex-1 bg-white border border-gold-300 rounded-lg px-3 py-1.5 text-xs text-deepBrown/80 select-all outline-none focus:border-gold-500"
              />
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 bg-maroon-800 text-gold-300 rounded-lg text-xs font-medium hover:bg-maroon-900 transition-colors flex items-center gap-1 whitespace-nowrap"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? t.common.copied : t.common.copyLink}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
