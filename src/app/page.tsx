import { UsacoHero } from "@/components/landing/usaco-hero";
import { UsacoShowcase } from "@/components/landing/usaco-showcase";
import { UsacoTracks } from "@/components/landing/usaco-tracks";
import { UsacoStats } from "@/components/landing/usaco-stats";
import { ContributorsSection } from "@/components/landing/contributors-section";
import { UsacoFaq } from "@/components/landing/usaco-faq";

export default function HomePage() {
  return (
    <main className="flex-1">
      <UsacoHero />
      <UsacoShowcase />
      <UsacoTracks />
      <UsacoStats />
      <ContributorsSection />
      <UsacoFaq />
    </main>
  );
}
