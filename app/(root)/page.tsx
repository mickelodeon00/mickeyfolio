import { Button } from "@/components/ui/button";
import { ArrowRight, Github, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";
import PageWrapper from "@/components/layout/page-wrapper";
import { fadeInLeft } from "@/utils/animations";
import FadeInWhenVisible from "@/components/general/fadeIn-when-visible";

export default function Home() {
  return (
    <PageWrapper>
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        <FadeInWhenVisible variants={fadeInLeft}>
          <div className="container mx-auto px-4 z-10 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Hi, I&apos;m Micheal
            </h1>
            <h1 className="text-5xl md:text-7xl font-bold mb-4">
              <span className="text-primary">Software Alchemist</span>{" "}
            </h1>

            <p className="text-base md:text-xl max-w-2xl mx-auto mb-8 text-muted-foreground">
              Software Developer with a sharp mathematical mind, crafting
              elegant digital experiences where logic meets creativity. Driven
              by precision, built with purpose, delivered with style
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <Button asChild size="lg">
                <Link href="/projects">
                  View Projects <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/blog">
                  Read My Blog <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="flex justify-center space-x-6">
              <Link
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full h-12 w-12"
                >
                  <Github className="h-6 w-6" />
                </Button>
              </Link>
              <Link
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full h-12 w-12"
                >
                  <Twitter className="h-6 w-6" />
                </Button>
              </Link>
              <Link
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full h-12 w-12"
                >
                  <Linkedin className="h-6 w-6" />
                </Button>
              </Link>
            </div>
          </div>
        </FadeInWhenVisible>
      </div>
    </PageWrapper>
  );
}
