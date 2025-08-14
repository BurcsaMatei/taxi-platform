// components/sections/homepage/HeroSectionHomepage.tsx
import Image from 'next/image';
import { IMAGES } from '@/lib/images';

import {
  heroSectionHomepageBgClass,
  heroSectionHomepageContainerClass,
  heroTitleClass,
  heroSubtitleClass,
} from '../../../styles/homepage/heroSectionHomepage.css';
import Button from '../../Button';
import { HeroAnimatedText } from '../../HeroAnimatedText'; // ajustează path-ul dacă e altul

const HeroSectionHomepage = () => {
  return (
    <section
      className={heroSectionHomepageBgClass}
      style={{
        position: 'relative',
        minHeight: '60vh',
        overflow: 'hidden',
      }}
    >
      {/* Imaginea HERO optimizată de Next.js */}
      <Image
        src={IMAGES.hero}
        alt="Imagine Hero"
        fill
        sizes="100vw"
        priority
        style={{ objectFit: 'cover', objectPosition: 'center', zIndex: 0 }}
      />

      {/* Overlay pentru contrast (opțional) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.35) 100%)',
          zIndex: 1,
        }}
      />

      {/* Conținutul peste imagine */}
      <div
        className={heroSectionHomepageContainerClass}
        style={{ position: 'relative', zIndex: 2 }}
      >
        <HeroAnimatedText as="h1" className={heroTitleClass}>
          Bine ai venit la KonceptID!
        </HeroAnimatedText>

        <p className={heroSubtitleClass}>
          Transformăm ideile în proiecte digitale memorabile.
        </p>

        <Button href="/galerie">Vezi galeria</Button>
      </div>
    </section>
  );
};

export default HeroSectionHomepage;
