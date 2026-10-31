import { useState } from 'react'
import { Sun, Zap, Mail, Phone, MapPin, Clock, Send, Loader2, CheckCircle } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email address'),
  phone: z.string().min(10, 'Enter a valid phone number'),
  subject: z.string().min(1, 'Select a subject'),
  message: z.string().min(20, 'Message must be at least 20 characters'),
})

type ContactForm = z.infer<typeof contactSchema>

export function ContactPage() {
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (data: ContactForm) => {
    void data
    setSubmitStatus('submitting')
    await new Promise(resolve => setTimeout(resolve, 1500))
    setSubmitStatus('success')
    reset()
  }

  if (submitStatus === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center py-20 px-4">
        <div className="w-full max-w-md">
          <div className="text-center p-8 rounded-2xl bg-card border">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-8 w-8 text-green-600" aria-hidden="true" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Message Sent!</h1>
            <p className="text-muted-foreground mb-6">
              Thank you for contacting us. We'll get back to you within 24 hours.
            </p>
            <button
              onClick={() => setSubmitStatus('idle')}
              className="w-full rounded-md bg-primary px-6 py-3 font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Send Another Message
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-gradient-to-b from-background to-muted/50 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
              <Sun className="h-4 w-4" aria-hidden="true" />
              <Zap className="h-4 w-4 text-yellow-400" aria-hidden="true" />
              <span>Contact Us</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground mb-6">
              Get in Touch with{' '}
              <span className="text-primary">SunPower One</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Have questions? Our team is here to help. Whether you're a homeowner,
              installer, or business partner, we'd love to hear from you.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-12 lg:py-16 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="p-6 rounded-2xl bg-card border">
              <h2 className="text-2xl font-bold text-foreground mb-6">Send Us a Message</h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">Full Name *</label>
                    <input
                      id="name"
                      {...register('name')}
                      className={`w-full rounded-md border bg-background px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-ring ${errors.name ? 'border-red-500' : ''}`}
                      placeholder="Your name"
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">Email Address *</label>
                    <input
                      id="email"
                      type="email"
                      {...register('email')}
                      className={`w-full rounded-md border bg-background px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-ring ${errors.email ? 'border-red-500' : ''}`}
                      placeholder="you@example.com"
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-1">Phone Number</label>
                    <input
                      id="phone"
                      type="tel"
                      {...register('phone')}
                      className={`w-full rounded-md border bg-background px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-ring ${errors.phone ? 'border-red-500' : ''}`}
                      placeholder="9876543210"
                    />
                    {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>}
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-1">Subject *</label>
                    <select
                      id="subject"
                      {...register('subject')}
                      className={`w-full rounded-md border bg-background px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-ring ${errors.subject ? 'border-red-500' : ''}`}
                    >
                      <option value="">Select a topic</option>
                      <option value="general">General Inquiry</option>
                      <option value="sales">Sales & Quotations</option>
                      <option value="support">Technical Support</option>
                      <option value="service">Service & Warranty</option>
                      <option value="partnership">Partnership / Dealer Inquiry</option>
                      <option value="careers">Careers</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.subject && <p className="mt-1 text-sm text-red-500">{errors.subject.message}</p>}
                  </div>
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-foreground mb-1">Message *</label>
                  <textarea
                    id="message"
                    rows={5}
                    {...register('message')}
                    className={`w-full rounded-md border bg-background px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-ring ${errors.message ? 'border-red-500' : ''}`}
                    placeholder="How can we help you?"
                  />
                  {errors.message && <p className="mt-1 text-sm text-red-500">{errors.message.message}</p>}
                </div>
                <button
                  type="submit"
                  disabled={submitStatus === 'submitting'}
                  className="w-full rounded-md bg-primary px-6 py-3 text-lg font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {submitStatus === 'submitting' ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-5 w-5" aria-hidden="true" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-card border">
                <h3 className="text-xl font-bold text-foreground mb-6">Contact Information</h3>
                <div className="space-y-6">
                  {[
                    { icon: MapPin, title: 'Head Office', details: ['123 Solar Lane, Green City', 'GC 12345, India'] },
                    { icon: Phone, title: 'Phone', details: ['+91 1800 123 456 (Toll Free)', '+91 22 1234 5678 (Direct)'] },
                    { icon: Mail, title: 'Email', details: ['info@sunpowerone.com (General)', 'sales@sunpowerone.com (Sales)', 'support@sunpowerone.com (Support)'] },
                    { icon: Clock, title: 'Business Hours', details: ['Monday - Saturday: 9:00 AM - 6:00 PM', 'Sunday: Closed', 'Emergency Support: 24/7'] },
                  ].map((item) => (
                    <div key={item.title} className="flex gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <item.icon className="h-6 w-6" aria-hidden="true" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">{item.title}</h4>
                        <div className="text-sm text-muted-foreground space-y-1">
                          {item.details.map((detail, i) => (
                            <p key={i}>{detail}</p>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-card border">
                <h3 className="text-xl font-bold text-foreground mb-4">Quick Links</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    { label: 'Request a Survey', href: '/request-survey' },
                    { label: 'Solar Calculator', href: '/solar-calculator' },
                    { label: 'On-Grid Systems', href: '/solutions/on-grid' },
                    { label: 'Off-Grid Systems', href: '/solutions/off-grid' },
                    { label: 'Customer Portal', href: '/portal/dashboard' },
                    { label: 'Technician Login', href: '/technician/dashboard' },
                  ].map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      className="p-3 rounded-lg bg-muted/50 hover:bg-primary/10 transition-colors text-left"
                    >
                      <p className="font-medium text-foreground">{link.label}</p>
                    </a>
                  ))}
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-primary text-primary-foreground">
                <h3 className="text-xl font-bold mb-2">Interested in Becoming a Dealer?</h3>
                <p className="text-primary-foreground/80 mb-4">
                  Join our network of authorized dealers and installers across India.
                  Access training, marketing support, and competitive pricing.
                </p>
                <a
                  href="/contact?subject=partnership"
                  className="inline-flex items-center gap-2 rounded-md bg-primary-foreground px-6 py-2 font-medium text-primary hover:bg-primary-foreground/90 transition-colors"
                >
                  Apply Now
                  <Sun className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Placeholder */}
      <section className="py-12 lg:py-16 bg-muted/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="aspect-video rounded-xl bg-card border flex items-center justify-center">
            <div className="text-center p-8">
              <MapPin className="h-12 w-12 mx-auto text-primary/30 mb-4" aria-hidden="true" />
              <p className="text-foreground">Interactive Map</p>
              <p className="text-sm text-muted-foreground mt-1">Office location with directions</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}