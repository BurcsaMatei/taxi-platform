import { 
  introSectionClass, 
  introTitleClass, 
  introTextClass 
} from '../../../styles/introSection.css';

const IntroSectionHomepage = () => (
  <section className={introSectionClass}>
    <h2 className={introTitleClass}>De ce KonceptID?</h2>
    <p className={introTextClass}>
      Credem în forța ideilor simple, transpuse digital cu grijă și pasiune. Descoperă un partener de încredere pentru proiecte creative, rapide și bine gândite.
    </p>
  </section>
);

export default IntroSectionHomepage;
