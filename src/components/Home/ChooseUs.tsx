import React from "react";
import image from "./../../assets/login-image.jpg";
import Image from "next/image";

function ChooseUs() {
  return (
    <div className="space-y-10">
      <h2 className="text-xl font-bold md:text-3xl">Why Choose us?</h2>
      <div className="flex flex-col gap-5 md:flex-row">
        <div className="flex-1 space-y-8">
          <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-2">
            <div className="flex gap-4">
              <p className="text-4xl font-bold text-primary">01</p>
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-primary">
                  Expert-Led Support
                </h3>
                <p className="text-sm">
                  Founded by a licensed mental health expert and recovering
                  addict with 20+ years of experience, ensuring evidence-based
                  and compassionate care.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <p className="text-4xl font-bold text-primary">02</p>
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-primary">
                  Long-Term Recovery Support
                </h3>
                <p className="text-sm">
                  We provide aftercare programs, mentorship, and reintegration
                  support to prevent relapse and promote lasting recovery.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <p className="text-4xl font-bold text-primary">03</p>
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-primary">
                  Community Awareness & ducation
                </h3>
                <p className="text-sm">
                  Through workshops and outreach, we combat stigma, educate
                  communities, and encourage open discussions on mental health.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <p className="text-4xl font-bold text-primary">04</p>
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-primary">
                  Holistic Mental Wellness Approach
                </h3>
                <p className="text-sm">
                  Beyond addiction, we address stress management, workplace
                  mental health, teenage identity crises, and relationship
                  counseling.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative min-h-52 flex-1">
          <Image
            src={image}
            alt="photo"
            className="rounded-lg object-cover"
            fill
          />
        </div>
      </div>
    </div>
  );
}

export default ChooseUs;
