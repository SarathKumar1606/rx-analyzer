export default function ContactPage() {
  return (
    <main className="card" style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.75rem' ,color:'rgb(240, 246, 247)'}}>Contact</h1>
        <p className="muted" style={{ lineHeight: 1.75 }}>
          Reach out to the MediScan team for questions, feedback, or collaboration. Below are the primary contacts for the project.
        </p>
      </div>

      <div style={{ display: 'grid', gap: '1rem' }}>
        <section className="card" style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.95)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>R.Sarathkumar</h2>
          <p className="muted" style={{ margin: '0.5rem 0 0.75rem', lineHeight: 1.75 }}>
            Lead developer and product owner for MediScan. Focused on AI integration, OCR workflow, and frontend experience.
          </p>
          <div style={{ display: 'grid', gap: '0.5rem' }}>
            <div><strong>Email:</strong> sarathhh16@gmail.com</div>
            <div><strong>Phone:</strong> +91 97886 14670</div>
            <div><strong>Role:</strong> AI & product engineering</div>
          </div>
        </section>

        <section className="card" style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.95)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>S.Kowshik</h2>
          <p className="muted" style={{ margin: '0.5rem 0 0.75rem', lineHeight: 1.75 }}>
            Co-founder and engineering lead. Handles backend architecture, deployment, and system reliability.
          </p>
          <div style={{ display: 'grid', gap: '0.5rem' }}>
            <div><strong>Email:</strong> kowshik19072006@gmail.com</div>
            <div><strong>Phone:</strong> +91 91593 81807</div>
            <div><strong>Role:</strong> Backend & deployment</div>
          </div>
        </section>
      </div>

      <div className="card" style={{ padding: '1.25rem', background: 'rgba(14,165,164,0.08)', border: '1px solid rgba(14,165,164,0.16)' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>General Inquiry</h2>
        <p className="muted" style={{ lineHeight: 1.75 }}>
          Have questions about the product, deployment, or integration? Send a note to the team and we will get back to you as soon as possible.
        </p>
      </div>
    </main>
  );
}
