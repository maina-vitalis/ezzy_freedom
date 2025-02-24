import { Mail, MapPin, Phone } from "lucide-react";
import { FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const Social = () => {
  return (
    <div className="">
      <div className="flex flex-col justify-center gap-3">
        <h3 className="mb-3 text-base font-bold text-primary underline">
          Connect With Us
        </h3>
        <div className="flex flex-col gap-3">
          <span className="flex items-center gap-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
              <Phone className="h-5 w-5 text-background" />
            </div>
            <div>
              <p className="text-sm font-normal">Drop a Line</p>
              <h4 className="text-sm font-bold">+254 791 672 961</h4>
            </div>
          </span>
          <span className="flex items-center gap-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
              <Mail className="h-5 w-5 text-background" />
            </div>
            <div>
              <p className="text-sm font-normal">Email Address</p>
              <h4 className="text-sm font-bold">info@ezzyfoundation.co.ke</h4>
            </div>
          </span>
          <span className="flex items-center gap-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
              <MapPin className="h-5 w-5 text-background" />
            </div>
            <div>
              <p className="text-sm font-normal">Visit the office</p>
              <p className="text-sm font-normal">NextGen Mall</p>
              <h4 className="text-sm font-bold">Nairobi, Mombasa Road</h4>
            </div>
          </span>
          <div className="ml-16 mt-2 flex gap-3">
            <a href="#" target="_blank" rel="noopener">
              <FaFacebook className="hover:text-greenPrimary text-xl text-foreground duration-200 ease-out" />
            </a>
            <a
              href="https://www.instagram.com//"
              target="_blank"
              rel="noopener"
            >
              <FaInstagram className="hover:text-greenPrimary text-xl text-foreground duration-200 ease-out" />
            </a>
            <a href="#" target="_blank" rel="noopener">
              <FaXTwitter className="hover:text-greenPrimary text-xl text-foreground duration-200 ease-out" />
            </a>
            <a href="https://wa.me/254712345678" target="_blank" rel="noopener">
              <FaWhatsapp className="hover:text-greenPrimary text-xl text-foreground duration-200 ease-out" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Social;
