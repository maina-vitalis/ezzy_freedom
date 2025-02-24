import Image from "next/image";
import logo from "./../../assets/logo.png";
import Social from "./Social";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="mt-4 w-full bg-muted">
      <div className="mx-auto max-w-full px-3 md:max-w-[95%] lg:max-w-[1140px]">
        <div className="flex flex-col justify-between gap-9 py-10 md:flex-row">
          <div className="min-w-[200px] self-start">
            <div className="relative h-60 flex-1">
              <Image
                className="h-auto object-contain"
                src={logo}
                alt="ezzy foundation logo"
                fill
              />
            </div>{" "}
          </div>
          <div>
            <Social />
          </div>
          <div>
            <h2 className="text-base font-bold text-primary underline">
              Links
            </h2>

            <ul className="">
              <li>
                <Link
                  className="text-sm font-normal hover:underline"
                  href={"/about"}
                >
                  AboutUs
                </Link>
              </li>

              <li>
                <Link
                  className="text-sm font-normal hover:underline"
                  href={"/contact"}
                >
                  Contact{" "}
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="h-[50px] w-full items-center bg-card text-center text-sm md:text-base">
        © {new Date().getFullYear()} Ezzy foundation. All Rights Reserved
      </div>
    </footer>
  );
};

export default Footer;
