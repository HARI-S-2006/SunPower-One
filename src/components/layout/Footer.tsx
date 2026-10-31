import { Link } from 'react-router-dom'
import { Sun, Zap, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    product: [
      { name: 'On-Grid Systems', href: '/solutions/on-grid' },
      { name: 'Off-Grid Systems', href: '/solutions/off-grid' },
      { name: 'Solar Calculator', href: '/solar-calculator' },
      { name: 'Request Survey', href: '/request-survey' },
    ],
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Contact', href: '/contact' },
      { name: 'Careers', href: '#' },
      { name: 'Blog', href: '#' },
    ],
    support: [
      { name: 'Documentation', href: '#' },
      { name: 'Help Center', href: '#' },
      { name: 'Terms of Service', href: '#' },
      { name: 'Privacy Policy', href: '#' },
    ],
  }

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: '#' },
    { name: 'Twitter', icon: Twitter, href: '#' },
    { name: 'LinkedIn', icon: Linkedin, href: '#' },
    { name: 'Instagram', icon: Instagram, href: '#' },
  ]

  return (
    <footer className="border-t bg-muted/50" role="contentinfo">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8">
            <Link to="/" className="flex items-center gap-2" aria-label="SunPower One Home">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Sun className="h-5 w-5" aria-hidden="true" />
                <Zap className="h-5 w-5 text-yellow-400" aria-hidden="true" />
              </div>
              <span className="font-bold text-xl">SunPower One</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              The intelligent operating platform for solar installation businesses.
              Transform your manual operations into a connected, transparent digital system.
            </p>
            <div className="flex gap-6">
              {socialLinks.map(({ name, icon: Icon, href }) => (
                <a
                  key={name}
                  href={href}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={name}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-foreground">Product</h3>
                <ul className="mt-4 space-y-3" role="list">
                  {footerLinks.product.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold text-foreground">Company</h3>
                <ul className="mt-4 space-y-3" role="list">
                  {footerLinks.company.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-foreground">Support</h3>
                <ul className="mt-4 space-y-3" role="list">
                  {footerLinks.support.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold text-foreground">Contact</h3>
                <address className="mt-4 not-italic text-sm text-muted-foreground space-y-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
                    <span>123 Solar Lane, Green City, GC 12345</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 shrink-0" aria-hidden="true" />
                    <a href="tel:+1234567890" className="hover:text-foreground transition-colors">+1 (234) 567-890</a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
                    <a href="mailto:info@sunpowerone.com" className="hover:text-foreground transition-colors">info@sunpowerone.com</a>
                  </div>
                </address>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t pt-8">
          <p className="text-sm text-muted-foreground text-center">
            &copy; {currentYear} SunPower One. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}