import React from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, Github, Twitter, Mail } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-dark-border bg-dark-secondary">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <BookOpen className="h-8 w-8 text-primary-500" />
              <span className="text-xl font-bold gradient-text">NotesHub</span>
            </div>
            <p className="text-gray-400 text-sm mb-4 max-w-md">
              Your premier platform for sharing and discovering educational notes. 
              Connect with students worldwide and excel in your studies.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary-400 transition-colors"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary-400 transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="mailto:support@noteshub.com"
                className="text-gray-400 hover:text-primary-400 transition-colors"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-100 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/notes" className="text-sm text-gray-400 hover:text-primary-400 transition-colors">
                  Browse Notes
                </Link>
              </li>
              <li>
                <Link to="/trending" className="text-sm text-gray-400 hover:text-primary-400 transition-colors">
                  Trending
                </Link>
              </li>
              <li>
                <Link to="/upload" className="text-sm text-gray-400 hover:text-primary-400 transition-colors">
                  Upload Notes
                </Link>
              </li>
              <li>
                <Link to="/leaderboard" className="text-sm text-gray-400 hover:text-primary-400 transition-colors">
                  Leaderboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-gray-100 mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/help" className="text-sm text-gray-400 hover:text-primary-400 transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm text-gray-400 hover:text-primary-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-gray-400 hover:text-primary-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-gray-400 hover:text-primary-400 transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-dark-border">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400">
              © {currentYear} NotesHub. All rights reserved.
            </p>
            <p className="text-sm text-gray-400 mt-2 md:mt-0">
              Made with ❤️ for students worldwide
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
