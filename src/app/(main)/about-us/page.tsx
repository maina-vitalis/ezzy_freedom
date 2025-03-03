"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import CountUp from "react-countup";
import ezra from "./../../../assets/ezzy.png";
import ReachOut from "@/components/forms/ReachOut";

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
      <div className="before: relative left-0 h-[30vh] from-primary to-transparent before:absolute before:top-0 before:z-10 before:h-full before:w-full before:rounded-lg before:bg-primary/50 before:content-[''] md:before:bg-transparent md:before:bg-gradient-to-r md:before:opacity-90">
        <Image
          src={
            "https://35jq5szehk.ufs.sh/f/tNU9RDFz3KoO9G1xO3rXlKG4t5u3xDPbjmCwOpR8QUX7yFhg"
          }
          alt="Contact Us"
          fill
          className="rounded-lg object-cover"
        />
        <h1 className="absolute left-[50%] top-[30%] z-10 -translate-x-[50%] text-center text-3xl font-bold text-white">
          About Us
        </h1>
      </div>

      <div className="flex flex-col gap-5 md:flex-row">
        <div className="flex-1 space-y-2">
          <h3 className="font-semibold text-primary">Ezz freedom and hope</h3>
          <h4 className="text-2xl font-bold">
            Empowering Lives, Restoring Hope
          </h4>

          <p className="mt-2 text-sm">
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
        </div>

        <div className="relative min-h-52 flex-1">
          <Image
            src={
              "https://35jq5szehk.ufs.sh/f/tNU9RDFz3KoOUw56pPydJaCcu6rFeWZRAOYGo8y4nEz7iIfK"
            }
            alt="ezz foundation image"
            className="rounded-lg object-cover"
            fill
          />
        </div>
      </div>
      <div
        ref={ref}
        className="flex flex-wrap items-center justify-between gap-5 rounded-lg bg-primary/40 p-3"
      >
        {hasScrolled && (
          <>
            <div className="w-full border px-3 py-6 text-center sm:w-48">
              <p className="text-4xl font-bold">
                <CountUp end={20} duration={4} />+
              </p>
              <p className="Font text-sm font-semibold">Years Experience</p>
            </div>

            <div className="w-full border px-3 py-6 text-center sm:w-48">
              <p className="text-4xl font-bold">
                <CountUp end={100} duration={4} />+
              </p>{" "}
              <p className="Font text-sm font-semibold">
                Workshops and Seminars
              </p>
            </div>

            <div className="w-full border px-3 py-6 text-center sm:w-48">
              <p className="text-4xl font-bold">
                <CountUp end={500} duration={4} />+
              </p>{" "}
              <p className="Font text-sm font-semibold">
                Supported individuals
              </p>
            </div>

            <div className="w-full border px-3 py-6 text-center sm:w-48">
              <p className="text-4xl font-bold">
                <CountUp end={10} duration={4} />+
              </p>{" "}
              <p className="Font text-sm font-semibold">
                community outreach programs
              </p>
            </div>
          </>
        )}
      </div>
      <div className="flex flex-col gap-10 md:flex-row">
        <div className="relative min-h-60 flex-1">
          <Image
            src={ezra}
            alt="ezz foundation image"
            className="rounded-lg object-contain"
            fill
          />
        </div>
        <div className="flex-1 space-y-2">
          <h3 className="font-semibold text-primary">About the Founder</h3>
          <h4 className="text-2xl font-bold">Clr. Ezra Karanja</h4>
          <p className="mb-5 text-sm">
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
            <li className="flex items-center gap-1">
              <Check
                className="rounded-full bg-primary p-0.5 text-white"
                size={17}
              />
              <p className="text-sm font-semibold">
                Overcame addiction and now helps others in their recovery
                journey.
              </p>
            </li>
            <li className="flex items-center gap-1">
              <Check
                className="rounded-full bg-primary p-0.5 text-white"
                size={17}
              />
              <p className="text-sm font-semibold">
                Licensed counselor and mental health expert specializing in
                addiction therapy.
              </p>
            </li>
            <li className="flex items-center gap-1">
              <Check
                className="rounded-full bg-primary p-0.5 text-white"
                size={17}
              />
              <p className="text-sm font-semibold">
                Committed to providing long-term support, education, and
                awareness.
              </p>
            </li>

            <li className="flex items-center gap-1">
              <Check
                className="rounded-full bg-primary p-0.5 text-white"
                size={17}
              />
              <p className="text-sm font-semibold">
                Advocates for breaking the stigma surrounding addiction and
                mental health.
              </p>
            </li>
            <li className="flex items-center gap-1">
              <Check
                className="rounded-full bg-primary p-0.5 text-white"
                size={17}
              />
              <p className="text-sm font-semibold">
                Believes recovery is a victory that should be celebrated and
                supported.
              </p>
            </li>
            <li className="flex items-center gap-1">
              <Check
                className="rounded-full bg-primary p-0.5 text-white"
                size={17}
              />
              <p className="text-sm font-semibold">
                Encourages seeking help, embracing recovery, and rebuilding a
                healthy future.
              </p>
            </li>
          </ul>
        </div>
      </div>

      <div className="flex flex-col gap-10 md:flex-row">
        <div className="flex-1 space-y-5">
          <div>
            <h3 className="inline-block rounded-lg bg-primary/50 p-1 text-sm font-semibold">
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
            <h3 className="inline-block rounded-lg bg-primary/50 p-1 text-sm font-semibold">
              Our vision
            </h3>
            <p className="mt-1 text-sm">
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
          <h3 className="mt-4 inline-block rounded-lg bg-primary/50 p-1 text-sm font-semibold">
            Our Core Values
          </h3>
          <p className="mt-2 text-sm">
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

          <ul className="mt-3 space-y-2">
            <li className="flex items-center gap-1">
              <Check
                className="rounded-full bg-primary p-0.5 text-white"
                size={17}
              />
              <p className="text-sm font-semibold">
                <span className="font-bold text-primary">Passion</span> –
                Commitment to making a lasting impact on mental health and
                recovery.
              </p>
            </li>
            <li className="flex items-center gap-1">
              <Check
                className="rounded-full bg-primary p-0.5 text-white"
                size={17}
              />
              <p className="text-sm font-semibold">
                <span className="font-bold text-primary">Inspiration</span> –
                Motivating individuals to seek help and embrace change.
              </p>
            </li>
            <li className="flex items-center gap-1">
              <Check
                className="rounded-full bg-primary p-0.5 text-white"
                size={17}
              />
              <p className="text-sm font-semibold">
                <span className="font-bold text-primary">Purpose</span> –
                Providing direction and meaningful solutions for mental health
                challenges.
              </p>
            </li>
            <li className="flex items-center gap-1">
              <Check
                className="rounded-full bg-primary p-0.5 text-white"
                size={17}
              />
              <p className="text-sm font-semibold">
                <span className="font-bold text-primary">Hope</span> – Restoring
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
