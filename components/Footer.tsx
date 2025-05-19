export default function Footer() {
  return (
    <footer className="w-full border-t shadow-sm px-4 py-4 flex items-center justify-center text-sm bg-background text-foreground mt-auto">
      &copy; {new Date().getFullYear()} {process.env.NEXT_PUBLIC_SITENAME}. All rights reserved.
    </footer>
  );
} 