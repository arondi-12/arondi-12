import { SiteFooter, SiteHeader } from "@/components/marketing/chrome";
import { Hero } from "@/components/marketing/hero";
import { Lifecycle } from "@/components/marketing/lifecycle";
import { Autonomy } from "@/components/marketing/autonomy";
import { ConsentRail } from "@/components/marketing/consent-rail";
import { AgentApi, CtaBand, Points } from "@/components/marketing/agents-points";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <Lifecycle />
        <Autonomy />
        <ConsentRail />
        <AgentApi />
        <Points />
        <CtaBand />
      </main>
      <SiteFooter />
    </>
  );
}
