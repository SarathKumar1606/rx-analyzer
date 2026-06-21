export default function AboutPage() {
  return (
    <main className="card" style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.75rem',color:'rgb(240, 246, 247)' }}>About MediScan</h1>
        <p className="muted" style={{ lineHeight: 1.75 }}>
          MediScan combines prescription OCR, domain-aware preprocessing, and AI-powered understanding to make medical instructions easy to read and follow. Our mission is to give patients and providers fast, reliable insight from handwritten prescriptions.
        </p>
      </div>

      <div style={{ display: 'grid', gap: '1rem' }}>
        <section className="card" style={{ padding: '1.25rem', background: 'rgba(14,165,164,0.06)', border: '1px solid rgba(14,165,164,0.18)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>What we do</h2>
          <p className="muted" style={{ lineHeight: 1.75 }}>
            We extract text from prescription images, normalize medical terms, and provide follow-up answers using advanced LLM prompts. The result is a smart assistant that helps users understand medication names, dosage, timing, and potential precautions.
          </p>
        </section>

        <section className="card" style={{ padding: '1.25rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>Why it works</h2>
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)', marginTop: 6, flexShrink: 0 }} />
              <span className="muted">Specialized OCR preprocessing for messy handwritten scripts.</span>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)', marginTop: 6, flexShrink: 0 }} />
              <span className="muted">LLM prompts designed for medical clarity and follow-up questions.</span>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)', marginTop: 6, flexShrink: 0 }} />
              <span className="muted">Clean UI with preview, upload, and chat flow for faster insights.</span>
            </div>
          </div>
        </section>

        <section className="card" style={{ padding: '1.25rem', background: 'rgba(40, 66, 83, 0.9)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>Mission</h2>
          <p className="muted" style={{ lineHeight: 1.75 }}>
            Our goal is to make prescription guidance accessible, especially when handwriting is unclear or medical language feels overwhelming. MediScan is built to help users make safer decisions while respecting the need for professional medical advice.
          </p>
        </section>
      </div>
    </main>
  );
}
