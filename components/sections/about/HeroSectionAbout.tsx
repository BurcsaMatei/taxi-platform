// components/sections/services/HeroSectionServices.tsx
import Image from 'next/image';
import { IMAGES } from '@/lib/images';

import {
  heroSectionHomepageBgClass,
  heroSectionHomepageContainerClass,
  heroTitleClass,
  heroSubtitleClass,
} from '../../../styles/homepage/heroSectionHomepage.css';
import Button from '../../Button';
import { HeroAnimatedText } from '../../HeroAnimatedText';

const HeroSectionServices = () => {
  return (
    <section
      className={heroSectionHomepageBgClass}
      style={{ position: 'relative', minHeight: '60vh', overflow: 'hidden' }}
    >
      <Image
        src={IMAGES.heroServices}
        alt="Imagine Hero Servicii"
        fill
        sizes="100vw"
        priority
        style={{ objectFit: 'cover', objectPosition: 'center', zIndex: 0 }}
      />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.35) 100%)',
          zIndex: 1,
        }}
      />

      <div
        className={heroSectionHomepageContainerClass}
        style={{ position: 'relative', zIndex: 2 }}
      >
        <HeroAnimatedText as="h1" className={heroTitleClass}>
          Servicii
        </HeroAnimatedText>

        <p className={heroSubtitleClass}>
          Soluții clare, implementare rapidă, rezultate măsurabile.
        </p>

        <Button href="/servicii">Vezi toate serviciile</Button>
      </div>
    </section>
  );
};

export default HeroSectionServices;
