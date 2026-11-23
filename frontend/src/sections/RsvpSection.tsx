import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Send, CheckCircle2, AlertCircle, MessageCircle, Heart, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { weddingService } from '../services/api';
import { getRsvpWhatsAppUrl } from '../utils/whatsapp';
import { INITIAL_WEDDING_EVENTS } from '../config/wedding.config';
import { OrnamentalDivider, CornerFlourish, GaneshaEmblem } from '../components/common/DecorativeOrnaments';
import { RsvpFormData } from '../types/wedding';

const rsvpSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(10, 'Please enter a valid phone number with at least 10 digits'),
  email: z.string().email('Please enter a valid email address').optional().or(z.literal('')),
  guestCount: z.coerce.number().min(1, 'At least 1 guest required').max(15, 'Maximum 15 guests per RSVP'),
  attendanceStatus: z.enum(['CONFIRMED', 'DECLINED']),
  selectedEvents: z.array(z.string()).default([]),
  message: z.string().max(500, 'Message cannot exceed 500 characters').optional().or(z.literal('')),
  whatsappOptIn: z.boolean().default(true),
});

export const RsvpSection: React.FC = () => {
  const { t, language } = useLanguage();
  const [submitting, setSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<RsvpFormData>({
    resolver: zodResolver(rsvpSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      guestCount: 1,
      attendanceStatus: 'CONFIRMED',
      selectedEvents: INITIAL_WEDDING_EVENTS.map((e) => e.title),
      message: '',
      whatsappOptIn: true,
    },
  });

  const currentValues = watch();

  const onSubmit = async (data: RsvpFormData) => {
    setSubmitting(true);
    setErrorMessage(null);

    try {
      await weddingService.submitRsvp(data);

      // Trigger royal celebratory confetti
      confetti({
        particleCount: 130,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#581C2B', '#FFF9F0', '#F5E6CC', '#B76E79'],
      });

      setIsSuccess(true);
      reset();
    } catch (err: any) {
      setErrorMessage(err.message || 'Unable to submit RSVP. Please try again or RSVP directly via WhatsApp.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleWhatsAppDirectRsvp = () => {
    const directUrl = getRsvpWhatsAppUrl(currentValues);
    window.open(directUrl, '_blank');
  };

  return (
    <section id="rsvp" className="py-20 sm:py-28 px-4 sm:px-6 bg-ivory relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 ivory-pattern-bg opacity-35 pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <span className="text-xs uppercase tracking-widest text-royalGold font-bold font-hindi">
            ॥ उपस्थिति सूचना ॥
          </span>
          <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-primaryMaroon mt-2">
            {t.rsvp.sectionTitle}
          </h2>
          <p className="font-cormorant text-base sm:text-xl text-darkBrown/80 italic mt-2 max-w-xl mx-auto">
            {t.rsvp.sectionSubtitle}
          </p>
          <OrnamentalDivider color="#D4AF37" className="my-3 scale-90 sm:scale-100" />
        </div>

        {/* Card Form Container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="relative bg-[#FFFDF9] rounded-3xl p-5 xs:p-7 sm:p-10 md:p-12 shadow-2xl border-2 border-royalGold gold-border-card"
        >
          <CornerFlourish position="top-left" />
          <CornerFlourish position="top-right" />
          <CornerFlourish position="bottom-left" />
          <CornerFlourish position="bottom-right" />

          {isSuccess ? (
            <div className="text-center py-10 space-y-4">
              <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto animate-bounce" />
              <h3 className="font-heading text-3xl font-bold text-primaryMaroon">
                {t.rsvp.successTitle}
              </h3>
              <p className="text-sm sm:text-base text-darkBrown/80 font-cormorant italic max-w-lg mx-auto leading-relaxed">
                {t.rsvp.successMessage}
              </p>
              <div className="pt-4">
                <button
                  onClick={() => setIsSuccess(false)}
                  className="px-6 py-2.5 rounded-full border border-royalGold bg-champagne/60 text-primaryMaroon font-semibold text-xs hover:bg-champagne transition-colors"
                >
                  {language === 'hi' ? 'दूसरा RSVP दर्ज करें' : 'Submit Another RSVP'}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Form Subheading */}
              <div className="text-center mb-6">
                <h3 className="font-heading text-2xl font-bold text-primaryMaroon">
                  {t.rsvp.formTitle}
                </h3>
                <p className="text-xs text-royalGold font-semibold uppercase tracking-wider mt-1">
                  {t.rsvp.formSubtitle}
                </p>
              </div>

              {errorMessage && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Attendance Radio Selection */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-primaryMaroon">
                  {t.rsvp.attendanceLabel}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label
                    className={`flex items-center gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                      watch('attendanceStatus') === 'CONFIRMED'
                        ? 'border-royalGold bg-champagne/60 shadow-sm text-primaryMaroon font-semibold'
                        : 'border-royalGold/30 bg-white text-darkBrown/70'
                    }`}
                  >
                    <input
                      type="radio"
                      value="CONFIRMED"
                      {...register('attendanceStatus')}
                      className="text-royalGold focus:ring-royalGold"
                    />
                    <span className="text-xs sm:text-sm">{t.rsvp.willAttend}</span>
                  </label>

                  <label
                    className={`flex items-center gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                      watch('attendanceStatus') === 'DECLINED'
                        ? 'border-primaryMaroon bg-maroon-50 shadow-sm text-primaryMaroon font-semibold'
                        : 'border-royalGold/30 bg-white text-darkBrown/70'
                    }`}
                  >
                    <input
                      type="radio"
                      value="DECLINED"
                      {...register('attendanceStatus')}
                      className="text-primaryMaroon focus:ring-primaryMaroon"
                    />
                    <span className="text-xs sm:text-sm">{t.rsvp.cannotAttend}</span>
                  </label>
                </div>
              </div>

              {/* Name & Phone Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-primaryMaroon mb-1">
                    {t.rsvp.nameLabel} *
                  </label>
                  <input
                    type="text"
                    placeholder={t.rsvp.namePlaceholder}
                    {...register('name')}
                    className={`w-full px-4 py-2.5 rounded-xl border bg-white text-sm text-darkBrown outline-none transition-colors ${
                      errors.name ? 'border-red-500 focus:border-red-600' : 'border-royalGold/40 focus:border-royalGold'
                    }`}
                  />
                  {errors.name && <p className="text-[11px] text-red-600 mt-1">{errors.name.message}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-primaryMaroon mb-1">
                    {t.rsvp.phoneLabel} *
                  </label>
                  <input
                    type="tel"
                    placeholder={t.rsvp.phonePlaceholder}
                    {...register('phone')}
                    className={`w-full px-4 py-2.5 rounded-xl border bg-white text-sm text-darkBrown outline-none transition-colors ${
                      errors.phone ? 'border-red-500 focus:border-red-600' : 'border-royalGold/40 focus:border-royalGold'
                    }`}
                  />
                  {errors.phone && <p className="text-[11px] text-red-600 mt-1">{errors.phone.message}</p>}
                </div>
              </div>

              {/* Email & Guests Count Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-primaryMaroon mb-1">
                    {t.rsvp.emailLabel}
                  </label>
                  <input
                    type="email"
                    placeholder={t.rsvp.emailPlaceholder}
                    {...register('email')}
                    className="w-full px-4 py-2.5 rounded-xl border border-royalGold/40 bg-white text-sm text-darkBrown outline-none focus:border-royalGold"
                  />
                  {errors.email && <p className="text-[11px] text-red-600 mt-1">{errors.email.message}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-primaryMaroon mb-1">
                    {t.rsvp.guestCountLabel} *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="15"
                    {...register('guestCount')}
                    className="w-full px-4 py-2.5 rounded-xl border border-royalGold/40 bg-white text-sm text-darkBrown outline-none focus:border-royalGold"
                  />
                  {errors.guestCount && <p className="text-[11px] text-red-600 mt-1">{errors.guestCount.message}</p>}
                </div>
              </div>

              {/* Events Selection (only if attending) */}
              {watch('attendanceStatus') === 'CONFIRMED' && (
                <div className="space-y-2 pt-2 border-t border-royalGold/30">
                  <label className="block text-xs font-bold uppercase tracking-wider text-primaryMaroon">
                    {t.rsvp.eventsLabel}
                  </label>
                  <p className="text-[11px] text-darkBrown/70 font-medium">{t.rsvp.eventsHelp}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {INITIAL_WEDDING_EVENTS.map((evt) => (
                      <label
                        key={evt.id}
                        className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white border border-royalGold/30 text-xs text-darkBrown cursor-pointer hover:bg-champagne/40 transition-colors"
                      >
                        <input
                          type="checkbox"
                          value={evt.title}
                          {...register('selectedEvents')}
                          className="rounded text-royalGold focus:ring-royalGold"
                        />
                        <span className="font-semibold text-primaryMaroon">
                          {language === 'hi' ? evt.titleHi || evt.title : evt.title}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Wishes Message */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-primaryMaroon mb-1">
                  {t.rsvp.messageLabel}
                </label>
                <textarea
                  rows={3}
                  placeholder={t.rsvp.messagePlaceholder}
                  {...register('message')}
                  className="w-full px-4 py-2.5 rounded-xl border border-royalGold/40 bg-white text-sm text-darkBrown outline-none focus:border-royalGold"
                />
              </div>

              {/* WhatsApp Opt-in */}
              <label className="flex items-start gap-3 p-3 rounded-xl bg-champagne/40 border border-royalGold/30 cursor-pointer">
                <input
                  type="checkbox"
                  {...register('whatsappOptIn')}
                  className="mt-0.5 rounded text-royalGold focus:ring-royalGold"
                />
                <div className="text-xs">
                  <span className="font-bold text-primaryMaroon block">{t.rsvp.whatsappOptIn}</span>
                  <span className="text-darkBrown/70">{t.rsvp.whatsappOptInHelp}</span>
                </div>
              </label>

              {/* Submit Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-3.5 px-6 rounded-full bg-gradient-to-r from-deepBurgundy via-primaryMaroon to-deepBurgundy text-champagne font-bold text-sm tracking-wide shadow-xl border border-royalGold hover:shadow-royalGold/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4 text-royalGold" />
                  <span>{submitting ? t.rsvp.submittingButton : t.rsvp.submitButton}</span>
                </button>

                <button
                  type="button"
                  onClick={handleWhatsAppDirectRsvp}
                  className="py-3.5 px-6 rounded-full bg-[#25D366] text-white font-bold text-sm shadow-md hover:bg-[#20ba5a] transition-all flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>{t.rsvp.submitViaWhatsapp}</span>
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export const RSVPSection = RsvpSection;
export default RsvpSection;
