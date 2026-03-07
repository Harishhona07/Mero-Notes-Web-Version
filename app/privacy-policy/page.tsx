import Link from 'next/link'

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12 text-foreground animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-10 pb-6 border-b border-border">
        <h1 className="text-4xl font-extrabold mb-2">Privacy Policy</h1>
        <div className="text-sm text-muted-foreground">Effective date: March 7, 2026 &middot; Mero Notes</div>
      </div>

      <section className="mb-8 space-y-4">
        <p className="text-muted-foreground leading-relaxed">This Privacy Policy explains how Mero Notes ("App"), developed by Harish Hona ("Developer", "I", "me"), collects, uses, and protects your information. I am committed to keeping your data private and secure.</p>
      </section>

      <section className="mb-8 space-y-4">
        <h2 className="text-2xl font-bold mt-8 mb-4">1. Information Collected</h2>
        <p className="text-muted-foreground leading-relaxed">When you use Mero Notes, the following data is collected:</p>
        <div className="overflow-x-auto my-4 rounded-xl border border-border">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-secondary text-left text-foreground">
                <th className="p-4 border-b border-border font-semibold">Data</th>
                <th className="p-4 border-b border-border font-semibold">Source</th>
                <th className="p-4 border-b border-border font-semibold">Purpose</th>
              </tr>
            </thead>
            <tbody className="bg-card">
              <tr>
                <td className="p-4 border-b border-border text-muted-foreground">Google account email &amp; display name</td>
                <td className="p-4 border-b border-border text-muted-foreground">Google OAuth</td>
                <td className="p-4 border-b border-border text-muted-foreground">Identify and authenticate your account</td>
              </tr>
              <tr>
                <td className="p-4 border-b border-border text-muted-foreground">Google profile picture URL</td>
                <td className="p-4 border-b border-border text-muted-foreground">Google OAuth</td>
                <td className="p-4 border-b border-border text-muted-foreground">Display your avatar in the App</td>
              </tr>
              <tr>
                <td className="p-4 text-muted-foreground">Notes content you create</td>
                <td className="p-4 text-muted-foreground">You</td>
                <td className="p-4 text-muted-foreground">Core functionality &mdash; storing your notes</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-muted-foreground leading-relaxed">No additional personal information is collected. The App does not collect location data, device identifiers, or usage analytics.</p>
      </section>

      <section className="mb-8 space-y-4">
        <h2 className="text-2xl font-bold mt-8 mb-4">2. How Your Data Is Used</h2>
        <p className="text-muted-foreground leading-relaxed">Your data is used solely to operate the App:</p>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>To authenticate you via Google OAuth.</li>
          <li>To store, retrieve, and display your notes.</li>
          <li>To associate your notes with your account so only you can access them.</li>
        </ul>
        <p className="text-muted-foreground leading-relaxed">Your data is <strong>never used for marketing, advertising, or analytics</strong>.</p>
      </section>

      <section className="mb-8 space-y-4">
        <h2 className="text-2xl font-bold mt-8 mb-4">3. Data Storage and Security</h2>
        <p className="text-muted-foreground leading-relaxed">Your notes and account information are stored in <strong>Supabase</strong>, a managed cloud database platform. Supabase enforces <strong>Row-Level Security (RLS) policies</strong>, which means:</p>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>Only your authenticated session can read or modify your own notes.</li>
          <li>No other user can access your data.</li>
          <li>The Developer does not routinely access individual user notes.</li>
        </ul>
        <p className="text-muted-foreground leading-relaxed">Data is encrypted in transit (HTTPS/TLS) and at rest by Supabase's infrastructure.</p>
      </section>

      <section className="mb-8 space-y-4">
        <h2 className="text-2xl font-bold mt-8 mb-4">4. Google OAuth</h2>
        <p className="text-muted-foreground leading-relaxed">Authentication is handled entirely by Google. The App only receives the basic profile information that Google provides after you grant permission (name, email, profile picture). The Developer never sees or stores your Google password.</p>
        <p className="text-muted-foreground leading-relaxed">You can review Google's privacy practices at <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer" className="text-foreground font-medium underline hover:text-foreground/80 transition-colors">policies.google.com/privacy</a>.</p>
      </section>

      <section className="mb-8 space-y-4">
        <h2 className="text-2xl font-bold mt-8 mb-4">5. Data Sharing</h2>
        <p className="text-muted-foreground leading-relaxed"><strong>Your data is not shared with any third party</strong>, sold, rented, or disclosed to advertisers or data brokers &mdash; ever.</p>
        <p className="text-muted-foreground leading-relaxed">The only third-party services involved in operating the App are:</p>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li><strong>Google</strong> &mdash; for authentication (OAuth).</li>
          <li><strong>Supabase</strong> &mdash; for database storage.</li>
        </ul>
        <p className="text-muted-foreground leading-relaxed">Both services handle data under their own privacy policies and security standards.</p>
      </section>

      <section className="mb-8 space-y-4">
        <h2 className="text-2xl font-bold mt-8 mb-4">6. Sensitive Information</h2>
        <p className="text-muted-foreground leading-relaxed">While your notes are protected, <strong>you should not store highly sensitive information</strong> such as passwords, financial credentials, government IDs, or other critical secrets in your notes. Use purpose-built, dedicated tools for that kind of data.</p>
      </section>

      <section className="mb-8 space-y-4">
        <h2 className="text-2xl font-bold mt-8 mb-4">7. Data Retention</h2>
        <p className="text-muted-foreground leading-relaxed">Your notes and account data are retained as long as you use the App. If you wish to have your data deleted, contact the Developer at <a href="https://harishhona.com.np" target="_blank" rel="noreferrer" className="text-foreground font-medium underline hover:text-foreground/80 transition-colors">harishhona.com.np</a> and your data will be removed from the database.</p>
      </section>

      <section className="mb-8 space-y-4">
        <h2 className="text-2xl font-bold mt-8 mb-4">8. Children&rsquo;s Privacy</h2>
        <p className="text-muted-foreground leading-relaxed">Mero Notes is not directed at children under 13. The App does not knowingly collect data from children under 13. If you believe a child has provided data through the App, please contact me and I will delete it.</p>
      </section>

      <section className="mb-8 space-y-4">
        <h2 className="text-2xl font-bold mt-8 mb-4">9. Changes to This Policy</h2>
        <p className="text-muted-foreground leading-relaxed">This Privacy Policy may be updated from time to time to reflect changes in the App. The &ldquo;Effective date&rdquo; at the top of this page will reflect the most recent revision. Continued use of the App after changes means you accept the updated policy.</p>
      </section>

      <section className="mb-8 space-y-4">
        <h2 className="text-2xl font-bold mt-8 mb-4">10. Contact</h2>
        <p className="text-muted-foreground leading-relaxed">If you have any questions, concerns, or data requests regarding this Privacy Policy, please reach out to the Developer:</p>
        <p className="text-muted-foreground leading-relaxed"><strong>Harish Hona</strong><br /><a href="https://harishhona.com.np" target="_blank" rel="noreferrer" className="text-foreground font-medium underline hover:text-foreground/80 transition-colors">harishhona.com.np</a></p>
      </section>
      
      <div className="mt-16 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <Link href="/terms-of-service" className="hover:text-foreground font-medium transition-colors">Terms of Service</Link>
        <span>&copy; 2026 Mero Notes &mdash; Built by <a href="https://harishhona.com.np" target="_blank" rel="noreferrer" className="hover:text-foreground font-medium transition-colors">Harish Hona</a></span>
        <Link href="/auth" className="hover:text-foreground font-medium transition-colors">Back to Login</Link>
      </div>
    </div>
  )
}