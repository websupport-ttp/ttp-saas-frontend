export default function TestPage() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#e21e24' }}>🎉 Next.js is Working!</h1>
      <p>If you can see this page, Next.js is running correctly.</p>
      <ul>
        <li>✅ React is loaded</li>
        <li>✅ TypeScript is working</li>
        <li>✅ App Router is functional</li>
      </ul>
      <p>
        <a href="/" style={{ color: '#e21e24', textDecoration: 'underline' }}>
          Go back to main page
        </a>
      </p>
    </div>
  )
}