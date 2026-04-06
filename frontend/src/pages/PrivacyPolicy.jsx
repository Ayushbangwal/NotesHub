import React from 'react'
import { Shield } from 'lucide-react'

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-primary-500/10 rounded-full">
            <Shield className="h-10 w-10 text-primary-400" />
          </div>
        </div>
        <h1 className="text-4xl font-bold gradient-text mb-3">Privacy Policy</h1>
        <p className="text-gray-400">Last updated: April 2026</p>
      </div>

      {[
        {
          title: '1. Information We Collect',
          content: `We collect information you provide directly to us, such as when you create an account, upload notes, or contact us for support. This includes your name, email address, and any content you upload to our platform.`
        },
        {
          title: '2. How We Use Your Information',
          content: `We use the information we collect to provide, maintain, and improve our services, process transactions, send you technical notices and support messages, and respond to your comments and questions.`
        },
        {
          title: '3. Information Sharing',
          content: `We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties. This does not include trusted third parties who assist us in operating our website, as long as those parties agree to keep this information confidential.`
        },
        {
          title: '4. Data Security',
          content: `We implement a variety of security measures to maintain the safety of your personal information. Your personal information is contained behind secured networks and is only accessible by a limited number of persons who have special access rights.`
        },
        {
          title: '5. Cookies',
          content: `We use cookies to enhance your experience, gather general visitor information, and track visits to our website. You can choose to disable cookies through your browser settings, though this may affect functionality.`
        },
        {
          title: '6. Third-Party Links',
          content: `Occasionally, at our discretion, we may include or offer third-party products or services on our website. These third-party sites have separate and independent privacy policies.`
        },
        {
          title: '7. Your Rights',
          content: `You have the right to access, update, or delete your personal information at any time. You may also opt out of receiving promotional communications from us by following the unsubscribe instructions in those messages.`
        },
        {
          title: '8. Contact Us',
          content: `If you have any questions about this Privacy Policy, please contact us at support@noteshub.com. We will respond to your inquiry within 48 hours.`
        }
      ].map((section, index) => (
        <div
          key={index}
          className="bg-dark-secondary border border-dark-border rounded-xl p-6 hover:border-primary-500/30 transition-colors duration-300"
        >
          <h2 className="text-xl font-semibold text-primary-400 mb-3">{section.title}</h2>
          <p className="text-gray-300 leading-relaxed">{section.content}</p>
        </div>
      ))}
    </div>
  )
}

export default PrivacyPolicy