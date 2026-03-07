import Link from 'next/link'

export default function TermsOfServicePage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12 text-foreground animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-10 pb-6 border-b border-border">
        <h1 className="text-4xl font-extrabold mb-2">Terms of Service</h1>
        <div className="text-sm text-muted-foreground">Effective date: March 7, 2026 &middot; Mero Notes</div>
      </div>

      <section className="mb-8 space-y-4">
        <p className="text-muted-foreground leading-relaxed">These Terms of Service (&ldquo;Terms&rdquo;) govern your use of the Mero Notes mobile application (&ldquo;App&rdquo;) developed and operated by Harish Hona (&ldquo;Developer&rdquo;, &ldquo;I&rdquo;, &ldquo;me&rdquo;). By using the App, you agree to these Terms. If you do not agree, please do not use the App.</p>
      </section>

      <section className="mb-8 space-y-4">
        <h2 className="text-2xl font-bold mt-8 mb-4">1. About the App</h2>
        <p className="text-muted-foreground leading-relaxed">Mero Notes is a simple, personal note-taking application. It is a small, real-world project and is not intended for commercial marketing purposes. The App is made available to real users for genuine, everyday use.</p>
      </section>

      <section className="mb-8 space-y-4">
        <h2 className="text-2xl font-bold mt-8 mb-4">2. Eligibility</h2>
        <p className="text-muted-foreground leading-relaxed">You must be at least 13 years old to use Mero Notes. By using the App, you confirm that you meet this requirement.</p>
      </section>

      <section className="mb-8 space-y-4">
        <h2 className="text-2xl font-bold mt-8 mb-4">3. Account and Authentication</h2>
        <p className="text-muted-foreground leading-relaxed">Access to Mero Notes requires signing in with a Google account via Google OAuth. You are responsible for maintaining the security of your Google account. The Developer does not have access to your Google password.</p>
      </section>

      <section className="mb-8 space-y-4">
        <h2 className="text-2xl font-bold mt-8 mb-4">4. Acceptable Use</h2>
        <p className="text-muted-foreground leading-relaxed">You agree to use the App only for lawful purposes. You must not:</p>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>Use the App for any illegal or harmful activity.</li>
          <li>Attempt to reverse-engineer, hack, or disrupt the App or its infrastructure.</li>
          <li>Share, sell, or transfer your account to another person.</li>
          <li>Store content that is unlawful, abusive, or infringes on the rights of others.</li>
        </ul>
      </section>

      <section className="mb-8 space-y-4">
        <h2 className="text-2xl font-bold mt-8 mb-4">5. Sensitive Information</h2>
        <p className="text-muted-foreground leading-relaxed">Although your notes are stored securely, <strong>you should not store highly sensitive information</strong> such as passwords, financial credentials, government ID numbers, or other critical personal data in your notes. Use a dedicated, purpose-built secure storage tool for such information.</p>
      </section>

      <section className="mb-8 space-y-4">
        <h2 className="text-2xl font-bold mt-8 mb-4">6. Your Content</h2>
        <p className="text-muted-foreground leading-relaxed">You own the content you create in Mero Notes. The Developer does not claim any ownership over your notes. You grant the Developer a limited, non-exclusive right to store and process your data solely to operate and provide the App.</p>
      </section>

      <section className="mb-8 space-y-4">
        <h2 className="text-2xl font-bold mt-8 mb-4">7. Data Storage and Security</h2>
        <p className="text-muted-foreground leading-relaxed">Your notes are stored in Supabase, a third-party database service, protected by Row-Level Security (RLS) policies. This means only your authenticated account can access your own data. No other user &mdash; and no third party &mdash; can read your notes. See the <Link href="/privacy-policy" className="text-foreground font-medium underline hover:text-foreground/80 transition-colors">Privacy Policy</Link> for full details.</p>
      </section>

      <section className="mb-8 space-y-4">
        <h2 className="text-2xl font-bold mt-8 mb-4">8. Service Availability</h2>
        <p className="text-muted-foreground leading-relaxed">The App is provided &ldquo;as is&rdquo; without warranties of any kind. As a sole-developer project, there may be periods of downtime, bugs, or changes. I will make reasonable efforts to keep the App functional, but cannot guarantee uninterrupted service.</p>
      </section>

      <section className="mb-8 space-y-4">
        <h2 className="text-2xl font-bold mt-8 mb-4">9. Termination</h2>
        <p className="text-muted-foreground leading-relaxed">You may stop using the App at any time. The Developer reserves the right to suspend or terminate access if these Terms are violated. If the App is discontinued, reasonable notice will be provided where possible.</p>
      </section>

      <section className="mb-8 space-y-4">
        <h2 className="text-2xl font-bold mt-8 mb-4">10. Limitation of Liability</h2>
        <p className="text-muted-foreground leading-relaxed">To the fullest extent permitted by applicable law, the Developer shall not be liable for any indirect, incidental, or consequential damages arising from your use of, or inability to use, the App.</p>
      </section>

      <section className="mb-8 space-y-4">
        <h2 className="text-2xl font-bold mt-8 mb-4">11. Changes to These Terms</h2>
        <p className="text-muted-foreground leading-relaxed">These Terms may be updated from time to time. The &ldquo;Effective date&rdquo; at the top of this page will reflect the latest revision. Continued use of the App after changes constitutes acceptance of the updated Terms.</p>
      </section>

      <section className="mb-8 space-y-4">
        <h2 className="text-2xl font-bold mt-8 mb-4">12. Contact</h2>
        <p className="text-muted-foreground leading-relaxed">If you have any questions about these Terms, you can reach the Developer at <a href="https://harishhona.com.np" target="_blank" rel="noreferrer" className="text-foreground font-medium underline hover:text-foreground/80 transition-colors">harishhona.com.np</a>.</p>
      </section>
      
      <div className="mt-16 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <Link href="/privacy-policy" className="hover:text-foreground font-medium transition-colors">Privacy Policy</Link>
        <span>&copy; 2026 Mero Notes &mdash; Built by <a href="https://harishhona.com.np" target="_blank" rel="noreferrer" className="hover:text-foreground font-medium transition-colors">Harish Hona</a></span>
        <Link href="/auth" className="hover:text-foreground font-medium transition-colors">Back to Login</Link>
      </div>
    </div>
  )
}