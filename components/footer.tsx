"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  // Don't show footer on admin pages
  if (pathname && pathname.startsWith("/admin")) return null;

  return (
    <footer className="bg-zinc-950 text-zinc-300 pt-4 pb-2 border-t border-zinc-900 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
          
          {/* Brand Section */}
          <div className="space-y-2 max-w-xs">
            <Link href="/" className="inline-block">
              <Image
                src="https://ik.imagekit.io/dypkhqxip/yemnestnavbar"
                alt="Yemnest Logo"
                width={120}
                height={34}
                className="h-8 w-auto object-contain brightness-0 invert opacity-90 hover:opacity-100 transition-opacity"
              />
            </Link>
            <p className="text-sm text-zinc-400 leading-relaxed max-w-xs">
              Crafting premium artisanal treats delivered straight to your door. Experience the taste of luxury.
            </p>
            <div className="flex items-center space-x-4">
              <a href="https://www.instagram.com/yemnest?igsh=cHVmYXAzNjI2a2Rt" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition-colors">
                <span className="sr-only">Instagram</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition-colors">
                <span className="sr-only">WhatsApp</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12c0 2.17.69 4.18 1.87 5.84L2.3 21.7l3.96-1.52C7.82 21.37 9.85 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18.2c-1.8 0-3.5-.5-4.9-1.3l-.3-.2-2.7 1 1-2.6-.2-.4c-.9-1.4-1.4-3.1-1.4-4.8 0-4.5 3.7-8.2 8.2-8.2s8.2 3.7 8.2 8.2-3.7 8.2-8.2 8.2zm4.5-5.9c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1s-.6.8-.7.9c-.1.1-.3.2-.5.1-.2-.1-1-.4-2-1.2-.7-.6-1.2-1.4-1.3-1.6-.1-.2 0-.3.1-.4.1-.1.2-.2.3-.3s.1-.2.2-.4c.1-.2 0-.3 0-.4s-.5-1.3-.7-1.8c-.2-.5-.4-.4-.5-.4h-.4c-.2 0-.5.1-.7.3-.2.2-.9.9-.9 2.1 0 1.2 1 2.4 1.1 2.6.1.2 1.8 2.7 4.2 3.8.6.3 1 .4 1.4.5.6.2 1.1.2 1.5.1.5-.1 1.4-.6 1.6-1.1.2-.5.2-1 .1-1.1-.2-.1-.4-.2-.6-.3z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>

          {/* Customer Care */}
          <div className="flex flex-col md:items-end">
            <h3 className="text-xs font-semibold text-white tracking-wider uppercase mb-2">Customer Care</h3>
            <ul className="flex flex-wrap gap-x-4 gap-y-1 md:justify-end">
              <li>
                <Link href="/contact" className="text-sm text-zinc-400 hover:text-white transition-colors">Contact Us</Link>
              </li>
              <li>
                <Link href="/shipping" className="text-sm text-zinc-400 hover:text-white transition-colors">Shipping Policy</Link>
              </li>
              <li>
                <Link href="/returns" className="text-sm text-zinc-400 hover:text-white transition-colors">Returns & Refunds</Link>
              </li>
              <li>
                <Link href="/privacy" className="text-xs text-zinc-400 hover:text-white transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/terms" className="text-xs text-zinc-400 hover:text-white transition-colors">Terms</Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-2 border-t border-zinc-900 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-[10px] text-zinc-500">
            &copy; {new Date().getFullYear()} Yemnest. All rights reserved.
          </p>
          <div className="flex items-center text-zinc-500">
            <span className="text-[10px]">Developed by Student Forge</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
