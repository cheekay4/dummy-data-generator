import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — ScanLingo',
  description: 'Privacy Policy for ScanLingo mobile application',
};

export default function PrivacyPage() {
  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '48px 24px', fontFamily: 'system-ui, sans-serif', color: '#1a1a1a', lineHeight: 1.7 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Privacy Policy</h1>
      <p style={{ color: '#666', marginBottom: 32 }}>Last updated: March 8, 2026</p>

      <p>
        This Privacy Policy explains how ScanLingo (&quot;we&quot;, &quot;us&quot;, or &quot;the App&quot;) collects, uses, and protects
        your information when you use our mobile application.
      </p>

      <Section title="1. Information We Collect">
        <h4 style={{ fontWeight: 600, marginTop: 16, marginBottom: 4 }}>1.1 Camera and Photo Library Images</h4>
        <p>
          When you scan a document, the App captures or selects an image from your device. This image is sent to our
          server solely for the purpose of analyzing and translating the Japanese text it contains.
        </p>
        <ul>
          <li>Images are processed in real-time and are <strong>not stored on our servers</strong> after processing is complete.</li>
          <li>Images are transmitted over encrypted HTTPS connections.</li>
          <li>We do not use your images for training AI models or any other purpose.</li>
        </ul>

        <h4 style={{ fontWeight: 600, marginTop: 16, marginBottom: 4 }}>1.2 Scan Results and History</h4>
        <p>
          Scan results (translated text, summaries, action items) are stored <strong>locally on your device only</strong> using
          on-device storage (SQLite on iOS, localStorage on web). We do not have access to your scan history.
        </p>

        <h4 style={{ fontWeight: 600, marginTop: 16, marginBottom: 4 }}>1.3 Language and Preferences</h4>
        <p>
          Your selected language and personalization preferences (e.g., document categories of interest) are stored
          locally on your device. This data is not transmitted to our servers.
        </p>

        <h4 style={{ fontWeight: 600, marginTop: 16, marginBottom: 4 }}>1.4 Usage Data</h4>
        <p>
          We track the number of daily free scans used, stored locally on your device. No personally identifiable
          usage analytics are collected in the current version.
        </p>

        <h4 style={{ fontWeight: 600, marginTop: 16, marginBottom: 4 }}>1.5 Purchase Information</h4>
        <p>
          In-app purchases are processed entirely through Apple&apos;s App Store. We do not collect or store your
          payment information (credit card numbers, billing addresses, etc.). We only receive a purchase
          confirmation from Apple to unlock features.
        </p>
      </Section>

      <Section title="2. How We Use Your Information">
        <ul>
          <li><strong>Image processing:</strong> To analyze and translate Japanese text in documents you scan.</li>
          <li><strong>Local storage:</strong> To save your scan history and preferences on your device for your convenience.</li>
          <li><strong>Purchase verification:</strong> To confirm in-app purchases and provide access to premium features.</li>
        </ul>
        <p>We do not sell, rent, or share your personal information with third parties.</p>
      </Section>

      <Section title="3. Third-Party Services">
        <p>The App uses the following third-party services for document analysis:</p>
        <ul>
          <li>
            <strong>Anthropic Claude API:</strong> Images you scan are sent to Anthropic&apos;s API for AI-powered text
            analysis and translation. Anthropic processes this data according to their{' '}
            <a href="https://www.anthropic.com/privacy" style={{ color: '#2D7FF9' }}>Privacy Policy</a>.
            Per Anthropic&apos;s API data policy, data sent via the API is not used to train their models.
          </li>
          <li>
            <strong>Apple App Store:</strong> For in-app purchases and subscription management, governed by{' '}
            <a href="https://www.apple.com/legal/privacy/" style={{ color: '#2D7FF9' }}>Apple&apos;s Privacy Policy</a>.
          </li>
        </ul>
      </Section>

      <Section title="4. Data Retention">
        <ul>
          <li><strong>Scanned images:</strong> Not retained. Deleted immediately after processing (typically within seconds).</li>
          <li><strong>Scan results:</strong> Stored locally on your device until you delete them or uninstall the App.</li>
          <li><strong>Preferences:</strong> Stored locally on your device until you reset or uninstall the App.</li>
        </ul>
      </Section>

      <Section title="5. Data Security">
        <p>We implement the following security measures to protect your data:</p>
        <ul>
          <li>All data transmission uses HTTPS/TLS encryption.</li>
          <li>No server-side storage of user images or scan results.</li>
          <li>API keys and credentials are stored securely in environment variables, never in client-side code.</li>
        </ul>
      </Section>

      <Section title="6. Your Rights">
        <p>You have the right to:</p>
        <ul>
          <li><strong>Delete your data:</strong> Clear your scan history from within the App&apos;s settings, or uninstall the App to remove all locally stored data.</li>
          <li><strong>Deny camera access:</strong> You can use the App with gallery-only mode or demo mode without granting camera permission.</li>
          <li><strong>Opt out:</strong> You can stop using the App at any time. No account is required.</li>
        </ul>

        <h4 style={{ fontWeight: 600, marginTop: 16, marginBottom: 4 }}>For EU/EEA Users (GDPR)</h4>
        <p>
          Our legal basis for processing images is your explicit consent (by choosing to scan a document).
          Since we do not store personal data on our servers, there is no server-side data to request access
          to or deletion of. All user data resides on your device under your control.
        </p>

        <h4 style={{ fontWeight: 600, marginTop: 16, marginBottom: 4 }}>For Japanese Users (APPI)</h4>
        <p>
          We comply with Japan&apos;s Act on the Protection of Personal Information. We do not acquire, store,
          or provide personal information to third parties beyond what is described in this policy.
          Images sent for analysis are processed transiently and not retained.
        </p>
      </Section>

      <Section title="7. Children's Privacy">
        <p>
          The App is not directed at children under 13. We do not knowingly collect personal information
          from children under 13. If you believe a child has provided us with personal information,
          please contact us so we can take appropriate action.
        </p>
      </Section>

      <Section title="8. Changes to This Policy">
        <p>
          We may update this Privacy Policy from time to time. Any changes will be reflected on this page
          with an updated &quot;Last updated&quot; date. We encourage you to review this page periodically.
        </p>
      </Section>

      <Section title="9. Contact Us">
        <p>
          If you have questions or concerns about this Privacy Policy, please contact us at:
        </p>
        <p style={{ marginTop: 8 }}>
          <strong>Email:</strong> support@tools24.jp
        </p>
      </Section>

      <div style={{ borderTop: '1px solid #e5e5e5', marginTop: 48, paddingTop: 24, color: '#999', fontSize: 14 }}>
        <p>ScanLingo is operated by tools24.jp</p>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginTop: 36 }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>{title}</h2>
      {children}
    </section>
  );
}
