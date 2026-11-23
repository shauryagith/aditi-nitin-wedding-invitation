import React from 'react';
import { MessageCircle, Share2, Copy, Check } from 'lucide-react';
import { getShareWhatsAppUrl } from '../../utils/whatsapp';
import { useLanguage } from '../../context/LanguageContext';

export const WhatsAppShare: React.FC<{ url?: string; className?: string }> = ({ url, className = '' }) => {
  const { t } = useLanguage();
  const shareUrl = getShareWhatsAppUrl(url);

  return (
    <a
      href={shareUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#25D366] text-white font-bold text-xs sm:text-sm shadow-md hover:bg-[#20ba5a] transition-all hover:scale-105 active:scale-95 ${className}`}
    >
      <MessageCircle className="w-4 h-4 fill-current" />
      <span>{t.whatsapp.shareViaWhatsappBtn}</span>
    </a>
  );
};

export default WhatsAppShare;
