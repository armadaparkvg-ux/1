import { Hero } from "@/components/hero";
import { Trust } from "@/components/trust";
import { Tariffs } from "@/components/tariffs";
import { LaborContract } from "@/components/labor-contract";
import { MaxChannel } from "@/components/max-channel";
import { Services } from "@/components/services";
import { Taxes } from "@/components/taxes";
import { Requirements } from "@/components/requirements";
import { HowItWorks } from "@/components/how-it-works";
import { Faq } from "@/components/faq";
import { LeadForm } from "@/components/lead-form";
import { Contacts } from "@/components/contacts";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Trust />
      <div className="divider-glow mx-auto max-w-7xl" />
      <Tariffs />
      <div className="divider-glow mx-auto max-w-7xl" />
      <LaborContract />
      <MaxChannel />
      <div className="divider-glow mx-auto max-w-7xl" />
      <Services />
      <Taxes />
      <Requirements />
      <div className="divider-glow mx-auto max-w-7xl" />
      <HowItWorks />
      <div className="divider-glow mx-auto max-w-7xl" />
      <Faq />
      <div className="divider-glow mx-auto max-w-7xl" />
      <LeadForm />
      <Contacts />
    </>
  );
}
