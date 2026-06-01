import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <main className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 text-center">
      <p className="text-6xl font-bold text-primary-200">404</p>
      <h1 className="text-2xl font-bold text-gray-900 mt-4">Page not found</h1>
      <p className="text-gray-500 mt-2">The page you're looking for doesn't exist.</p>
      <Link
        to="/"
        className="mt-6 bg-primary-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
      >
        Go home
      </Link>
    </main>
  );
}
