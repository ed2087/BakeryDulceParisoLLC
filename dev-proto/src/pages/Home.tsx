import { Hero } from '../components/Hero';
import { Celebrations, CategoryScroller, Classes, FreshFromOven, Popular, Story } from '../components/HomeSections';
import { VisitSection } from '../components/Visit';

export default function Home() {
  return (
    <>
      <Hero />
      <FreshFromOven />
      <CategoryScroller />
      <Celebrations />
      <Popular />
      <Story />
      <Classes />
      <VisitSection id="visitanos" />
    </>
  );
}
