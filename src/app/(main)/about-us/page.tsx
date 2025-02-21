"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import CountUp from "react-countup";
import image from "./../../../assets/login-image.jpg";
import ezra from "./../../../assets/ezzy.png";
import ReachOut from "@/components/forms/ReachOut";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Check } from "lucide-react";

function AboutUs() {
  const [hasScrolled, setHasScrolled] = useState(false);
  const { ref, inView } = useInView({
    triggerOnce: true, // Ensures the animation happens only once
  });

  useEffect(() => {
    if (inView) {
      setHasScrolled(true);
    }
  }, [inView]);

  return (
    <div className="space-y-8">
      <div className="h-[30vh] relative before:content-[''] before:absolute before:top-0 before: left-0 before:w-full before:h-full before:z-10 md:before:bg-gradient-to-r from-primary  to-transparent before:rounded-lg md:before:opacity-90 before:bg-primary/50  md:before:bg-transparent">
        <Image
          src={image}
          alt="Contact Us"
          fill
          className="rounded-lg object-cover"
        />
        <h1 className="absolute left-[50%] top-[30%] -translate-x-[50%] text-center text-3xl font-bold text-white z-10">
          About Us
        </h1>
      </div>

      <div className="flex gap-5 flex-col md:flex-row">
        <div className="flex-1 space-y-2">
          <h3 className="text-primary font-semibold">Ezz freedom and hope</h3>
          <h4 className="text-2xl font-bold">
            Empowering Lives, Restoring Hope
          </h4>

          <p className="text-sm mt-2">
            <span className="font-bold text-primary">
              EZZ Freedom and Hope Foundation
            </span>{" "}
            is a dedicated
            <span className="font-bold text-primary">
              {" "}
              mental health awareness initiative
            </span>
            , addressing critical challenges in mental well-being, addiction
            recovery, and social issues. Recognizing that{" "}
            <span className="font-bold text-primary">
              ignorance and assumptions
            </span>{" "}
            about mental health can be harmful, we strive to equip individuals
            with the right
            <span className="font-bold text-primary">
              {" "}
              information, support, and interventions
            </span>{" "}
            to bridge the gap in awareness and advocacy.
          </p>
          <Button
            className="hover:scale-105 hover:shadow-lg transition-all duration-300 ease-in-out"
            asChild
          >
            <Link href={"/contact-us"}>Get started</Link>
          </Button>
        </div>

        <div className="relative min-h-52 flex-1">
          <Image
            src={image}
            alt="ezz foundation image"
            className="object-cover rounded-lg"
            fill
          />
        </div>
      </div>
      <div
        ref={ref}
        className="flex gap-5  justify-between items-center flex-wrap bg-primary/40 p-3 rounded-lg"
      >
        {hasScrolled && (
          <>
            <div className="sm:w-48 text-center w-full px-3 py-6 border">
              <p className="font-bold text-4xl">
                <CountUp end={20} duration={4} />+
              </p>
              <p className="Font font-semibold text-sm">Years Experience</p>
            </div>

            <div className="sm:w-48 w-full text-center px-3 py-6 border">
              <p className="font-bold text-4xl">
                <CountUp end={100} duration={4} />+
              </p>{" "}
              <p className="Font font-semibold text-sm">
                Workshops and Seminars
              </p>
            </div>

            <div className="sm:w-48 w-full text-center px-3 py-6 border">
              <p className="font-bold text-4xl">
                <CountUp end={500} duration={4} />+
              </p>{" "}
              <p className="Font font-semibold text-sm">
                Supported individuals
              </p>
            </div>

            <div className="sm:w-48 w-full text-center px-3 py-6 border">
              <p className="font-bold text-4xl">
                <CountUp end={10} duration={4} />+
              </p>{" "}
              <p className="Font font-semibold text-sm">
                community outreach programs
              </p>
            </div>
          </>
        )}
      </div>
      <div className="flex gap-10 flex-col md:flex-row">
        <div className="relative min-h-60 flex-1">
          <Image
            src={ezra}
            alt="ezz foundation image"
            className="object-contain rounded-lg"
            fill
          />
        </div>
        <div className="flex-1 space-y-2">
          <h3 className="text-primary font-semibold">About the Founder</h3>
          <h4 className="text-2xl font-bold">Dr. Ezra Karanja</h4>
          <p className="text-sm mb-5">
            The founder of EZZ Freedom and Hope Foundation is a recovering
            addict, mental health expert, and registered counselor. Their
            personal journey through addiction and recovery fuels their
            commitment to long-term support, education, and advocacy.
            Recognizing the risk of relapse without aftercare, they champion
            continuous mental health education, workplace programs, and
            relationship counseling. The foundation stands as a testament to
            their dedication to breaking stigma, supporting recovery, and
            inspiring others to seek help and reclaim their lives.
          </p>

          <ul className="space-y-2">
            <li className="flex gap-1 items-center">
              <Check
                className="text-white bg-primary p-0.5 rounded-full"
                size={17}
              />
              <p className="font-semibold text-sm">
                Overcame addiction and now helps others in their recovery
                journey.
              </p>
            </li>
            <li className="flex gap-1 items-center">
              <Check
                className="text-white bg-primary p-0.5 rounded-full"
                size={17}
              />
              <p className="font-semibold text-sm">
                Licensed counselor and mental health expert specializing in
                addiction therapy.
              </p>
            </li>
            <li className="flex gap-1 items-center">
              <Check
                className="text-white bg-primary p-0.5 rounded-full"
                size={17}
              />
              <p className="font-semibold text-sm">
                Committed to providing long-term support, education, and
                awareness.
              </p>
            </li>

            <li className="flex gap-1 items-center">
              <Check
                className="text-white bg-primary p-0.5 rounded-full"
                size={17}
              />
              <p className="font-semibold text-sm">
                Advocates for breaking the stigma surrounding addiction and
                mental health.
              </p>
            </li>
            <li className="flex gap-1 items-center">
              <Check
                className="text-white bg-primary p-0.5 rounded-full"
                size={17}
              />
              <p className="font-semibold text-sm">
                Believes recovery is a victory that should be celebrated and
                supported.
              </p>
            </li>
            <li className="flex gap-1 items-center">
              <Check
                className="text-white bg-primary p-0.5 rounded-full"
                size={17}
              />
              <p className="font-semibold text-sm">
                Encourages seeking help, embracing recovery, and rebuilding a
                healthy future.
              </p>
            </li>
          </ul>
        </div>
      </div>

      <div className="flex gap-10 flex-col md:flex-row">
        <div className="flex-1 space-y-5">
          <div>
            <h3 className="bg-primary/50 inline-block p-1 font-semibold rounded-lg text-sm">
              Our mission
            </h3>
            <p className="text-sm">
              Our mission is to bring
              <span className="font-bold text-primary">
                mental health awareness
              </span>
              to as many doorsteps as possible through accessible and affordable
              means. We strive to
              <span className="font-bold text-primary">
                break the cycle of substance dependence
              </span>
              across all ages and social classes, ensuring that recovery is a
              recognized and celebrated journey. By reaching individuals
              <span className="font-bold text-primary">
                before addiction takes hold
              </span>
              , we aim to dispel false narratives and foster informed choices.
              Additionally, we work to
              <span className="font-bold text-primary">
                sensitize informal workers
              </span>
              , particularly in the transport sector, on the crucial link
              between
              <span className="font-bold text-primary">
                mental wellness, productivity, and safety
              </span>
              .
            </p>
          </div>

          <div>
            <h3 className="bg-primary/50 inline-block p-1 font-semibold rounded-lg text-sm">
              Our vision
            </h3>
            <p className="text-sm mt-1">
              We envision a future where{" "}
              <span className="font-bold text-primary">
                recovery support groups
              </span>{" "}
              are established in all sub-counties, providing accessible and
              localized help for those in need. Additionally, we aim to create
              an <span className="font-bold text-primary">online platform</span>{" "}
              that offers round-the-clock access to mental health support
              services, ensuring help is always within reach.
            </p>
          </div>
        </div>

        <div className="flex-1">
          <h3 className="bg-primary/50 inline-block p-1 font-semibold rounded-lg text-sm mt-4">
            Our Core Values
          </h3>
          <p className="text-sm mt-2">
            At the heart of our mission, we uphold values that guide our efforts
            in{" "}
            <span className="font-bold text-primary">
              mental health advocacy
            </span>{" "}
            and{" "}
            <span className="font-bold text-primary">addiction recovery</span>.
            These principles shape our commitment to creating a supportive
            environment where individuals can heal, grow, and reclaim their
            lives. Through our dedication, we inspire lasting change and work
            towards a society that embraces recovery with{" "}
            <span className="font-bold text-primary">
              compassion and understanding
            </span>
            .
          </p>

          <ul className="space-y-2 mt-3">
            <li className="flex gap-1 items-center">
              <Check
                className="text-white bg-primary p-0.5 rounded-full"
                size={17}
              />
              <p className="font-semibold text-sm">
                <span className="text-primary font-bold">Passion</span> –
                Commitment to making a lasting impact on mental health and
                recovery.
              </p>
            </li>
            <li className="flex gap-1 items-center">
              <Check
                className="text-white bg-primary p-0.5 rounded-full"
                size={17}
              />
              <p className="font-semibold text-sm">
                <span className="text-primary font-bold">Inspiration</span> –
                Motivating individuals to seek help and embrace change.
              </p>
            </li>
            <li className="flex gap-1 items-center">
              <Check
                className="text-white bg-primary p-0.5 rounded-full"
                size={17}
              />
              <p className="font-semibold text-sm">
                <span className="text-primary font-bold">Purpose</span> –
                Providing direction and meaningful solutions for mental health
                challenges.
              </p>
            </li>
            <li className="flex gap-1 items-center">
              <Check
                className="text-white bg-primary p-0.5 rounded-full"
                size={17}
              />
              <p className="font-semibold text-sm">
                <span className="text-primary font-bold">Hope</span> – Restoring
                faith in recovery, healing, and personal growth.
              </p>
            </li>
          </ul>
        </div>
      </div>
      <ReachOut />
    </div>
  );
}

export default AboutUs;
