import Link from 'next/link';

const navigation = [
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
  { name: 'Privacy Policy', href: '/privacy-policy' },
];

const Footer: React.FC = () => (
  <footer className="bg-black text-white">
    <div className="mx-auto max-w-7xl px-6 py-2 md:flex md:items-center md:justify-between lg:px-8">
      <ul className="flex justify-center space-x-6">
        {navigation.map(({ name, href }) => (
          <li key={href}>
            <Link
              href={href}
              className="block rounded-lg ring-offset-black transition-colors hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
            >
              {name}
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-8 md:order-1 md:mt-0">
        <p className="text-center">&copy; Skytruth 30x30 2023</p>
      </div>
    </div>
  </footer>
);

export default Footer;
