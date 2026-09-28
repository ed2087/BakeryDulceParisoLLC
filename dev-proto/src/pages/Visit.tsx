import { brand, home } from '../lib/content';
import { VisitSection } from '../components/Visit';
import { PageHeader } from './PageHeader';

export default function Visit() {
  return (
    <>
      <PageHeader eyebrow={`${brand.address.city}, ${brand.address.state}`} title={home.visit.eyebrow} subtitle={home.visit.title} />
      <div className="-mt-16 lg:-mt-28">
        <VisitSection heading={false} />
      </div>
    </>
  );
}
