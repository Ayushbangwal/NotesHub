import React, { useState } from 'react'
import emailjs from '@emailjs/browser'
import { Mail, MessageSquare, Send, MapPin, Clock } from 'lucide-react'

const ContactUs = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await emailjs.send(
        'service_csym9hc',    // 🔁 paste karo Service ID
        'template_rk2bih8',   // 🔁 paste karo Template ID
        {
          from_name: form.name,
          from_email: form.email,
          subject: form.subject,
          message: form.message,
        },
        'Cc8nttOHwG-k-pFTJ'     // 🔁 paste karo Public Key
      )
      setSubmitted(true)
    } catch (err) {
      setError('Something went wrong. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-primary-500/10 rounded-full">
            <Mail className="h-10 w-10 text-primary-400" />
          </div>
        </div>
        <h1 className="text-4xl font-bold gradient-text mb-3">Contact Us</h1>
        <p className="text-gray-400">We'd love to hear from you. Send us a message!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: <Mail className="h-6 w-6 text-primary-400" />, title: 'Email', info: 'support@noteshub.com' },
          { icon: <Clock className="h-6 w-6 text-primary-400" />, title: 'Response Time', info: 'Within 24-48 hours' },
          { icon: <MapPin className="h-6 w-6 text-primary-400" />, title: 'Based In', info: 'India 🇮🇳' },
        ].map((item, i) => (
          <div key={i} className="bg-dark-secondary border border-dark-border rounded-xl p-6 text-center hover:border-primary-500/30 transition-colors">
            <div className="flex justify-center mb-3">{item.icon}</div>
            <h3 className="text-gray-100 font-semibold mb-1">{item.title}</h3>
            <p className="text-gray-400 text-sm">{item.info}</p>
          </div>
        ))}
      </div>

      <div className="bg-dark-secondary border border-dark-border rounded-xl p-8">
        {submitted ? (
          <div className="text-center py-8">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-green-500/10 rounded-full">
                <Send className="h-10 w-10 text-green-400" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-100 mb-2">Message Sent!</h2>
            <p className="text-gray-400">Thank you for reaching out. We'll get back to you within 24-48 hours.</p>
            <button
              onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }) }}
              className="mt-6 text-primary-400 hover:text-primary-300 transition-colors"
            >
              Send another message
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-semibold text-gray-100 mb-6 flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary-400" /> Send a Message
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {[
                  { label: 'Your Name', key: 'name', type: 'text', placeholder: 'Ayush Bangwal' },
                  { label: 'Email Address', key: 'email', type: 'email', placeholder: 'ayush@example.com' },
                ].map(field => (
                  <div key={field.key}>
                    <label className="block text-sm text-gray-400 mb-2">{field.label}</label>
                    <input
                      type={field.type}
                      required
                      placeholder={field.placeholder}
                      value={form[field.key]}
                      onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                      className="w-full px-4 py-3 bg-dark-primary border border-dark-border rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors"
                    />
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Subject</label>
                <input
                  type="text"
                  required
                  placeholder="How can we help you?"
                  value={form.subject}
                  onChange={e => setForm({ ...form, subject: e.target.value })}
                  className="w-full px-4 py-3 bg-dark-primary border border-dark-border rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Message</label>
                <textarea
                  required
                  rows={5}
                  placeholder="Describe your issue or question in detail..."
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  className="w-full px-4 py-3 bg-dark-primary border border-dark-border rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors resize-none"
                />
              </div>
              {error && <p className="text-red-400 text-sm">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-500 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <Send className="h-4 w-4" />
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

export default ContactUs