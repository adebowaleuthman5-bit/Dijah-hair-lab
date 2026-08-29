import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import PageBanner from '@/components/public/PageBanner';
import StepIndicator from '@/components/booking/StepIndicator';
import ServiceStep from '@/components/booking/ServiceStep';
import StyleStep from '@/components/booking/StyleStep';
import LocationStep from '@/components/booking/LocationStep';
import DateStep from '@/components/booking/DateStep';
import TimeStep from '@/components/booking/TimeStep';
import DetailsStep from '@/components/booking/DetailsStep';
import SummaryStep from '@/components/booking/SummaryStep';
import ConfirmationStep from '@/components/booking/ConfirmationStep';
import Button from '@/components/ui/Button';
import { useBookingDraft } from '@/hooks/useBookingDraft';
import { useAuth } from '@/hooks/useAuth';
import { useCustomerData } from '@/hooks/useCustomerData';
import { createBooking } from '@/services/bookingService';
import { Booking, BookingCustomerDetails, HomeServiceDetails } from '@/types';
import { getServiceById } from '@/data/services';
import { getStyleById } from '@/data/styles';
import { buildWhatsAppLink, buildBookingWhatsAppMessage } from '@/utils/whatsapp';

const TOTAL_STEPS = 7; // confirmation is a separate final screen, not part of the indicator

const emptyCustomer: BookingCustomerDetails = { fullName: '', phone: '', email: '' };

export default function Bookingpage() {
  const { draft, setDraft, resetDraft } = useBookingDraft();
  const { isAuthenticated, customer } = useAuth();
  const { addBooking } = useCustomerData();
  const [step, setStep] = useState(1);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  // If a signed-in customer starts a booking without any details filled in
  // yet, pre-fill their known info — same "connected app" idea as the rest
  // of the site sharing one data layer.
  useEffect(() => {
    if (isAuthenticated && customer && !draft.customer) {
      setDraft((prev) => ({
        ...prev,
        customer: { fullName: customer.fullName, email: customer.email, phone: customer.phone },
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, customer?.id]);

  const service = draft.serviceId ? getServiceById(draft.serviceId) : undefined;
  const style = draft.styleId ? getStyleById(draft.styleId) : undefined;

  const canProceed = (): boolean => {
    switch (step) {
      case 1:
        return !!draft.serviceId;
      case 2:
        return true; // style is optional
      case 3:
        if (draft.locationType === 'in-shop') return true;
        if (draft.locationType === 'home-service') {
          return !!(draft.homeServiceDetails?.fullAddress && draft.homeServiceDetails?.area);
        }
        return false;
      case 4:
        return !!draft.date;
      case 5:
        return !!draft.time;
      case 6:
        return !!(draft.customer?.fullName && draft.customer?.phone && draft.customer?.email);
      case 7:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (step < TOTAL_STEPS) {
      setStep((s) => s + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((s) => s - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleConfirm = () => {
    try {
      const booking = createBooking(draft, customer?.id ?? null);
      if (isAuthenticated) {
        addBooking(booking);
      }
      setConfirmedBooking(booking);
    } catch {
      // Incomplete draft — shouldn't happen since canProceed gates each step.
    }
  };

  const handleStartOver = () => {
    resetDraft();
    setConfirmedBooking(null);
    setStep(1);
  };

  if (confirmedBooking) {
    return (
      <>
        <PageBanner eyebrow="Booking" title="Confirmation" />
        <section className="container-lab py-16">
          <ConfirmationStep booking={confirmedBooking} />
          <div className="mt-8 flex justify-center">
            <button onClick={handleStartOver} className="text-xs font-semibold uppercase tracking-wide text-ink-500 hover:text-rose-600">
              Book Another Appointment
            </button>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageBanner
        eyebrow="Book Appointment"
        title="Reserve Your Appointment"
        description="Follow the steps below to book your service with DIJAH HAIR LAB."
      />

      <section className="container-lab py-12 lg:py-16">
        <StepIndicator currentStep={step} />

        <div className="mt-10 min-h-[24rem] rounded-sm border border-ink/10 p-6 sm:p-8 lg:p-10">
          {step === 1 && (
            <ServiceStep
              draft={draft}
              onSelect={(serviceId) => setDraft((prev) => ({ ...prev, serviceId, styleId: undefined }))}
            />
          )}
          {step === 2 && (
            <StyleStep draft={draft} onSelect={(styleId) => setDraft((prev) => ({ ...prev, styleId }))} />
          )}
          {step === 3 && (
            <LocationStep
              draft={draft}
              onSelectType={(locationType) => setDraft((prev) => ({ ...prev, locationType }))}
              onChangeHomeDetails={(homeServiceDetails: HomeServiceDetails) =>
                setDraft((prev) => ({ ...prev, homeServiceDetails }))
              }
            />
          )}
          {step === 4 && (
            <DateStep draft={draft} onSelect={(date) => setDraft((prev) => ({ ...prev, date, time: undefined }))} />
          )}
          {step === 5 && (
            <TimeStep draft={draft} onSelect={(time) => setDraft((prev) => ({ ...prev, time }))} />
          )}
          {step === 6 && (
            <DetailsStep
              details={draft.customer ?? emptyCustomer}
              onChange={(customer) => setDraft((prev) => ({ ...prev, customer }))}
            />
          )}
          {step === 7 && <SummaryStep draft={draft} />}
        </div>

        <div className="mt-6 flex items-center justify-between gap-4">
          <button
            onClick={handleBack}
            disabled={step === 1}
            className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-ink-500 hover:text-rose-600 disabled:opacity-30"
          >
            <ChevronLeft size={14} /> Back
          </button>

          <div className="flex items-center gap-3">
            {step === 7 && (
              <Button
                href={buildWhatsAppLink(buildBookingWhatsAppMessage(draft, service?.name, style?.name))}
                target="_blank"
                variant="whatsapp"
              >
                Book via WhatsApp
              </Button>
            )}
            {step < TOTAL_STEPS ? (
              <Button onClick={handleNext} disabled={!canProceed()} icon={<ChevronRight size={16} />}>
                Continue
              </Button>
            ) : (
              <Button onClick={handleConfirm} disabled={!canProceed()}>
                Confirm Booking
              </Button>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
