import Image from "next/image";
import { Button } from "../components/ui/button";
import ThemeSwitcher from "../components/ThemeSwitcher";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-4 border-b border-border">
        <div className="flex items-center gap-8">
          <span className="font-bold text-xl">CitizenPrep</span>
          <nav className="hidden md:flex gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground">About</a>
            <a href="#" className="hover:text-foreground">Pricing</a>
            <a href="#" className="hover:text-foreground">Contact</a>
          </nav>
        </div>
        <div className="flex gap-2 items-center">
          <ThemeSwitcher />
          <Button variant="ghost" className="text-foreground border border-border">Login</Button>
          <Button variant="default">Sign Up</Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between px-8 py-16 max-w-6xl mx-auto w-full gap-12">
        <div className="flex-1 flex flex-col gap-6">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">Pass Your Citizenship Test with Confidence</h1>
          <p className="text-lg text-muted-foreground max-w-xl">Practice with our comprehensive test platform. Get instant feedback, track your progress, and prepare effectively for your citizenship exam.</p>
          <div className="flex gap-4 mt-2">
            <Button size="lg">Start Practicing Now</Button>
            <Button variant="outline" size="lg">View Plans</Button>
          </div>
        </div>
        <div className="flex-1 flex justify-center">
          <Image src="/illustration.svg" alt="Citizenship Test" width={350} height={250} className="rounded-lg bg-card" />
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-card py-16 px-8">
        <h2 className="text-2xl font-bold text-center mb-10">Features Designed for Success</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
          <div className="border border-border rounded-lg p-6 flex flex-col items-center text-center">
            <span className="mb-2 text-3xl">📝</span>
            <h3 className="font-semibold mb-1">20 Practice Tests</h3>
            <p className="text-muted-foreground text-sm">Access 20 distinct practice tests with randomized questions</p>
          </div>
          <div className="border border-border rounded-lg p-6 flex flex-col items-center text-center">
            <span className="mb-2 text-3xl">⏰</span>
            <h3 className="font-semibold mb-1">Timed Sessions</h3>
            <p className="text-muted-foreground text-sm">Practice with realistic 45-minute countdown timers</p>
          </div>
          <div className="border border-border rounded-lg p-6 flex flex-col items-center text-center">
            <span className="mb-2 text-3xl">⚡</span>
            <h3 className="font-semibold mb-1">Instant Feedback</h3>
            <p className="text-muted-foreground text-sm">Get immediate results and see where you need to improve</p>
          </div>
          <div className="border border-border rounded-lg p-6 flex flex-col items-center text-center">
            <span className="mb-2 text-3xl">📈</span>
            <h3 className="font-semibold mb-1">Progress Tracking</h3>
            <p className="text-muted-foreground text-sm">Monitor your performance and track improvement over time</p>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-16 px-8">
        <h2 className="text-2xl font-bold text-center mb-10">Success Stories</h2>
        <p className="text-center text-muted-foreground mb-8">See how CitizenPrep has helped others achieve their citizenship goals</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="border border-border rounded-lg p-6 bg-card">
            <div className="font-semibold mb-1">Sarah Johnson</div>
            <div className="text-xs text-muted-foreground mb-2">New Citizen</div>
            <div className="text-sm text-muted-foreground">CitizenPrep helped me pass my test on the first try. The practice questions were almost identical to the real test!</div>
          </div>
          <div className="border border-border rounded-lg p-6 bg-card">
            <div className="font-semibold mb-1">Michael Chen</div>
            <div className="text-xs text-muted-foreground mb-2">New Citizen</div>
            <div className="text-sm text-muted-foreground">The timed tests really helped me manage my anxiety. I felt so prepared when I took the actual citizenship test.</div>
          </div>
          <div className="border border-border rounded-lg p-6 bg-card">
            <div className="font-semibold mb-1">Priya Patel</div>
            <div className="text-xs text-muted-foreground mb-2">New Citizen</div>
            <div className="text-sm text-muted-foreground">I love how the app tracks progress. It helped me focus on areas where I needed more practice.</div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="bg-card py-16 px-8">
        <h2 className="text-2xl font-bold text-center mb-10">Simple, Transparent Pricing</h2>
        <p className="text-center text-muted-foreground mb-8">Choose the plan that works for you</p>
        <div className="flex flex-col md:flex-row gap-8 max-w-3xl mx-auto">
          <div className="flex-1 border border-border rounded-lg p-8 flex flex-col items-center bg-background">
            <div className="font-semibold mb-2">Free Plan</div>
            <div className="text-3xl font-bold mb-2">$0</div>
            <ul className="text-muted-foreground text-sm mb-6 space-y-1">
              <li>✓ First 5 questions on 5 practice tests</li>
              <li>✓ Basic progress tracking</li>
              <li>✓ Access to study materials</li>
            </ul>
            <Button className="w-full">Sign Up Free</Button>
          </div>
          <div className="flex-1 border border-border rounded-lg p-8 flex flex-col items-center bg-background">
            <div className="font-semibold mb-2">Premium Plan</div>
            <div className="text-3xl font-bold mb-2">$19.99</div>
            <ul className="text-muted-foreground text-sm mb-6 space-y-1">
              <li>✓ Full access to all 20 practice tests</li>
              <li>✓ Detailed performance analytics</li>
              <li>✓ Unlimited practice sessions</li>
              <li>✓ Priority support</li>
            </ul>
            <Button className="w-full" variant="secondary">Get Premium</Button>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to Become a Citizen?</h2>
        <p className="text-muted-foreground mb-6">Start practicing today and pass your citizenship test with confidence</p>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Button size="lg">Get Started</Button>
          <Button variant="outline" size="lg">Contact Us</Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 px-8 border-t border-border flex flex-col md:flex-row items-center justify-between text-xs text-muted-foreground">
        <div>&copy; 2025 CitizenPrep. All rights reserved.</div>
        <div className="flex gap-4 mt-2 md:mt-0">
          <a href="#" className="hover:underline">Terms</a>
          <a href="#" className="hover:underline">Privacy</a>
        </div>
      </footer>
    </div>
  );
}
