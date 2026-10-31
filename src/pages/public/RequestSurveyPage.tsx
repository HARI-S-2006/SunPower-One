import { useState } from 'react'
import { Sun, Zap, ArrowRight, Mail, Phone, MapPin, CheckCircle, Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const enquirySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(10, 'Enter a valid 10-digit phone number'),
  email: z.string().email('Enter a valid email address'),
  address: z.string().min(10, 'Please provide complete address'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  pincode: z.string().min(6, 'Enter valid 6-digit pincode'),
  requiredCapacity: z.string().min(1, 'Select required capacity'),
  systemType: z.string().min(1, 'Select system type'),
  monthlyBill: z.string().optional(),
  rooftopArea: z.string().optional(),
  gridSuitability: z.string().optional(),
  additionalRequirements: z.string().optional(),
})

type EnquiryForm = z.infer<typeof enquirySchema>

const states = [
  'Maharashtra', 'Gujarat', 'Rajasthan', 'Karnataka', 'Tamil Nadu', 'Delhi',
  'Uttar Pradesh', 'Madhya Pradesh', 'West Bengal', 'Kerala', 'Andhra Pradesh',
  'Telangana', 'Punjab', 'Haryana', 'Odisha', 'Bihar', 'Jharkhand', 'Chhattisgarh',
  'Himachal Pradesh', 'Uttarakhand', 'Assam', 'Goa', 'Other'
]

