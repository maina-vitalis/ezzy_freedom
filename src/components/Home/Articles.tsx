import { ArrowRight, BookOpen, Clock, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import image from "./../../assets/hopeful-despite.jpeg";

function Articles() {
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="space-y-4 text-center">
        <div className="mb-2 flex items-center justify-center gap-2">
          <BookOpen className="text-primary" size={28} />
          <span className="text-sm font-medium uppercase tracking-wide text-primary">
            Featured Article
          </span>
        </div>
        <h2 className="text-3xl font-bold text-foreground md:text-4xl">
          Insights & Inspiration
        </h2>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          Explore thoughtful articles that provide guidance, hope, and practical
          wisdom for your mental health journey.
        </p>
      </div>

      {/* Featured Article */}
      <Card className="group overflow-hidden border-0 shadow-lg transition-all duration-500 hover:shadow-2xl">
        <div className="grid gap-0 md:grid-cols-2">
          {/* Image Section */}
          <div className="relative h-64 overflow-hidden md:h-auto">
            <Image
              src={image}
              alt="Hopeful Despite - Mental Health Article"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />

            {/* Floating Badge */}
            <div className="absolute left-4 top-4">
              <div className="rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-primary backdrop-blur-sm">
                Featured Article
              </div>
            </div>
          </div>

          {/* Content Section */}
          <CardContent className="flex flex-col justify-center space-y-6 p-8">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-foreground transition-colors duration-300 group-hover:text-primary md:text-3xl">
                Hopeful Despite
              </h3>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <User size={14} />
                  <span>Clr. Ezra Karanja</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  <span>5 min read</span>
                </div>
              </div>

              <p className="leading-relaxed text-muted-foreground">
                Giving up is costly, and though life tempts us to quit, hope
                fuels growth despite its challenges. Clinging to comfort limits
                us, but questioning norms and embracing rebellion against
                mediocrity can free us. Failures and pain, viewed differently,
                become experiences that uncover opportunities and lead us to our
                potential.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                  Mental Health
                </span>
                <span className="rounded-full bg-blue-500/10 px-2 py-1 text-xs font-medium text-primary">
                  Inspiration
                </span>
                <span className="rounded-full bg-green-500/10 px-2 py-1 text-xs font-medium text-green-600">
                  Hope
                </span>
              </div>

              <Button
                asChild
                size="lg"
                className="transform rounded-full bg-primary/70 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                <Link href={"/articles"} className="flex items-center gap-2">
                  <span className="font-medium">Read All Articles</span>
                  <ArrowRight size={16} />
                </Link>
              </Button>
            </div>
          </CardContent>
        </div>
      </Card>

      {/* Call to Action Section */}
      <div className="text-center">
        <div className="inline-flex flex-col items-center gap-4 rounded-2xl border border-green-500/20 bg-gradient-to-r from-green-500/10 to-primary/10 p-6 sm:flex-row">
          <div className="text-center sm:text-left">
            <h4 className="mb-1 font-semibold text-foreground">
              Stay Informed & Inspired
            </h4>
            <p className="text-sm text-muted-foreground">
              Get weekly insights on mental health, recovery, and personal
              growth
            </p>
          </div>
          <Button
            variant="outline"
            asChild
            className="rounded-full border-primary text-primary transition-all duration-300 hover:bg-primary hover:text-white"
          >
            <Link href="/articles" className="flex items-center gap-2">
              Browse Articles
              <BookOpen size={16} />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Articles;
