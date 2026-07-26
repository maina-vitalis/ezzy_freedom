import Appointment from "@/components/Home/Appointment";
import Articles from "@/components/Home/Articles";
import ChooseUs from "@/components/Home/ChooseUs";
import Hero from "@/components/Home/Hero";
import Products from "@/components/Home/Products";
import Services from "@/components/Home/Services";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, MessageCircle, Users } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

function Home() {
  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <Hero />

      {/* Books Section */}
      <section className="relative">
        <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-b from-primary/50 to-transparent" />
        <div className="p-8">
          <Products />
        </div>
      </section>

      {/* Articles Section */}
      <section className="relative">
        <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-b from-transparent via-primary/50 to-transparent" />
        <div className="p-8">
          <Articles />
        </div>
      </section>

      {/* Enhanced Appointment Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-primary/10 via-primary/5 to-transparent" />
        <div className="relative p-8">
          <Appointment />
        </div>
      </section>

      {/* Services Section */}
      <Services />

      {/* Why Choose Us */}
      <ChooseUs />

      {/* Enhanced WhatsApp Community Section */}
      <section className="relative">
        <Card className="overflow-hidden border-0 bg-gradient-to-br from-green-500 via-green-600 to-green-700 text-white">
          <CardContent className="relative p-8 md:p-12">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute left-10 top-10">
                <MessageCircle size={120} />
              </div>
              <div className="absolute bottom-10 right-10">
                <Users size={100} />
              </div>
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform">
                <Heart size={80} />
              </div>
            </div>

            <div className="relative z-10 space-y-6 text-center">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold md:text-4xl">
                  Join Our Recovery Community
                </h2>
                <p className="text-xl font-medium opacity-90 md:text-2xl">
                  Connect • Support • Heal Together
                </p>
                <p className="mx-auto max-w-3xl text-lg leading-relaxed opacity-80">
                  Ready to start your recovery journey? Join our supportive
                  community and get help when you need it. Connect with others
                  who understand your journey and find strength in shared
                  experiences.
                </p>
              </div>

              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <div className="flex items-center gap-2 text-green-100">
                  <Users size={20} />
                  <span className="text-sm font-medium">500+ Members</span>
                </div>
                <div className="flex items-center gap-2 text-green-100">
                  <Heart size={20} />
                  <span className="text-sm font-medium">24/7 Support</span>
                </div>
                <div className="flex items-center gap-2 text-green-100">
                  <MessageCircle size={20} />
                  <span className="text-sm font-medium">Safe Space</span>
                </div>
              </div>

              <Button
                size="lg"
                className="transform rounded-full bg-white px-8 py-4 text-lg font-semibold text-green-600 shadow-lg transition-all duration-300 hover:scale-105 hover:bg-green-50 hover:shadow-xl"
                asChild
              >
                <a
                  href="https://chat.whatsapp.com/LguO5OsS1FiGZ7K2iYV6gs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3"
                >
                  <FaWhatsapp className="text-2xl" />
                  Join Recovery Support Group
                </a>
              </Button>

              <p className="text-sm opacity-70">
                Free to join • Private & Confidential • Professional Moderation
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

export default Home;