export function RequestSurveyPage() {
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EnquiryForm>({
    resolver: zodResolver(enquirySchema),
  })

  const onSubmit = async (data: EnquiryForm) => {
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
            <h1 className="text-2xl font-bold text-foreground mb-2">Enquiry Submitted!</h1>
            <p className="text-muted-foreground mb-6">
              Thank you for your interest. Our team will contact you within 24 hours
              to schedule a free site survey.
            </p>
            <button
              onClick={() => setSubmitStatus('idle')}
              className="w-full rounded-md bg-primary px-6 py-3 font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Submit Another Enquiry
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
              <span>Free Site Survey</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground mb-6">
              Request a Free{' '}
              <span className="text-primary">Site Survey</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Our certified technicians will visit your property, assess roof suitability,
              take measurements, and provide a detailed quotation. No obligation.
            </p>
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="py-12 lg:py-16 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="p-6 rounded-2xl bg-card border">
              <h2 className="text-2xl font-bold text-foreground mb-6">Schedule Your Free Survey</h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Personal Info */}
                <fieldset className="space-y-4">
                  <legend className="text-lg font-semibold text-foreground">Personal Information</legend>
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
                      <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-1">Phone Number *</label>
                      <input
                        id="phone"
                        type="tel"
                        {...register('phone')}
                        className={`w-full rounded-md border bg-background px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-ring ${errors.phone ? 'border-red-500' : ''}`}
                        placeholder="9876543210"
                      />
                      {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>}
                    </div>
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
                </fieldset>

                {/* Address */}
                <fieldset className="space-y-4">
                  <legend className="text-lg font-semibold text-foreground">Installation Address *</legend>
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-foreground mb-1">Complete Address</label>
                    <textarea
                      id="address"
                      rows={2}
                      {...register('address')}
                      className={`w-full rounded-md border bg-background px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-ring ${errors.address ? 'border-red-500' : ''}`}
                      placeholder="House/Flat No., Building, Street, Landmark"
                    />
                    {errors.address && <p className="mt-1 text-sm text-red-500">{errors.address.message}</p>}
                  </div>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-foreground mb-1">City *</label>
                      <input
                        id="city"
                        {...register('city')}
                        className={`w-full rounded-md border bg-background px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-ring ${errors.city ? 'border-red-500' : ''}`}
                        placeholder="Mumbai"
                      />
                      {errors.city && <p className="mt-1 text-sm text-red-500">{errors.city.message}</p>}
                    </div>
                    <div>
                      <label htmlFor="state" className="block text-sm font-medium text-foreground mb-1">State *</label>
                      <select
                        id="state"
                        {...register('state')}
                        className={`w-full rounded-md border bg-background px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-ring ${errors.state ? 'border-red-500' : ''}`}
                      >
                        <option value="">Select state</option>
                        {states.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      {errors.state && <p className="mt-1 text-sm text-red-500">{errors.state.message}</p>}
                    </div>
                    <div>
                      <label htmlFor="pincode" className="block text-sm font-medium text-foreground mb-1">Pincode *</label>
                      <input
                        id="pincode"
                        {...register('pincode')}
                        className={`w-full rounded-md border bg-background px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-ring ${errors.pincode ? 'border-red-500' : ''}`}
                        placeholder="400001"
                      />
                      {errors.pincode && <p className="mt-1 text-sm text-red-500">{errors.pincode.message}</p>}
                    </div>
                  </div>
                </fieldset>

                {/* System Requirements */}
                <fieldset className="space-y-4">
                  <legend className="text-lg font-semibold text-foreground">System Requirements</legend>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="requiredCapacity" className="block text-sm font-medium text-foreground mb-1">Required Capacity *</label>
                      <select
                        id="requiredCapacity"
                        {...register('requiredCapacity')}
                        className={`w-full rounded-md border bg-background px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-ring ${errors.requiredCapacity ? 'border-red-500' : ''}`}
                      >
                        <option value="">Select capacity</option>
                        <option value="1">1 kW</option>
                        <option value="2">2 kW</option>
                        <option value="3">3 kW</option>
                        <option value="4">4 kW</option>
                        <option value="5">5 kW</option>
                        <option value="other">Other / Not Sure</option>
                      </select>
                      {errors.requiredCapacity && <p className="mt-1 text-sm text-red-500">{errors.requiredCapacity.message}</p>}
                    </div>
                    <div>
                      <label htmlFor="systemType" className="block text-sm font-medium text-foreground mb-1">System Type *</label>
                      <select
                        id="systemType"
                        {...register('systemType')}
                        className={`w-full rounded-md border bg-background px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-ring ${errors.systemType ? 'border-red-500' : ''}`}
                      >
                        <option value="">Select type</option>
                        <option value="on-grid">On-Grid (Grid Connected)</option>
                        <option value="off-grid">Off-Grid (Battery Backup)</option>
                        <option value="not-sure">Not Sure - Need Advice</option>
                      </select>
                      {errors.systemType && <p className="mt-1 text-sm text-red-500">{errors.systemType.message}</p>}
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="monthlyBill" className="block text-sm font-medium text-foreground mb-1">Monthly Electricity Bill (₹)</label>
                      <input
                        id="monthlyBill"
                        type="number"
                        {...register('monthlyBill')}
                        className="w-full rounded-md border bg-background px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder="e.g., 3000"
                      />
                    </div>
                    <div>
                      <label htmlFor="rooftopArea" className="block text-sm font-medium text-foreground mb-1">Shadow-Free Rooftop Area (sq ft)</label>
                      <input
                        id="rooftopArea"
                        type="number"
                        {...register('rooftopArea')}
                        className="w-full rounded-md border bg-background px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder="e.g., 500"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="gridSuitability" className="block text-sm font-medium text-foreground mb-1">Grid Suitability (if known)</label>
                    <select
                      id="gridSuitability"
                      {...register('gridSuitability')}
                      className="w-full rounded-md border bg-background px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="">Select</option>
                      <option value="reliable">Reliable grid (few outages)</option>
                      <option value="unreliable">Frequent outages / voltage issues</option>
                      <option value="no-grid">No grid connection</option>
                      <option value="unknown">Unknown</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="additionalRequirements" className="block text-sm font-medium text-foreground mb-1">Additional Requirements</label>
                    <textarea
                      id="additionalRequirements"
                      rows={3}
                      {...register('additionalRequirements')}
                      className="w-full rounded-md border bg-background px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="Any specific requirements, preferred brands, budget range, timeline, etc."
                    />
                  </div>
                </fieldset>

                <button
                  type="submit"
                  disabled={submitStatus === 'submitting'}
                  className="w-full rounded-md bg-primary px-6 py-3 text-lg font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {submitStatus === 'submitting' ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Enquiry
                      <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Info Panel */}
            <div className="p-6 rounded-2xl bg-card border">
              <h3 className="text-xl font-bold text-foreground mb-6">What Happens Next?</h3>
              <ol className="space-y-6 mb-8">
                {[
                  { step: '1', title: 'Enquiry Received', desc: 'Our team reviews your details within 24 hours' },
                  { step: '2', title: 'Survey Scheduled', desc: 'We call you to schedule a convenient time for site visit' },
                  { step: '3', title: 'Site Assessment', desc: 'Technician measures roof, checks structure, takes photos' },
                  { step: '4', title: 'Quotation Prepared', desc: 'Custom BOM generated, detailed quotation sent for approval' },
                  { step: '5', title: 'Installation', desc: 'After acceptance & payment, installation scheduled' },
                ].map((item) => (
                  <li key={item.step} className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                      {item.step}
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ol>

              <div className="rounded-xl bg-primary/5 border p-4">
                <h4 className="font-semibold text-foreground mb-3">What We Need from You</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-primary" aria-hidden="true" />Access to roof for measurements</li>
                  <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-primary" aria-hidden="true" />Recent electricity bills (6-12 months)</li>
                  <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-primary" aria-hidden="true" />Property ownership documents</li>
                  <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-primary" aria-hidden="true" />ID proof for subsidy application</li>
                </ul>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                {[
                  { icon: Phone, label: 'Call Us', value: '1800-123-456' },
                  { icon: Mail, label: 'Email', value: 'survey@sunpowerone.com' },
                  { icon: MapPin, label: 'Visit Office', value: 'Mon-Sat, 9AM-6PM' },
                ].map((item) => (
                  <div key={item.label} className="p-4 rounded-lg bg-muted/50">
                    <item.icon className="h-6 w-6 mx-auto text-primary mb-2" aria-hidden="true" />
                    <p className="text-sm font-medium text-foreground">{item.label}</p>
                    <p className="text-sm text-muted-foreground">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}