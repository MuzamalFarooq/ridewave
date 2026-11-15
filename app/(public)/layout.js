import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';

export default function PublicLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#F8F6F0] dark:bg-[#102F28] text-[#242824] dark:text-[#F8F6F0] flex flex-col font-sans selection:bg-[#173F35] selection:text-white">
      <Navbar />
      <main className="grow flex flex-col">{children}</main>
      <Footer />
    </div>
  );
}
