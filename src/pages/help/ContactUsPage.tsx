import { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';
import { PageLayout } from '../../components/PageLayout';
import { PageHero, InfoCard } from './HelpShared';

export function ContactUsPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setTimeout(() => {
      setStatus("success");
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1500);
  };

  return (
    <PageLayout>
      <PageHero
        icon={MessageSquare}
        title="Contact Us"
        subtitle="We'd love to hear from you. Please reach out with any questions."
        crumb="Contact"
      />
      
      <div className="max-w-5xl mx-auto px-4 py-16 grid md:grid-cols-5 gap-10">
        
        {/* Contact Info Sidebar */}
        <div className="md:col-span-2 space-y-6">
          <InfoCard icon={Phone} title="Call Us">
            <p className="text-sm text-emerald-900/70 dark:text-gray-400">
              Mon-Fri from 8am to 5pm.<br/>
              <a href="tel:+15551234567" className="font-bold text-emerald-700 dark:text-emerald-400 mt-2 inline-block hover:underline">
                +1 (555) 123-4567
              </a>
            </p>
          </InfoCard>

          <InfoCard icon={Mail} title="Email Us">
            <p className="text-sm text-emerald-900/70 dark:text-gray-400">
              We aim to respond within 24 hours.<br/>
              <a href="mailto:support@bookstore.com" className="font-bold text-emerald-700 dark:text-emerald-400 mt-2 inline-block hover:underline">
                support@bookstore.com
              </a>
            </p>
          </InfoCard>

          <InfoCard icon={MapPin} title="Visit Us">
            <p className="text-sm text-emerald-900/70 dark:text-gray-400">
              123 Reading Lane, Book District<br/>
              Literary City, ST 12345<br/>
              United States
            </p>
          </InfoCard>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-3 bg-white dark:bg-dark-card border border-emerald-100 dark:border-white/5 rounded-2xl p-8 shadow-xl">
          <h2 className="text-2xl font-black text-emerald-950 dark:text-white mb-6 font-serif">
            Send us a message
          </h2>
          
          {status === "success" ? (
            <div className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 p-6 rounded-xl border border-green-200 dark:border-green-900/30 text-center">
              <h3 className="text-xl font-bold mb-2">Message Sent!</h3>
              <p>Thank you for contacting us. We'll get back to you shortly.</p>
              <button 
                onClick={() => setStatus("idle")}
                className="mt-6 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-bold"
              >
                Send Another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-bold text-emerald-950 dark:text-gray-300 mb-2">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-emerald-200 dark:border-white/10 bg-emerald-50/30 dark:bg-dark-bg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-shadow dark:text-white"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-bold text-emerald-950 dark:text-gray-300 mb-2">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-emerald-200 dark:border-white/10 bg-emerald-50/30 dark:bg-dark-bg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-shadow dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-bold text-emerald-950 dark:text-gray-300 mb-2">Subject</label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-emerald-200 dark:border-white/10 bg-emerald-50/30 dark:bg-dark-bg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-shadow dark:text-white"
                >
                  <option value="">Select a subject...</option>
                  <option value="order">Order Inquiry</option>
                  <option value="returns">Returns & Refunds</option>
                  <option value="product">Product Question</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-bold text-emerald-950 dark:text-gray-300 mb-2">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 rounded-lg border border-emerald-200 dark:border-white/10 bg-emerald-50/30 dark:bg-dark-bg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-shadow dark:text-white resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={status === "submitting"}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-md"
              >
                {status === "submitting" ? (
                  "Sending..."
                ) : (
                  <>
                    <Send size={18} />
                    Send Message
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
