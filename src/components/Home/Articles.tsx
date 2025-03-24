import Image from "next/image";
import React from "react";
import image from "./../../assets/signup-image.jpg";
import { Button } from "../ui/button";
import Link from "next/link";

function Articles() {
  return (
    <section className="flex flex-col justify-between gap-10 md:flex-row">
      <div className="relative flex-1">
        <Image src={image} alt="" fill className="rounded-lg object-cover" />
      </div>
      <div className="flex-1">
        <h2 className="mb-2 text-lg font-semibold md:text-2xl">
          Hopeful Despite
        </h2>
        <p className="text-sm">
          Giving up is costly, and though life tempts us to quit, hope fuels
          growth despite its challenges. Clinging to comfort limits us, but
          questioning norms and embracing rebellion against mediocrity can free
          us. Failures and pain, viewed differently, become experiences that
          uncover opportunities and lead us to our potential.
        </p>

        {/* Button Section */}
        <div className="mt-6">
          <Button
            asChild
            className="rounded-full transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg"
          >
            <Link href={"/articles"}>Read Articles</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

export default Articles;
