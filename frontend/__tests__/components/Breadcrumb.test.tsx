import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Breadcrumb } from '../../components/ui/Breadcrumb';

expect.extend(toHaveNoViolations);

describe('Breadcrumb', () => {
  it('renders a single non-linked crumb', () => {
    render(<Breadcrumb crumbs={[{ label: 'Home' }]} />);
    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  it('renders linked crumb as anchor', () => {
    render(<Breadcrumb crumbs={[{ label: 'Programs', href: '/programs' }]} />);
    const link = screen.getByRole('link', { name: 'Programs' });
    expect(link).toHaveAttribute('href', '/programs');
  });

  it('renders multiple crumbs with separators', () => {
    render(
      <Breadcrumb
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Programs', href: '/programs' },
          { label: 'BSCS' },
        ]}
      />,
    );
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Programs')).toBeInTheDocument();
    expect(screen.getByText('BSCS')).toBeInTheDocument();
  });

  it('last crumb has aria-current="page"', () => {
    render(<Breadcrumb crumbs={[{ label: 'Programs', href: '/programs' }, { label: 'BSCS' }]} />);
    expect(screen.getByText('BSCS')).toHaveAttribute('aria-current', 'page');
  });

  it('non-last linked crumbs have no aria-current', () => {
    render(<Breadcrumb crumbs={[{ label: 'Programs', href: '/programs' }, { label: 'BSCS' }]} />);
    const link = screen.getByRole('link', { name: 'Programs' });
    expect(link).not.toHaveAttribute('aria-current');
  });

  it('renders nav landmark with Breadcrumb label', () => {
    render(<Breadcrumb crumbs={[{ label: 'Home' }]} />);
    expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeInTheDocument();
  });

  it('has no axe accessibility violations', async () => {
    const { container } = render(
      <Breadcrumb
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Programs', href: '/programs' },
          { label: 'BSCS' },
        ]}
      />,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
