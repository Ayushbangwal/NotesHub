import React from 'react'
import { FileText } from 'lucide-react'

const TermsOfService = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-primary-500/10 rounded-full">
            <FileText className="h-10 w-10 text-primary-400" />
          </div>
        </div>
        <h1 className="text-4xl font-bold gradient-text mb-3">Terms of Service</h1>
        <p className="text-gray-400">Last updated: April 2026</p>
      </div>

      {[
        {
          title: '1. Acceptance of Terms',
          content: `By accessing and using NotesHub, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.`
        },
        {
          title: '2. User Accounts',
          content: `You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account. You must be at least 13 years of age to use this service.`
        },
        {
          title: '3. Content Guidelines',
          content: `Users may upload educational notes and materials. You agree not to upload content that is plagiarized, infringes on copyright, contains malware, or is otherwise harmful or illegal. NotesHub reserves the right to remove any content that violates these guidelines.`
        },
        {
          title: '4. Intellectual Property',
          content: `The content you upload remains your intellectual property. By uploading to NotesHub, you grant us a non-exclusive license to display and distribute your content on our platform. You represent that you have the right to share any content you upload.`
        },
        {
          title: '5. Prohibited Activities',
          content: `You may not use NotesHub to engage in any illegal activity, harass other users, distribute spam, attempt to gain unauthorized access to any part of the platform, or interfere with the proper functioning of the service.`
        },
        {
          title: '6. Disclaimer of Warranties',
          content: `NotesHub is provided on an "as is" basis without warranties of any kind. We do not guarantee the accuracy, completeness, or usefulness of any information on the platform and are not responsible for errors or omissions.`
        },
        {
          title: '7. Limitation of Liability',
          content: `NotesHub shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service.`
        },
        {
          title: '8. Changes to Terms',
          content: `We reserve the right to modify these terms at any time. We will notify users of significant changes via email or a prominent notice on our platform. Continued use of NotesHub after changes constitutes acceptance of the new terms.`
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

export default TermsOfService