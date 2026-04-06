import React from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, Github, Twitter, Mail } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-dark-border bg-dark-secondary w-full mt-auto">
      <div className="container mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <BookOpen className="h-7 w-7 text-primary-500" />
              <span className="text-xl font-bold gradient-text">NotesHub</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed mb-6 max-w-sm">
              Your premier platform for sharing and discovering educational notes.
              Connect with students worldwide and excel in your studies.
            </p>
            <div className="flex space-x-2">
              {[
                { href: 'https://github.com/Ayushbangwal', icon: <Github className="h-4 w-4" />, label: 'GitHub' },
                { href: 'https://twitter.com', icon: <Twitter className="h-4 w-4" />, label: 'Twitter' },
                { href: 'mailto:ayushbangwal0@gmail.com', icon: <Mail className="h-4 w-4" />, label: 'Email' },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target={social.href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex items-center justify-center w-9 h-9 rounded-xl bg-dark-primary border border-dark-border text-gray-500 hover:text-primary-400 hover:border-primary-500/40 hover:bg-primary-500/10 transition-all duration-200"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-5">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { to: '/notes', label: 'Browse Notes' },
                { to: '/trending', label: 'Trending' },
                { to: '/upload', label: 'Upload Notes' },
                { to: '/leaderboard', label: 'Leaderboard' },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-gray-500 hover:text-primary-400 transition-all duration-200 inline-flex items-center gap-1.5 group"
                  >
                    <span className="w-0 group-hover:w-2 h-px bg-primary-400 transition-all duration-200 inline-block rounded-full" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-5">Support</h3>
            <ul className="space-y-3">
              {[
                { to: '/help', label: 'Help Center' },
                { to: '/privacy', label: 'Privacy Policy' },
                { to: '/terms', label: 'Terms of Service' },
                { to: '/contact', label: 'Contact Us' },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-gray-500 hover:text-primary-400 transition-all duration-200 inline-flex items-center gap-1.5 group"
                  >
                    <span className="w-0 group-hover:w-2 h-px bg-primary-400 transition-all duration-200 inline-block rounded-full" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-5 border-t border-dark-border flex flex-col md:flex-row justify-between items-center gap-2">
          <p className="text-xs text-gray-600">
            © {currentYear} <span className="text-gray-500 font-medium">NotesHub</span>
            <span className="mx-2 text-gray-700">·</span>
            All rights reserved
          </p>
          <p className="text-xs text-gray-600">
            Built for students, by students
          </p>
        </div>

      </div>
    </footer>
  )
}

export default Footer