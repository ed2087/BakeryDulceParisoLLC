import { Link } from 'react-router-dom';
import { usePrefs } from '../lib/app-state';
import { ui } from '../lib/content';
import { buttonClass } from '../components/ui';

export default function NotFound() {
  const { t } = usePrefs();
  return (
    <div className="mx-auto flex min-h-[80svh] max-w-md flex-col items-center justify-center px-6 pt-24 text-center">
      <p className="font-display text-7xl italic">404</p>
      <p className="mt-4 text-muted">{t(ui.notFound.title)}</p>
      <Link to="/menu" className={`${buttonClass.primary} mt-8`}>{t(ui.notFound.cta)}</Link>
    </div>
  );
}
