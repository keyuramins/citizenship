import Link from "next/link";
import { Button } from "../components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="text-6xl mb-4" aria-hidden="true">🚫</div>
      <h1 className="text-3xl font-bold mb-2">Page Not Found</h1>
      <p className="mb-6 text-muted-foreground">Sorry, the page you are looking for does not exist.</p>
      <Button asChild>
        <Link href="/">Back to Home</Link>
      </Button>
    </div>
  );
} 