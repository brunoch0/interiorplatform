import Link from "next/link";
import { Card } from "@/components/ui";

export default function Onboarding() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <div className="text-center">
        <h1 className="text-3xl font-black">Get started with DubaiInterior</h1>
        <p className="mt-3 text-gray-500">How will you use the platform? We&apos;ll guide you through the right sign-up flow.</p>
      </div>
      <div className="mt-10 grid gap-5 md:grid-cols-2">
        <Link href="/signup/consumer">
          <Card className="h-full transition hover:border-emerald-300 hover:shadow-md">
            <span className="text-3xl">🏠</span>
            <h2 className="mt-4 text-lg font-bold">I need an interior contractor</h2>
            <p className="mt-1 text-sm font-medium text-emerald-600">Sign up as a Homeowner</p>
            <ul className="mt-4 space-y-2 text-sm text-gray-500">
              <li>✓ Compare verified contractors by hard metrics</li>
              <li>✓ Request quotes from up to 5 contractors at once</li>
              <li>✓ Manage your project safely with escrow &amp; QA reports</li>
            </ul>
          </Card>
        </Link>
        <Link href="/signup/supplier">
          <Card className="h-full transition hover:border-sky-300 hover:shadow-md">
            <span className="text-3xl">🔨</span>
            <h2 className="mt-4 text-lg font-bold">I&apos;m a contractor</h2>
            <p className="mt-1 text-sm font-medium text-sky-600">Sign up as a Contractor</p>
            <ul className="mt-4 space-y-2 text-sm text-gray-500">
              <li>✓ Claim your existing profile</li>
              <li>✓ Register and manage your portfolio for free</li>
              <li>✓ Receive qualified homeowner leads</li>
            </ul>
          </Card>
        </Link>
      </div>
      <div className="mt-8 rounded-xl bg-white p-6 text-center text-sm text-gray-500 shadow-sm">
        Quick sign-in:{" "}
        <span className="mx-1 inline-block rounded-lg border border-gray-200 px-4 py-2 font-medium text-slate-700">Google</span>
        <span className="mx-1 inline-block rounded-lg border border-gray-200 px-4 py-2 font-medium text-slate-700">Apple</span>
        <span className="mx-1 inline-block rounded-lg border border-gray-200 px-4 py-2 font-medium text-slate-700">Email</span>
      </div>
    </div>
  );
}
