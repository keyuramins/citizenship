import { SiFacebook, SiX, SiLinkedin, SiGmail, SiWhatsapp } from 'react-icons/si';
import { Button } from '../components/ui/button';

export function SocialShare({ title, link, score, time }: { title: string; link: string; score: number; time: string }) {
  const message = `${title} — I scored ${score}% in ${time}! Try it: ${link}`;
  const subject = `${title} — My Citizenship Practice Test Result`;

  const handleWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleTwitter = () => {
    const url = `https://x.com/intent/tweet?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}&quote=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(link)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleEmail = () => {
    const url = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
    window.location.href = url;
  };

  return (
    <div className="flex flex-wrap gap-2 mt-4 justify-center items-center">
      <Button onClick={handleWhatsApp} aria-label="Share on WhatsApp" className="bg-green-500 hover:bg-green-600 text-white">
        <SiWhatsapp size={20} />
      </Button>
      <Button onClick={handleTwitter} aria-label="Share on X (Twitter)" className="bg-black hover:bg-neutral-800 text-white">
        <SiX size={20} />
      </Button>
      <Button onClick={handleFacebook} aria-label="Share on Facebook" className="bg-blue-600 hover:bg-blue-700 text-white">
        <SiFacebook size={20} />
      </Button>
      <Button onClick={handleLinkedIn} aria-label="Share on LinkedIn" className="bg-blue-700 hover:bg-blue-800 text-white">
        <SiLinkedin size={20} />
      </Button>
      <Button onClick={handleEmail} aria-label="Share via Email" className="bg-amber-600 hover:bg-amber-700 text-white">
        <SiGmail size={20} />
      </Button>
    </div>
  );
} 