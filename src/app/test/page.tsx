export default function TestPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Test Page</h1>
      <p>If you can see this, the Vercel deployment is working!</p>
      <p>Environment: {process.env.NODE_ENV}</p>
      <p>MongoDB URI exists: {process.env.MONGODB_URI ? 'Yes' : 'No'}</p>
    </div>
  );
}