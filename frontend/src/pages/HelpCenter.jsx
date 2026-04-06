import React, { useState } from 'react'
import { HelpCircle, ChevronDown, ChevronUp, Search, Upload, Download, User, Shield } from 'lucide-react'

const faqs = [
  {
    category: 'Getting Started',
    icon: <User className="h-5 w-5" />,
    questions: [
      {
        q: 'How do I create an account?',
        a: 'Click the "Sign Up" button on the top right corner. Fill in your name, email, and password. Verify your email and you\'re ready to go!'
      },
      {
        q: 'Is NotesHub free to use?',
        a: 'Yes! NotesHub is completely free for all students. You can browse, download, and upload notes without any charges.'
      },
      {
        q: 'How do I reset my password?',
        a: 'Click "Forgot Password" on the login page. Enter your email address and we\'ll send you a reset link within a few minutes.'
      }
    ]
  },
  {
    category: 'Uploading Notes',
    icon: <Upload className="h-5 w-5" />,
    questions: [
      {
        q: 'What file formats are supported?',
        a: 'We currently support PDF, DOCX, and PPT formats. PDF is recommended for best compatibility across all devices.'
      },
      {
        q: 'What is the maximum file size?',
        a: 'Each file can be up to 50MB in size. If your file is larger, consider compressing it or splitting it into multiple parts.'
      },
      {
        q: 'Can I edit or delete my uploaded notes?',
        a: 'Yes! Go to your Dashboard, find the note you want to manage, and use the edit or delete options available.'
      }
    ]
  },
  {
    category: 'Downloading Notes',
    icon: <Download className="h-5 w-5" />,
    questions: [
      {
        q: 'How do I download a note?',
        a: 'Find the note you want, click the "Download" button on the note card. The file will be saved to your device automatically.'
      },
      {
        q: 'Is there a download limit?',
        a: 'There is no download limit. You can download as many notes as you need for your studies.'
      },
      {
        q: 'Why is my download not starting?',
        a: 'Check your browser\'s popup blocker settings. NotesHub may need permission to open download links. Also check your internet connection.'
      }
    ]
  },
  {
    category: 'Privacy & Security',
    icon: <Shield className="h-5 w-5" />,
    questions: [
      {
        q: 'Who can see my uploaded notes?',
        a: 'All uploaded notes are publicly visible to registered users on the platform. Do not upload any personal or sensitive information.'
      },
      {
        q: 'How is my data protected?',
        a: 'We use industry-standard encryption and security practices to protect your data. Your password is hashed and never stored in plain text.'
      },
      {
        q: 'How do I delete my account?',
        a: 'Go to your Dashboard settings and scroll to the bottom. Click "Delete Account" and confirm. This action is permanent and cannot be undone.'
      }
    ]
  }
]

const FAQItem = ({ question, answer }) => {
  const [open, setOpen] = useState(false)
  return (
    <div
      className={`border rounded-xl overflow-hidden transition-all duration-300 cursor-pointer
        ${open ? 'border-primary-500/50 bg-primary-500/5' : 'border-dark-border bg-dark-secondary hover:border-primary-500/30'}`}
      onClick={() => setOpen(!open)}
    >
      <div className="flex justify-between items-center p-4">
        <p className="text-gray-100 font-medium pr-4">{question}</p>
        {open
          ? <ChevronUp className="h-5 w-5 text-primary-400 flex-shrink-0" />
          : <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0" />}
      </div>
      {open && (
        <div className="px-4 pb-4">
          <p className="text-gray-300 leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  )
}

const HelpCenter = () => {
  const [search, setSearch] = useState('')

  const filtered = faqs.map(cat => ({
    ...cat,
    questions: cat.questions.filter(
      q => q.q.toLowerCase().includes(search.toLowerCase()) ||
           q.a.toLowerCase().includes(search.toLowerCase())
    )
  })).filter(cat => cat.questions.length > 0)

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-primary-500/10 rounded-full">
            <HelpCircle className="h-10 w-10 text-primary-400" />
          </div>
        </div>
        <h1 className="text-4xl font-bold gradient-text mb-3">Help Center</h1>
        <p className="text-gray-400 mb-6">Find answers to frequently asked questions</p>
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search your question..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-dark-secondary border border-dark-border rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors"
          />
        </div>
      </div>

      {filtered.map((cat, i) => (
        <div key={i}>
          <div className="flex items-center space-x-2 mb-4">
            <span className="text-primary-400">{cat.icon}</span>
            <h2 className="text-xl font-semibold text-gray-100">{cat.category}</h2>
          </div>
          <div className="space-y-3">
            {cat.questions.map((item, j) => (
              <FAQItem key={j} question={item.q} answer={item.a} />
            ))}
          </div>
        </div>
      ))}

      <div className="bg-gradient-to-r from-primary-500/10 to-purple-500/10 border border-primary-500/20 rounded-xl p-6 text-center">
        <h3 className="text-lg font-semibold text-gray-100 mb-2">Still need help?</h3>
        <p className="text-gray-400 mb-4">Can't find your answer? Contact our support team directly.</p>
        <a
          href="/contact"
          className="inline-block bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-lg transition-colors font-medium"
        >
          Contact Support
        </a>
      </div>
    </div>
  )
}

export default HelpCenter