import Link from "next/link";
import {
  Cloud,
  FolderSync,
  Search,
  Shield,
  BarChart3,
  Zap,
  ArrowRight,
} from "lucide-react";

const features = [
  {
    icon: FolderSync,
    title: "Unified File Management",
    description:
      "Connect Google Drive, OneDrive, and more into one seamless interface. Browse, move, and organize files across all your cloud accounts.",
  },
  {
    icon: Search,
    title: "AI-Powered Search",
    description:
      "Find any file instantly with intelligent search that works across all your connected drives. No more switching between apps.",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description:
      "Your credentials are encrypted and never stored on our servers. We use OAuth tokens with minimal permissions to keep your data safe.",
  },
  {
    icon: BarChart3,
    title: "Storage Analytics",
    description:
      "Get clear insights into your storage usage across all drives. Identify large files, duplicates, and optimize your cloud space.",
  },
  {
    icon: Cloud,
    title: "Multi-Cloud Support",
    description:
      "Google Drive and OneDrive today, with Dropbox, iCloud, and more coming soon. One dashboard for every cloud provider you use.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Built on modern infrastructure for speed. Cached smart filters, instant previews, and real-time sync keep you productive.",
  },
];

export default function HomePage() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 text-center">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-gray-400">
            <Cloud className="h-4 w-4 text-blue-400" />
            All your cloud drives, one place
          </div>

          <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              DriveUnity
            </span>
            <br />
            <span className="text-white">
              Your Clouds, United.
            </span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-gray-400 sm:text-xl">
            Stop juggling multiple cloud storage apps. DriveUnity brings Google
            Drive, OneDrive, and more into a single, powerful dashboard with
            AI-powered search, smart analytics, and seamless file management.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/auth"
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-3.5 text-base font-medium text-white transition-opacity hover:opacity-90"
            >
              Get Started Free
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-8 py-3.5 text-base font-medium text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
            >
              Learn More
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 animate-bounce text-gray-500">
          <div className="h-6 w-4 rounded-full border-2 border-gray-500">
            <div className="mx-auto mt-1 h-1.5 w-0.5 rounded-full bg-gray-500" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative px-4 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
              Everything you need to manage your cloud
            </h2>
            <p className="mx-auto max-w-2xl text-gray-400">
              DriveUnity simplifies cloud storage management with powerful
              features designed to save you time and keep your files organized.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-xl border border-white/10 bg-white/5 p-6 transition-colors hover:border-white/20 hover:bg-white/[0.07]"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600/20 to-purple-600/20 ring-1 ring-white/10">
                  <feature.icon className="h-6 w-6 text-blue-400" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative px-4 py-24">
        <div className="mx-auto max-w-4xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
              Get started in minutes
            </h2>
            <p className="mx-auto max-w-xl text-gray-400">
              Three simple steps to unify all your cloud storage.
            </p>
          </div>

          <div className="space-y-12">
            {[
              {
                step: "01",
                title: "Create your account",
                description:
                  "Sign up with just your email. No credit card required to get started.",
              },
              {
                step: "02",
                title: "Connect your drives",
                description:
                  "Link your Google Drive, OneDrive, or other cloud accounts with secure OAuth.",
              },
              {
                step: "03",
                title: "Manage everything in one place",
                description:
                  "Browse, search, and organize files across all connected drives from a single dashboard.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="flex items-start gap-6"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-sm font-bold text-white">
                  {item.step}
                </div>
                <div>
                  <h3 className="mb-1 text-xl font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="text-gray-400">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative px-4 py-24">
        <div className="mx-auto max-w-3xl rounded-2xl border border-white/10 bg-gradient-to-br from-blue-600/10 to-purple-600/10 p-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
            Ready to unify your cloud?
          </h2>
          <p className="mb-8 text-gray-400">
            Join DriveUnity and take control of all your cloud storage from one
            powerful dashboard.
          </p>
          <Link
            href="/auth"
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-3.5 text-base font-medium text-white transition-opacity hover:opacity-90"
          >
            Get Started Free
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-4 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <span className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} DriveUnity. All rights reserved.
          </span>
          <div className="flex gap-6 text-sm text-gray-500">
            <Link href="/about" className="hover:text-gray-300">
              About
            </Link>
            <Link href="/pricing" className="hover:text-gray-300">
              Pricing
            </Link>
            <Link href="/contact" className="hover:text-gray-300">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
