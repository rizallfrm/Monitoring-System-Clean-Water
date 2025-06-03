"use client";
import { Droplets, Phone, Mail, MapPin, Globe } from "lucide-react";

import Logo from "../../assets/logo.png";

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-6"></div>
            <p className="text-gray-300 mb-6 max-w-md">
              Platform monitoring air bersih yang memudahkan masyarakat
              mengakses informasi distribusi air secara transparan dan
              real-time.
            </p>
            <div className="flex gap-4">
              <div className="bg-blue-600 p-3 rounded-full hover:bg-blue-700 transition-colors cursor-pointer">
                <Phone className="w-5 h-5" />
              </div>
              <div className="bg-green-600 p-3 rounded-full hover:bg-green-700 transition-colors cursor-pointer">
                <Mail className="w-5 h-5" />
              </div>
              <div className="bg-pink-600 p-3 rounded-full hover:bg-pink-700 transition-colors cursor-pointer">
                <Globe className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-6">Link Penting</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Tentang Kami
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  FAQ
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Kebijakan Privasi
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Syarat & Ketentuan
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Panduan Pengguna
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-bold text-lg mb-6">Kontak</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-blue-400 mt-0.5" />
                <div>
                  <p className="font-medium">Call Center</p>
                  <p className="text-gray-300">(0282) 123-4567</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-green-400 mt-0.5" />
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-gray-300">hydroflow@pdam.go.id</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-red-400 mt-0.5" />
                <div>
                  <p className="font-medium">Alamat</p>
                  <p className="text-gray-300">
                    Jl. Sudirman No. 123
                    <br />
                     Jawa Tengah
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t  border-gray-800 pt-8">
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400 text-sm">© 2025 HydroFlow.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
