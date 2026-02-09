import { Link } from "wouter";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md border border-gray-100">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-display font-bold text-gray-900 mb-4">404</h1>
        <p className="text-gray-600 mb-8 text-lg">
          La pagina che stai cercando non esiste o è stata spostata.
        </p>
        <Link href="/" className="btn-primary w-full block">
          Torna alla Home
        </Link>
      </div>
    </div>
  );
}
